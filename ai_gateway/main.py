"""
FastAPI Main Application
AI Gateway - FabriX Agent 및 Image Inspector를 위한 API 게이트웨이
"""

import sys
import logging
from pathlib import Path
from contextlib import asynccontextmanager

import httpx
import toml
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import health, chat, image

# Logging 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 환경 설정 및 Secrets 로드
BASE_DIR = Path(__file__).resolve().parent.parent
SECRETS_PATH = BASE_DIR / "secrets.toml"

try:
    with open(SECRETS_PATH, "r", encoding="utf-8") as f:
        SECRETS = toml.load(f)
except FileNotFoundError:
    print(f"Error: secrets.toml not found at {SECRETS_PATH}")
    sys.exit(1)

SERVER_CONFIG = SECRETS['server']

# Lifecycle management for HTTP client
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage HTTP client lifecycle"""
    # Startup: Create shared AsyncClient
    app.state.http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(60.0, connect=10.0, read=60.0)
    )
    logger.info("✅ HTTP Client initialized with 60s timeout")
    yield
    # Shutdown: Close AsyncClient
    await app.state.http_client.aclose()
    logger.info("✅ HTTP Client closed")


# FastAPI 앱 초기화
app = FastAPI(
    title="AI Gateway",
    description="FabriX Agent & Image Inspector API Gateway",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=SECRETS['security']['allowed_hosts'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(chat.router, prefix="/agent-messages", tags=["Chat"])
app.include_router(image.router, prefix="/image-compare", tags=["Image"])


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "name": "AI Gateway",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "chat": "/agent-messages",
            "image": "/image-compare",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    # 개발용 실행 (실제 실행은 run_project.bat 사용 권장)
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
