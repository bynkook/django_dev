import sys
import json
import toml
import httpx
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel

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

# 2. FastAPI 앱 초기화
app = FastAPI(title="FabriX AI Gateway")

# 3. CORS 설정 (React 연동 및 사내망 서비스 모드 지원)
app.add_middleware(
    CORSMiddleware,
    allow_origins=SECRETS['security']['allowed_hosts'],  # ["*"] 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lifecycle events for HTTP client management
@app.on_event("startup")
async def startup_event():
    """Create shared AsyncClient on startup"""
    app.state.http_client = httpx.AsyncClient(timeout=30.0)

@app.on_event("shutdown")
async def shutdown_event():
    """Close AsyncClient on shutdown"""
    await app.state.http_client.aclose()

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
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line and line.startswith("data:"):
                        yield line + "\n\n"
        except Exception as e:
            print(f"Streaming Error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

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
    url = f"{FABRIX_AGENT_URL}/agent-messages/file"
    
    # 헤더에서 Content-Type 제거 (httpx가 boundary 자동 설정하도록)
    headers = get_fabrix_headers()
    headers.pop("Content-Type", None)

    try:
        file_content = await file.read()
        files = {
            'file': (file.filename, file_content, file.content_type)
        }
        
        # Form 데이터 구성
        data = {
            'agentId': agentId,
            'isStream': 'False',
            'contents': [contents]
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

if __name__ == "__main__":
    import uvicorn
    # 개발용 실행 (실제 실행은 run_project.bat 사용 권장)
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)