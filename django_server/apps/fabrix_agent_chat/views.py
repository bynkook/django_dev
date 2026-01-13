from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatSessionDetailSerializer, ChatMessageSerializer

import requests
from django.conf import settings

class AgentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # settings.py에서 로드한 secrets.toml 설정 사용
        fabrix_conf = getattr(settings, 'SECRETS', {}).get('fabrix_api', {})
        
        base_url = fabrix_conf.get('base_url', '').rstrip('/')
        target_url = f"{base_url}/openapi/agent-chat/v1/agents"
        
        headers = {
            'Content-Type': 'application/json',
            'x-fabrix-client': fabrix_conf.get('client_key'),
            'x-openapi-token': fabrix_conf.get('openapi_token'),
        }
        
        try:
            # FabriX API 호출
            response = requests.get(target_url, headers=headers, params={'page': 1, 'limit': 100})
            return Response(response.json(), status=response.status_code)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SignUpView(APIView):
    """
    [POST] /api/auth/signup/
    관리자 인증키(admin_signup_key) 검증 후 회원가입
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        auth_key = request.data.get('auth_key') # 사용자 입력 인증키

        # 1. 필수 필드 검증
        if not all([username, password, email, auth_key]):
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # 2. 인증키 검증 (secrets.toml 설정값)
        if auth_key != settings.ADMIN_SIGNUP_KEY:
            return Response({'error': 'Invalid Auth Key.'}, status=status.HTTP_403_FORBIDDEN)

        # 3. 중복 사용자 확인
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # 4. 계정 생성 및 활성화
        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_active = True # 인증키 통과 시 즉시 활성화
        user.save()

        # 5. 토큰 발행 (자동 로그인 효과)
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Signup successful.',
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    """
    [POST] /api/auth/login/
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ChatSessionViewSet(viewsets.ModelViewSet):
    """
    [GET, POST, DELETE] /api/sessions/
    대화방 관리 ViewSet. 본인의 세션만 조회 가능.
    """
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 로그인한 사용자의 세션만 필터링
        return ChatSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        # 목록 조회 vs 상세 조회 시 다른 Serializer 사용
        if self.action == 'retrieve':
            return ChatSessionDetailSerializer
        return ChatSessionSerializer

    @action(detail=True, methods=['post'])
    def messages(self, request, pk=None):
        """
        [POST] /api/sessions/{id}/messages/
        특정 세션에 메시지 추가 (User 질문 또는 AI 답변 저장)
        """
        session = self.get_object()
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(session=session)
            # 세션의 updated_at 갱신 (목록 상단 이동)
            session.save() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)