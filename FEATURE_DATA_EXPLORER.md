# Feature: Data Explorer (Graphic Walker Integration)

## 1. 개요
**Data Explorer**는 Django와 React 환경에서 **Graphic Walker**를 통합하여 데이터를 시각적으로 탐색하고 분석할 수 있는 도구입니다. Graphic Walker는 DuckDB 기반 엔진의 네이티브 React 구성 요소를 제공하는 강력한 데이터 시각화 라이브러리입니다.

## 2. 주요 기능
- **전용 사이드바**: 데이터 업로드 및 샘플 데이터 로드 기능을 제공하는 전용 사이드바로 분리되었습니다.
- **메인 화면**: Graphic Walker 네이티브 React 컴포넌트를 사용하여 고성능 데이터 분석을 제공합니다.
- **데이터 로드**:
    - **파일 업로드**: 로컬 CSV 파일을 직접 업로드하여 분석합니다 (최대 500MB).
    - **샘플 데이터**: 기본 제공되는 샘플 데이터(`daily_resource.csv`)를 로드합니다.
- **홈 이동**: 사이드바 상단 메뉴를 통해 앱 선택 화면으로 이동할 수 있습니다.

## 3. 기술 구현 (Architecture)

### Backend (Django)
- **앱**: `apps.data_explorer`
- **API View**: `GraphicWalkerDataView` (POST: 파일 업로드, GET: 샘플 로드)
- **URL**: `/api/data-explorer/data/`
- **핵심 기술**: 
    - CSV 파일을 pandas DataFrame으로 읽어 JSON 형식으로 변환
    - Graphic Walker가 필요로 하는 필드 메타데이터 자동 생성
    - 파일 크기 제한: 500MB (설정 가능)
    - 메모리 크기 제한: 1000MB (설정 가능)
- **설정 변수**:
    - `MAX_FILE_SIZE_MB`: 업로드 가능한 파일 크기 제한 (기본값: 500MB)
    - `MAX_MEMORY_SIZE_MB`: 데이터 처리 메모리 크기 제한 (기본값: 1000MB)

### Frontend (React)
- **구조**: `DataExplorerPage` 내에서 사이드바와 메인 영역을 직접 관리 (`useState`)
- **컴포넌트**:
    - `DataExplorerSidebar`: 파일 업로드 UI, 샘플 데이터 로드 버튼, 홈 버튼, 축소 버튼
    - `DataExplorerPage`: Graphic Walker React 컴포넌트를 직접 렌더링
- **라이브러리**: `@kanaries/graphic-walker` (v0.5.0)
- **디자인 통합**:
    - 사이드바 헤더에 아이콘, 앱 제목, 홈 버튼, 축소 버튼 배치 (표준화)
    - 사이드바 축소 시 메인 영역에 버튼 공간 확보를 위한 패딩 처리
    - Graphic Walker 네이티브 컴포넌트 사용으로 iframe 불필요

## 4. 파일 구조

```text
frontend/src/features/dataExplorer/
├── components/
│   └── DataExplorerSidebar.jsx  # 앱 전용 사이드바
└── DataExplorerPage.jsx         # 메인 분석 뷰 (Graphic Walker 포함)
```

## 5. 사용 방법
1. **앱 진입**: 메인 화면에서 "Data Explorer" 카드 클릭.
2. **데이터 로드**: 사이드바의 "Upload CSV" 또는 "Sample Data" 버튼 클릭.
3. **분석**: 메인 화면에 로드된 Graphic Walker 인터페이스 사용.
4. **나가기**: 사이드바 헤더의 Grid 아이콘 클릭.

## 6. Graphic Walker 장점
- **네이티브 React 컴포넌트**: iframe이 아닌 순수 React 컴포넌트로 더 나은 성능과 통합
- **DuckDB 기반**: 고성능 데이터 처리 엔진
- **직관적인 UI**: 드래그 앤 드롭으로 필드를 배치하여 차트 생성
- **다양한 차트**: 막대형, 선형, 산점도, 히트맵 등 다양한 시각화 지원
