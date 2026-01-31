# Image Inspector - 이미지/도면 비교 기능

## 📋 프로젝트 개요

Image Inspector는 두 개의 이미지 또는 PDF 도면을 비교하여 차이점을 시각적으로 표시하는 웹 기반 도구입니다. 기존 Streamlit 기반 애플리케이션을 Django + FastAPI + React 아키텍처로 통합하여 구현했습니다.

**프로젝트 정보:**
- Branch: `feature/image-inspector`
- 개발 시작일: 2026년 1월 31일
- AI/LLM 사용: 없음 (독립적인 이미지 처리 기능)

---

## 🎯 주요 기능

### 1. 이미지 비교 모드

#### 차이점 강조 모드 (Difference)
- **파랑색**: 이미지 1에만 있는 요소
- **빨강색**: 이미지 2에만 있는 요소
- **검정색**: 두 이미지 공통 요소
- **흰색**: 배경

#### 오버레이 모드 (Overlay)
- **주황색**: 이미지 1의 요소
- **초록색**: 이미지 2의 요소
- **혼합색**: 겹치는 영역

### 2. 자동 이미지 정렬
- **ORB (Oriented FAST and Rotated BRIEF)** 특징점 매칭
- 호모그래피 행렬 계산으로 정밀 정렬
- 정렬 실패 시 자동 폴백 (리사이즈 기반 정렬)

### 3. 파일 형식 지원
- **이미지**: JPEG, PNG, GIF
- **PDF**: 페이지별 렌더링 (300 DPI)
- **파일 크기**: 최대 100MB

### 4. 최적화 기능
- 4000px 이상 이미지 자동 다운샘플링
- JPEG 압축 (85% 품질) - 화면 표시용
- PNG 고품질 - 다운로드용
- 동시 처리 제한 (최대 5개)

---

## 🏗️ 아키텍처 설계

### 설계 원칙
1. ✅ **기존 아키텍처 유지** - Django/FastAPI 구조 변경 없음
2. ✅ **인증 시스템 공유** - Fabrix Chat과 동일한 사용자 인증
3. ✅ **독립적인 기능** - AI API 사용하지 않음
4. ✅ **히스토리 없음** - DB 저장 없이 임시 처리 후 로컬 다운로드만 제공

### 시스템 구조

```
┌─────────────────────────────────────────────────────┐
│ Frontend (React + Vite)                             │
│ http://localhost:5173                               │
│                                                     │
│ ├─ /chat              → Fabrix Chat (기존)          │
│ └─ /image-compare     → Image Inspector (신규)      │
└──────────────┬──────────────────────────────────────┘
               │
               ├─────────────────────────────────────┐
               │                                     │
               ▼                                     ▼
┌──────────────────────────┐      ┌──────────────────────────┐
│ Django REST API          │      │ FastAPI Gateway          │
│ http://localhost:8000    │      │ http://localhost:8001    │
│                          │      │                          │
│ - 사용자 인증            │      │ - Fabrix AI 스트리밍     │
│ - 세션 관리              │      │ - 이미지 비교 처리 (신규) │
│ - DB 관리                │      │   /image-compare/process │
└──────────────────────────┘      └──────────────────────────┘
```

### FastAPI 사용 근거
- **비동기 처리**: 여러 사용자의 요청을 동시에 처리
- **멀티스레딩**: ThreadPoolExecutor로 CPU-bound 작업 병렬화
- **Django 보호**: 이미지 처리가 Django 메인 스레드를 블록하지 않음
- **기존 인프라 활용**: 이미 실행 중인 FastAPI 서버 재사용

---

## 📁 구현 파일 목록

### Backend (FastAPI + Python)

#### 1. `ai_gateway/image_processor.py` (신규, 490줄)
핵심 이미지 처리 로직 모듈

**주요 함수:**
- `pdf_to_image()` - PDF를 이미지로 변환 (PyMuPDF)
- `load_file()` - 이미지/PDF 파일 로드
- `downsample_if_needed()` - 대용량 이미지 다운샘플링
- `align_images()` - ORB 특징점 매칭 정렬
- `fallback_align()` - 리사이즈 기반 폴백 정렬
- `compare_images()` - 차이점 강조 비교
- `compare_images_overlay()` - 오버레이 비교
- `encode_image_to_base64()` - 결과 이미지 인코딩
- `process_comparison()` - 전체 파이프라인 통합

