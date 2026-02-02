import httpx
import logging
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout as auth_logout
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatSessionDetailSerializer, ChatMessageSerializer

logger = logging.getLogger(__name__)

# [추가] Agent 목록 조회 Proxy View
class AgentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # settings.py의 SECRETS를 통해 로드된 설정 사용
        fabrix_conf = getattr(settings, 'FABRIX_API_CONFIG', {})
        
        base_url = fabrix_conf.get('base_url', '').rstrip('/')
        target_url = f"{base_url}/openapi/agent-chat/v1/agents"
        
        headers = {
            'Content-Type': 'application/json',
            'x-fabrix-client': fabrix_conf.get('client_key'),
            'x-openapi-token': fabrix_conf.get('openapi_token'),
            'x-generative-ai-user-email': fabrix_conf.get('user_email', ''),
        }
        
        # Retry logic for better reliability
        max_retries = 2
        retry_count = 0
        
        while retry_count <= max_retries:
            try:
                # settings에서 공유 HTTP 클라이언트 사용 (연결 재사용)
                http_client = getattr(settings, 'SHARED_HTTP_CLIENT', None)
                
                if http_client is None:
                    # Fallback: 클라이언트가 없으면 새로 생성
                    with httpx.Client(timeout=15.0) as client:
                        response = client.get(
                            target_url,
                            headers=headers,
                            params={'page': 1, 'limit': 100}
                        )
                        response.raise_for_status()
                        return JsonResponse(response.json(), status=response.status_code, safe=False)
                
                # 공유 클라이언트 사용
                response = http_client.get(
                    target_url,
                    headers=headers,
                    params={'page': 1, 'limit': 100}
                )
                response.raise_for_status()
                return JsonResponse(response.json(), status=response.status_code, safe=False)
                
            except httpx.TimeoutException:
                retry_count += 1
                logger.warning(f"Timeout fetching agents (attempt {retry_count}/{max_retries + 1})")
                if retry_count > max_retries:
                    return JsonResponse(
                        {'error': 'Request timeout to FabriX API after retries'},
                        status=504
                    )
                continue
            except httpx.HTTPStatusError as e:
                # Don't retry on HTTP errors (4xx, 5xx)
                logger.error(f"HTTP error fetching agents: {e.response.status_code}")
                return JsonResponse(
                    {'error': str(e), 'status_code': e.response.status_code},
                    status=e.response.status_code
                )
            except httpx.ConnectError as e:
                retry_count += 1
                logger.warning(f"Connection error fetching agents (attempt {retry_count}/{max_retries + 1}): {e}")
                if retry_count > max_retries:
                    return JsonResponse(
                        {'error': f'Connection failed to FabriX API: {str(e)}'},
                        status=503
                    )
                continue
            except Exception as e:
                logger.exception(f"Unexpected error fetching agents: {e}")
                return JsonResponse(
                    {'error': f'Failed to fetch agents: {str(e)}'},
                    status=500
                )

class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = ChatSession.objects.filter(user=self.request.user)
        # Optimize queries based on action
        if self.action == 'retrieve':
            # Prefetch messages for detail view to avoid N+1 queries
            queryset = queryset.prefetch_related('messages')
        elif self.action == 'list':
            # Only select related user for list view
            queryset = queryset.select_related('user')
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ChatSessionDetailSerializer
        return ChatSessionSerializer

    @action(detail=True, methods=['post'])
    @transaction.atomic  # Ensure atomicity for message creation and session update
    def messages(self, request, pk=None):
        session = self.get_object()
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(session=session)
            session.save()  # Update session's updated_at timestamp
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)