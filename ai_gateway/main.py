import sys
import json
import toml
import requests
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
async def get_agents(page: int = 1, limit: int = 50):
    """
    [GET] /agents
    FabriX에서 사용 가능한 Agent 목록을 조회합니다.
    """
    url = f"{FABRIX_AGENT_URL}/agents"
    params = {"page": page, "limit": limit}
    headers = get_fabrix_headers()

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"FabriX API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch agents from FabriX")

@app.post("/agent-messages")
async def chat_stream(req: ChatRequest):
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

    def event_generator():
        try:
            with requests.post(url, headers=headers, json=payload, stream=True) as r:
                r.raise_for_status()
                # FabriX 응답을 한 줄씩 읽어서 클라이언트로 전달 (Pass-through)
                for line in r.iter_lines():
                    if line:
                        decoded_line = line.decode('utf-8')
                        # FabriX는 "data: {...}" 형태의 문자열을 보냄
                        # SSE 포맷 유지를 위해 그대로 yield 하거나 필요한 경우 가공
                        if decoded_line.startswith("data:"):
                            # "data:" 접두어 제거 후 JSON 파싱하여 검증 가능하나,
                            # 성능을 위해 그대로 전달 (React에서 파싱)
                            yield decoded_line + "\n\n"
                        else:
                            # heartbeat 등 기타 라인 처리
                            pass
        except Exception as e:
            print(f"Streaming Error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return EventSourceResponse(event_generator())

@app.post("/agent-messages/file")
async def chat_with_file(
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
    
    # 헤더에서 Content-Type 제거 (requests가 boundary 자동 설정하도록)
    headers = get_fabrix_headers()
    headers.pop("Content-Type", None)

    try:
        # Use file-like object directly instead of reading into memory
        # This is more memory efficient for large files
        file.file.seek(0)  # Reset file pointer to beginning
        
        # 2. Multipart 데이터 구성
        files = {
            'file': (file.filename, file.file, file.content_type)
        }
        
        # 3. Form 데이터 구성 (contents는 리스트 형태여야 함)
        # 클라이언트에서 contents를 단순 문자열로 보냈다면 리스트로 변환
        content_list = [contents]
        
        data = {
            'agentId': agentId,
            'isStream': 'False', # 파일 분석은 보통 단답형이 많으므로 False 설정 (필요시 변경)
        }
        # requests 라이브러리는 data의 리스트를 multiple value로 처리하므로 주의
        # FabriX API가 contents를 여러 개의 필드로 받는지, JSON 문자열로 받는지 확인 필요.
        # 매뉴얼상 List[string]이므로, data에 'contents': ["질문"] 형태로 전달.
        
        # requests의 data 파라미터에 리스트를 직접 넘기면 form-data의 array로 전송됨
        response = requests.post(
            url, 
            headers=headers, 
            files=files, 
            data={'agentId': agentId, 'isStream': 'False', 'contents': content_list},
            timeout=30  # Add timeout for large file uploads
        )
        
        response.raise_for_status()
        return response.json()

    except requests.Timeout:
        print(f"File Upload Timeout")
        raise HTTPException(status_code=504, detail="File upload timed out")
    except Exception as e:
        print(f"File Upload Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # 개발용 실행 (실제 실행은 run_project.bat 사용 권장)
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)