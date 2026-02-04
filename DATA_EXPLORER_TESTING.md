# Data Explorer Testing Guide

## Overview
This guide helps you test the new Graphic Walker-based Data Explorer implementation.

## Prerequisites
1. Python 3.10+ installed
2. Node.js 18+ and npm installed
3. All dependencies installed via `setup_project.bat`

## Quick Start

### 1. Install Dependencies
```bash
# Run the setup script
setup_project.bat

# Or manually:
# Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

### 2. Setup Django
```bash
# Create secrets.toml if not exists (see existing project docs)
# Run migrations
cd django_server
python manage.py migrate
python manage.py createsuperuser
cd ..
```

### 3. Start Development Servers

#### Terminal 1 - Django Backend
```bash
cd django_server
python manage.py runserver 8000
```

#### Terminal 2 - Frontend Development
```bash
cd frontend
npm run dev
```

## Testing the Data Explorer

### 1. Login
- Navigate to `http://localhost:5173`
- Login with your superuser credentials

### 2. Access Data Explorer
- Click on the "Data Explorer" card in the main interface
- You should see the sidebar with two options:
  - Upload CSV
  - Sample Data

### 3. Test Sample Data
- Click "Sample Data" button
- The sample dataset (`daily_resource.csv`) should load
- You should see the Graphic Walker interface with:
  - Date column
  - CPU, memory, disk usage metrics
  - Network in/out metrics
  - Category dimension

### 4. Test CSV Upload
- Prepare a CSV file (should be under 500MB)
- Click "Upload CSV" button
- Select your CSV file
- The data should load into Graphic Walker

### 5. Test Graphic Walker Features
- Drag fields from the left panel to create visualizations
- Try different chart types (bar, line, scatter, etc.)
- Test filtering and aggregation
- Verify the interface is responsive

## Configuration Changes

### File Size Limit
Edit `django_server/apps/data_explorer/views.py`:
```python
MAX_FILE_SIZE_MB = 500  # Change this value
```

### Memory Size Limit
Edit `django_server/apps/data_explorer/views.py`:
```python
MAX_MEMORY_SIZE_MB = 1000  # Change this value
```

## Troubleshooting

### Frontend Issues
- Clear browser cache
- Run `npm install` again
- Check browser console for errors

### Backend Issues
- Check Django logs
- Verify pandas is installed: `python -c "import pandas; print(pandas.__version__)"`
- Ensure the sample CSV exists: `doc/daily_resource.csv`

### Build Issues
- Remove `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf frontend/.vite`

## Production Build

### Build Frontend
```bash
cd frontend
npm run build
```
The built files will be in `frontend/dist/`

### Deploy
- Configure Django to serve the built frontend
- Or deploy frontend and backend separately

## Key Files Modified
- `django_server/apps/data_explorer/views.py` - Backend API
- `django_server/apps/data_explorer/urls.py` - URL routing
- `frontend/src/features/dataExplorer/DataExplorerPage.jsx` - Main component
- `frontend/src/features/dataExplorer/components/DataExplorerSidebar.jsx` - Sidebar
- `frontend/src/api/djangoApi.js` - API client
- `frontend/package.json` - Dependencies

## API Endpoints
- `GET /api/data-explorer/data/` - Load sample data
- `POST /api/data-explorer/data/` - Upload CSV file

## Sample Response Format
```json
{
  "data": [
    {"date": "2024-01-01", "cpu_usage": 45.2, ...},
    ...
  ],
  "fields": [
    {
      "fid": "cpu_usage",
      "name": "cpu_usage", 
      "semanticType": "quantitative",
      "analyticType": "measure"
    },
    ...
  ],
  "total_rows": 15,
  "filename": "daily_resource.csv"
}
```

## Security Notes
- CodeQL scan passed with 0 vulnerabilities
- File size limits enforced
- Memory limits enforced
- Authentication required for all endpoints
- Input validation on file uploads

## Support
For issues or questions, refer to:
- FEATURE_DATA_EXPLORER.md - Feature documentation
- Graphic Walker docs: https://github.com/Kanaries/graphic-walker
