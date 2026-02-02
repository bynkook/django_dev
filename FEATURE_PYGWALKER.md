# Feature: Data Explorer (PyGWalker Integration)

## 1. 개요
**Data Explorer**는 Django와 React 환경에서 **PyGWalker**를 통합하여 데이터를 시각적으로 탐색하고 분석할 수 있는 도구입니다.

## 2. 주요 기능
- **전용 사이드바**: 데이터 업로드 및 샘플 데이터 로드 기능을 제공하는 전용 사이드바로 분리되었습니다.
- **메인 화면**: 분석 도구(iframe)에 집중할 수 있도록 불필요한 UI 요소를 제거했습니다.
- **데이터 로드**:
    - **파일 업로드**: 로컬 CSV 파일을 직접 업로드하여 분석합니다.
    - **샘플 데이터**: 기본 제공되는 샘플 데이터(`daily_resource.csv`)를 로드합니다.
- **홈 이동**: 사이드바 상단 메뉴를 통해 앱 선택 화면으로 이동할 수 있습니다.

## 3. 기술 구현 (Architecture)

### Backend (Django)
- **앱**: `apps.data_explorer`
- **API View**: `PygWalkerHTMLView` (POST: 파일 업로드, GET: 샘플 로드)
- **URL**: `/api/data-explorer/html/`
- **핵심 기술**: 
    - `pygwalker.to_html(df, use_kernel=False, env='gradio', appearance='light')` 사용하여 순수 HTML 생성
    - 로컬 서버 실행 및 브라우저 팝업 완전 차단

### Frontend (React)
- **구조**: `DataExplorerPage` 내에서 사이드바와 메인 영역을 직접 관리 (`useState`)
- **컴포넌트**:
    - `DataExplorerSidebar`: 파일 업로드 UI, 홈 버튼, 축소 버튼
    - `DataExplorerPage`: 사이드바 토글 상태에 따른 메인 영역 패딩(`pl-16`) 처리 및 iframe 렌더링
- **디자인 통합**:
    - 사이드바 헤더에 아이콘, 앱 제목, 홈 버튼, 축소 버튼 배치 (표준화)
    - 사이드바 축소 시 메인 영역에 버튼 공간 확보를 위한 패딩 처리

## 4. 파일 구조

```text
frontend/src/features/dataExplorer/
├── components/
│   └── DataExplorerSidebar.jsx  # 앱 전용 사이드바
└── DataExplorerPage.jsx         # 메인 분석 뷰 (iframe 포함)
```

## 5. 사용 방법
1. **앱 진입**: 메인 화면에서 "Data Explorer" 카드 클릭.
2. **데이터 로드**: 사이드바의 "Upload CSV" 또는 "Sample Data" 버튼 클릭.
3. **분석**: 메인 화면에 로드된 PyGWalker 인터페이스 사용.
4. **나가기**: 사이드바 헤더의 Grid 아이콘 클릭.