**의존성:**
- OpenCV 4.13.0.90 (cv2)
- PyMuPDF 1.26.7 (fitz)
- Pillow 12.1.0
- NumPy 2.3.5

#### 2. `ai_gateway/main.py` (수정)
FastAPI 엔드포인트 추가

**변경사항:**
- `import asyncio` 추가
- `from .image_processor import process_comparison` 추가
- `image_processing_semaphore = asyncio.Semaphore(5)` 선언
- `POST /image-compare/process` 엔드포인트 구현

### Frontend (React)

#### 1. `frontend/src/features/imageCompare/ImageComparePage.jsx` (신규, 175줄)
메인 페이지 컴포넌트

**기능:**
- 파일 업로드 상태 관리
- 비교 실행 및 결과 표시
- 에러 처리 (413, 429, 504)
- 다운로드 기능

#### 2. `frontend/src/features/imageCompare/components/FileUploader.jsx` (신규, 165줄)
파일 업로드 컴포넌트

**기능:**
- 드래그 앤 드롭 지원
- 파일 크기 검증 (최대 100MB)
- PDF 페이지 선택 UI
- 파일 제거 기능

#### 3. `frontend/src/features/imageCompare/components/SettingsPanel.jsx` (신규, 95줄)
비교 설정 패널

**설정 항목:**
- 비교 모드 선택 (차이점/오버레이)
- 차이 임계값 슬라이더 (10-100)
- 특징점 개수 슬라이더 (1000-10000)

#### 4. `frontend/src/features/imageCompare/components/ResultViewer.jsx` (신규, 105줄)
결과 이미지 뷰어

**기능:**
- Base64 이미지 표시
- 다운로드 버튼
- 메타데이터 표시 (크기, 매칭 품질)
- 범례 표시

#### 5. `frontend/src/features/imageCompare/components/LoadingOverlay.jsx` (신규, 15줄)
로딩 오버레이 UI

**기능:**
- 스피너 애니메이션
- 처리 시간 안내 메시지

#### 6. `frontend/src/api/fastapiApi.js` (수정)
API 통신 레이어

**추가된 함수:**
```javascript
compareImages: async (params) => {
  // FormData로 file1, file2, mode, diff_threshold, feature_count, page1, page2 전송
  // 60초 타임아웃 설정
}
```

#### 7. `frontend/src/App.jsx` (수정)
라우팅 추가

**변경사항:**
- `ImageComparePage` import 추가
- `/image-compare` 라우트 등록

#### 8. `frontend/src/features/chat/components/Sidebar.jsx` (수정)
네비게이션 메뉴 추가

**변경사항:**
- `useLocation` hook 추가
- Chat / Image 페이지 전환 버튼 추가
- Agent Selector를 Chat 페이지에서만 표시
- Session List를 Chat 페이지에서만 표시

---

## 🔌 API 명세

### `POST /image-compare/process`

이미지/PDF 비교 처리 엔드포인트

**요청:**
```http
POST http://localhost:8001/image-compare/process
Content-Type: multipart/form-data

{
  "file1": <File>,              // 첫 번째 파일 (이미지 또는 PDF)
  "file2": <File>,              // 두 번째 파일 (이미지 또는 PDF)
  "mode": "difference",         // 비교 모드: "difference" | "overlay"
  "diff_threshold": 30,         // 차이 임계값 (10-100)
  "feature_count": 4000,        // ORB 특징점 개수 (1000-10000)
  "page1": 0,                   // PDF 페이지 번호 (0-based)
  "page2": 0                    // PDF 페이지 번호 (0-based)
}
```

**응답 (성공):**
```json
{
  "result_base64": "data:image/jpeg;base64,/9j/4AAQ...",     // JPEG 압축 (화면용)
  "download_base64": "data:image/png;base64,iVBORw0KGgo...", // PNG 고품질 (다운로드용)
  "metadata": {
    "mode": "difference",
    "file1_pages": 1,
    "file2_pages": 1,
    "match_quality": 0.87,       // 정렬 품질 (0-1)
    "result_size": "3840x2160"
  }
}
```

