@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo   [FabriX Agent Chat] 개발 모드 실행 (Localhost Only)
echo ========================================================
echo.

:: 1. 가상환경 확인
if not exist .venv (
    echo [Error] 가상환경이 없습니다. 'setup_project.bat'를 먼저 실행하세요.
    pause
    exit /b
)

:: 2. Django Server (Port 8000)
echo [1/3] Django 서버 시작 (127.0.0.1:8000)...
start "Django Server" cmd /k "call .venv\Scripts\activate & cd django_server & python manage.py runserver --noreload"

:: 3. FastAPI Gateway (Port 8001) - 단일 워커 (Windows 호환)
echo [2/3] AI 게이트웨이 시작 (127.0.0.1:8001)...
start "FastAPI Gateway" cmd /k "call .venv\Scripts\activate & uvicorn ai_gateway.main:app --host 127.0.0.1 --port 8001 --reload"

:: 4. React Frontend (Localhost)
echo [3/3] React 클라이언트 시작...
cd frontend
start "React Frontend" cmd /k "npm run dev"

echo.
echo   모든 서비스가 시작되었습니다.
echo   - Django Backend: http://127.0.0.1:8000
echo   - FastAPI Gateway: http://127.0.0.1:8001
echo   - Frontend (Chat + Image Inspector): http://localhost:5173
echo.
echo   접속 주소:
echo   * Chat 앱: http://localhost:5173/chat
echo   * Image Inspector 앱: http://localhost:5173/image-compare
echo   * 통합 로그인: http://localhost:5173/login
echo ========================================================
pause