import sys
import json
import toml
import httpx
import logging
import asyncio
from pathlib import Path
from typing import List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel

from .rate_limiter import rate_limiter
from .image_processor import process_comparison

# Logging 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 1. 환경 설정 및 Secrets 로드
BASE_DIR = Path(__file__).resolve().parent.parent
SECRETS_PATH = BASE_DIR / "secrets.toml"

try:
    with open(SECRETS_PATH, "r", encoding="utf-8") as f:
        SECRETS = toml.load(f)
except FileNotFoundError:
    print(f"Error: secrets.toml not found at {SECRETS_PATH}")
    sys.exit(1)

FABRIX_CONFIG = SECRETS['fabrix_api']
SERVER_CONFIG = SECRETS['server']

# FabriX API Base URL (예: https://api.fabrix.../openapi/agent-chat/v1)
# 매뉴얼상 URL 구조: {BASE_URL}/openapi/agent-chat/v1/...
FABRIX_BASE_URL = FABRIX_CONFIG['base_url'].rstrip('/')
FABRIX_AGENT_URL = f"{FABRIX_BASE_URL}/openapi/agent-chat/v1"

# Lifecycle management for HTTP client
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage HTTP client lifecycle"""
    # Startup: Create shared AsyncClient with longer timeout for streaming
    app.state.http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(60.0, connect=10.0, read=60.0)
    )
    logger.info("HTTP Client initialized with 60s timeout")
    yield
    # Shutdown: Close AsyncClient
    await app.state.http_client.aclose()
    logger.info("HTTP Client closed")

# 2. FastAPI 앱 초기화
app = FastAPI(title="FabriX AI Gateway", lifespan=lifespan)

# 이미지 처리 동시성 제어 (최대 5개 동시 처리)
image_processing_semaphore = asyncio.Semaphore(5)

# 3. CORS 설정 (React 연동 및 사내망 서비스 모드 지원)
app.add_middleware(
    CORSMiddleware,
    allow_origins=SECRETS['security']['allowed_hosts'],  # ["*"] 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. 공통 헤더 생성 함수
def get_fabrix_headers():
    return {
        "Content-Type": "application/json",
        "x-fabrix-client": FABRIX_CONFIG['client_key'],
        "x-openapi-token": FABRIX_CONFIG['openapi_token'],
        "x-generative-ai-user-email": FABRIX_CONFIG.get('user_email', ''),
    }

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    agentId: str
    contents: List[str]
    isStream: bool = True
    isRagOn: bool = True
    # 추가 옵션들 (필요시 확장)

# --- API Endpoints ---

@app.get("/rate-limit-status")
async def get_rate_limit_status():
    """
    [GET] /rate-limit-status
    현재 Rate Limiter 사용 현황을 조회합니다.
    """
    return rate_limiter.get_current_usage()

@app.get("/agents")
async def get_agents(request: Request, page: int = 1, limit: int = 50):
    """
    [GET] /agents
    FabriX에서 사용 가능한 Agent 목록을 조회합니다.
    """
    url = f"{FABRIX_AGENT_URL}/agents"
    params = {"page": page, "limit": limit}
    headers = get_fabrix_headers()

    try:
        response = await request.app.state.http_client.get(
            url, headers=headers, params=params
        )
        response.raise_for_status()
        return response.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timeout")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        print(f"FabriX API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch agents")

@app.post("/agent-messages")
async def chat_stream(req: ChatRequest, request: Request):
    """
    [POST] /agent-messages
    사용자 메시지를 FabriX로 전송하고, 답변을 SSE 스트림으로 반환합니다.
    """
    # Rate Limiter 체크 (평균 토큰 사용량 추정)
    estimated_tokens = sum(len(content) for content in req.contents) // 4  # 대략 4 chars = 1 token
    estimated_tokens = max(100, estimated_tokens)  # 최소 100 토큰
    
    # Rate limit 체크 및 자동 대기
    max_retries = 3
    max_wait_time = 10.0  # 최대 10초까지 대기
    
    for attempt in range(max_retries):
        can_proceed, error_msg = rate_limiter.can_proceed(estimated_tokens)
        
        if can_proceed:
            break
        
        # 대기 시간 계산
        wait_time = rate_limiter.get_wait_time(estimated_tokens)
        
        if wait_time > max_wait_time or attempt == max_retries - 1:
            # 대기 시간이 너무 길거나 마지막 시도면 에러 반환
            logger.warning(f"Rate limit exceeded after {attempt + 1} attempts: {error_msg}")
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "rate_limit_exceeded",
                    "message": error_msg,
                    "retry_after": wait_time,
                    "current_usage": rate_limiter.get_current_usage()
                }
            )
        
        # 대기 후 재시도
        logger.info(f"Rate limit reached, waiting {wait_time:.2f}s (attempt {attempt + 1}/{max_retries})")
        import asyncio
        await asyncio.sleep(wait_time)
    
    else:
        # 모든 재시도 실패
        logger.error(f"Rate limit exceeded after {max_retries} retries")
        raise HTTPException(status_code=429, detail="Rate limit exceeded, please try again later")
    
    url = f"{FABRIX_AGENT_URL}/agent-messages"
    headers = get_fabrix_headers()
    
    # Request Body 구성
    payload = {
        "agentId": req.agentId,
        "contents": req.contents,
        "isStream": True,  # 강제 스트리밍
        "isRagOn": req.isRagOn,
        "executeFinalAnswer": True,
        "executeRagFinalAnswer": True,
        "executeRagStandaloneQuery": True
    }

    async def event_generator():
        try:
            async with request.app.state.http_client.stream(
                "POST", url, headers=headers, json=payload
            ) as response:
                # 스트림 시작 전 상태 확인
                response.raise_for_status()
                
                async for line in response.aiter_lines():
                    if line:
                        # bytes를 문자열로 변환
                        decoded_line = line if isinstance(line, str) else line.decode('utf-8')
                        if decoded_line.startswith("data:"):
                            yield decoded_line + "\n\n"
                            
        except httpx.TimeoutException:
            logger.error("Streaming timeout occurred")
            yield f'data: {json.dumps({"error": "timeout", "detail": "API request timeout"})}\n\n'
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error during streaming: {e.response.status_code}")
            yield f'data: {json.dumps({"error": "http_error", "status": e.response.status_code, "detail": str(e)})}\n\n'
        except httpx.RequestError as e:
            logger.error(f"Request error during streaming: {e}")
            yield f'data: {json.dumps({"error": "request_error", "detail": str(e)})}\n\n'
        except Exception as e:
            logger.error(f"Unexpected streaming error: {e}")
            yield f'data: {json.dumps({"error": "unexpected_error", "detail": str(e)})}\n\n'

    return EventSourceResponse(event_generator())

@app.post("/agent-messages/file")
async def chat_with_file(
    request: Request,
    file: UploadFile = File(...),
    agentId: str = Form(...),
    contents: str = Form(...) # React에서 JSON stringify해서 보냄
):
    """
    [POST] /agent-messages/file
    파일을 업로드하고 FabriX Code Interpreter 등을 이용해 분석 결과를 받습니다.
    (Non-streaming 방식 예시)
    """
    # Rate Limiter 체크 (파일 업로드는 더 많은 토큰 소비)
    estimated_tokens = max(500, len(contents) // 4)  # 파일 처리는 최소 500 토큰
    
    # Rate limit 체크 및 자동 대기
    max_retries = 3
    max_wait_time = 15.0  # 파일 업로드는 최대 15초까지 대기
    
    for attempt in range(max_retries):
        can_proceed, error_msg = rate_limiter.can_proceed(estimated_tokens)
        
        if can_proceed:
            break
        
        # 대기 시간 계산
        wait_time = rate_limiter.get_wait_time(estimated_tokens)
        
        if wait_time > max_wait_time or attempt == max_retries - 1:
            # 대기 시간이 너무 길거나 마지막 시도면 에러 반환
            logger.warning(f"Rate limit exceeded for file upload after {attempt + 1} attempts: {error_msg}")
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "rate_limit_exceeded",
                    "message": error_msg,
                    "retry_after": wait_time,
                    "current_usage": rate_limiter.get_current_usage()
                }
            )
        
        # 대기 후 재시도
        logger.info(f"Rate limit reached for file upload, waiting {wait_time:.2f}s (attempt {attempt + 1}/{max_retries})")
        import asyncio
        await asyncio.sleep(wait_time)
    
    else:
        # 모든 재시도 실패
        logger.error(f"File upload rate limit exceeded after {max_retries} retries")
        raise HTTPException(status_code=429, detail="Rate limit exceeded, please try again later")
    
    url = f"{FABRIX_AGENT_URL}/agent-messages/file"
    
    # 헤더에서 Content-Type 제거 (httpx가 boundary 자동 설정하도록)
    headers = get_fabrix_headers()
    headers.pop("Content-Type", None)

    try:
        # 스트리밍 방식으로 파일 전송 (메모리 효율적)
        file.file.seek(0)
        files = {
            'file': (file.filename, file.file, file.content_type)
        }
        
        # Form 데이터 구성 (contents는 문자열로 직접 전송)
        data = {
            'agentId': agentId,
            'isStream': 'False',
            'contents': contents  # 문자열로 직접 전송 (API 명세 준수)
        }
        
        response = await request.app.state.http_client.post(
            url,
            headers=headers,
            files=files,
            data=data
        )
        response.raise_for_status()
        return response.json()

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="File upload timed out")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        print(f"File Upload Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/image-compare/process")
async def compare_images(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    mode: str = Form("difference"),
    diff_threshold: int = Form(30),
    feature_count: int = Form(4000),
    page1: int = Form(0),
    page2: int = Form(0)
):
    """
    [POST] /image-compare/process
    두 이미지/PDF를 비교하여 차이점을 시각화합니다.
    
    Args:
        file1: 첫 번째 파일 (이미지 또는 PDF)
        file2: 두 번째 파일 (이미지 또는 PDF)
        mode: 비교 모드 ('difference' 또는 'overlay')
        diff_threshold: 차이 임계값 (0-255)
        feature_count: ORB 특징점 개수 (1000-10000)
        page1: PDF 페이지 번호 (0-based)
        page2: PDF 페이지 번호 (0-based)
    
    Returns:
        {
            "result_base64": str (JPEG, 화면 표시용),
            "download_base64": str (PNG, 다운로드용),
            "metadata": dict
        }
    """
    # 파일 크기 제한 (100MB)
    MAX_FILE_SIZE = 100 * 1024 * 1024
    
    # MIME 타입 검증
    ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    
    if file1.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type for file1: {file1.content_type}. Allowed: {', '.join(ALLOWED_TYPES)}"
        )
    
    if file2.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type for file2: {file2.content_type}. Allowed: {', '.join(ALLOWED_TYPES)}"
        )
    
    # Semaphore로 동시 처리 제한 (최대 5개)
    async with image_processing_semaphore:
        try:
            logger.info(f"Image comparison started: {file1.filename} vs {file2.filename}")
            
            # 파일 읽기
            file1_bytes = await file1.read()
            file2_bytes = await file2.read()
            
            # 크기 검증
            if len(file1_bytes) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail=f"File1 too large: {len(file1_bytes) / 1024 / 1024:.1f}MB (max 100MB)"
                )
            
            if len(file2_bytes) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail=f"File2 too large: {len(file2_bytes) / 1024 / 1024:.1f}MB (max 100MB)"
                )
            
            # CPU-bound 작업을 별도 스레드에서 실행 (이벤트 루프 블록 방지)
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,  # ThreadPoolExecutor 사용 (기본)
                process_comparison,
                file1_bytes,
                file1.content_type,
                file2_bytes,
                file2.content_type,
                mode,
                diff_threshold,
                feature_count,
                page1,
                page2
            )
            
            logger.info(f"Image comparison completed: {result['metadata']['result_size']}")
            return result
        
        except ValueError as e:
            # 사용자 입력 오류 (파일 형식, 페이지 번호 등)
            logger.warning(f"Invalid input: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        
        except Exception as e:
            # 서버 내부 오류
            logger.error(f"Image comparison failed: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"Image processing failed: {str(e)}"
            )

if __name__ == "__main__":
    import uvicorn
    # 개발용 실행 (실제 실행은 run_project.bat 사용 권장)
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)