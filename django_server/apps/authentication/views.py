import logging
from django.conf import settings
from django.db import transaction
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout as auth_logout

logger = logging.getLogger(__name__)


class SignUpView(APIView):
    """회원가입 API"""
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
            logger.debug(f"[Signup Debug] Auth Key Match: {received_key == expected_key_str}")
        
        if received_key != expected_key_str:
            return Response({'error': 'Invalid Auth Key.'}, status=status.HTTP_403_FORBIDDEN)

        # 사용자 중복 검증
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 트랜잭션으로 원자성 보장
            with transaction.atomic():
                user = User.objects.create_user(username=username, email=email, password=password)
                user.is_active = True
                user.save()

                # 새 사용자이므로 토큰 생성
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
    """로그인 API"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        logger.info(f"[Login Request] Username: '{username}'")
        
        # 입력값 검증
        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 디버그: 사용자 존재 여부 확인
        if settings.DEBUG:
            try:
                user_exists = User.objects.filter(username=username).exists()
                logger.debug(f"[Login Debug] Username '{username}' exists: {user_exists}")
                if user_exists:
                    user_obj = User.objects.get(username=username)
                    logger.debug(f"[Login Debug] User details - Active: {user_obj.is_active}")
            except Exception as e:
                logger.debug(f"[Login Debug] Error checking user: {e}")
        
        user = authenticate(username=username, password=password)
        
        if user:
            # 계정 활성화 상태 확인
            if not user.is_active:
                logger.warning(f"[Login] User '{username}' is not active")
                return Response(
                    {'error': 'Account is disabled.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Token 인증 사용
            token, created = Token.objects.get_or_create(user=user)
            logger.info(f"[Login Success] User '{username}' logged in successfully")
            
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email
            })
        
        logger.warning(f"[Login Failed] Authentication failed for username '{username}'")
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """로그아웃 API"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Token 삭제 (선택적: Token을 재사용하려면 주석 처리)
            # request.user.auth_token.delete()
            
            # Django 세션 로그아웃 (세션이 있는 경우)
            auth_logout(request)
            
            logger.info(f"[Logout] User '{request.user.username}' logged out successfully")
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"[Logout] Error during logout: {e}")
            return Response({'error': 'Logout failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(APIView):
    """사용자 프로필 조회 API"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'date_joined': user.date_joined,
        })
