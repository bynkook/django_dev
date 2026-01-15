import httpx
import asyncio
from asgiref.sync import async_to_sync
from django.conf import settings
from django.http import JsonResponse
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatSessionDetailSerializer, ChatMessageSerializer

# [추가] Agent 목록 조회 Proxy View
class AgentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return async_to_sync(self._async_get)(request)
    
    async def _async_get(self, request):
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
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    target_url,
                    headers=headers,
                    params={'page': 1, 'limit': 100}
                )
                return JsonResponse(response.json(), status=response.status_code, safe=False)
        except httpx.TimeoutException:
            return JsonResponse(
                {'error': 'Request timeout to FabriX API'},
                status=504
            )
        except httpx.HTTPStatusError as e:
            return JsonResponse(
                {'error': str(e)},
                status=e.response.status_code
            )
        except Exception as e:
            return JsonResponse(
                {'error': f'Failed to fetch agents: {str(e)}'},
                status=500
            )

class SignUpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        auth_key = request.data.get('auth_key')

        if not all([username, password, email, auth_key]):
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Admin Key 검증
        expected_key = getattr(settings, 'ADMIN_SIGNUP_KEY', '')
        
        # 타입 통일 및 공백 제거 후 비교
        received_key = str(auth_key).strip() if auth_key else ''
        expected_key_str = str(expected_key).strip()
        
        # 개발 환경에서 디버그 로그 출력
        if settings.DEBUG:
            print(f"[Signup Debug] Auth Key Match: {received_key == expected_key_str}")
        
        if received_key != expected_key_str:
            return Response({'error': 'Invalid Auth Key.'}, status=status.HTTP_403_FORBIDDEN)

        # Use exists() instead of filter() for better performance
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.is_active = True
            user.save()

            # Create token directly instead of get_or_create since user is new
            token = Token.objects.create(user=user)
            
            return Response({
                'message': 'Signup successful.',
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f'Signup failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # 입력값 검증
        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        if user:
            # 계정 활성화 상태 확인
            if not user.is_active:
                return Response(
                    {'error': 'Account is disabled.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

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
    def messages(self, request, pk=None):
        session = self.get_object()
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(session=session)
            session.save() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)