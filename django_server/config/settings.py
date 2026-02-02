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
    'apps.authentication',       # 인증 앱
    'apps.fabrix_agent_chat',    # AI 채팅 앱
    'apps.image_inspector',      # 이미지 비교 앱
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

# 5. Database (SQLite with WAL mode for better concurrency)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        'CONN_MAX_AGE': 0,  # Disable connection pooling for SQLite (prevents locking issues)
        'OPTIONS': {
            'timeout': 30,  # Increased timeout for concurrent operations
            'init_command': 'PRAGMA journal_mode=WAL;',  # Enable Write-Ahead Logging for better concurrency
        }
    }
}

# SQLite WAL 모드 활성화 (데이터베이스 초기화 시)
from django.db.backends.signals import connection_created
from django.dispatch import receiver

@receiver(connection_created)
def activate_wal_mode(sender, connection, **kwargs):
    """Enable WAL mode for better concurrency in SQLite"""
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        cursor.execute('PRAGMA journal_mode=WAL;')
        cursor.execute('PRAGMA synchronous=NORMAL;')  # Balance between safety and performance
        cursor.execute('PRAGMA cache_size=-64000;')  # 64MB cache
        cursor.execute('PRAGMA busy_timeout=30000;')  # 30 seconds timeout

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

# FabriX API 설정 노출 (secrets.toml에서 로드된 값 사용)
FABRIX_API_CONFIG = SECRETS.get('fabrix_api', {})

# 브라우저 종료 시 세션 만료
SESSION_EXPIRE_AT_BROWSER_CLOSE = True  # 브라우저 닫으면 세션 삭제
SESSION_COOKIE_AGE = 1800  # 30분 후 자동 만료 (선택 사항)
SESSION_SAVE_EVERY_REQUEST = True  # 요청마다 세션 갱신 (활동 중에는 유지)

# 13. HTTP Client Configuration (재사용 가능한 클라이언트)
import httpx
import atexit

# 공유 HTTP 클라이언트 생성 (연결 재사용 및 안정성 향상)
SHARED_HTTP_CLIENT = httpx.Client(
    timeout=httpx.Timeout(
        connect=5.0,   # Connection timeout: 5 seconds
        read=30.0,     # Read timeout: 30 seconds
        write=10.0,    # Write timeout: 10 seconds
        pool=5.0       # Pool timeout: 5 seconds
    ),
    limits=httpx.Limits(
        max_keepalive_connections=10,  # Reduced for stability
        max_connections=50,            # Reduced for Windows compatibility
        keepalive_expiry=30.0          # Close idle connections after 30s
    ),
    transport=httpx.HTTPTransport(
        retries=2  # Automatic retry on connection failures
    )
)

# 애플리케이션 종료 시 클라이언트 닫기
def cleanup_http_client():
    try:
        SHARED_HTTP_CLIENT.close()
    except Exception:
        pass  # Ignore cleanup errors

atexit.register(cleanup_http_client)

# 14. Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{levelname}] {asctime} {name} {message}',
            'style': '{',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
        'simple': {
            'format': '[{levelname}] {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'maxBytes': 1024 * 1024 * 10,  # 10MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'WARNING',  # Only log database warnings/errors
            'propagate': False,
        },
        'apps.fabrix_agent_chat': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
    },
}

# Create logs directory if it doesn't exist
import os
logs_dir = BASE_DIR / 'logs'
if not os.path.exists(logs_dir):
    os.makedirs(logs_dir)