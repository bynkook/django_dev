"""
FastAPI Router: Chat (FabriX Agent)
FabriX AI 에이전트와의 채팅 엔드포인트
"""

from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import List
import json
import httpx
import asyncio
import logging

from ..services.rate_limiter import rate_limiter

router = APIRouter()
logger = logging.getLogger(__name__)


# Pydantic Models
class ChatRequest(BaseModel):
    agentId: str
    contents: List[str]
    isStream: bool = True
    isRagOn: bool = True


def get_fabrix_config():
    """FabriX API 설정 가져오기 (main.py에서 로드됨)"""
    # main.py의 SECRETS에서 로드
    from pathlib import Path
    import toml
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    SECRETS_PATH = BASE_DIR / "secrets.toml"
    
    with open(SECRETS_PATH, "r", encoding="utf-8") as f:
        SECRETS = toml.load(f)
    
    FABRIX_CONFIG = SECRETS['fabrix_api']
    FABRIX_BASE_URL = FABRIX_CONFIG['base_url'].rstrip('/')
    FABRIX_AGENT_URL = f"{FABRIX_BASE_URL}/openapi/agent-chat/v1"
    
    return FABRIX_CONFIG, FABRIX_AGENT_URL


def get_fabrix_headers():
    """FabriX API 요청 헤더 생성"""
    fabrix_config, _ = get_fabrix_config()
    return {
        "Content-Type": "application/json",
        "x-fabrix-client": fabrix_config['client_key'],
        "x-openapi-token": fabrix_config['openapi_token'],
        "x-generative-ai-user-email": fabrix_config.get('user_email', ''),
    }


@router.get("/agents")
async def get_agents(request: Request, page: int = 1, limit: int = 50):
    """
    [GET] /agent-messages/agents
    FabriX에서 사용 가능한 Agent 목록을 조회합니다.
    """
    _, fabrix_agent_url = get_fabrix_config()
    url = f"{fabrix_agent_url}/agents"
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
        logger.error(f"FabriX API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch agents")


@router.post("")
async def chat_stream(req: ChatRequest, request: Request):
    """
    [POST] /agent-messages
    사용자 메시지를 FabriX로 전송하고, 답변을 SSE 스트림으로 반환합니다.
    """
    _, fabrix_agent_url = get_fabrix_config()
    
    # Rate Limiter 체크
    estimated_tokens = sum(len(content) for content in req.contents) // 4
    estimated_tokens = max(100, estimated_tokens)
    
    # Rate limit 체크 및 자동 대기
    max_retries = 3
    max_wait_time = 10.0
    
    for attempt in range(max_retries):
        can_proceed, error_msg = rate_limiter.can_proceed(estimated_tokens)
        
        if can_proceed:
            break
        
        wait_time = rate_limiter.get_wait_time(estimated_tokens)
        
        if wait_time > max_wait_time or attempt == max_retries - 1:
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
        
        logger.info(f"Rate limit reached, waiting {wait_time:.2f}s (attempt {attempt + 1}/{max_retries})")
        await asyncio.sleep(wait_time)
    else:
        logger.error(f"Rate limit exceeded after {max_retries} retries")
        raise HTTPException(status_code=429, detail="Rate limit exceeded, please try again later")
    
    url = f"{fabrix_agent_url}/agent-messages"
    headers = get_fabrix_headers()
    
    payload = {
        "agentId": req.agentId,
        "contents": req.contents,
        "isStream": True,
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
                    if line:
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


@router.post("/file")
async def chat_with_file(
    request: Request,
    file: UploadFile = File(...),
    agentId: str = Form(...),
    contents: str = Form(...)
):
    """
    [POST] /agent-messages/file
    파일을 업로드하고 FabriX Code Interpreter 등을 이용해 분석 결과를 받습니다.
    """
    _, fabrix_agent_url = get_fabrix_config()
    
    # Rate Limiter 체크
    estimated_tokens = max(500, len(contents) // 4)
    
    max_retries = 3
    max_wait_time = 15.0
    
    for attempt in range(max_retries):
        can_proceed, error_msg = rate_limiter.can_proceed(estimated_tokens)
        
        if can_proceed:
            break
        
        wait_time = rate_limiter.get_wait_time(estimated_tokens)
        
        if wait_time > max_wait_time or attempt == max_retries - 1:
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
        
        logger.info(f"Rate limit reached for file upload, waiting {wait_time:.2f}s (attempt {attempt + 1}/{max_retries})")
        await asyncio.sleep(wait_time)
    else:
        logger.error(f"File upload rate limit exceeded after {max_retries} retries")
        raise HTTPException(status_code=429, detail="Rate limit exceeded, please try again later")
    
    url = f"{fabrix_agent_url}/agent-messages/file"
    
    headers = get_fabrix_headers()
    headers.pop("Content-Type", None)

    try:
        file.file.seek(0)
        files = {
            'file': (file.filename, file.file, file.content_type)
        }
        
        data = {
            'agentId': agentId,
            'isStream': 'False',
            'contents': contents
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
        logger.error(f"File Upload Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rate-limit-status")
async def get_rate_limit_status():
    """
    [GET] /agent-messages/rate-limit-status
    현재 Rate Limiter 사용 현황을 조회합니다.
    """
    return rate_limiter.get_current_usage()
