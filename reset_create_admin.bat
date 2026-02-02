@echo off
chcp 65001 > nul
echo ========================================================
echo   [FabriX Agent Chat] DB 초기화 및 관리자 생성
echo   주의: 기존 데이터베이스(db.sqlite3)가 영구 삭제됩니다.
echo ========================================================
echo.

:: 1. 가상환경 활성화
if not exist .venv (
    echo [Error] 가상환경 .venv 폴더가 없습니다. 'setup_project.bat'를 먼저 실행하세요.
    pause
    exit /b
)
call .venv\Scripts\activate

:: 2. Django 프로젝트 폴더로 이동
cd django_server

:: 3. 기존 DB 삭제 (Clean Slate)
if exist db.sqlite3 (
    echo [1/3] 기존 DB 파일 삭제 중...
    del db.sqlite3
) else (
    echo [1/3] 기존 DB가 없습니다. 새로 생성합니다.
)

:: 4. 마이그레이션 적용 (Table 생성)
echo.
echo [2/3] DB 테이블 생성 (Migrate)...
:: 혹시 모를 마이그레이션 충돌 방지를 위해 앱 지정
python manage.py makemigrations fabrix_agent_chat
python manage.py makemigrations authentication
python manage.py makemigrations core
python manage.py makemigrations image_inspector
python manage.py migrate

:: 5. 관리자 계정 생성
echo.
echo [3/3] 관리자 계정(Superuser)을 생성합니다.
echo 사용하실 ID, Email, Password를 입력해 주세요.
python manage.py createsuperuser

echo.
echo ========================================================
echo   초기화가 완료되었습니다.
echo   이제 'run_project.bat' 또는 'service_project.bat'를 실행하세요.
echo ========================================================
pause