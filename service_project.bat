@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo   [FabriX Agent Chat] 사내망 서비스 모드 실행 (0.0.0.0)
echo   주의: 방화벽 경고 시 '액세스 허용'을 반드시 눌러주세요.
echo ========================================================
echo.

:: 1. 가상환경 확인
if not exist .venv (
    echo [Error] 가상환경이 없습니다. 'setup_project.bat'를 먼저 실행하세요.
    pause
    exit /b
)

:: 2. Django Server (Port 8000 - Public)
echo [1/3] Django 서버 개방 (0.0.0.0:8000)...
start "Django Service" cmd /k "call .venv\Scripts\activate & cd django_server & python manage.py runserver 0.0.0.0:8000 --noreload"

:: 3. FastAPI Gateway (Port 8001 - Public) - 단일 워커
echo [2/3] AI 게이트웨이 개방 (0.0.0.0:8001)...
start "FastAPI Service" cmd /k "call .venv\Scripts\activate & uvicorn ai_gateway.main:app --host 0.0.0.0 --port 8001"

:: 4. React Frontend (Port 5173 - Public)
echo [3/3] React 클라이언트 개방 (0.0.0.0:5173)...
cd frontend
start "React Service" cmd /k "npm run dev -- --host 0.0.0.0"

echo.
echo ========================================================
echo   서비스가 시작되었습니다!
echo.
echo   [접속 방법]
echo   1. 본인 PC에서 확인: http://localhost:5173
echo   2. 동료에게 공유 시: http://내IP주소:5173 공유
echo.
echo   [앱 접속 주소]
echo   * Chat 앱: http://localhost:5173/chat
echo   * Image Inspector: http://localhost:5173/image-compare
echo   * 앱 선택화면: http://localhost:5173
echo ========================================================
pause