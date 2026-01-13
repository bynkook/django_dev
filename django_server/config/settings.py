from pathlib import Path
import os
import sys
import toml

# 1. Base Directory 설정
BASE_DIR = Path(__file__).resolve().parent.parent
# Root Directory (secrets.toml 위치)
ROOT_DIR = BASE_DIR.parent

# 2. secrets.toml 로드
try:
    secrets_path = ROOT_DIR / "secrets.toml"
    with open(secrets_path, "r", encoding="utf-8") as f:
        SECRETS = toml.load(f)
except FileNotFoundError:
    print(f"Error: secrets.toml not found at {secrets_path}")
    sys.exit(1)

# 3. Django Core Settings
SECRET_KEY = SECRETS['security']['django_secret_key']
DEBUG = SECRETS['server']['debug']
ALLOWED_HOSTS = SECRETS['security']['allowed_hosts']

# 4. Application Definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party Apps
    'rest_framework',
    'rest_framework.authtoken',  # 토큰 인증
    'corsheaders',               # CORS 설정

    # Local Apps
    'apps.fabrix_agent_chat',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 최상단 위치 권장
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# 5. Database (SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 6. Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# 7. Internationalization
LANGUAGE_CODE = 'ko-kr'
TIME_ZONE = 'Asia/Seoul'
USE_I18N = True
USE_TZ = True

# 8. Static files
STATIC_URL = 'static/'

# 9. Default Primary Key Field Type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 10. CORS Settings (사내망 서비스용 개방 설정)
CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True

# 11. REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication', 
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# 12. Custom Auth Settings (Admin Key)
ADMIN_SIGNUP_KEY = SECRETS['auth']['admin_signup_key']

# [수정 1] FabriX API 설정 노출 (secrets.toml에서 로드된 값 사용)
FABRIX_API_CONFIG = SECRETS.get('fabrix_api', {})

# [수정 2] 브라우저 종료 시 세션 만료 (문제 5번 해결)
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_AGE = 1800  # 30분 후 만료 (선택 사항)