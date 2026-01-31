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
            # Use transaction to ensure atomicity
            with transaction.atomic():
                user = User.objects.create_user(username=username, email=email, password=password)
                user.is_active = True
                user.save()

                # Create token directly instead of get_or_create since user is new
                token = Token.objects.create(user=user)
            
            logger.info(f"New user created: {username}")
            return Response({
                'message': 'Signup successful.',
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Signup failed for {username}: {e}", exc_info=True)
            return Response({'error': f'Signup failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        print(f"\n{'='*60}")
        print(f"[Login Request] Username: '{username}'")
        print(f"[Login Request] Password length: {len(password) if password else 0}")
        print(f"[Login Request] Session key: {request.session.session_key}")
        
        # 입력값 검증
        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 디버그: 사용자 존재 여부 확인
        try:
            user_exists = User.objects.filter(username=username).exists()
            print(f"[Login Debug] Username '{username}' exists: {user_exists}")
            if user_exists:
                user_obj = User.objects.get(username=username)
                print(f"[Login Debug] User details - Active: {user_obj.is_active}, Staff: {user_obj.is_staff}, Superuser: {user_obj.is_superuser}")
                print(f"[Login Debug] User has_usable_password: {user_obj.has_usable_password()}")
                has_token = Token.objects.filter(user=user_obj).exists()
                print(f"[Login Debug] User has token: {has_token}")
                if has_token:
                    existing_token = Token.objects.get(user=user_obj)
                    print(f"[Login Debug] Existing token: {existing_token.key[:10]}...")
        except Exception as e:
            print(f"[Login Debug] Error checking user: {e}")
        
        user = authenticate(username=username, password=password)
        print(f"[Login Debug] Authentication result: {user is not None}")
        
        if user:
            # 계정 활성화 상태 확인
            if not user.is_active:
                print(f"[Login Debug] User '{username}' is not active")
                return Response(
                    {'error': 'Account is disabled.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Token 인증 사용 (세션 로그인 불필요)
            token, created = Token.objects.get_or_create(user=user)
            print(f"[Login Debug] Token {'created' if created else 'retrieved'} for user '{username}'")
            print(f"[Login Debug] Token key: {token.key[:10]}...")
            print(f"[Login Success] User '{username}' logged in successfully")
            print(f"{'='*60}\n")
            
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email
            })
        
        print(f"[Login Failed] Authentication failed for username '{username}'")
        print(f"{'='*60}\n")
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Token 삭제 (선택적: Token을 재사용하려면 삭제하지 않음)
            # request.user.auth_token.delete()
            
            # Django 세션 로그아웃 (세션이 있는 경우)
            auth_logout(request)
            
            print(f"[Logout Debug] User '{request.user.username}' logged out successfully")
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"[Logout Debug] Error during logout: {e}")
            return Response({'error': 'Logout failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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