**응답 (에러):**
```json
// 400 Bad Request - 잘못된 파일 형식
{
  "detail": "Unsupported file type for file1: application/msword. Allowed: image/jpeg, image/png, image/gif, application/pdf"
}

// 413 Payload Too Large - 파일 크기 초과
{
  "detail": "File1 too large: 120.5MB (max 100MB)"
}

// 429 Too Many Requests - 동시 처리 제한
{
  "detail": "Too many concurrent image processing requests"
}

// 500 Internal Server Error - 처리 실패
{
  "detail": "Image processing failed: PDF 변환 실패"
}
```

**처리 시간:**
- 소형 이미지 (1-5MB): 3-6초
- 대형 PDF (50MB): 30-48초

---

## 🛠️ 기술 스택

### Backend
- **Python 3.x**
- **FastAPI 0.128.0** - 비동기 웹 프레임워크
- **OpenCV 4.13.0.90** - 이미지 처리 (ORB, 정렬)
- **PyMuPDF 1.26.7** - PDF 렌더링
- **Pillow 12.1.0** - 이미지 I/O
- **NumPy 2.3.5** - 배열 연산

### Frontend
- **React 18.2.0** - UI 프레임워크
- **Vite 5.0.10** - 빌드 도구
- **Axios 1.6.5** - HTTP 클라이언트
- **Tailwind CSS 3.4.1** - 스타일링
- **Lucide React** - 아이콘

---

## 📊 주요 설계 결정사항

### 1. DB 히스토리 없음 (임시 처리 전용)
**결정:** 비교 결과를 데이터베이스에 저장하지 않고, 사용자가 Save 버튼 클릭 시 로컬 다운로드만 제공

**이유:**
- 대용량 이미지 저장 시 DB 크기 급증
- 비교 작업은 일회성이 많음
- 사용자가 필요한 결과만 선택적으로 저장 가능

**영향:**
- Django 모델 불필요 → 코드 단순화
- 마이그레이션 없음
- 스토리지 부담 없음

### 2. FastAPI 사용 (Django 단독 사용 대신)
**결정:** 이미지 처리를 FastAPI에서 수행

**이유:**
- AI/LLM 사용하지 않지만, CPU 집약적 작업에 적합
- 비동기 처리로 Django 메인 스레드 블록 방지
- 기존 FastAPI 서버 재사용 (추가 비용 없음)

**대안 검토:**
- Django 단독 사용: 동기 처리로 30-48초 동안 다른 API 블록됨 (❌)
- ProcessPoolExecutor: Windows 호환성 문제로 ThreadPoolExecutor 사용 (✅)

### 3. 이미지 압축 전략
**결정:** 화면 표시용 JPEG (85%), 다운로드용 PNG

**이유:**
- JPEG: 네트워크 전송 속도 향상 (70% 크기 감소)
- PNG: 고품질 보존 (도면 비교 시 세부사항 중요)

**측정 결과:**
- 3840x2160 이미지: PNG 12MB → JPEG 3.5MB

### 4. 동시성 제어
**결정:** Semaphore로 최대 5개 동시 처리

**이유:**
- 이미지 처리는 메모리 500MB+ 사용
- 동시 10개 이상 처리 시 메모리 부족 위험
- 5개 제한으로 안정성과 처리량 균형

**에러 처리:**
- 초과 요청: 429 에러 반환
- 클라이언트: "잠시 후 다시 시도" 안내

### 5. 브라우저 호환성
**결정:** OpenSeadragon 사용 계획 연기, 단순 `<img>` 태그 사용

**이유:**
- MVP에서는 기본 이미지 표시로 충분
- OpenSeadragon은 Phase 2로 연기 (pan/zoom 기능)

---

## 🚀 실행 방법

