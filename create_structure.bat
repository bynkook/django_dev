@echo off
echo [INFO] Creating Project Directory Structure...

:: 1. Django Server Directories
if not exist "django_server" mkdir django_server
if not exist "django_server\config" mkdir django_server\config
if not exist "django_server\apps" mkdir django_server\apps
if not exist "django_server\apps\fabrix_agent_chat" mkdir django_server\apps\fabrix_agent_chat
if not exist "django_server\apps\fabrix_agent_chat\migrations" mkdir django_server\apps\fabrix_agent_chat\migrations
if not exist "django_server\apps\authentication" mkdir django_server\apps\authentication
if not exist "django_server\apps\authentication\migrations" mkdir django_server\apps\authentication\migrations
if not exist "django_server\apps\core" mkdir django_server\apps\core
if not exist "django_server\apps\core\management" mkdir django_server\apps\core\management
if not exist "django_server\apps\core\management\commands" mkdir django_server\apps\core\management\commands
if not exist "django_server\apps\image_inspector" mkdir django_server\apps\image_inspector
if not exist "django_server\apps\image_inspector\migrations" mkdir django_server\apps\image_inspector\migrations

:: Create Django empty __init__.py files to make them packages
type nul > django_server\apps\__init__.py
type nul > django_server\apps\fabrix_agent_chat\__init__.py
type nul > django_server\apps\fabrix_agent_chat\migrations\__init__.py
type nul > django_server\apps\authentication\__init__.py
type nul > django_server\apps\authentication\migrations\__init__.py
type nul > django_server\apps\core\__init__.py
type nul > django_server\apps\core\management\__init__.py
type nul > django_server\apps\core\management\commands\__init__.py
type nul > django_server\apps\image_inspector\__init__.py
type nul > django_server\apps\image_inspector\migrations\__init__.py

:: 2. AI Gateway (FastAPI) Directories
if not exist "ai_gateway" mkdir ai_gateway
if not exist "ai_gateway\routers" mkdir ai_gateway\routers
if not exist "ai_gateway\services" mkdir ai_gateway\services

:: Create FastAPI empty __init__.py files to make them packages
type nul > ai_gateway\__init__.py
type nul > ai_gateway\routers\__init__.py
type nul > ai_gateway\services\__init__.py

echo [SUCCESS] Backend directory structure created successfully.
echo [NEXT STEP] Run 'setup_npm.bat' to create frontend environment.
pause