@echo off
echo [INFO] Creating Project Directory Structure...

:: 1. Django Server Directories
if not exist "django_server" mkdir django_server
if not exist "django_server\config" mkdir django_server\config
if not exist "django_server\apps" mkdir django_server\apps
if not exist "django_server\apps\fabrix_agent_chat" mkdir django_server\apps\fabrix_agent_chat
if not exist "django_server\apps\fabrix_agent_chat\migrations" mkdir django_server\apps\fabrix_agent_chat\migrations

:: Create Django empty __init__.py files to make them packages
type nul > django_server\apps\__init__.py
type nul > django_server\apps\fabrix_agent_chat\__init__.py
type nul > django_server\apps\fabrix_agent_chat\migrations\__init__.py

:: 2. AI Gateway (FastAPI) Directories
if not exist "ai_gateway" mkdir ai_gateway
if not exist "ai_gateway\routers" mkdir ai_gateway\routers

echo [SUCCESS] Backend directory structure created successfully.
echo [NEXT STEP] Run 'setup_npm.bat' to create frontend environment.
pause