### 1. 의존성 설치
```bash
# 가상환경 활성화
.venv\Scripts\activate

# Python 패키지 설치
pip install opencv-python==4.13.0.90 pymupdf==1.26.7 Pillow==12.1.0 numpy==2.3.5

# 설치 확인
python -c "import cv2, fitz, PIL, numpy; print('OK')"
```

### 2. 서버 실행
```bash
# 방법 1: 배치 파일 사용 (권장)
run_project.bat          # 개발 모드 (localhost)
service_project.bat      # 서비스 모드 (0.0.0.0)

# 방법 2: 수동 실행
# Terminal 1: Django
cd django_server
python manage.py runserver

# Terminal 2: FastAPI
uvicorn ai_gateway.main:app --reload --host 127.0.0.1 --port 8001

# Terminal 3: React
cd frontend
npm run dev
```

### 3. 접속
- React 앱: http://localhost:5173
- 로그인 후 사이드바에서 "Image" 버튼 클릭
- Image Compare 페이지로 이동

---

## ✅ 테스트 시나리오

### 기본 기능 테스트
1. ✅ 이미지 2개 업로드 (JPEG/PNG)
2. ✅ 비교 모드 전환 (차이점 ↔ 오버레이)
3. ✅ 차이 임계값 조정 (10-100)
4. ✅ 특징점 개수 조정 (1000-10000)
5. ✅ 비교 실행 및 결과 표시
6. ✅ PNG 다운로드

### PDF 테스트
1. ✅ PDF 파일 2개 업로드
2. ✅ 페이지 선택 (다중 페이지 PDF)
3. ✅ 비교 실행 및 결과 확인

### 에러 처리 테스트
1. ✅ 100MB 초과 파일 업로드 → 413 에러
2. ✅ 지원하지 않는 파일 형식 → 400 에러
3. ✅ 동시 6개 이상 처리 시도 → 429 에러

---

## 🔧 향후 개선 사항

### Phase 2: 고급 UI
- [ ] OpenSeadragon 통합 (pan/zoom 기능)
- [ ] 3패널 동기화 뷰어 (Image1, Image2, Result)
- [ ] 진행률 표시 (WebSocket/SSE)

### Phase 3: 기능 확장
- [ ] 배치 비교 (여러 파일 동시 처리)
- [ ] 비교 히스토리 저장 (선택적)
- [ ] PDF 보고서 생성 (주석 포함)

### Phase 4: 최적화
- [ ] WebP 포맷 지원 (브라우저 호환성 확인 필요)
- [ ] 이미지 캐싱 (Redis)
- [ ] 작업 큐 (Celery)

---

## 📝 Git 커밋 메시지

```bash
feat: add Image Inspector - image/PDF comparison tool

- Add FastAPI endpoint for image comparison (/image-compare/process)
- Implement image processing with OpenCV (ORB alignment, difference/overlay modes)
- Add React frontend components (FileUploader, SettingsPanel, ResultViewer)
- Integrate with existing auth system and navigation
- Support JPEG compression for display, PNG for download
- Add concurrency control with Semaphore (max 5 simultaneous processes)

Files:
- Backend: ai_gateway/image_processor.py, ai_gateway/main.py
- Frontend: features/imageCompare/*, api/fastapiApi.js, App.jsx, Sidebar.jsx

Technical Stack:
- OpenCV 4.13.0.90, PyMuPDF 1.26.7, Pillow 12.1.0, NumPy 2.3.5
- FastAPI async + ThreadPoolExecutor for non-blocking processing
```

---

## 👥 개발자 정보

- **Branch:** feature/image-inspector
- **개발 기간:** 2026.01.31 - 진행 중
- **기존 코드 기반:** image_inspector.py (Streamlit)
- **통합 플랫폼:** django_dev (Django + FastAPI + React)

---

## 📚 참고 자료

### 라이브러리 문서
- OpenCV ORB: https://docs.opencv.org/4.x/d1/d89/tutorial_py_orb.html
- PyMuPDF: https://pymupdf.readthedocs.io/
- FastAPI: https://fastapi.tiangolo.com/

### 기술 결정 문서
- 이 문서의 "주요 설계 결정사항" 섹션 참조
- 개발 과정에서의 모든 기술 검토 내용 포함
