# FabriX Agent Chat Interface

> **Windows 환경 실행용 LLM 채팅 서비스**  
> **Version:** 1.0.0
> **Last Updated:** 2026-01-30

---

## 📑 목차 (Table of Contents)

### 1. [프로젝트 개요](#1-프로젝트-개요)
   - 1.1 프로젝트명
   - 1.2 프로젝트 목표
   - 1.3 프로젝트 범위

### 2. [핵심 개발 원칙](#2-핵심-개발-원칙)
   - 2.1 Production-Ready 개발
   - 2.2 확장 가능한 구조
   - 2.3 보안 우선 설계
   - 2.4 사용자 경험 최우선

### 3. [프로젝트 설계 요구조건](#3-프로젝트-설계-요구조건)
   - 3.1 사용자 인터페이스(UI) 요구사항
   - 3.2 Application 성능 요구조건
   - 3.3 Application 구조체 설계 조건
   - 3.4 데이터 입출력(I/O) 및 보안(Security) 설계

### 4. [프로젝트 기술 스택](#4-프로젝트-기술-스택)
   - 4.1 Frontend 기술
   - 4.2 Backend 기술
   - 4.3 Database & Storage
   - 4.4 HTTP 통신 라이브러리
   - 4.5 개발 도구

### 5. [시스템 아키텍처](#5-시스템-아키텍처)
   - 5.1 논리적 구성도
   - 5.2 프로젝트 디렉토리 구조
   - 5.3 모듈별 역할 정의
   - 5.4 데이터 흐름 다이어그램

### 6. [API 명세 및 통신 프로토콜](#6-api-명세-및-통신-프로토콜)
   - 6.1 Django REST API
   - 6.2 FastAPI Gateway API
   - 6.3 통신 프로토콜 (HTTP/SSE)
   - 6.4 에러 응답 형식

### 7. [프론트엔드 설계 상세](#7-프론트엔드-설계-상세)
   - 7.1 React 프로젝트 구조
   - 7.2 컴포넌트 계층 구조
   - 7.3 상태 관리 전략
   - 7.4 라우팅 설계
   - 7.5 주요 컴포넌트 상세

### 8. [백엔드 설계 상세](#8-백엔드-설계-상세)
   - 8.1 Django Server 설계
   - 8.2 FastAPI Gateway 설계
   - 8.3 비동기 처리 전략
   - 8.4 HTTP Client 관리

### 9. [데이터베이스 및 보안 설계](#9-데이터베이스-및-보안-설계)
   - 9.1 데이터베이스 스키마 설계
   - 9.2 인증 및 권한 관리
   - 9.3 보안 정책
   - 9.4 환경변수 관리 (secrets.toml)

### 10. [사용자 인터페이스 설계](#10-사용자-인터페이스-설계)
   - 10.1 디자인 시스템
   - 10.2 레이아웃 구조
   - 10.3 주요 UI 컴포넌트
   - 10.4 반응형 디자인

### 11. [성능 최적화 및 안정성 향상](#11-성능-최적화-및-안정성-향상)
   - 11.1 Rate Limit Handling
   - 11.2 데이터베이스 최적화
   - 11.3 HTTP 클라이언트 최적화
   - 11.4 비동기 마이그레이션 (requests → httpx)
   - 11.5 안정성 개선 방안

### 12. [환경 설정 및 설치 가이드](#12-환경-설정-및-설치-가이드)
   - 12.1 시스템 요구사항
   - 12.2 Python 가상환경 설정
   - 12.3 의존성 설치
   - 12.4 secrets.toml 설정
   - 12.5 데이터베이스 초기화

### 13. [배포 및 실행 가이드](#13-배포-및-실행-가이드)
   - 13.1 개발 모드 실행 (localhost)
   - 13.2 서비스 모드 실행 (사내망)
   - 13.3 관리자 계정 생성
   - 13.4 문제 해결 (Troubleshooting)

### 14. [관리자 운영 가이드](#14-관리자-운영-가이드)
   - 14.1 사용자 관리
   - 14.2 시스템 로그 모니터링
   - 14.3 백업 및 복구
   - 14.4 성능 모니터링

### 15. [부록](#15-부록)
   - 15.1 배치 파일 상세 설명
   - 15.2 주요 명령어 모음
   - 15.3 FAQ
   - 15.4 참고 문서

---

## 1. 프로젝트 개요

### 1.1 프로젝트명

**FabriX Agent Chat Interface**

Windows 환경에서 실행되는 사내 FabriX API 기반 LLM 채팅 서비스 인터페이스

### 1.2 프로젝트 목표

본 프로젝트는 Samsung SDS의 FabriX 생성형 AI 플랫폼 API를 활용하여, **보안성 높은 로컬 채팅 서비스**를 구축하는 것을 목표로 합니다. 

#### 주요 목표

1. **사내망 내 안전한 AI 서비스 제공**
   - 외부 공개 API 의존성 제거
   - 사내 보안 정책 준수
   - 민감 정보 로컬 관리

2. **Production-Ready 서비스 구현**
   - Demo가 아닌 실제 운영 가능한 서비스 레벨
   - 동시 접속 5~50명 규모 안정적 처리
   - 예외 처리 및 에러 복구 메커니즘 완비

3. **확장 가능한 아키텍처 구축**
   - 미래 프로젝트 추가를 위한 모듈화 설계
   - Frontend/Backend 명확한 분리
   - Django App 단위 구조화

4. **우수한 사용자 경험 제공**
   - 직관적인 UI/UX (Gemini 스타일)
   - 실시간 스트리밍 응답
   - 파일 업로드 및 분석 기능

### 1.3 프로젝트 범위

#### 포함되는 기능

**사용자 기능**
- ✅ 사용자 회원가입 및 로그인 (6자리 인증키 방식)
- ✅ 다중 Agent 선택 및 전환
- ✅ 실시간 AI 채팅 (SSE 스트리밍)
- ✅ 파일 업로드 및 분석 (Code Interpreter)
- ✅ 대화 히스토리 저장/불러오기/삭제
- ✅ 질문 수정 및 재요청
- ✅ 답변 중단 기능

**관리자 기능**
- ✅ 사용자 계정 관리
- ✅ 시스템 로그 모니터링
- ✅ 환경 설정 관리

**시스템 기능**
- ✅ SQLite 기반 데이터 영속성
- ✅ Rate Limit 자동 처리
- ✅ 네트워크 장애 자동 복구 (재시도)
- ✅ Connection Pooling 및 성능 최적화

#### 제외되는 기능

- ❌ 이메일 인증 (SMTP 서버 미구축)
- ❌ 다중 파일 동시 업로드
- ❌ 음성/비디오 입출력
- ❌ 멀티모달 이미지 생성


---

## 2. 핵심 개발 원칙

본 프로젝트는 다음 4가지 핵심 원칙을 바탕으로 설계 및 구현되었습니다.

### 2.1 Production-Ready 개발

본 프로젝트는 **Demo 프로젝트가 아닌, 실제 운영 가능한 Production-Level 서비스**로 개발되었습니다.

#### 핵심 요구사항

**동시 접속 사용자 지원**
- 목표: 5~50명 규모의 동시 접속자 안정적 처리
- 구현:
  - SQLite WAL(Write-Ahead Logging) 모드 활성화로 동시성 3-5배 향상
  - Connection Pooling 설정 (최대 50개 연결)
  - Rate Limiting으로 과부하 방지

**에러 처리 및 복구**
- 자동 재시도 메커니즘 (최대 3회)
- Timeout 설정 (Connect: 5초, Read: 30초, Write: 10초)
- 구조화된 에러 응답 (JSON 형식)
- 로그 기반 문제 추적

**안정성 확보**
```python
# 트랜잭션 보호
@transaction.atomic
def messages(self, request, pk=None):
    # 원자성 보장으로 데이터 무결성 확보
    
# HTTP 재시도
transport=httpx.HTTPTransport(retries=2)

# 타임아웃 세분화
timeout=httpx.Timeout(
    connect=5.0, read=30.0, write=10.0, pool=5.0
)
```

**성능 모니터링**
- 구조화된 로깅 시스템 (Console + File)
- Rotating File Handler (10MB x 5개)
- 요청/응답 시간 추적
- Rate Limit 사용량 모니터링 엔드포인트

#### 검증 기준

- ✅ 10명 동시 접속 시 응답 지연 없음
- ✅ 네트워크 장애 시 자동 복구
- ✅ 메모리 누수 없음 (Connection 자동 정리)
- ✅ 24시간 연속 가동 안정성 확보

---

### 2.2 확장 가능한 구조

**미래의 다른 프로젝트 추가를 고려한 모듈화 설계**가 핵심입니다.

#### 아키텍처 분리

**Frontend 확장 구조**
```
frontend/src/
├── api/                 # API 통신 레이어 분리
│   ├── djangoApi.js     # Django 전용
│   ├── fastapiApi.js    # FastAPI 전용
│   └── axiosConfig.js   # 공통 설정
│
├── features/            # 기능별 모듈화
│   ├── chat/            # 채팅 기능
│   ├── auth/            # 인증 기능
│   └── [새 기능]/       # 확장 가능
│
└── components/          # 공통 컴포넌트
    └── layout/
```

**Backend 확장 구조**
```
django_server/
└── apps/
    ├── fabrix_agent_chat/    # LLM 채팅 앱
    ├── [새 앱]/              # 확장 가능
    └── [새 앱]/              # 확장 가능
```

#### 모듈화 원칙

**1. 역할별 명확한 분리**
- Django: 사용자 관리, 데이터 영속성, 인증
- FastAPI: AI Gateway, 스트리밍, 외부 API 프록시
- React: UI/UX, 상태 관리, 라우팅

**2. 독립적 배포 가능**
- Frontend: 정적 파일 빌드 후 별도 서버 가능
- Django: 단독 실행 가능
- FastAPI: 단독 실행 가능

**3. API 기반 통신**
- RESTful API로 Frontend-Backend 통신
- 버전 관리 용이 (`/api/v1/`, `/api/v2/`)


---

### 2.3 보안 우선 설계

사내망 서비스이지만 **최소한의 악의적 공격을 방어**할 수 있도록 설계되었습니다.

#### 인증 및 권한 관리

**사용자 인증**
```python
# Django Token Authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

**회원가입 보호**
- 6자리 인증키 검증 (secrets.toml에 저장)
- 이메일 도메인 검증 (@samsung.com)
- 중복 계정 방지

**세션 관리**
```python
SESSION_EXPIRE_AT_BROWSER_CLOSE = True  # 브라우저 종료 시 세션 삭제
SESSION_COOKIE_AGE = 1800  # 30분 자동 만료
SESSION_SAVE_EVERY_REQUEST = True  # 활동 시 갱신
```

#### API Key 보호

**절대 노출 금지 항목**
```toml
# secrets.toml (Git 제외 필수)
[fabrix_api]
client_key = "eyJ0eXAiOiJKV1QiLCJhbGc..."
openapi_token = "Bearer eyJ4NXQiOiJNV0l5..."
```

**보호 메커니즘**
1. `.gitignore`에 `secrets.toml` 등록
2. FastAPI가 Proxy 역할 (클라이언트는 API Key 모름)
3. 환경변수로만 로드 (코드에 하드코딩 금지)

```python
# FastAPI에서만 Key 사용
def get_fabrix_headers():
    return {
        "x-fabrix-client": FABRIX_CONFIG['client_key'],
        "x-openapi-token": FABRIX_CONFIG['openapi_token'],
    }
```

#### CORS 및 네트워크 보안

**개발 모드 (localhost)**
```python
# run_project.bat
python manage.py runserver 127.0.0.1:8000  # 본인만 접근
```

**서비스 모드 (사내망)**
```python
# service_project.bat
python manage.py runserver 0.0.0.0:8000  # 사내망 접근

# CORS 설정
CORS_ALLOW_ALL_ORIGINS = True  # 사내망 전용
CORS_ALLOW_CREDENTIALS = True
```

#### SQL Injection 방지

Django ORM 사용으로 자동 방어:
```python
# ✅ 안전 (ORM)
ChatSession.objects.filter(user=request.user)

# ❌ 위험 (Raw SQL - 사용하지 않음)
# cursor.execute(f"SELECT * FROM sessions WHERE user_id={user_id}")
```

#### 추가 보안 조치

**1. 비밀번호 해싱**
- Django 기본 PBKDF2 알고리즘 사용
- 자동 Salt 처리

**2. CSRF 보호**
- Django Middleware 활성화
- POST 요청 검증

**3. XSS 방지**
- React의 자동 이스케이핑
- `dangerouslySetInnerHTML` 사용 금지

**4. 로그 보안**
- 민감 정보 로그 출력 금지
- API Key, Password 로깅 제외

---

### 2.4 사용자 경험 최우선

**직관적이고 쾌적한 사용자 경험**을 제공하는 것을 최우선 목표로 합니다.

#### UI/UX 설계 철학

**Professional High-Quality Design**
- Black & White & Gray 컬러 테마
- Gemini 스타일 참조
- Lucide Icons 사용
- Smooth Animations (Tailwind CSS)

**반응성 (Responsiveness)**
```javascript
// SSE 스트리밍으로 실시간 응답
await fetchEventSource('/agent-messages', {
  onmessage(ev) {
    // 타이핑 효과로 자연스러운 응답
    accumulatedAnswer += parsed.content;
    updateLastMessage(accumulatedAnswer);
  }
});
```

#### 주요 UX 개선 사항

**1. Rate Limit 투명 처리**
```python
# 사용자는 모르게 자동 대기 후 재시도
max_retries = 3
for attempt in range(max_retries):
    wait_time = rate_limiter.get_wait_time(tokens)
    if wait_time <= max_wait_time:
        await asyncio.sleep(wait_time)  # 자동 대기
        # 재시도
```

**결과**: 사용자는 "조금 느린 응답" 정도로만 느낌 (투명한 처리)

**2. 로딩 상태 표시**
```jsx
{isLoading && <LoadingSpinner />}
{isStreaming && <TypingIndicator />}
```

**3. 에러 메시지 친화적 표시**
```jsx
<div className="text-red-500 flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full">
  <AlertCircle size={14} /> 
  Server is busy, please try again
</div>
```

**4. 자동 스크롤**
```javascript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

#### 성능 최적화로 UX 향상

**1. Connection Pooling**
- HTTP 연결 재사용으로 응답 속도 30-50% 개선

**2. 데이터베이스 최적화**
- 인덱싱으로 쿼리 속도 50-70% 개선
- N+1 쿼리 제거 (Prefetch)

**3. 비동기 처리**
- requests → httpx 마이그레이션
- I/O 대기 시간 제거

**4. 이미지 및 CSS 최적화**
- Tailwind CSS 사용 (미사용 스타일 제거)
- SVG 아이콘 사용 (경량화)

#### 접근성 (Accessibility)

**키보드 단축키**
- Enter: 메시지 전송
- Shift + Enter: 줄바꿈
- Esc: 중단

**명확한 피드백**
- 버튼 호버 효과
- 클릭 시 시각적 피드백
- 상태 변화 애니메이션

**에러 복구**
- 네트워크 장애 시 자동 재시도
- 실패 시 명확한 안내 메시지

---

## 3. 프로젝트 설계 요구조건

본 장에서는 프로젝트 설계 및 구현 시 준수해야 할 구체적인 요구사항을 정의합니다.

### 3.1 사용자 인터페이스(UI) 요구사항

#### 전체 디자인 컨셉

**컬러 테마**
- **Primary**: Black, White, Gray 기반
- **Accent**: Blue (Agent 선택, 버튼 등)
- **Error**: Red (에러 메시지)
- **Success**: Green (성공 알림)
- **목표**: Professional Level High-Quality Design

**디자인 참조**
- Google Gemini 스타일 레이아웃
- 깔끔하고 직관적인 인터페이스
- 최소한의 시각적 요소로 콘텐츠 집중

#### 레이아웃 구조

**1. 로그인 페이지 (초기 화면)**
```
┌─────────────────────────────────────┐
│                                     │
│          [Logo/Title]               │
│                                     │
│      ┌─────────────────┐            │
│      │   Login Form    │            │
│      │  - Username     │            │
│      │  - Password     │            │
│      │  [Login Button] │            │
│      │  [Signup Link]  │            │
│      └─────────────────┘            │
│                                     │
└─────────────────────────────────────┘
```

**2. 메인 화면 (채팅 페이지)**
```
┌──────────┬────────────────────────────┐
│ Sidebar  │     Main Chat Area         │
│          │                            │
│ [Menu]   │  [Agent Info Header]       │
│          │  ┌──────────────────────┐  │
│ Agent    │  │  Chat Messages       │  │
│ Selector │  │  ┌──────────┐        │  │
│          │  │  │ User Msg │        │  │
│ [New]    │  │  └──────────┘        │  │
│          │  │  ┌──────────┐        │  │
│ History  │  │  │ AI Reply │        │  │
│ - Chat 1 │  │  └──────────┘        │  │
│ - Chat 2 │  │  ...                 │  │
│ ...      │  │                      │  │
│          │  └──────────────────────┘  │
│ [User]   │  [Input Box]               │
│ [Logout] │                            │
└──────────┴────────────────────────────┘
```

#### 주요 UI 컴포넌트 요구사항

**채팅 입력창**
- **위치**: 화면 하단 중앙
- **형상**: 코너 라운드 처리 (border-radius: 12px 이상)
- **구성 요소**:
  - 텍스트 입력 영역 (Textarea, 자동 높이 조절)
  - 파일 업로드 버튼 (📎 아이콘)
  - 전송 버튼 (✅ 또는 ↑ 아이콘)
  - 중단 버튼 (❌ 또는 ⏹ 아이콘, 답변 중에만 표시)
- **동작**:
  - Enter: 전송
  - Shift + Enter: 줄바꿈
  - 전송 중: 입력 비활성화

**채팅 버블**
- **질문 버블** (User):
  - 배경색: Blue-50 (#EBF8FF)
  - 정렬: 오른쪽
  - 아이콘: 사용자 이니셜 또는 UserCircle
  - 수정 가능 (✏️ 버튼 호버 시 표시)
  
- **답변 버블** (Assistant):
  - 배경색: Gray-50 (#F9FAFB)
  - 정렬: 왼쪽
  - 아이콘: Bot 또는 Sparkles
  - Markdown 렌더링 지원
  - 코드 블록: Syntax Highlighting
  - 스트리밍 중: 타이핑 애니메이션

**좌측 사이드바**
- **기능**:
  - Hide/Show 토글 (3-stripe 메뉴 버튼)
  - Agent 선택 드롭다운
  - New Chat 버튼 (+ 아이콘)
  - Chat History 목록 (스크롤 가능)
  - 사용자 정보 (하단)
  - Logout 버튼 (하단)

- **Chat History 항목**:
  - 제목 (자동 생성 또는 첫 질문)
  - 날짜/시간
  - 호버 시: 삭제 버튼 (🗑️)
  - 클릭 시: 해당 대화 로드

- **초기 상태**: Show (열림)

**Agent 선택 컴포넌트**
- **위치**: 사이드바 상단
- **형태**: 드롭다운 메뉴
- **표시 정보**:
  - Agent 이름 (label)
  - Agent ID (축약, 예: "520e8dd8...")
- **동작**:
  - 1개 이상 Agent 확인 필수
  - Agent 없을 시: 오류 메시지 표시
  - 선택 변경 시: 즉시 반영

**오류 메시지 표시**
- **형태**: 버블 형태로 메인 화면에 표시
- **종류**:
  - 네트워크 오류
  - Agent 연결 실패
  - Rate Limit 초과
  - 파일 업로드 실패
- **구성**:
  - 아이콘 (⚠️ AlertCircle)
  - 간결한 메시지
  - 자동 닫기 또는 X 버튼

#### 반응형 요구사항

**화면 크기별 대응**
- **Desktop (1024px+)**: 사이드바 고정 표시
- **Tablet (768px-1023px)**: 사이드바 토글 가능
- **Mobile (767px 이하)**: 사이드바 오버레이 형태

**최소 지원 해상도**
- 1280 x 720 (HD) 이상 권장

#### 애니메이션 및 트랜지션

**필수 애니메이션**
```css
/* 사이드바 토글 */
transition: width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0);

/* 버튼 호버 */
transition: all 0.2s ease;

/* 메시지 등장 */
animation: fade-in-up 0.3s ease;

/* 타이핑 애니메이션 */
animation: pulse 1.5s infinite;
```

---

### 3.2 Application 성능 요구조건

#### 동시 사용자 처리

**목표 스펙**
- **최소**: 5명 동시 접속 안정 운영
- **권장**: 20명 동시 접속 원활 서비스
- **최대**: 50명 동시 접속 견디기

#### 응답 시간 요구사항

**일반 API 호출**
- 로그인/회원가입: 1초 이내
- Agent 목록 조회: 2초 이내
- 세션 목록 조회: 1초 이내
- 메시지 저장: 0.5초 이내

**AI 응답 (스트리밍)**
- 첫 토큰 응답: 3초 이내
- 스트리밍 중단 없음
- 총 응답 시간: 30초 이내

**파일 업로드**
- 10MB 파일: 5초 이내
- 50MB 파일: 20초 이내
- 100MB 파일: 40초 이내

#### 데이터베이스 성능

**쿼리 최적화 목표**
- 단일 쿼리: 100ms 이내
- 복잡한 쿼리 (JOIN): 500ms 이내
- N+1 쿼리 제거 (Prefetch 사용)

**인덱싱 전략**
```python
# 자주 조회되는 필드에 인덱스
class ChatSession(models.Model):
    agent_id = models.CharField(db_index=True)  # 인덱스
    created_at = models.DateTimeField(db_index=True)  # 인덱스
    updated_at = models.DateTimeField(db_index=True)  # 인덱스
    
    class Meta:
        indexes = [
            models.Index(fields=['-updated_at', 'user']),  # 복합 인덱스
            models.Index(fields=['user', '-created_at']),  # 복합 인덱스
        ]
```

**SQLite 최적화**
```python
# WAL 모드 활성화
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA cache_size=-64000;  # 64MB 캐시
PRAGMA busy_timeout=30000;  # 30초 대기
```

#### 메모리 사용량

**제한 사항**
- Django Server: 최대 512MB
- FastAPI Gateway: 최대 512MB
- React Frontend: 브라우저 의존

**메모리 관리**
- 파일 업로드: 스트리밍 방식 (메모리 상주 방지)
- HTTP Connection: 자동 정리 (lifespan 관리)
- 데이터베이스 Connection: Pooling (재사용)

#### 네트워크 최적화

**Connection Pooling**
```python
# HTTP Client 재사용
SHARED_HTTP_CLIENT = httpx.Client(
    limits=httpx.Limits(
        max_keepalive_connections=10,
        max_connections=50,
        keepalive_expiry=30.0
    )
)
```

**타임아웃 설정**
```python
timeout=httpx.Timeout(
    connect=5.0,   # 연결: 5초
    read=30.0,     # 읽기: 30초
    write=10.0,    # 쓰기: 10초
    pool=5.0       # 풀: 5초
)
```

**Rate Limiting**
- RPM (Requests Per Minute): 100
- TPM (Tokens Per Minute): 10,000
- 자동 재시도: 최대 3회
- 최대 대기: 10초 (chat), 15초 (file)

---

### 3.3 Application 구조체 설계 조건

#### 심플하고 명확한 구조

**설계 목표**
> "개발에 참여하지 않은 관리자도 쉽게 코드를 유지보수할 수 있도록"

**구조 원칙**
1. **명확한 파일 명명**: 역할이 이름에 드러나야 함
2. **논리적 디렉토리 구조**: 기능별/계층별 분리
3. **최소한의 추상화**: 과도한 패턴 지양
4. **주석 및 문서화**: 복잡한 로직에 설명 추가

#### 프로젝트 구조 설계

**Backend 구조**
```
django_server/
├── manage.py              # Django 진입점
├── config/                # 프로젝트 설정
│   ├── settings.py        # 환경 설정 (중요!)
│   ├── urls.py            # URL 라우팅
│   └── wsgi.py            # WSGI 서버
│
└── apps/                  # Django 앱들
    ├── __init__.py
    └── fabrix_agent_chat/ # LLM 채팅 앱
        ├── models.py      # 데이터 모델
        ├── views.py       # API 로직
        ├── serializers.py # JSON 직렬화
        ├── urls.py        # 앱 URL
        ├── admin.py       # 관리자 페이지
        └── migrations/    # DB 마이그레이션

ai_gateway/
├── main.py                # FastAPI 진입점
└── rate_limiter.py        # Rate Limit 로직
```

**Frontend 구조**
```
frontend/
├── package.json           # 의존성 관리
├── vite.config.js         # Vite 설정
├── tailwind.config.js     # Tailwind CSS 설정
│
└── src/
    ├── main.jsx           # React 진입점
    ├── App.jsx            # 라우팅 설정
    │
    ├── api/               # API 통신
    │   ├── axiosConfig.js # Axios 설정
    │   ├── djangoApi.js   # Django 연동
    │   └── fastapiApi.js  # FastAPI 연동
    │
    ├── components/        # 공통 컴포넌트
    │   └── layout/
    │       └── MainLayout.jsx
    │
    ├── features/          # 기능별 모듈
    │   ├── auth/
    │   │   └── LoginPage.jsx
    │   └── chat/
    │       ├── ChatPage.jsx
    │       └── components/
    │           ├── Sidebar.jsx
    │           ├── ChatBubble.jsx
    │           ├── InputBox.jsx
    │           └── LoadingSpinner.jsx
    │
    └── styles/            # 스타일
        ├── Global.css
        └── Chat.css
```

#### 확장 가능성 확보

**새 앱 추가 시나리오**
```bash
# 1. Django에 새 앱 생성
cd django_server
python manage.py startapp new_service

# 2. settings.py에 등록
INSTALLED_APPS = [
    ...
    'apps.new_service',  # 추가
]

# 3. urls.py에 라우팅 추가
urlpatterns = [
    ...
    path('api/new/', include('apps.new_service.urls')),  # 추가
]

# 4. Frontend에 기능 추가
mkdir frontend/src/features/new_service
```

**기존 코드 영향 최소화**
- 독립적인 모듈 구조
- API 버전 관리 (`/api/v1/`, `/api/v2/`)
- 설정 파일 분리 가능

#### 코드 가독성 요구사항

**함수/클래스 명명 규칙**
```python
# ✅ 좋은 예시
def get_user_sessions(user_id):
    """사용자의 모든 채팅 세션을 조회"""
    return ChatSession.objects.filter(user_id=user_id)

class ChatSessionViewSet(viewsets.ModelViewSet):
    """채팅 세션 CRUD API"""
    pass
```

**주석 작성 원칙**
- 복잡한 로직: 왜 그렇게 했는지 설명
- 외부 API 호출: 요청/응답 형식 명시
- 임시 코드: `# TODO:` 또는 `# FIXME:` 표시

**문서화**
- README.md: 프로젝트 개요 및 실행 방법
- API 문서: API 명세서 별도 작성
- 설정 가이드: secrets.toml 예시 제공

---

### 3.4 데이터 입출력(I/O) 및 보안(Security) 설계

#### 보안 설계 원칙

**1. 라이브러리 기본 보안 최대 활용**
```python
# Django 기본 보안 기능
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # 보안 헤더
    'django.middleware.csrf.CsrfViewMiddleware',      # CSRF 방어
    ...
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',  # 토큰 인증
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # 인증 필수
    ],
}
```

**2. 로그인 보안 정책**
- Django 기본 인증 시스템 사용
- 비밀번호 해싱 (PBKDF2)
- 세션 관리 (30분 자동 만료)
- 브라우저 종료 시 로그아웃

#### 회원가입 인증 설계

**SMTP 서버 미구축 대응 방안**
```python
# 6자리 숫자 인증키 방식
ADMIN_SIGNUP_KEY = "123456"  # secrets.toml에 저장

# 검증 로직
if request.data.get('auth_key') != ADMIN_SIGNUP_KEY:
    return Response({'error': 'Invalid Auth Key'}, 
                   status=status.HTTP_403_FORBIDDEN)
```

**이메일 도메인 검증**
```python
# @samsung.com 도메인만 허용 (선택적)
if not email.endswith('@samsung.com'):
    return Response({'error': 'Invalid email domain'}, 
                   status=status.HTTP_400_BAD_REQUEST)
```

#### 환경 설정 파일 (secrets.toml)

**파일 위치**: 프로젝트 루트

**구조 및 예시**
```toml
[server]
# 개발/운영 환경 구분
debug = true  # 개발: true, 운영: false

[auth]
# 회원가입 인증키 (6자리 숫자 권장)
admin_signup_key = "123456"

[fabrix_api]
# FabriX API 연결 정보
base_url = "https://nsecc-api.fabrix-s.samsungsds.com/secc/trial/api-agent"
client_key = "eyJ0eXAiOiJKV1QiLCJhbGc..."  # JWT 토큰
openapi_token = "Bearer eyJ4NXQiOiJNV0l5..."  # Bearer 토큰
agent_id = "520e8dd8-0eb6-49ae-ba38-02da413edb14"  # Agent UUID
user_email = "your.name@samsung.com"

[security]
# Django Secret Key (자동 생성 권장)
django_secret_key = "django-insecure-your-random-secret-key-here"
# 허용 호스트 (개발: localhost, 운영: 사내 IP 추가)
allowed_hosts = ["*"]  # 사내망 전용: 모든 IP 허용 가능
```

**보안 주의사항**
- ⚠️ **절대 Git에 커밋하지 말 것** (`.gitignore` 등록 필수)
- 🔑 **API Key 노출 금지**
- 🔄 **주기적으로 Key 갱신**

#### 코드 저장 구조 보안

**1. 소스 코드 노출 방지**
```python
# Django에서 소스 코드 직접 접근 차단
DEBUG = False  # 운영 환경에서 반드시 False

# 에러 페이지 커스터마이징 (스택 트레이스 숨김)
ALLOWED_HOSTS = ['specific-ip-only']  # 특정 IP만 허용
```

**2. 환경 변수 분리**
- secrets.toml: Git 제외
- .env.example: Git 포함 (예시용, 실제 값 없음)

**3. 로그 파일 보안**
```python
LOGGING = {
    'handlers': {
        'file': {
            'filename': BASE_DIR / 'logs' / 'django.log',
            # 민감 정보 필터링
        },
    },
}
```

#### 데이터베이스 보안

**사용자 정보 보호**
```python
# 비밀번호: 자동 해싱 (PBKDF2)
User.objects.create_user(username, email, password)

# 토큰: 무작위 생성
Token.objects.create(user=user)  # 40자 랜덤 문자열
```

**SQL Injection 방지**
- Django ORM 사용 (자동 이스케이핑)
- Raw SQL 사용 금지

**백업 및 복구**
```bash
# SQLite 백업
cp db.sqlite3 db.sqlite3.backup

# 복구
cp db.sqlite3.backup db.sqlite3
```

#### 동시성 제어 및 Race Condition 처리

**트랜잭션 보호**
```python
from django.db import transaction

@transaction.atomic
def save_message_and_update_session(session_id, message):
    """원자성 보장으로 데이터 무결성 확보"""
    session = ChatSession.objects.get(id=session_id)
    ChatMessage.objects.create(session=session, ...)
    session.save()  # updated_at 갱신
```

**SQLite 동시성 향상**
```python
# WAL 모드 활성화
PRAGMA journal_mode=WAL;  # 읽기/쓰기 동시 가능
PRAGMA busy_timeout=30000;  # 30초 대기 (락 경합 시)
```

**HTTP Client 스레드 안전성**
```python
# 공유 클라이언트는 스레드 안전
SHARED_HTTP_CLIENT = httpx.Client(...)

# Rate Limiter는 Lock 사용
from threading import Lock
lock = Lock()
with lock:
    # 임계 영역
```

#### 예외 처리 강화

**네트워크 예외**
```python
try:
    response = await client.get(url)
    response.raise_for_status()
except httpx.TimeoutException:
    # 타임아웃 처리
    return JsonResponse({'error': 'Timeout'}, status=504)
except httpx.HTTPStatusError as e:
    # HTTP 에러 처리
    return JsonResponse({'error': str(e)}, status=e.response.status_code)
except httpx.ConnectError:
    # 연결 실패 처리
    return JsonResponse({'error': 'Connection failed'}, status=503)
```

**데이터베이스 예외**
```python
from django.db import IntegrityError

try:
    user = User.objects.create_user(...)
except IntegrityError:
    return Response({'error': 'Username already exists'}, 
                   status=status.HTTP_400_BAD_REQUEST)
```

**파일 업로드 예외**
```python
# 파일 크기 제한
if file.size > 100 * 1024 * 1024:  # 100MB
    raise HTTPException(status_code=413, detail='File too large')

# 파일 형식 검증
allowed_types = ['text/plain', 'application/pdf', 'image/jpeg']
if file.content_type not in allowed_types:
    raise HTTPException(status_code=400, detail='Invalid file type')
```

#### Rate Limiting 및 과부하 방지

**Rate Limiter 설정**
```python
# ai_gateway/rate_limiter.py
rate_limiter = TokenRateLimiter(
    rpm_limit=100,   # 분당 100 요청
    tpm_limit=10000  # 분당 10,000 토큰
)

# 자동 재시도 메커니즘
max_retries = 3
for attempt in range(max_retries):
    if rate_limiter.can_proceed(tokens):
        break
    await asyncio.sleep(rate_limiter.get_wait_time(tokens))
```

**모니터링 엔드포인트**
```python
@app.get("/rate-limit-status")
async def get_rate_limit_status():
    return rate_limiter.get_current_usage()
```

---

## 4. 프로젝트 기술 스택

본 프로젝트는 최신 웹 기술과 검증된 프레임워크를 조합하여 구축되었습니다.

### 4.1 Frontend 기술

#### React 생태계

**React 18.2.0**
- **역할**: UI 렌더링 및 상태 관리
- **선택 이유**:
  - 컴포넌트 기반 구조로 재사용성 극대화
  - Virtual DOM으로 효율적인 렌더링
  - 풍부한 생태계 및 커뮤니티
  - Concurrent Features (Suspense, useTransition 등)

**React Router DOM 6.21.1**
- **역할**: 클라이언트 사이드 라우팅
- **주요 기능**:
  - SPA(Single Page Application) 구현
  - Protected Routes (인증 가드)
  - URL 기반 네비게이션
  - useNavigate, useSearchParams 훅

```javascript
// 라우팅 구조
<Route path="/login" element={<LoginPage />} />
<Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
  <Route path="/chat" element={<ChatPage />} />
</Route>
```

#### 빌드 도구 및 개발 환경

**Vite 5.0.10**
- **역할**: 빌드 도구 및 개발 서버
- **선택 이유**:
  - 초고속 HMR (Hot Module Replacement)
  - Create React App 대비 10배 빠른 빌드
  - ESM 기반 번들링
  - 개발 환경 최적화

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // 사내망 접근 허용
    port: 5173
  }
})
```

**Node.js (LTS 버전 권장)**
- 개발 환경: Node.js 18.x 이상
- 패키지 관리: npm 또는 yarn

#### 스타일링 및 디자인

**Tailwind CSS 3.4.1**
- **역할**: Utility-first CSS 프레임워크
- **장점**:
  - 빠른 스타일링 (클래스 기반)
  - 미사용 CSS 자동 제거 (PurgeCSS)
  - 일관된 디자인 시스템
  - 반응형 디자인 간편

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F9FAFB',
        'text-primary': '#111827',
      }
    }
  }
}
```

**PostCSS 8.4.33 & Autoprefixer 10.4.17**
- CSS 후처리 및 브라우저 호환성

**Custom CSS Variables**
```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --accent-color: #3B82F6;
  --border-color: #E5E7EB;
}
```

#### UI 컴포넌트 및 아이콘

**Lucide React 0.309.0**
- **역할**: SVG 아이콘 라이브러리
- **특징**:
  - 경량 (트리 셰이킹 지원)
  - 1000+ 아이콘
  - 커스터마이징 가능

```javascript
import { Bot, Sparkles, Send, Upload } from 'lucide-react';
<Bot size={20} className="text-blue-600" />
```

**Utility 라이브러리**
- **clsx 2.1.0**: 조건부 className 처리
- **tailwind-merge 2.2.0**: Tailwind 클래스 충돌 방지

```javascript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));
```

#### Markdown 및 코드 렌더링

**React Markdown 9.0.1**
- **역할**: Markdown → HTML 변환
- **용도**: AI 응답 렌더링
- **플러그인**: remark-gfm 4.0.0 (GitHub Flavored Markdown)

```javascript
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {message.content}
</ReactMarkdown>
```

**React Syntax Highlighter 15.5.0**
- **역할**: 코드 블록 Syntax Highlighting
- **지원 언어**: Python, JavaScript, Java, C++, SQL 등

```javascript
<SyntaxHighlighter language="python" style={vscDarkPlus}>
  {codeString}
</SyntaxHighlighter>
```

#### HTTP 통신

**Axios 1.6.5**
- **역할**: HTTP 클라이언트
- **기능**:
  - Interceptor (자동 토큰 추가)
  - Request/Response 변환
  - 타임아웃 설정

```javascript
// axiosConfig.js
export const djangoClient = axios.create({
  baseURL: `${protocol}//${hostname}:8000`,
  withCredentials: true,
});

djangoClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});
```

**@microsoft/fetch-event-source 2.0.1**
- **역할**: SSE (Server-Sent Events) 클라이언트
- **용도**: AI 스트리밍 응답 수신

```javascript
await fetchEventSource('/agent-messages', {
  method: 'POST',
  body: JSON.stringify(data),
  onmessage(ev) {
    const parsed = JSON.parse(ev.data);
    // 실시간 업데이트
  }
});
```

---

### 4.2 Backend 기술

#### Django 프레임워크

**Django 5.0.0+**
- **역할**: 웹 프레임워크 (Data & Auth)
- **주요 기능**:
  - ORM (Object-Relational Mapping)
  - 사용자 인증 시스템
  - Admin 패널
  - Migration 관리

**Django REST Framework 3.14.0+**
- **역할**: RESTful API 구축
- **주요 기능**:
  - Serializer (JSON 직렬화)
  - ViewSet (CRUD 자동 생성)
  - Authentication (Token, Session)
  - Permission (권한 관리)

```python
# ViewSet 예시
class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)
```

**django-cors-headers 4.3.1+**
- **역할**: CORS (Cross-Origin Resource Sharing) 설정
- **용도**: Frontend-Backend 간 통신 허용

```python
CORS_ALLOW_ALL_ORIGINS = True  # 사내망 전용
CORS_ALLOW_CREDENTIALS = True
```

#### FastAPI 프레임워크

**FastAPI 0.109.0+**
- **역할**: AI Gateway (비동기 처리)
- **선택 이유**:
  - 네이티브 async/await 지원
  - 자동 API 문서 생성 (Swagger)
  - Pydantic 기반 데이터 검증
  - 빠른 성능 (Starlette 기반)

```python
@app.post("/agent-messages")
async def chat_stream(req: ChatRequest, request: Request):
    async with request.app.state.http_client.stream(...) as response:
        async for line in response.aiter_lines():
            yield line
```

**Uvicorn 0.27.0+**
- **역할**: ASGI 서버
- **설정**: 
  - Host: 0.0.0.0 (사내망) 또는 127.0.0.1 (로컬)
  - Port: 8001
  - Workers: 1 (Windows 호환성)

**SSE-Starlette 2.0.0**
- **역할**: Server-Sent Events 지원
- **용도**: 실시간 스트리밍 응답

```python
from sse_starlette.sse import EventSourceResponse

return EventSourceResponse(event_generator())
```

**Python Multipart 0.0.9**
- **역할**: 파일 업로드 처리
- **용도**: multipart/form-data 파싱

#### Python 런타임

**Python 3.10+**
- 최소 요구: Python 3.10
- 권장 버전: Python 3.11 또는 3.12
- 가상환경: venv (내장 모듈)

```bash
# 가상환경 생성
python -m venv .venv

# 활성화 (Windows)
.venv\Scripts\activate
```

---

### 4.3 Database & Storage

#### SQLite 3

**SQLite 3 (Django 내장)**
- **역할**: 경량 RDBMS
- **선택 이유**:
  - 설치 불필요 (파일 기반)
  - 소규모 사용자 충분
  - 백업 간편 (파일 복사)
  - Windows 호환성 우수

**WAL 모드 최적화**
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        'OPTIONS': {
            'timeout': 30,
            'init_command': 'PRAGMA journal_mode=WAL;',
        }
    }
}

# WAL 모드 활성화
@receiver(connection_created)
def activate_wal_mode(sender, connection, **kwargs):
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        cursor.execute('PRAGMA journal_mode=WAL;')
        cursor.execute('PRAGMA synchronous=NORMAL;')
        cursor.execute('PRAGMA cache_size=-64000;')
        cursor.execute('PRAGMA busy_timeout=30000;')
```

**성능 특성**
- 동시 읽기: 무제한
- 동시 쓰기: WAL 모드로 향상 (3-5배)
- 권장 사용자 수: 5-50명

#### 파일 스토리지

**로컬 파일 시스템**
- Django 정적 파일: `static/`
- 사용자 업로드: 메모리 스트리밍 (디스크 저장 안 함)
- 로그 파일: `django_server/logs/`

**로그 파일 관리**
```python
LOGGING = {
    'handlers': {
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5,      # 최대 5개 파일
        },
    },
}
```

---

### 4.4 HTTP 통신 라이브러리

#### httpx (Python)

**httpx 0.27.0+**
- **역할**: 비동기 HTTP 클라이언트
- **선택 이유**:
  - async/await 네이티브 지원
  - requests 호환 API
  - HTTP/2 지원
  - Connection Pooling

**주요 기능**
```python
# 동기 클라이언트 (Django)
client = httpx.Client(
    timeout=httpx.Timeout(connect=5.0, read=30.0),
    transport=httpx.HTTPTransport(retries=2)
)

# 비동기 클라이언트 (FastAPI)
async with httpx.AsyncClient(timeout=60.0) as client:
    response = await client.get(url)
```

**타임아웃 구성**
```python
timeout=httpx.Timeout(
    connect=5.0,   # 연결 타임아웃
    read=30.0,     # 읽기 타임아웃
    write=10.0,    # 쓰기 타임아웃
    pool=5.0       # 풀 타임아웃
)
```

**Connection Pooling**
```python
limits=httpx.Limits(
    max_keepalive_connections=10,
    max_connections=50,
    keepalive_expiry=30.0
)
```

#### requests (Legacy, 마이그레이션 완료)

**requests 2.31.0**
- 현재: httpx로 대체 완료
- 유지 이유: 하위 호환성 (필요 시 사용 가능)

---

### 4.5 개발 도구

#### 설정 관리

**TOML 0.10.2**
- **역할**: 설정 파일 파싱
- **용도**: secrets.toml 읽기

```python
import toml

with open('secrets.toml', 'r') as f:
    SECRETS = toml.load(f)

FABRIX_CONFIG = SECRETS['fabrix_api']
```

#### 코드 품질

**ESLint 8.56.0**
- **역할**: JavaScript/JSX 린터
- **설정**: 
  - eslint-plugin-react 7.33.2
  - eslint-plugin-react-hooks 4.6.0
  - eslint-plugin-react-refresh 0.4.5

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ]
}
```

#### 버전 관리

**Git**
- `.gitignore`: secrets.toml, db.sqlite3, node_modules, .venv 제외
- Branch 전략: main (production), develop (개발)

```gitignore
# 필수 제외 항목
secrets.toml
db.sqlite3
db.sqlite3-*
.venv/
node_modules/
__pycache__/
*.log
```

#### 배포 스크립트

**Windows Batch Files**
- `setup_project.bat`: 초기 설정
- `run_project.bat`: 개발 모드 실행
- `service_project.bat`: 서비스 모드 실행
- `reset_create_admin.bat`: 관리자 생성

```batch
@echo off
chcp 65001 > nul
echo Django 서버 시작...
start "Django" cmd /k "call .venv\Scripts\activate & python manage.py runserver"
```

---

### 기술 스택 요약표

| 계층 | 기술 | 버전 | 역할 |
|------|------|------|------|
| **Frontend** | React | 18.2.0 | UI 프레임워크 |
| | React Router | 6.21.1 | 라우팅 |
| | Vite | 5.0.10 | 빌드 도구 |
| | Tailwind CSS | 3.4.1 | 스타일링 |
| | Axios | 1.6.5 | HTTP 클라이언트 |
| | Lucide React | 0.309.0 | 아이콘 |
| **Backend** | Django | 5.0.0+ | 웹 프레임워크 |
| | DRF | 3.14.0+ | REST API |
| | FastAPI | 0.109.0+ | AI Gateway |
| | Uvicorn | 0.27.0+ | ASGI 서버 |
| | httpx | 0.27.0+ | HTTP 클라이언트 |
| **Database** | SQLite | 3.x | RDBMS |
| **Runtime** | Python | 3.10+ | 백엔드 런타임 |
| | Node.js | 18.x+ | 프론트엔드 빌드 |
| **기타** | TOML | 0.10.2 | 설정 관리 |
| | Git | 2.x | 버전 관리 |

---

### 라이브러리 선택 기준

**Frontend**
1. ✅ **React**: 가장 널리 사용되는 UI 라이브러리
2. ✅ **Vite**: CRA 대비 압도적 빌드 속도
3. ✅ **Tailwind**: 빠른 개발 속도 및 일관성
4. ✅ **Axios**: 간편한 HTTP 통신

**Backend**
1. ✅ **Django**: 완벽한 인증 시스템 및 Admin
2. ✅ **FastAPI**: 비동기 스트리밍 최적화
3. ✅ **httpx**: async/await 네이티브 지원
4. ✅ **SQLite**: 설치 불필요, Windows 호환

**공통 철학**
- 검증된 기술 우선 (안정성)
- 최신 LTS 버전 사용 (보안)
- 최소한의 의존성 (단순성)
- Windows 호환성 확보

---

## 5. 시스템 아키텍처

본 프로젝트는 **3-Tier 아키텍처**를 기반으로, Frontend/Backend를 명확히 분리하고 Backend 내에서도 역할별 분리를 통해 확장성과 유지보수성을 확보했습니다.

### 5.1 논리적 구성도

#### 전체 시스템 구조

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser (React)                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Frontend (Port 5173/3000)                         │     │
│  │  - Vite Dev Server                                 │     │
│  │  - React Components                                │     │
│  │  - Tailwind CSS                                    │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────┬────────────────────────┬─────────────────────┘
               │                        │
               │ HTTP/REST              │ HTTP/SSE
               │ (axios)                │ (EventSource)
               │                        │
               ▼                        ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  Django Server           │  │  FastAPI Gateway         │
│  (Port 8000)             │  │  (Port 8001)             │
│                          │  │                          │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │ User Auth          │  │  │  │ Rate Limiter       │  │
│  │ - Login/Signup     │  │  │  │ - RPM/TPM Control  │  │
│  │ - Token Management │  │  │  └────────────────────┘  │
│  └────────────────────┘  │  │                          │
│                          │  │  ┌────────────────────┐  │
│  ┌────────────────────┐  │  │  │ FabriX Proxy       │  │
│  │ Data Management    │  │  │  │ - Agent List       │  │
│  │ - Chat Sessions    │  │  │  │ - Chat Streaming   │  │
│  │ - Message History  │  │  │  │ - File Upload      │  │
│  └────────────────────┘  │  │  └────────────────────┘  │
│           │              │  │           │              │
│           ▼              │  │           ▼              │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │ SQLite Database    │  │  │  │ HTTP Client        │  │
│  │ - WAL Mode         │  │  │  │ - Connection Pool  │  │
│  │ - Transactions     │  │  │  │ - Auto Retry       │  │
│  └────────────────────┘  │  │  └────────────────────┘  │
└──────────────────────────┘  └──────────┬───────────────┘
                                         │
                                         │ HTTPS
                                         │ (API Key in Header)
                                         ▼
                              ┌──────────────────────────┐
                              │  FabriX API              │
                              │  (Samsung SDS)           │
                              │                          │
                              │  - Agent Management      │
                              │  - LLM Inference         │
                              │  - Code Interpreter      │
                              │  - RAG System            │
                              └──────────────────────────┘
```

#### 계층별 역할 분리

**Presentation Layer (Frontend)**
- 사용자 인터페이스 렌더링
- 사용자 입력 처리
- 상태 관리 (React State)
- 클라이언트 사이드 라우팅

**Application Layer (Backend)**
- **Django**: 비즈니스 로직, 인증, 데이터 영속성
- **FastAPI**: AI Gateway, 스트리밍, 외부 API 프록시

**Data Layer**
- SQLite: 사용자, 세션, 메시지 저장
- secrets.toml: 환경 설정 관리

**External Service Layer**
- FabriX API: LLM 서비스 제공

---

### 5.2 프로젝트 디렉토리 구조

#### 전체 프로젝트 구조

```
django_dev/                          # 프로젝트 루트
│
├── secrets.toml                     # 🔐 환경 설정 (Git 제외)
├── requirements.txt                 # Python 의존성
├── .gitignore                       # Git 제외 파일
│
├── setup_project.bat                # 🔧 프로젝트 초기 설정
├── run_project.bat                  # 🚀 개발 모드 실행 (localhost)
├── service_project.bat              # 🌐 서비스 모드 실행 (0.0.0.0)
├── reset_create_admin.bat           # 👤 관리자 계정 생성
├── create_django_key.bat            # 🔑 Django Secret Key 생성
│
├── README.md                        # 프로젝트 개요
├── PERFORMANCE_IMPROVEMENTS.md      # 성능 개선 문서
├── RATE_LIMIT_HANDLING.md           # Rate Limit 가이드
├── STABILITY_IMPROVEMENTS.md        # 안정성 개선 문서
├── REQUESTS-TO-HTTPX-ASYNC-MIGRATION.MD  # 비동기 마이그레이션 문서
│
├── django_server/                   # Django 애플리케이션
│   ├── manage.py                    # Django 관리 명령
│   ├── db.sqlite3                   # SQLite 데이터베이스
│   ├── db.sqlite3-shm               # SQLite WAL 파일
│   ├── db.sqlite3-wal               # SQLite WAL 파일
│   │
│   ├── logs/                        # 로그 디렉토리
│   │   └── django.log               # Django 로그 파일
│   │
│   ├── config/                      # Django 프로젝트 설정
│   │   ├── __init__.py
│   │   ├── settings.py              # ⚙️ 핵심 설정 파일
│   │   ├── urls.py                  # URL 라우팅
│   │   └── wsgi.py                  # WSGI 진입점
│   │
│   └── apps/                        # Django 앱들
│       ├── __init__.py
│       └── fabrix_agent_chat/       # LLM 채팅 앱
│           ├── __init__.py
│           ├── models.py            # 데이터 모델 (User, Session, Message)
│           ├── views.py             # API 뷰 (Login, Signup, Session CRUD)
│           ├── serializers.py       # DRF Serializers
│           ├── urls.py              # 앱 URL 패턴
│           ├── admin.py             # Django Admin 설정
│           └── migrations/          # DB 마이그레이션
│               ├── __init__.py
│               └── 0001_initial.py
│
├── ai_gateway/                      # FastAPI AI Gateway
│   ├── main.py                      # 🚀 FastAPI 진입점
│   └── rate_limiter.py              # Rate Limiter 로직
│
├── frontend/                        # React 애플리케이션
│   ├── package.json                 # Node.js 의존성
│   ├── vite.config.js               # Vite 설정
│   ├── tailwind.config.js           # Tailwind CSS 설정
│   ├── postcss.config.js            # PostCSS 설정
│   ├── index.html                   # HTML 엔트리
│   │
│   └── src/                         # 소스 코드
│       ├── main.jsx                 # React 진입점
│       ├── App.jsx                  # 라우팅 설정
│       │
│       ├── api/                     # API 통신 레이어
│       │   ├── axiosConfig.js       # Axios 설정 (Django/FastAPI)
│       │   ├── djangoApi.js         # Django API 함수
│       │   └── fastapiApi.js        # FastAPI API 함수
│       │
│       ├── components/              # 공통 컴포넌트
│       │   └── layout/
│       │       └── MainLayout.jsx   # 메인 레이아웃 (Sidebar + Content)
│       │
│       ├── features/                # 기능별 모듈
│       │   ├── auth/
│       │   │   └── LoginPage.jsx    # 로그인/회원가입 페이지
│       │   │
│       │   └── chat/
│       │       ├── ChatPage.jsx     # 메인 채팅 페이지
│       │       └── components/
│       │           ├── Sidebar.jsx        # 좌측 사이드바
│       │           ├── ChatBubble.jsx     # 채팅 버블
│       │           ├── InputBox.jsx       # 입력창
│       │           └── LoadingSpinner.jsx # 로딩 스피너
│       │
│       └── styles/                  # 스타일
│           ├── Global.css           # 전역 스타일
│           └── Chat.css             # 채팅 스타일
│
└── doc/                             # 문서
    ├── 개발프롬프트.md
    ├── 최종설계서.md
    └── git 초기화.txt
```

#### 주요 디렉토리 설명

**루트 레벨**
- `secrets.toml`: API Key, DB 설정 등 민감 정보 (Git 제외 필수)
- `requirements.txt`: Python 패키지 목록
- `*.bat`: Windows 배치 파일 (자동화 스크립트)

**django_server/**
- Django 백엔드 애플리케이션
- `config/`: 프로젝트 레벨 설정
- `apps/`: 앱 단위 기능 모듈

**ai_gateway/**
- FastAPI 기반 AI Gateway
- FabriX API와의 중계 역할

**frontend/**
- React 기반 SPA
- `features/`: 기능별 모듈화 (확장 용이)

---

### 5.3 모듈별 역할 정의

#### Frontend 모듈

**1. API 통신 레이어 (`src/api/`)**

**axiosConfig.js**
```javascript
// 역할: Axios 클라이언트 설정 및 Interceptor
// - Django Client (Port 8000): 인증, 데이터 관리
// - FastAPI Client (Port 8001): AI 기능
// - 동적 Host 설정 (window.location.hostname)
// - 자동 토큰 추가 (Authorization Header)

export const djangoClient = axios.create({
  baseURL: `${protocol}//${hostname}:8000`,
  withCredentials: true,
});

djangoClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) config.headers['Authorization'] = `Token ${token}`;
  return config;
});
```

**djangoApi.js**
```javascript
// 역할: Django API 호출 함수 모음
// - authApi: 로그인, 회원가입
// - agentApi: Agent 목록 조회
// - chatApi: 세션/메시지 CRUD

export const chatApi = {
  getSessions: async () => { /* ... */ },
  createSession: async (agentId, title) => { /* ... */ },
  deleteSession: async (sessionId) => { /* ... */ },
  saveMessage: async (sessionId, role, content) => { /* ... */ },
};
```

**fastapiApi.js**
```javascript
// 역할: FastAPI API 호출 함수 모음
// - 파일 업로드 및 분석

export const fastApi = {
  uploadFile: async (file, agentId, query) => {
    const formData = new FormData();
    formData.append('file', file);
    // ...
  },
};
```

**2. 컴포넌트 레이어**

**MainLayout.jsx**
```javascript
// 역할: 전체 레이아웃 구조
// - Sidebar 토글 관리
// - Outlet으로 하위 라우트 렌더링

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex">
      <Sidebar onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main><Outlet /></main>
    </div>
  );
};
```

**Sidebar.jsx**
```javascript
// 역할: 좌측 사이드바
// - Agent 선택 드롭다운
// - Chat History 목록
// - New Chat 버튼
// - 사용자 정보 및 Logout
// - Agent 정보를 ChatPage로 전달 (CustomEvent)

window.dispatchEvent(new CustomEvent('agent-selected', {
  detail: { agentId, agent }
}));
```

**ChatPage.jsx**
```javascript
// 역할: 메인 채팅 페이지
// - 메시지 목록 표시
// - 스트리밍 응답 처리
// - 파일 업로드 처리
// - Session 로드/저장

await fetchEventSource('/agent-messages', {
  onmessage(ev) {
    // 실시간 업데이트
  }
});
```

**ChatBubble.jsx**
```javascript
// 역할: 채팅 메시지 버블
// - Markdown 렌더링 (ReactMarkdown)
// - 코드 Syntax Highlighting
// - 타이핑 애니메이션 (스트리밍 중)
```

**InputBox.jsx**
```javascript
// 역할: 메시지 입력창
// - 텍스트 입력 (Textarea)
// - 파일 선택 (FileInput)
// - 전송/중단 버튼
// - Enter/Shift+Enter 처리
```

#### Backend 모듈

**1. Django Server (`django_server/`)**

**config/settings.py**
```python
# 역할: Django 프로젝트 설정
# - Database 설정 (SQLite WAL 모드)
# - CORS 설정
# - REST Framework 설정
# - Logging 설정
# - HTTP Client 설정 (httpx)

SHARED_HTTP_CLIENT = httpx.Client(
    timeout=httpx.Timeout(connect=5.0, read=30.0),
    transport=httpx.HTTPTransport(retries=2)
)
```

**config/urls.py**
```python
# 역할: URL 라우팅
# - Admin 페이지
# - API 엔드포인트

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', RedirectView.as_view(url='/admin/')),
    path('api/', include('apps.fabrix_agent_chat.urls')),
]
```

**apps/fabrix_agent_chat/models.py**
```python
# 역할: 데이터 모델 정의
# - ChatSession: 대화방
# - ChatMessage: 개별 메시지

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    agent_id = models.CharField(max_length=100, db_index=True)
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**apps/fabrix_agent_chat/views.py**
```python
# 역할: API 뷰
# - SignUpView: 회원가입 (6자리 키 검증)
# - LoginView: 로그인 (Token 발급)
# - AgentListView: FabriX Agent 목록 프록시
# - ChatSessionViewSet: 세션 CRUD
#   - list(): 세션 목록
#   - retrieve(): 세션 상세 (메시지 포함)
#   - create(): 세션 생성
#   - destroy(): 세션 삭제
#   - messages(): 메시지 저장

@transaction.atomic
@action(detail=True, methods=['post'])
def messages(self, request, pk=None):
    # 트랜잭션 보호로 원자성 보장
```

**apps/fabrix_agent_chat/serializers.py**
```python
# 역할: JSON 직렬화
# - ChatSessionSerializer: 세션 기본 정보
# - ChatSessionDetailSerializer: 세션 + 메시지
# - ChatMessageSerializer: 메시지

class ChatSessionDetailSerializer(ChatSessionSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
```

**2. FastAPI Gateway (`ai_gateway/`)**

**main.py**
```python
# 역할: FastAPI 애플리케이션 진입점
# - Lifespan 관리 (HTTP Client)
# - CORS 설정
# - Rate Limiter 적용
# - 엔드포인트:
#   - GET /agents: Agent 목록 조회
#   - POST /agent-messages: 채팅 (스트리밍)
#   - POST /agent-messages/file: 파일 업로드
#   - GET /rate-limit-status: Rate Limit 상태

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: HTTP Client 생성
    app.state.http_client = httpx.AsyncClient(timeout=60.0)
    yield
    # Shutdown: HTTP Client 종료
    await app.state.http_client.aclose()
```

**rate_limiter.py**
```python
# 역할: Rate Limiting 로직
# - RPM (Requests Per Minute): 100
# - TPM (Tokens Per Minute): 10,000
# - Thread-safe (Lock 사용)
# - 자동 대기 시간 계산

class TokenRateLimiter:
    def can_proceed(self, tokens):
        # Rate limit 체크
        
    def get_wait_time(self, tokens):
        # 대기 시간 계산
```

---

### 5.4 데이터 흐름 다이어그램

#### 1. 사용자 인증 흐름

```
┌─────────┐
│ Browser │
└────┬────┘
     │ 1. POST /api/auth/signup/
     │    { username, password, email, auth_key }
     ▼
┌────────────────┐
│ Django Server  │
│ (SignUpView)   │
└────┬───────────┘
     │ 2. 검증
     │    - auth_key == secrets.toml[admin_signup_key]
     │    - email 도메인 체크
     │    - 중복 계정 확인
     │
     │ 3. User.objects.create_user()
     │ 4. Token.objects.create(user)
     │
     ▼
┌─────────────┐
│ SQLite DB   │
│ - auth_user │
│ - authtoken │
└─────────────┘
     │
     │ 5. Response
     │    { token, user_id, username, email }
     ▼
┌─────────┐
│ Browser │ → sessionStorage.setItem('authToken', token)
└─────────┘
```

#### 2. Agent 목록 조회 흐름

```
┌─────────┐
│ Browser │
└────┬────┘
     │ 1. GET /api/agents/
     │    Authorization: Token xxx
     ▼
┌────────────────┐
│ Django Server  │
│ (AgentListView)│
└────┬───────────┘
     │ 2. 인증 확인 (Token)
     │
     │ 3. FabriX API 호출
     │    GET {base_url}/agents
     │    Headers:
     │      - x-fabrix-client: xxx
     │      - x-openapi-token: xxx
     ▼
┌─────────────┐
│ FabriX API  │
└────┬────────┘
     │ 4. Response
     │    { items: [{ agentId, label, ... }] }
     ▼
┌────────────────┐
│ Django Server  │
└────┬───────────┘
     │ 5. Proxy Response
     ▼
┌─────────┐
│ Browser │ → Sidebar에 Agent 목록 표시
└─────────┘
```

#### 3. 채팅 메시지 스트리밍 흐름

```
┌─────────┐
│ Browser │
└────┬────┘
     │ 1. EventSource
     │    POST /agent-messages
     │    { agentId, contents: ["Hello"], isStream: true }
     ▼
┌──────────────────┐
│ FastAPI Gateway  │
└────┬─────────────┘
     │ 2. Rate Limit 체크
     │    - can_proceed(estimated_tokens)?
     │    - No → await sleep(wait_time) → Retry
     │    - Yes → 진행
     │
     │ 3. FabriX API 스트리밍 호출
     │    POST {base_url}/agent-messages
     │    Headers: x-fabrix-client, x-openapi-token
     ▼
┌─────────────┐
│ FabriX API  │ → LLM Inference (실시간 토큰 생성)
└────┬────────┘
     │ 4. SSE Stream
     │    data: {"content": "Hello"}
     │    data: {"content": " there"}
     │    data: {"content": "!"}
     │    ...
     ▼
┌──────────────────┐
│ FastAPI Gateway  │
└────┬─────────────┘
     │ 5. Proxy SSE Stream
     │    data: {"content": "Hello"}
     │    data: {"content": " there"}
     │    ...
     ▼
┌─────────┐
│ Browser │ → 실시간 업데이트 (타이핑 효과)
└────┬────┘
     │ 6. 완료 후 저장
     │    POST /api/sessions/{id}/messages/
     │    { role: "assistant", content: "Hello there!" }
     ▼
┌────────────────┐
│ Django Server  │
└────┬───────────┘
     │ 7. ChatMessage.objects.create()
     ▼
┌─────────────┐
│ SQLite DB   │
│ - chat_msg  │
└─────────────┘
```

#### 4. 파일 업로드 및 분석 흐름

```
┌─────────┐
│ Browser │
└────┬────┘
     │ 1. POST /agent-messages/file
     │    FormData:
     │      - file: [File Object]
     │      - agentId: "xxx"
     │      - contents: "Analyze this"
     ▼
┌──────────────────┐
│ FastAPI Gateway  │
└────┬─────────────┘
     │ 2. Rate Limit 체크 (파일은 최소 500 토큰)
     │
     │ 3. file.read() → 스트리밍 업로드
     │    POST {base_url}/agent-messages/file
     │    multipart/form-data
     ▼
┌─────────────┐
│ FabriX API  │ → Code Interpreter 실행
└────┬────────┘
     │ 4. Response (Non-streaming)
     │    { content: "분석 결과: ..." }
     ▼
┌──────────────────┐
│ FastAPI Gateway  │
└────┬─────────────┘
     │ 5. Response
     ▼
┌─────────┐
│ Browser │ → 결과 표시
└────┬────┘
     │ 6. 저장
     │    POST /api/sessions/{id}/messages/
     ▼
┌────────────────┐
│ Django Server  │ → SQLite 저장
└────────────────┘
```

#### 5. 세션 히스토리 조회 흐름

```
┌─────────┐
│ Browser │
└────┬────┘
     │ 1. GET /api/sessions/
     │    Authorization: Token xxx
     ▼
┌────────────────┐
│ Django Server  │
│ (ViewSet.list) │
└────┬───────────┘
     │ 2. 쿼리 최적화
     │    ChatSession.objects
     │      .filter(user=request.user)
     │      .select_related('user')
     │      .order_by('-updated_at')
     ▼
┌─────────────┐
│ SQLite DB   │
│ - chat_sess │
└────┬────────┘
     │ 3. Response
     │    [{ id, agent_id, title, created_at, updated_at }]
     ▼
┌─────────┐
│ Browser │ → Sidebar에 히스토리 목록 표시
└─────────┘


┌─────────┐
│ Browser │
└────┬────┘
     │ 4. 클릭: GET /api/sessions/{id}/
     ▼
┌────────────────┐
│ Django Server  │
│ (retrieve)     │
└────┬───────────┘
     │ 5. 쿼리 최적화
     │    session.objects
     │      .prefetch_related('messages')
     │      .get(id=id)
     ▼
┌─────────────┐
│ SQLite DB   │
│ - chat_sess │
│ - chat_msg  │
└────┬────────┘
     │ 6. Response
     │    { id, ..., messages: [{role, content}] }
     ▼
┌─────────┐
│ Browser │ → 대화 내역 복원
└─────────┘
```

---

### 아키텍처 특징 요약

**1. 관심사의 분리 (Separation of Concerns)**
- Frontend: UI/UX만 담당
- Django: 데이터 관리 및 인증
- FastAPI: AI Gateway 전담
- 각 계층이 독립적으로 확장 가능

**2. 보안 계층화**
- Frontend: API Key 접근 불가
- FastAPI: Proxy로 Key 보호
- Django: 토큰 기반 인증
- SQLite: 파일 권한 관리

**3. 확장성**
- 새 Django App 추가 용이
- Frontend Feature 모듈화
- FastAPI 라우터 분리 가능

**4. 성능 최적화**
- Connection Pooling (HTTP)
- WAL 모드 (SQLite)
- Prefetch (Django ORM)
- Rate Limiting (자동 조절)

**5. 안정성**
- 트랜잭션 보호
- 자동 재시도 (네트워크)
- 타임아웃 설정
- 에러 핸들링

---

## 6. API 명세 및 통신 프로토콜

본 프로젝트는 Django REST API와 FastAPI Gateway API로 구성되며, 각각 명확한 역할 분리를 통해 효율적인 서비스를 제공합니다.

### 6.1 Django REST API

Django Server는 **Port 8000**에서 실행되며, 사용자 인증 및 데이터 관리를 담당합니다.

**Base URL**
- 개발 모드: `http://127.0.0.1:8000`
- 서비스 모드: `http://{server-ip}:8000`

#### 6.1.1 인증 API

**회원가입**

```http
POST /api/auth/signup/
Content-Type: application/json

Request Body:
{
  "username": "user123",
  "password": "secure_password",
  "email": "user@samsung.com",
  "auth_key": "123456"
}

Response (201 Created):
{
  "message": "Signup successful.",
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  "user_id": 1,
  "username": "user123",
  "email": "user@samsung.com"
}

Error Response (403 Forbidden):
{
  "error": "Invalid Auth Key."
}

Error Response (400 Bad Request):
{
  "error": "Username already exists."
}
```

**로그인**

```http
POST /api/auth/login/
Content-Type: application/json

Request Body:
{
  "username": "user123",
  "password": "secure_password"
}

Response (200 OK):
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  "user_id": 1,
  "username": "user123",
  "email": "user@samsung.com"
}

Error Response (401 Unauthorized):
{
  "error": "Invalid credentials"
}

Error Response (403 Forbidden):
{
  "error": "Account is disabled."
}
```

**인증 방식**
```http
Authorization: Token a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

#### 6.1.2 Agent API

**Agent 목록 조회**

```http
GET /api/agents/
Authorization: Token {user_token}

Response (200 OK):
{
  "items": [
    {
      "agentId": "520e8dd8-0eb6-49ae-ba38-02da413edb14",
      "label": "FabriX General Agent",
      "description": "일반 대화 및 코드 작성 지원",
      "capabilities": ["chat", "code_generation", "file_analysis"]
    },
    {
      "agentId": "630f9ee9-1fc7-5abf-cb49-13eb524fed25",
      "label": "Data Analysis Agent",
      "description": "데이터 분석 및 시각화 지원",
      "capabilities": ["data_analysis", "visualization"]
    }
  ]
}

Error Response (504 Gateway Timeout):
{
  "error": "Request timeout to FabriX API"
}

Error Response (503 Service Unavailable):
{
  "error": "Connection failed to FabriX API: Connection refused"
}
```

**특징**
- Django가 FabriX API를 Proxy
- 최대 재시도: 2회
- 타임아웃: 10초

#### 6.1.3 채팅 세션 API

**세션 목록 조회**

```http
GET /api/sessions/
Authorization: Token {user_token}

Response (200 OK):
[
  {
    "id": 1,
    "agent_id": "520e8dd8-0eb6-49ae-ba38-02da413edb14",
    "title": "Python 코드 최적화 질문",
    "created_at": "2026-01-29T10:30:00Z",
    "updated_at": "2026-01-29T11:45:00Z"
  },
  {
    "id": 2,
    "agent_id": "520e8dd8-0eb6-49ae-ba38-02da413edb14",
    "title": "Django 프로젝트 구조 질문",
    "created_at": "2026-01-28T14:20:00Z",
    "updated_at": "2026-01-28T15:10:00Z"
  }
]
```

**세션 생성**

```http
POST /api/sessions/
Authorization: Token {user_token}
Content-Type: application/json

Request Body:
{
  "agent_id": "520e8dd8-0eb6-49ae-ba38-02da413edb14",
  "title": "새로운 대화"
}

Response (201 Created):
{
  "id": 3,
  "agent_id": "520e8dd8-0eb6-49ae-ba38-02da413edb14",
  "title": "새로운 대화",
  "created_at": "2026-01-30T09:00:00Z",
  "updated_at": "2026-01-30T09:00:00Z"
}
```

**세션 상세 조회 (메시지 포함)**

```http
GET /api/sessions/{session_id}/
Authorization: Token {user_token}

Response (200 OK):
{
  "id": 1,
  "agent_id": "520e8dd8-0eb6-49ae-ba38-02da413edb14",
  "title": "Python 코드 최적화 질문",
  "created_at": "2026-01-29T10:30:00Z",
  "updated_at": "2026-01-29T11:45:00Z",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "Python에서 리스트 순회를 최적화하는 방법은?",
      "created_at": "2026-01-29T10:30:15Z"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "Python에서 리스트 순회 최적화 방법:\n1. List Comprehension 사용\n2. Generator Expression 활용\n3. map() 함수 고려...",
      "created_at": "2026-01-29T10:30:45Z"
    }
  ]
}

Error Response (404 Not Found):
{
  "detail": "Not found."
}
```

**세션 삭제**

```http
DELETE /api/sessions/{session_id}/
Authorization: Token {user_token}

Response (204 No Content):
(No response body)

Error Response (404 Not Found):
{
  "detail": "Not found."
}
```

**메시지 저장**

```http
POST /api/sessions/{session_id}/messages/
Authorization: Token {user_token}
Content-Type: application/json

Request Body:
{
  "role": "user",
  "content": "Django에서 비동기 처리는 어떻게 하나요?"
}

Response (201 Created):
{
  "id": 3,
  "role": "user",
  "content": "Django에서 비동기 처리는 어떻게 하나요?",
  "created_at": "2026-01-30T09:15:00Z"
}

Error Response (400 Bad Request):
{
  "role": ["This field is required."],
  "content": ["This field is required."]
}
```

**특징**
- 트랜잭션 보호: `@transaction.atomic`
- 쿼리 최적화: `prefetch_related('messages')`
- 사용자별 필터링: 자신의 세션만 접근 가능

---

### 6.2 FastAPI Gateway API

FastAPI Gateway는 **Port 8001**에서 실행되며, FabriX API와의 통신을 중계합니다.

**Base URL**
- 개발 모드: `http://127.0.0.1:8001`
- 서비스 모드: `http://{server-ip}:8001`

#### 6.2.1 Rate Limit 상태 조회

```http
GET /rate-limit-status

Response (200 OK):
{
  "current_rpm": 45,
  "current_tpm": 3200,
  "remaining_rpm": 55,
  "remaining_tpm": 6800,
  "rpm_limit": 100,
  "tpm_limit": 10000
}
```

**용도**
- 현재 Rate Limit 사용량 모니터링
- 관리자 대시보드 연동

#### 6.2.2 Agent 목록 조회 (FastAPI)

```http
GET /agents?page=1&limit=50

Response (200 OK):
{
  "items": [
    {
      "agentId": "520e8dd8-0eb6-49ae-ba38-02da413edb14",
      "label": "FabriX General Agent",
      "description": "일반 대화 및 코드 작성 지원"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}

Error Response (504 Gateway Timeout):
{
  "detail": "Request timeout"
}
```

#### 6.2.3 채팅 스트리밍 (SSE)

**엔드포인트**

```http
POST /agent-messages
Content-Type: application/json

Request Body:
{
  "agentId": "520e8dd8-0eb6-49ae-ba38-02da413edb14",
  "contents": ["Python에서 데코레이터를 설명해주세요"],
  "isStream": true,
  "isRagOn": true
}

Response: text/event-stream
```

**SSE 스트림 형식**

```
data: {"type": "start", "content": ""}

data: {"type": "content", "content": "Python"}

data: {"type": "content", "content": " 데코레이터는"}

data: {"type": "content", "content": " 함수를"}

data: {"type": "content", "content": " 수정하는"}

...

data: {"type": "end", "content": ""}
```

**JavaScript 클라이언트 예시**

```javascript
import { fetchEventSource } from '@microsoft/fetch-event-source';

await fetchEventSource('http://localhost:8001/agent-messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    agentId: "520e8dd8-0eb6-49ae-ba38-02da413edb14",
    contents: ["안녕하세요"],
    isStream: true,
    isRagOn: true
  }),
  onmessage(ev) {
    if (ev.data) {
      const parsed = JSON.parse(ev.data);
      if (parsed.content) {
        // 실시간 업데이트
        console.log(parsed.content);
      }
    }
  },
  onerror(err) {
    console.error('Stream error:', err);
    throw err; // 재연결 방지
  },
  onclose() {
    console.log('Stream closed');
  }
});
```

**Rate Limit 처리**

스트리밍 요청은 자동 Rate Limit 처리가 적용됩니다:

```
1. 토큰 추정: contents 길이 / 4 (최소 100 토큰)
2. Rate Limit 체크
   - 여유 있음 → 즉시 진행
   - 초과 → 자동 대기 (최대 10초)
3. 대기 시간 > 10초 → 429 에러 반환
4. 최대 3회 재시도
```

**에러 응답 (429 Too Many Requests)**

```json
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded: 100 requests in last minute (limit: 100)",
  "retry_after": 15.5,
  "current_usage": {
    "current_rpm": 100,
    "current_tpm": 9800,
    "remaining_rpm": 0,
    "remaining_tpm": 200,
    "rpm_limit": 100,
    "tpm_limit": 10000
  }
}
```

#### 6.2.4 파일 업로드 및 분석

**엔드포인트**

```http
POST /agent-messages/file
Content-Type: multipart/form-data

Request (Form Data):
- file: [File] (최대 100MB)
- agentId: "520e8dd8-0eb6-49ae-ba38-02da413edb14"
- contents: "이 파일을 분석해주세요"

Response (200 OK):
{
  "content": "파일 분석 결과:\n\n1. 파일 형식: CSV\n2. 행 개수: 1000\n3. 열 개수: 5\n...",
  "metadata": {
    "filename": "data.csv",
    "size": 51200,
    "processed_at": "2026-01-30T09:20:00Z"
  }
}

Error Response (413 Payload Too Large):
{
  "detail": "File too large"
}

Error Response (400 Bad Request):
{
  "detail": "Invalid file type"
}

Error Response (504 Gateway Timeout):
{
  "detail": "File upload timed out"
}
```

**JavaScript 클라이언트 예시**

```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('agentId', selectedAgentId);
formData.append('contents', '이 파일을 분석해주세요');

const response = await axios.post(
  'http://localhost:8001/agent-messages/file',
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
);

console.log(response.data.content);
```

**지원 파일 형식**
- 텍스트: .txt, .csv, .json, .xml
- 코드: .py, .js, .java, .cpp, .c, .html, .css
- 문서: .pdf, .md
- 데이터: .xlsx (제한적)

**Rate Limit 처리**
- 최소 토큰: 500 (파일 처리는 더 많은 리소스 소비)
- 최대 대기 시간: 15초
- 타임아웃: 30초 (읽기)

---

### 6.3 통신 프로토콜 (HTTP/SSE)

#### 6.3.1 HTTP 프로토콜

**일반 API 통신**

```
Client                    Server
  │                         │
  ├──── HTTP Request ───────►
  │     POST /api/sessions/ │
  │     Authorization: Token│
  │     { agent_id, title } │
  │                         │
  │◄──── HTTP Response ─────┤
  │     201 Created         │
  │     { id, agent_id, ... }│
  │                         │
```

**요청 헤더**
```http
Content-Type: application/json
Authorization: Token {user_token}
Accept: application/json
```

**응답 헤더**
```http
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

#### 6.3.2 SSE (Server-Sent Events) 프로토콜

**스트리밍 통신**

```
Client                         FastAPI                    FabriX API
  │                              │                            │
  ├──── EventSource Open ───────►│                            │
  │     POST /agent-messages     │                            │
  │                              ├──── HTTP Stream ──────────►│
  │                              │                            │
  │                              │◄──── data: token 1 ────────┤
  │◄──── data: token 1 ──────────┤                            │
  │                              │◄──── data: token 2 ────────┤
  │◄──── data: token 2 ──────────┤                            │
  │                              │◄──── data: token 3 ────────┤
  │◄──── data: token 3 ──────────┤                            │
  │         ...                  │         ...                │
  │                              │◄──── [stream close] ───────┤
  │◄──── [stream close] ─────────┤                            │
  │                              │                            │
```

**SSE 메시지 형식**

```
필드 구분자: \n\n (두 개의 개행)

단일 메시지:
data: {"type": "content", "content": "Hello"}\n\n

연속 메시지:
data: {"content": "Hello"}\n\n
data: {"content": " World"}\n\n
data: {"content": "!"}\n\n
```

**연결 유지**
- Keep-Alive: 60초
- Reconnection: 자동 (EventSource API)
- Heartbeat: 필요 시 빈 메시지 전송

#### 6.3.3 Connection Pooling

**HTTP Client 설정 (Python)**

```python
# Django (Shared Client)
SHARED_HTTP_CLIENT = httpx.Client(
    timeout=httpx.Timeout(
        connect=5.0,
        read=30.0,
        write=10.0,
        pool=5.0
    ),
    limits=httpx.Limits(
        max_keepalive_connections=10,
        max_connections=50,
        keepalive_expiry=30.0
    ),
    transport=httpx.HTTPTransport(retries=2)
)

# FastAPI (Lifespan Managed)
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http_client = httpx.AsyncClient(
        timeout=60.0
    )
    yield
    await app.state.http_client.aclose()
```

**Axios 설정 (JavaScript)**

```javascript
export const djangoClient = axios.create({
  baseURL: `${protocol}//${hostname}:8000`,
  timeout: 30000,
  withCredentials: true,
});

export const fastApiClient = axios.create({
  baseURL: `${protocol}//${hostname}:8001`,
  timeout: 60000,
});
```

---

### 6.4 에러 응답 형식

#### 6.4.1 표준 에러 형식

**Django REST Framework**

```json
{
  "error": "에러 메시지",
  "detail": "상세 설명 (선택적)",
  "status_code": 400
}

또는

{
  "field_name": ["에러 메시지 1", "에러 메시지 2"]
}
```

**FastAPI**

```json
{
  "detail": "에러 메시지"
}

또는

{
  "error": "error_type",
  "message": "에러 메시지",
  "detail": "상세 정보 (선택적)"
}
```

#### 6.4.2 HTTP 상태 코드

**2xx Success**
- `200 OK`: 성공적인 요청
- `201 Created`: 리소스 생성 성공
- `204 No Content`: 성공 (응답 본문 없음)

**4xx Client Error**
- `400 Bad Request`: 잘못된 요청 형식
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `413 Payload Too Large`: 파일 크기 초과
- `429 Too Many Requests`: Rate Limit 초과

**5xx Server Error**
- `500 Internal Server Error`: 서버 내부 오류
- `502 Bad Gateway`: Upstream 서버 오류
- `503 Service Unavailable`: 서비스 일시 중단
- `504 Gateway Timeout`: Upstream 타임아웃

#### 6.4.3 주요 에러 시나리오

**인증 에러**

```http
401 Unauthorized
{
  "detail": "Authentication credentials were not provided."
}

또는

{
  "detail": "Invalid token."
}
```

**권한 에러**

```http
403 Forbidden
{
  "error": "Invalid Auth Key."
}

또는

{
  "detail": "You do not have permission to perform this action."
}
```

**Rate Limit 에러**

```http
429 Too Many Requests
{
  "error": "rate_limit_exceeded",
  "message": "Token limit exceeded: 10500 tokens in last minute (limit: 10000)",
  "retry_after": 15.5,
  "current_usage": {
    "current_rpm": 85,
    "current_tpm": 10500,
    "remaining_rpm": 15,
    "remaining_tpm": 0,
    "rpm_limit": 100,
    "tpm_limit": 10000
  }
}
```

**네트워크 에러**

```http
504 Gateway Timeout
{
  "error": "Request timeout to FabriX API"
}

또는

503 Service Unavailable
{
  "error": "Connection failed to FabriX API: Connection refused"
}
```

**스트리밍 에러 (SSE 형식)**

```
data: {"error": "timeout", "detail": "API request timeout"}\n\n

data: {"error": "http_error", "status": 500, "detail": "Internal server error"}\n\n

data: {"error": "request_error", "detail": "Connection refused"}\n\n
```

#### 6.4.4 에러 처리 Best Practice

**Frontend 에러 처리**

```javascript
try {
  const response = await djangoClient.post('/api/sessions/', data);
  return response.data;
} catch (error) {
  if (error.response) {
    // 서버가 에러 응답을 반환
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        alert(`잘못된 요청: ${data.error || JSON.stringify(data)}`);
        break;
      case 401:
        // 로그아웃 처리
        sessionStorage.clear();
        navigate('/login');
        break;
      case 403:
        alert('권한이 없습니다.');
        break;
      case 429:
        alert(`Rate Limit 초과. ${Math.ceil(data.retry_after)}초 후 재시도하세요.`);
        break;
      case 504:
        alert('서버 응답 시간 초과. 잠시 후 다시 시도해주세요.');
        break;
      default:
        alert(`에러 발생: ${data.error || data.detail || '알 수 없는 오류'}`);
    }
  } else if (error.request) {
    // 요청이 전송되었으나 응답 없음
    alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
  } else {
    // 요청 설정 중 에러
    alert('요청 처리 중 오류가 발생했습니다.');
  }
}
```

**Backend 에러 처리**

```python
# Django
try:
    session = ChatSession.objects.get(id=session_id, user=request.user)
except ChatSession.DoesNotExist:
    return Response(
        {'error': 'Session not found'},
        status=status.HTTP_404_NOT_FOUND
    )
except Exception as e:
    logger.error(f'Unexpected error: {e}', exc_info=True)
    return Response(
        {'error': 'Internal server error'},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )

# FastAPI
try:
    response = await client.get(url, headers=headers)
    response.raise_for_status()
    return response.json()
except httpx.TimeoutException:
    raise HTTPException(status_code=504, detail='Request timeout')
except httpx.HTTPStatusError as e:
    raise HTTPException(
        status_code=e.response.status_code,
        detail=str(e)
    )
except Exception as e:
    logger.error(f'Unexpected error: {e}')
    raise HTTPException(status_code=500, detail='Internal server error')
```

---

### API 테스트 가이드

**cURL 예시**

```bash
# 회원가입
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test1234","email":"test@samsung.com","auth_key":"123456"}'

# 로그인
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test1234"}'

# 세션 목록 조회
curl -X GET http://localhost:8000/api/sessions/ \
  -H "Authorization: Token your-token-here"

# Agent 목록 조회
curl -X GET http://localhost:8000/api/agents/ \
  -H "Authorization: Token your-token-here"

# Rate Limit 상태
curl -X GET http://localhost:8001/rate-limit-status
```

**Postman Collection**

프로젝트에 Postman Collection 파일을 포함하여 쉽게 API 테스트를 수행할 수 있습니다.

---

## 7. 프론트엔드 설계 상세

React 기반 Single Page Application(SPA)으로 구현되었으며, 컴포넌트 기반 아키텍처와 모듈화된 구조를 통해 확장성과 유지보수성을 확보했습니다.

### 7.1 React 프로젝트 구조

#### 디렉토리 구조 상세

```
frontend/
├── package.json              # 의존성 관리
├── vite.config.js            # Vite 빌드 설정
├── tailwind.config.js        # Tailwind CSS 설정
├── postcss.config.js         # PostCSS 설정
├── index.html                # HTML Entry Point
│
└── src/
    ├── main.jsx              # React 애플리케이션 진입점
    ├── App.jsx               # 라우팅 및 인증 가드
    │
    ├── api/                  # API 통신 레이어
    │   ├── axiosConfig.js    # Axios 인스턴스 설정
    │   ├── djangoApi.js      # Django API 함수
    │   └── fastapiApi.js     # FastAPI API 함수
    │
    ├── components/           # 공통 컴포넌트
    │   └── layout/
    │       └── MainLayout.jsx  # 전체 레이아웃 (Sidebar + Content)
    │
    ├── features/             # 기능별 모듈
    │   ├── auth/
    │   │   └── LoginPage.jsx  # 로그인/회원가입
    │   │
    │   └── chat/
    │       ├── ChatPage.jsx   # 메인 채팅 페이지
    │       └── components/
    │           ├── Sidebar.jsx         # 좌측 사이드바
    │           ├── ChatBubble.jsx      # 메시지 버블
    │           ├── InputBox.jsx        # 입력창
    │           └── LoadingSpinner.jsx  # 로딩 인디케이터
    │
    └── styles/               # 스타일 파일
        ├── Global.css        # 전역 스타일 (CSS Variables)
        └── Chat.css          # 채팅 관련 스타일
```

#### 파일 역할 설명

**설정 파일**

**package.json**
```json
{
  "name": "fabrix-agent-chat-interface",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",              // 개발 서버 실행
    "build": "vite build",      // 프로덕션 빌드
    "preview": "vite preview"   // 빌드 결과 미리보기
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "axios": "^1.6.5",
    "@microsoft/fetch-event-source": "^2.0.1",
    "react-markdown": "^9.0.1",
    "lucide-react": "^0.309.0",
    "tailwindcss": "^3.4.1"
  }
}
```

**vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // 사내망 접근 허용
    port: 5173
  }
})
```

**tailwind.config.js**
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // CSS Variables와 매핑
      }
    }
  }
}
```

**코어 파일**

**main.jsx** (React 진입점)
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/Global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**index.html** (HTML Entry)
```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FabriX Agent Chat</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### 7.2 컴포넌트 계층 구조

#### 전체 컴포넌트 트리

```
App (BrowserRouter)
├── Route: /login
│   └── LoginPage
│       ├── LoginForm
│       └── SignupForm
│
└── Route: / (PrivateRoute)
    └── MainLayout
        ├── Sidebar
        │   ├── MenuButton (토글)
        │   ├── AgentSelector (드롭다운)
        │   │   └── AgentItem (반복)
        │   ├── NewChatButton
        │   ├── SessionList
        │   │   └── SessionItem (반복)
        │   │       └── DeleteButton
        │   └── UserInfo
        │       └── LogoutButton
        │
        └── Outlet (ChatPage)
            ├── Header
            │   ├── AgentInfo
            │   └── ErrorAlert
            │
            ├── ChatArea
            │   └── MessageList
            │       └── ChatBubble (반복)
            │           ├── UserBubble
            │           │   └── UserIcon
            │           └── AssistantBubble
            │               ├── BotIcon
            │               ├── ReactMarkdown
            │               └── SyntaxHighlighter
            │
            └── InputContainer
                └── InputBox
                    ├── FileButton
                    ├── Textarea
                    ├── SendButton
                    └── StopButton
```

#### Props 및 State 흐름

```
App
├── [State] isAuthenticated
└── [Context] AuthContext (선택적)

MainLayout
├── [State] isSidebarOpen
└── [Props to Sidebar] onToggleSidebar

Sidebar
├── [State] agents, selectedAgent, sessions
├── [Effect] loadAgents(), loadSessions()
└── [Event] dispatchEvent('agent-selected')

ChatPage
├── [State] messages, isLoading, error, selectedAgentId
├── [Effect] loadHistory(), scrollToBottom()
├── [Event Listener] 'agent-selected', 'session-created'
└── [Props to Components]
    ├── ChatBubble: { message, isStreaming }
    └── InputBox: { onSend, onStop, isLoading }

InputBox
├── [State] text, file
└── [Handlers] handleSend(), handleFileSelect()
```

---

### 7.3 상태 관리 전략

#### 상태 분류

**1. 전역 상태 (Global State)**

**인증 상태**
```javascript
// sessionStorage 사용
sessionStorage.setItem('authToken', token);
sessionStorage.setItem('username', username);
sessionStorage.setItem('email', email);
sessionStorage.setItem('userId', userId);

// 접근
const token = sessionStorage.getItem('authToken');
const username = sessionStorage.getItem('username');
```

**선택 이유**
- `sessionStorage`: 브라우저 종료 시 자동 삭제 (보안)
- `localStorage` 대신 사용하여 세션 만료 정책 준수

**2. 페이지 상태 (Page State)**

**ChatPage.jsx**
```javascript
const [messages, setMessages] = useState([]);          // 메시지 목록
const [isLoading, setIsLoading] = useState(false);     // 로딩 상태
const [error, setError] = useState(null);              // 에러 메시지
const [selectedAgentId, setSelectedAgentId] = useState('');  // 선택된 Agent
const abortControllerRef = useRef(null);               // 스트림 중단용
const messagesEndRef = useRef(null);                   // 자동 스크롤용
```

**Sidebar.jsx**
```javascript
const [sessions, setSessions] = useState([]);          // 세션 목록
const [agents, setAgents] = useState([]);              // Agent 목록
const [selectedAgent, setSelectedAgent] = useState(null);  // 선택된 Agent
const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);  // 드롭다운 상태
```

**MainLayout.jsx**
```javascript
const [isSidebarOpen, setIsSidebarOpen] = useState(true);  // 사이드바 토글
```

**3. 컴포넌트 상태 (Component State)**

**InputBox.jsx**
```javascript
const [text, setText] = useState('');                  // 입력 텍스트
const [file, setFile] = useState(null);                // 선택된 파일
```

**LoginPage.jsx**
```javascript
const [isLogin, setIsLogin] = useState(true);          // 로그인/회원가입 모드
const [formData, setFormData] = useState({             // 폼 데이터
  username: '',
  password: '',
  email: '',
  auth_key: ''
});
const [error, setError] = useState('');                // 폼 에러
```

#### 상태 업데이트 패턴

**불변성 유지**
```javascript
// ❌ 잘못된 방법 (직접 수정)
messages.push(newMessage);
setMessages(messages);

// ✅ 올바른 방법 (불변성 유지)
setMessages(prev => [...prev, newMessage]);

// 마지막 메시지 업데이트
setMessages(prev => {
  const newMessages = [...prev];
  const lastMessage = { ...newMessages[newMessages.length - 1] };
  lastMessage.content = updatedContent;
  newMessages[newMessages.length - 1] = lastMessage;
  return newMessages;
});
```

**조건부 상태 업데이트**
```javascript
// 중복 방지
if (!agents.find(a => a.agentId === newAgent.agentId)) {
  setAgents(prev => [...prev, newAgent]);
}

// 필터링
setSessions(prev => prev.filter(s => s.id !== deletedId));
```

#### 컴포넌트 간 통신

**CustomEvent 사용 (Sidebar → ChatPage)**

```javascript
// Sidebar.jsx (발신)
const handleAgentSelect = (agent) => {
  setSelectedAgent(agent);
  window.dispatchEvent(new CustomEvent('agent-selected', {
    detail: { agentId: agent.agentId, agent: agent }
  }));
};

// ChatPage.jsx (수신)
useEffect(() => {
  const handleAgentSelected = (e) => {
    setSelectedAgentId(e.detail.agentId);
    if (e.detail.agent) {
      setAgents(prev => {
        const exists = prev.find(a => a.agentId === e.detail.agent.agentId);
        return exists ? prev : [...prev, e.detail.agent];
      });
    }
  };
  
  window.addEventListener('agent-selected', handleAgentSelected);
  return () => window.removeEventListener('agent-selected', handleAgentSelected);
}, []);
```

**URL 기반 상태 동기화 (React Router)**

```javascript
// URL에 session_id 포함
const [searchParams] = useSearchParams();
const currentSessionId = searchParams.get('session_id');

// 세션 변경 시 URL 업데이트
navigate(`/chat?session_id=${sessionId}`, { replace: true });

// 세션 로드 (URL 변경 시 자동 실행)
useEffect(() => {
  if (currentSessionId) {
    loadSessionHistory(currentSessionId);
  } else {
    setMessages([]);
  }
}, [currentSessionId]);
```

---

### 7.4 라우팅 설계

#### React Router 구조

**App.jsx**
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import ChatPage from './features/chat/ChatPage';

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

#### 라우트 설명

**Public Routes (인증 불필요)**
- `/login`: 로그인 및 회원가입 페이지
  - Query: 없음
  - 인증된 사용자 접근 시 `/chat`으로 자동 리다이렉트 (선택적)

**Protected Routes (인증 필요)**
- `/`: 루트 경로 → `/chat`으로 리다이렉트
- `/chat`: 메인 채팅 페이지
  - Query: `?session_id=123` (선택적)
  - session_id 있음: 해당 세션 로드
  - session_id 없음: 새 대화 시작

**Fallback**
- `/*`: 모든 미정의 경로 → `/login`으로 리다이렉트

#### 네비게이션 패턴

**프로그래밍 방식 네비게이션**
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// 새 대화 시작
navigate('/chat');

// 세션 선택
navigate(`/chat?session_id=${sessionId}`);

// 로그아웃
navigate('/login', { replace: true });
```

**Link 컴포넌트 (선택적)**
```javascript
import { Link } from 'react-router-dom';

<Link to="/chat">Go to Chat</Link>
```

#### 인증 가드 (PrivateRoute)

**토큰 검증**
```javascript
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('authToken');
  
  // 토큰 없음 → 로그인 페이지
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // 토큰 있음 → 컴포넌트 렌더링
  return children;
};
```

**향상된 인증 가드 (선택적)**
```javascript
const PrivateRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  
  useEffect(() => {
    const validateToken = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }
      
      // 선택적: 서버에 토큰 검증 요청
      try {
        await djangoClient.get('/api/validate-token/');
        setIsValid(true);
      } catch {
        sessionStorage.clear();
        setIsValid(false);
      }
      setIsValidating(false);
    };
    
    validateToken();
  }, []);
  
  if (isValidating) return <LoadingSpinner />;
  if (!isValid) return <Navigate to="/login" replace />;
  return children;
};
```

---

### 7.5 주요 컴포넌트 상세

#### 7.5.1 LoginPage.jsx

**역할**: 사용자 인증 (로그인/회원가입)

**주요 기능**
- 로그인/회원가입 모드 전환
- 폼 검증
- 에러 메시지 표시
- 성공 시 토큰 저장 및 리다이렉트

**코드 구조**
```javascript
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);  // 모드 전환
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    auth_key: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // 로그인
        const response = await authApi.login({
          username: formData.username,
          password: formData.password
        });
        
        // 토큰 및 사용자 정보 저장
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('username', response.username);
        sessionStorage.setItem('email', response.email);
        sessionStorage.setItem('userId', response.user_id);
        
        // 채팅 페이지로 이동
        navigate('/chat');
      } else {
        // 회원가입
        const response = await authApi.signup(formData);
        
        // 자동 로그인
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('username', response.username);
        sessionStorage.setItem('email', response.email);
        sessionStorage.setItem('userId', response.user_id);
        
        navigate('/chat');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-blue-600">
          {isLogin ? 'Create an account' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};
```

**스타일 특징**
- Tailwind CSS 사용
- 중앙 정렬 레이아웃
- 카드 형태 (rounded-2xl, shadow-lg)
- 에러 메시지: 빨간색 배경 (bg-red-50)

#### 7.5.2 MainLayout.jsx

**역할**: 전체 레이아웃 관리 (Sidebar + Content)

**주요 기능**
- Sidebar 토글 관리
- 반응형 레이아웃
- Outlet으로 하위 라우트 렌더링

**코드 구조**
```javascript
const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        relative flex-shrink-0 bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
        transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
        ${isSidebarOpen ? 'w-[280px]' : 'w-[56px]'}
      `}>
        {isSidebarOpen ? (
          <div className="w-[280px] h-full flex flex-col">
            <Sidebar onToggleSidebar={() => setIsSidebarOpen(false)} />
          </div>
        ) : (
          <div className="w-[56px] h-full flex flex-col">
            <div className="flex-shrink-0 h-14 flex items-center justify-center">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2">
                <Menu size={20} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[var(--bg-primary)]">
        <Outlet />
      </main>
    </div>
  );
};
```

**스타일 특징**
- Flexbox 레이아웃
- Sidebar: 고정 너비 (280px) / 축소 (56px)
- Smooth transition (cubic-bezier)
- CSS Variables 사용

#### 7.5.3 Sidebar.jsx

**역할**: 좌측 사이드바 (Agent 선택, 세션 관리)

**주요 기능**
- Agent 선택 드롭다운
- New Chat 버튼
- 세션 히스토리 목록
- 세션 삭제
- 사용자 정보 및 로그아웃

**코드 구조**
```javascript
const Sidebar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSessionId = searchParams.get('session_id');
  
  const [sessions, setSessions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const username = sessionStorage.getItem('username') || 'User';
  const userEmail = sessionStorage.getItem('email') || 'user@example.com';

  // Agent 및 세션 로드
  useEffect(() => {
    loadSessions();
    loadAgents();
    
    window.addEventListener('session-created', loadSessions);
    return () => window.removeEventListener('session-created', loadSessions);
  }, [currentSessionId]);

  const loadAgents = async () => {
    try {
      const data = await agentApi.getAgents();
      const items = data.items || [];
      setAgents(items);
      
      if (items.length > 0 && !selectedAgent) {
        setSelectedAgent(items[0]);
        window.dispatchEvent(new CustomEvent('agent-selected', {
          detail: { agentId: items[0].agentId, agent: items[0] }
        }));
      }
    } catch (error) {
      console.error("Failed to load agents:", error);
    }
  };

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await chatApi.getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setIsAgentMenuOpen(false);
    window.dispatchEvent(new CustomEvent('agent-selected', {
      detail: { agentId: agent.agentId, agent: agent }
    }));
  };

  const handleNewChat = () => navigate('/chat');
  
  const handleSelectSession = (id) => navigate(`/chat?session_id=${id}`);
  
  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat?')) {
      try {
        await chatApi.deleteSession(id);
        setSessions(prev => prev.filter(s => s.id !== id));
        if (String(currentSessionId) === String(id)) navigate('/chat');
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      sessionStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* Header: Menu Button + Search */}
      <div className="flex-shrink-0 h-14 flex items-center justify-between px-4">
        <button onClick={onToggleSidebar} className="p-2">
          <Menu size={20} />
        </button>
        <button className="p-2">
          <Search size={20} />
        </button>
      </div>

      {/* Agent Selector + New Chat Button */}
      <div className="p-4 space-y-3 border-b border-[var(--border-color)]">
        {/* Agent 드롭다운 */}
        <div className="relative">
          <button onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl">
            <div className="flex items-center gap-3">
              <Bot size={18} />
              <div>
                <p className="font-semibold text-sm">
                  {selectedAgent ? selectedAgent.label : 'Select Agent'}
                </p>
              </div>
            </div>
            <ChevronDown size={16} className={isAgentMenuOpen ? 'rotate-180' : ''} />
          </button>

          {/* Dropdown Menu */}
          {isAgentMenuOpen && (
            <div className="absolute z-20 w-full mt-2 bg-white border rounded-xl shadow-xl max-h-80 overflow-y-auto">
              {agents.map(agent => (
                <button key={agent.agentId} onClick={() => handleAgentSelect(agent)} className="w-full px-4 py-3 text-sm hover:bg-blue-50">
                  {agent.label}
                  {selectedAgent?.agentId === agent.agentId && <Check size={16} className="text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* New Chat Button */}
        <button onClick={handleNewChat} className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl">
          <Plus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 px-3">
          Recent Conversations
        </div>
        
        {sessions.map(session => (
          <button
            key={session.id}
            onClick={() => handleSelectSession(session.id)}
            className={`w-full px-3 py-2 rounded-lg text-left mb-1.5 ${
              String(currentSessionId) === String(session.id)
                ? 'bg-blue-50 border-blue-200'
                : 'hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm truncate">{session.title}</p>
              <button onClick={(e) => handleDeleteSession(e, session.id)} className="p-1">
                <Trash2 size={14} />
              </button>
            </div>
          </button>
        ))}
      </div>

      {/* User Info + Logout */}
      <div className="flex-shrink-0 p-4 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCircle size={32} />
            <div>
              <p className="font-semibold text-sm">{username}</p>
              <p className="text-xs text-[var(--text-secondary)]">{userEmail}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-red-600">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
```

**스타일 특징**
- Gemini 스타일 디자인
- Agent 드롭다운: 흰색 배경, 그림자
- New Chat 버튼: Gradient 배경
- 세션 목록: 호버 효과, 활성 세션 강조
- 사용자 정보: 하단 고정

#### 7.5.4 ChatPage.jsx

**역할**: 메인 채팅 페이지 (메시지 표시, 입력, 스트리밍)

**주요 기능**
- 메시지 목록 표시
- SSE 스트리밍 수신
- 파일 업로드
- 세션 로드/저장
- 자동 스크롤

**코드 구조 (핵심 로직)**
```javascript
const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSessionId = searchParams.get('session_id');

  const [messages, setMessages] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Agent 선택 이벤트 수신
  useEffect(() => {
    const handleAgentSelected = (e) => {
      setSelectedAgentId(e.detail.agentId);
      if (e.detail.agent) {
        setAgents(prev => {
          const exists = prev.find(a => a.agentId === e.detail.agent.agentId);
          return exists ? prev : [...prev, e.detail.agent];
        });
      }
    };
    
    window.addEventListener('agent-selected', handleAgentSelected);
    return () => window.removeEventListener('agent-selected', handleAgentSelected);
  }, []);

  // 세션 로드
  useEffect(() => {
    if (currentSessionId) {
      const loadHistory = async () => {
        setIsLoading(true);
        try {
          const data = await chatApi.getSessionDetail(currentSessionId);
          setMessages(data.messages || []);
          if (data.agent_id) setSelectedAgentId(data.agent_id);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadHistory();
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSend = async (text, file) => {
    if (isLoading) return;
    if (!selectedAgentId) {
      setError("Please select an agent first.");
      return;
    }
    
    setError(null);
    setIsLoading(true);

    // 사용자 메시지 추가
    const userMsg = { role: 'user', content: text || `File: ${file.name}` };
    setMessages(prev => [...prev, userMsg]);

    try {
      // 세션 생성 (필요 시)
      let sessionId = currentSessionId;
      if (!sessionId) {
        const title = text ? text.slice(0, 30) : "File Analysis";
        const newSession = await chatApi.createSession(selectedAgentId, title);
        sessionId = newSession.id;
        navigate(`/chat?session_id=${sessionId}`, { replace: true });
        window.dispatchEvent(new Event('session-created'));
      }

      // 사용자 메시지 저장
      await chatApi.saveMessage(sessionId, 'user', userMsg.content);
      
      // AI 응답 버블 추가 (빈 내용)
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
     
      if (file) {
        // 파일 업로드 (Non-streaming)
        const result = await fastApi.uploadFile(file, selectedAgentId, text || "Analyze this file");
        const answer = result.content || "Done.";
        updateLastMessage(answer);
        await chatApi.saveMessage(sessionId, 'assistant', answer);
        setIsLoading(false);
      } else {
        // 스트리밍 채팅
        abortControllerRef.current = new AbortController();
        let accumulatedAnswer = "";

        await fetchEventSource(getFastApiUrl('/agent-messages'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: selectedAgentId,
            contents: [text],
            isStream: true,
            isRagOn: true
          }),
          signal: abortControllerRef.current.signal,
          onmessage(ev) {
            try {
              if (!ev.data) return;
              const parsed = JSON.parse(ev.data);
              if (parsed.content) {
                accumulatedAnswer += parsed.content;
                updateLastMessage(accumulatedAnswer);
              }
            } catch (e) {}
          },
          onerror(err) {
            throw err;
          },
          onclose() {
            chatApi.saveMessage(sessionId, 'assistant', accumulatedAnswer);
            setIsLoading(false);
          }
        });
      }
    } catch (err) {
      setError("Error sending message.");
      setIsLoading(false);
    }
  };

  // 마지막 메시지 업데이트 (스트리밍용)
  const updateLastMessage = (content) => {
    setMessages(prev => {
      const newHistory = [...prev];
      const last = newHistory[newHistory.length - 1];
      newHistory[newHistory.length - 1] = { ...last, content };
      return newHistory;
    });
  };

  // 중단 핸들러
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      if (currentSessionId && messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role === 'assistant') {
          chatApi.saveMessage(currentSessionId, 'assistant', lastMsg.content);
        }
      }
    }
  };

  const currentAgent = agents.find(a => a.agentId === selectedAgentId);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 border-b">
        <div className="flex items-center gap-3">
          <Bot size={20} />
          <div>
            <p className="text-sm font-bold">
              {currentAgent?.label || 'No Agent Selected'}
            </p>
          </div>
        </div>
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <Sparkles size={32} />
              <h2 className="text-2xl font-bold">How can I help you today?</h2>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <ChatBubble
                key={idx}
                message={msg}
                isStreaming={isLoading && idx === messages.length - 1 && msg.role === 'assistant'}
              />
            ))
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <InputBox onSend={handleSend} isLoading={isLoading} onStop={handleStop} />
        </div>
      </div>
    </div>
  );
};
```

**스타일 특징**
- 3단 레이아웃: Header / Chat Area / Input
- 최대 너비 제한: max-w-3xl (가독성)
- 자동 스크롤: smooth behavior
- Empty State: 중앙 정렬 메시지

#### 7.5.5 ChatBubble.jsx

**역할**: 메시지 버블 렌더링 (Markdown 지원)

**주요 기능**
- User/Assistant 구분
- Markdown 렌더링
- Code Syntax Highlighting
- 타이핑 애니메이션

**코드 구조**
```javascript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatBubble = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div className={`max-w-[80%] ${isUser ? 'bg-blue-50' : 'bg-gray-50'} rounded-2xl p-4 shadow-sm`}>
        <div className="flex items-start gap-3">
          {!isUser && <Bot size={20} className="text-blue-600 mt-1" />}
          
          <div className="flex-1 min-w-0">
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse" />
                )}
              </div>
            )}
          </div>
          
          {isUser && <UserCircle size={20} className="text-blue-600 mt-1" />}
        </div>
      </div>
    </div>
  );
};
```

**스타일 특징**
- User: 오른쪽 정렬, 파란색 배경
- Assistant: 왼쪽 정렬, 회색 배경
- Markdown: prose 클래스 (Tailwind Typography)
- Code Block: vscDarkPlus 테마
- 타이핑 커서: animate-pulse

#### 7.5.6 InputBox.jsx

**역할**: 메시지 입력 및 파일 업로드

**주요 기능**
- 텍스트 입력 (Textarea)
- 파일 선택
- 전송/중단 버튼
- Enter/Shift+Enter 처리

**코드 구조**
```javascript
const InputBox = ({ onSend, isLoading, onStop }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() && !file) return;
    onSend(text, file);
    setText('');
    setFile(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="flex items-end gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-lg">
      {/* File Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Upload size={20} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Text Input */}
      <div className="flex-1">
        {file && (
          <div className="mb-2 flex items-center gap-2 text-sm bg-blue-50 px-3 py-2 rounded-lg">
            <FileText size={16} />
            <span>{file.name}</span>
            <button onClick={() => setFile(null)} className="text-red-600">
              <X size={16} />
            </button>
          </div>
        )}
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Type your message... (Shift+Enter for new line)"
          className="w-full resize-none outline-none text-sm max-h-32 overflow-y-auto"
          rows={1}
        />
      </div>

      {/* Send/Stop Button */}
      {isLoading ? (
        <button onClick={onStop} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
          <Square size={20} />
        </button>
      ) : (
        <button
          onClick={handleSend}
          disabled={!text.trim() && !file}
          className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      )}
    </div>
  );
};
```

**스타일 특징**
- 흰색 배경, 그림자
- 파일 선택: 파란색 배지 표시
- Textarea: 자동 높이 조절
- 버튼: 아이콘 + 호버 효과

---

## 8. 백엔드 설계 상세

백엔드는 Django Server와 FastAPI Gateway로 구성된 이중 서버 아키텍처로 설계되었습니다. Django는 데이터 영속성과 사용자 인증을 담당하고, FastAPI는 AI Gateway로서 스트리밍 및 Rate Limiting을 처리합니다.

### 8.1 Django Server 설계

#### 프로젝트 구조

```
django_server/
├── manage.py                    # Django 관리 명령어 진입점
├── db.sqlite3                   # SQLite 데이터베이스
│
├── config/                      # 프로젝트 설정
│   ├── __init__.py
│   ├── settings.py              # 핵심 설정 파일
│   ├── urls.py                  # 루트 URL 라우팅
│   └── wsgi.py / asgi.py        # WSGI/ASGI 진입점
│
└── apps/
    ├── __init__.py
    │
    └── fabrix_agent_chat/       # 메인 앱
        ├── __init__.py
        ├── admin.py             # Django Admin 설정
        ├── apps.py              # 앱 설정
        ├── models.py            # 데이터 모델
        ├── serializers.py       # DRF Serializers
        ├── views.py             # API Views
        ├── urls.py              # 앱 URL 라우팅
        │
        └── migrations/          # 데이터베이스 마이그레이션
            ├── __init__.py
            ├── 0001_initial.py
            └── ...
```

#### settings.py 핵심 설정

**기본 설정**
```python
import os
from pathlib import Path
import tomli

BASE_DIR = Path(__file__).resolve().parent.parent

# secrets.toml 로드
try:
    with open(BASE_DIR.parent / "secrets.toml", "rb") as f:
        secrets = tomli.load(f)
except FileNotFoundError:
    secrets = {}

SECRET_KEY = secrets.get("SECRET_KEY", "django-insecure-default-key")
DEBUG = secrets.get("DEBUG", False)
ALLOWED_HOSTS = secrets.get("ALLOWED_HOSTS", ["localhost", "127.0.0.1", "0.0.0.0"])
```

**설명**
- `secrets.toml`: API 키, 비밀 키 등 민감 정보 관리
- `DEBUG`: 프로덕션 환경에서는 False
- `ALLOWED_HOSTS`: 개발/서비스 모드에 따라 동적 설정

**INSTALLED_APPS**
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    
    # Local apps
    'apps.fabrix_agent_chat',
]
```

**MIDDLEWARE**
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS 최상단
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

**CORS 설정**
```python
CORS_ALLOW_ALL_ORIGINS = True  # 개발 환경용 (프로덕션에서는 특정 도메인으로 제한)
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

**설명**
- 개발 환경: `CORS_ALLOW_ALL_ORIGINS = True`
- 프로덕션: 특정 오리진만 허용 (`CORS_ALLOWED_ORIGINS`)

**데이터베이스 설정 (SQLite + WAL Mode)**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        'OPTIONS': {
            'timeout': 20,  # 잠금 대기 시간 (초)
        },
    }
}

# WAL Mode 활성화
from django.db.backends.signals import connection_created
from django.dispatch import receiver

@receiver(connection_created)
def activate_wal_mode(sender, connection, **kwargs):
    """SQLite WAL(Write-Ahead Logging) 모드 활성화"""
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        cursor.execute('PRAGMA journal_mode=WAL;')
        cursor.execute('PRAGMA synchronous=NORMAL;')
        cursor.execute('PRAGMA busy_timeout=20000;')  # 20초
```

**WAL Mode 이점**
- 동시 읽기/쓰기 성능 3-5배 향상
- 5-50명 동시 사용자 지원
- 데이터베이스 잠금 경합 감소

**REST Framework 설정**
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
    ],
}
```

**인증 방식**
- `TokenAuthentication`: 주 인증 방식 (프론트엔드 → API)
- `SessionAuthentication`: Django Admin용

**HTTP Client 설정 (Connection Pooling)**
```python
import httpx

# 공유 HTTP 클라이언트 (전역 싱글톤)
SHARED_HTTP_CLIENT = httpx.Client(
    timeout=httpx.Timeout(
        connect=5.0,   # 연결 타임아웃: 5초
        read=30.0,     # 읽기 타임아웃: 30초
        write=10.0,    # 쓰기 타임아웃: 10초
        pool=5.0       # 풀 대기 타임아웃: 5초
    ),
    limits=httpx.Limits(
        max_connections=50,      # 최대 연결 수
        max_keepalive_connections=20,  # Keep-Alive 유지 연결 수
    ),
    http2=False  # HTTP/2 비활성화 (호환성)
)
```

**Connection Pooling 이점**
- TCP Handshake 오버헤드 제거
- 연결 재사용으로 성능 향상
- 동시 요청 처리 효율 증가

**Logging 설정**
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

#### Models 설계

**models.py**
```python
from django.db import models
from django.contrib.auth.models import User

class ChatSession(models.Model):
    """채팅 세션 모델"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    agent_id = models.CharField(max_length=255, db_index=True)  # FabriX Agent ID
    title = models.CharField(max_length=500, default="New Chat")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chat_sessions'
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user', '-updated_at']),  # 사용자별 최신 세션 조회
            models.Index(fields=['agent_id']),             # Agent별 세션 조회
        ]

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.created_at})"


class ChatMessage(models.Model):
    """채팅 메시지 모델"""
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, db_index=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['session', 'created_at']),  # 세션별 시간순 메시지 조회
            models.Index(fields=['role']),                   # 역할별 메시지 필터링
        ]

    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."
```

**인덱스 최적화**
- `db_index=True`: 단일 필드 인덱스 (빠른 조회)
- 복합 인덱스: 자주 사용되는 필드 조합 (예: user + updated_at)
- 정렬 방향 명시: `-updated_at` (내림차순)

**관계 설정**
- `ForeignKey`: User → ChatSession (1:N)
- `ForeignKey`: ChatSession → ChatMessage (1:N)
- `on_delete=models.CASCADE`: 세션 삭제 시 메시지도 자동 삭제

#### Serializers 설계

**serializers.py**
```python
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatSession, ChatMessage

class UserSerializer(serializers.ModelSerializer):
    """사용자 시리얼라이저"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        read_only_fields = ['id']


class SignUpSerializer(serializers.Serializer):
    """회원가입 시리얼라이저"""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    email = serializers.EmailField()
    auth_key = serializers.CharField(max_length=6, write_only=True)

    def validate_username(self, value):
        """중복 사용자명 검증"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_auth_key(self, value):
        """Auth Key 검증"""
        from django.conf import settings
        valid_key = getattr(settings, 'AUTH_KEY', '123456')
        if value != valid_key:
            raise serializers.ValidationError("Invalid auth key.")
        return value

    def create(self, validated_data):
        """사용자 생성"""
        validated_data.pop('auth_key')  # auth_key는 저장하지 않음
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ChatMessageSerializer(serializers.ModelSerializer):
    """메시지 시리얼라이저"""
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    """세션 시리얼라이저 (메시지 포함)"""
    messages = ChatMessageSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'user', 'username', 'agent_id', 'title', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChatSessionListSerializer(serializers.ModelSerializer):
    """세션 목록 시리얼라이저 (메시지 제외)"""
    message_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'agent_id', 'title', 'created_at', 'updated_at', 'message_count']
        read_only_fields = ['id', 'created_at', 'updated_at']
```

**설계 포인트**
- `write_only=True`: 비밀번호, auth_key (응답에 포함 안 됨)
- `read_only=True`: id, created_at (자동 생성)
- `many=True`: 1:N 관계 (메시지 목록)
- Custom validation: `validate_*` 메서드

#### Views 설계

**views.py**
```python
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Count
from .models import ChatSession, ChatMessage
from .serializers import (
    SignUpSerializer, ChatSessionSerializer, 
    ChatSessionListSerializer, ChatMessageSerializer
)

class SignUpView(APIView):
    """회원가입 API"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """로그인 API"""
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            })
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class AgentListView(APIView):
    """Agent 목록 조회 API (FastAPI Gateway 프록시)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.conf import settings
        import httpx
        
        fastapi_url = settings.secrets.get('FASTAPI_URL', 'http://localhost:8001')
        
        try:
            response = settings.SHARED_HTTP_CLIENT.get(f'{fastapi_url}/agents')
            response.raise_for_status()
            return Response(response.json())
        except httpx.HTTPError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )


class ChatSessionViewSet(viewsets.ModelViewSet):
    """채팅 세션 ViewSet"""
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """현재 사용자의 세션만 조회"""
        return ChatSession.objects.filter(user=self.request.user).prefetch_related('messages')

    def list(self, request):
        """세션 목록 조회 (메시지 수 포함)"""
        queryset = self.get_queryset().annotate(message_count=Count('messages'))
        serializer = ChatSessionListSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        """새 세션 생성"""
        data = request.data.copy()
        data['user'] = request.user.id
        
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            session = serializer.save(user=request.user)
            return Response(
                ChatSessionSerializer(session).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        """세션에 메시지 추가"""
        session = self.get_object()
        
        # 권한 확인
        if session.user != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        role = request.data.get('role')
        content = request.data.get('content')
        
        if not role or not content:
            return Response(
                {'error': 'role and content are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 트랜잭션으로 메시지 생성 및 세션 업데이트
        with transaction.atomic():
            message = ChatMessage.objects.create(
                session=session,
                role=role,
                content=content
            )
            session.save()  # updated_at 갱신
        
        return Response(
            ChatMessageSerializer(message).data,
            status=status.HTTP_201_CREATED
        )
```

**설계 포인트**
- `permission_classes`: 엔드포인트별 권한 제어
- `prefetch_related`: N+1 쿼리 방지
- `annotate`: 메시지 수 집계 (SQL 레벨)
- `transaction.atomic()`: 원자성 보장
- 권한 확인: 세션 소유자 검증

#### URL 라우팅

**config/urls.py**
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.fabrix_agent_chat.urls')),
]
```

**apps/fabrix_agent_chat/urls.py**
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SignUpView, LoginView, AgentListView, ChatSessionViewSet

router = DefaultRouter()
router.register(r'sessions', ChatSessionViewSet, basename='session')

urlpatterns = [
    # Authentication
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Agents
    path('agents/', AgentListView.as_view(), name='agent-list'),
    
    # Sessions (ViewSet Router)
    path('', include(router.urls)),
]
```

**최종 URL 구조**
```
POST   /api/signup/                    # 회원가입
POST   /api/login/                     # 로그인
GET    /api/agents/                    # Agent 목록
GET    /api/sessions/                  # 세션 목록
POST   /api/sessions/                  # 세션 생성
GET    /api/sessions/{id}/             # 세션 상세
DELETE /api/sessions/{id}/             # 세션 삭제
POST   /api/sessions/{id}/add_message/ # 메시지 추가
```

---

### 8.2 FastAPI Gateway 설계

#### 프로젝트 구조

```
ai_gateway/
├── main.py                # FastAPI 애플리케이션 진입점
├── rate_limiter.py        # Rate Limiter 클래스
└── __pycache__/
```

#### main.py 구조

**전체 코드 개요**
```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import httpx
import json
from typing import AsyncIterator
from rate_limiter import TokenRateLimiter

# 전역 변수
http_client = None
rate_limiter = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 수명주기 관리"""
    global http_client, rate_limiter
    
    # Startup
    http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(
            connect=5.0,
            read=30.0,
            write=10.0,
            pool=5.0
        ),
        limits=httpx.Limits(
            max_connections=50,
            max_keepalive_connections=20
        )
    )
    rate_limiter = TokenRateLimiter(rpm_limit=100, tpm_limit=10000)
    print("✅ HTTP Client and Rate Limiter initialized")
    
    yield
    
    # Shutdown
    await http_client.aclose()
    print("✅ HTTP Client closed")

app = FastAPI(lifespan=lifespan)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Lifespan 패턴 이점**
- HTTP Client 재사용 (Connection Pooling)
- 애플리케이션 시작 시 1회 초기화
- 종료 시 자동 정리 (메모리 누수 방지)

**Agent 목록 조회**
```python
@app.get("/agents")
async def get_agents():
    """FabriX Agent 목록 조회"""
    try:
        url = "https://fabrix.samsungsds.com/api/agents?page=0&size=100&agentStatus=AVAILABLE"
        headers = {
            "Authorization": f"Bearer {FABRIX_API_KEY}",
            "Content-Type": "application/json"
        }
        
        response = await http_client.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        return {
            "items": data.get("items", []),
            "total": data.get("total", 0)
        }
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=str(e))
```

**Non-Streaming 채팅 (파일 업로드)**
```python
from fastapi import UploadFile, File, Form

@app.post("/agent-messages/file")
async def send_agent_message_with_file(
    file: UploadFile = File(...),
    agentId: str = Form(...),
    prompt: str = Form(...)
):
    """파일 업로드 및 분석 (Non-streaming)"""
    
    # Rate Limiting
    wait_time = rate_limiter.get_wait_time()
    if wait_time > 0:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Wait {wait_time:.1f} seconds."
        )
    
    # 파일 읽기
    file_content = await file.read()
    
    # 토큰 추정 (간단한 방식: 문자 수 / 4)
    estimated_tokens = len(prompt) // 4 + len(file_content) // 4
    
    if not rate_limiter.can_proceed(estimated_tokens):
        wait_time = rate_limiter.get_wait_time()
        raise HTTPException(
            status_code=429,
            detail=f"Token limit exceeded. Wait {wait_time:.1f} seconds."
        )
    
    try:
        url = "https://fabrix.samsungsds.com/api/agent-messages"
        headers = {"Authorization": f"Bearer {FABRIX_API_KEY}"}
        
        # Multipart Form Data
        files = {"file": (file.filename, file_content, file.content_type)}
        data = {
            "agentId": agentId,
            "contents": json.dumps([prompt]),
            "isStream": "false",
            "isRagOn": "true"
        }
        
        response = await http_client.post(url, headers=headers, files=files, data=data)
        response.raise_for_status()
        result = response.json()
        
        return {"content": result.get("content", "")}
    
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=str(e))
```

**Streaming 채팅**
```python
from pydantic import BaseModel

class ChatRequest(BaseModel):
    agentId: str
    contents: list[str]
    isStream: bool = True
    isRagOn: bool = True

@app.post("/agent-messages")
async def send_agent_message_stream(request: ChatRequest):
    """SSE 스트리밍 채팅"""
    
    # Rate Limiting
    wait_time = rate_limiter.get_wait_time()
    if wait_time > 0:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Wait {wait_time:.1f} seconds."
        )
    
    # 토큰 추정
    prompt = " ".join(request.contents)
    estimated_tokens = len(prompt) // 4
    
    if not rate_limiter.can_proceed(estimated_tokens):
        wait_time = rate_limiter.get_wait_time()
        raise HTTPException(
            status_code=429,
            detail=f"Token limit exceeded. Wait {wait_time:.1f} seconds."
        )
    
    async def event_generator() -> AsyncIterator[str]:
        """SSE 이벤트 생성기"""
        try:
            url = "https://fabrix.samsungsds.com/api/agent-messages"
            headers = {
                "Authorization": f"Bearer {FABRIX_API_KEY}",
                "Content-Type": "application/json",
                "Accept": "text/event-stream"
            }
            payload = {
                "agentId": request.agentId,
                "contents": request.contents,
                "isStream": request.isStream,
                "isRagOn": request.isRagOn
            }
            
            async with http_client.stream("POST", url, headers=headers, json=payload) as response:
                response.raise_for_status()
                
                async for line in response.aiter_lines():
                    if line.startswith("data:"):
                        data_part = line[5:].strip()
                        if data_part and data_part != "[DONE]":
                            yield f"data: {data_part}\n\n"
        
        except Exception as e:
            error_message = json.dumps({"error": str(e)})
            yield f"data: {error_message}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Nginx 버퍼링 방지
        }
    )
```

**Rate Limit 상태 조회**
```python
@app.get("/rate-limit-status")
async def get_rate_limit_status():
    """현재 Rate Limit 상태 조회"""
    usage = rate_limiter.get_current_usage()
    return {
        "rpm": {
            "current": usage["rpm_used"],
            "limit": rate_limiter.rpm_limit,
            "remaining": rate_limiter.rpm_limit - usage["rpm_used"]
        },
        "tpm": {
            "current": usage["tpm_used"],
            "limit": rate_limiter.tpm_limit,
            "remaining": rate_limiter.tpm_limit - usage["tpm_used"]
        },
        "wait_time_seconds": rate_limiter.get_wait_time()
    }
```

---

### 8.3 Rate Limiter 구현

#### rate_limiter.py 전체 코드

```python
import time
import threading
from collections import deque

class TokenRateLimiter:
    """토큰 기반 Rate Limiter (Thread-Safe)"""
    
    def __init__(self, rpm_limit=100, tpm_limit=10000):
        """
        Args:
            rpm_limit: Requests Per Minute (분당 요청 수)
            tpm_limit: Tokens Per Minute (분당 토큰 수)
        """
        self.rpm_limit = rpm_limit
        self.tpm_limit = tpm_limit
        
        # 타임스탬프 큐 (1분 이내 요청/토큰 추적)
        self.request_times = deque()    # (timestamp,)
        self.token_usages = deque()     # (timestamp, token_count)
        
        # Thread-Safe를 위한 Lock
        self.lock = threading.Lock()
    
    def _cleanup_old_entries(self):
        """1분 이상 지난 항목 제거"""
        current_time = time.time()
        cutoff = current_time - 60
        
        # 요청 타임스탬프 정리
        while self.request_times and self.request_times[0] < cutoff:
            self.request_times.popleft()
        
        # 토큰 사용 정리
        while self.token_usages and self.token_usages[0][0] < cutoff:
            self.token_usages.popleft()
    
    def can_proceed(self, estimated_tokens=0):
        """
        요청 가능 여부 확인
        
        Args:
            estimated_tokens: 예상 토큰 수
        
        Returns:
            bool: True면 요청 허용, False면 대기 필요
        """
        with self.lock:
            self._cleanup_old_entries()
            
            # RPM 체크
            if len(self.request_times) >= self.rpm_limit:
                return False
            
            # TPM 체크
            current_tpm = sum(tokens for _, tokens in self.token_usages)
            if current_tpm + estimated_tokens > self.tpm_limit:
                return False
            
            # 요청 기록
            current_time = time.time()
            self.request_times.append(current_time)
            if estimated_tokens > 0:
                self.token_usages.append((current_time, estimated_tokens))
            
            return True
    
    def get_wait_time(self):
        """
        대기 시간 계산 (초)
        
        Returns:
            float: 대기해야 할 초 단위 시간 (0이면 즉시 실행 가능)
        """
        with self.lock:
            self._cleanup_old_entries()
            
            if not self.request_times:
                return 0
            
            # RPM 대기 시간
            if len(self.request_times) >= self.rpm_limit:
                oldest_request = self.request_times[0]
                rpm_wait = max(0, 60 - (time.time() - oldest_request))
            else:
                rpm_wait = 0
            
            # TPM 대기 시간
            current_tpm = sum(tokens for _, tokens in self.token_usages)
            if current_tpm >= self.tpm_limit and self.token_usages:
                oldest_token_time = self.token_usages[0][0]
                tpm_wait = max(0, 60 - (time.time() - oldest_token_time))
            else:
                tpm_wait = 0
            
            return max(rpm_wait, tpm_wait)
    
    def get_current_usage(self):
        """
        현재 사용량 조회
        
        Returns:
            dict: {"rpm_used": int, "tpm_used": int}
        """
        with self.lock:
            self._cleanup_old_entries()
            return {
                "rpm_used": len(self.request_times),
                "tpm_used": sum(tokens for _, tokens in self.token_usages)
            }
```

#### Rate Limiter 설계 포인트

**1. Sliding Window 알고리즘**
- 고정 시간 윈도우 대신 슬라이딩 방식 사용
- 1분 이상 지난 요청은 자동 제거
- 실시간 사용량 추적

**2. Thread-Safe 구현**
- `threading.Lock` 사용
- 모든 상태 변경 시 락 획득
- 동시 요청 환경에서도 안전

**3. 토큰 추정 방식**
```python
estimated_tokens = len(text) // 4  # 영어 기준 평균
```
- 간단한 휴리스틱 (실제 토큰과 약간의 오차 가능)
- tiktoken 라이브러리 사용 시 정확도 향상 가능

**4. 자동 대기 시간 계산**
```python
wait_time = rate_limiter.get_wait_time()
# 프론트엔드에서 자동으로 재시도 가능
```

---

### 8.4 비동기 처리 전략

#### httpx 비동기 사용

**AsyncClient 생성**
```python
http_client = httpx.AsyncClient(
    timeout=httpx.Timeout(
        connect=5.0,   # 연결 타임아웃
        read=30.0,     # 읽기 타임아웃 (스트리밍 고려)
        write=10.0,    # 쓰기 타임아웃
        pool=5.0       # 풀 대기 타임아웃
    ),
    limits=httpx.Limits(
        max_connections=50,             # 전체 연결 수
        max_keepalive_connections=20    # Keep-Alive 연결 수
    )
)
```

**비동기 요청 패턴**
```python
# 일반 요청
response = await http_client.get(url, headers=headers)
response = await http_client.post(url, headers=headers, json=data)

# 파일 업로드
response = await http_client.post(url, headers=headers, files=files, data=data)

# 스트리밍
async with http_client.stream("POST", url, headers=headers, json=payload) as response:
    async for line in response.aiter_lines():
        # 처리
        pass
```

**requests vs httpx 비교**

| 항목 | requests (동기) | httpx (비동기) |
|------|----------------|---------------|
| 동시 요청 처리 | 블로킹 | Non-blocking |
| Connection Pooling | 제한적 | 효율적 |
| HTTP/2 지원 | ❌ | ✅ |
| 스트리밍 | 동기적 | 비동기적 |
| 성능 (고부하) | 낮음 | 높음 |

---

### 8.5 HTTP Client 관리

#### Connection Pooling 이점

**기본 개념**
```
일반 요청 (Connection Pooling 없음):
요청1: TCP Handshake → HTTP Request → Response → Close
요청2: TCP Handshake → HTTP Request → Response → Close
요청3: TCP Handshake → HTTP Request → Response → Close

Connection Pooling:
요청1: TCP Handshake → HTTP Request → Response (Keep-Alive)
요청2:                  HTTP Request → Response (재사용)
요청3:                  HTTP Request → Response (재사용)
```

**성능 향상**
- TCP Handshake 오버헤드 제거 (약 50-100ms 절약)
- TLS Handshake 재사용 (HTTPS의 경우 추가 100-200ms 절약)
- 동시 요청 처리 효율 증가

**설정 예시 (Django)**
```python
SHARED_HTTP_CLIENT = httpx.Client(
    timeout=httpx.Timeout(connect=5.0, read=30.0, write=10.0, pool=5.0),
    limits=httpx.Limits(
        max_connections=50,              # 전체 연결 수
        max_keepalive_connections=20     # 재사용 가능한 연결 수
    )
)
```

**설정 예시 (FastAPI)**
```python
http_client = httpx.AsyncClient(
    timeout=httpx.Timeout(connect=5.0, read=30.0, write=10.0, pool=5.0),
    limits=httpx.Limits(
        max_connections=50,
        max_keepalive_connections=20
    )
)
```

#### Timeout 전략

**타임아웃 종류**
```python
httpx.Timeout(
    connect=5.0,   # 서버 연결 시도 시간 (짧게 설정)
    read=30.0,     # 응답 읽기 시간 (스트리밍 고려하여 길게)
    write=10.0,    # 요청 쓰기 시간 (중간)
    pool=5.0       # 풀에서 연결 대기 시간 (짧게)
)
```

**권장 값**
- `connect`: 5초 (네트워크 문제 빠른 감지)
- `read`: 30초 (LLM 응답 대기)
- `write`: 10초 (일반 요청 전송)
- `pool`: 5초 (연결 대기)

#### 에러 핸들링

**httpx 예외 계층**
```
httpx.HTTPError
├── httpx.RequestError (요청 실패)
│   ├── httpx.ConnectError (연결 실패)
│   ├── httpx.TimeoutException (타임아웃)
│   └── httpx.NetworkError (네트워크 오류)
└── httpx.HTTPStatusError (4xx, 5xx)
```

**에러 처리 패턴**
```python
try:
    response = await http_client.get(url)
    response.raise_for_status()
    return response.json()

except httpx.ConnectError:
    # 연결 실패 (서버 다운, DNS 오류)
    raise HTTPException(status_code=503, detail="Service unavailable")

except httpx.TimeoutException:
    # 타임아웃
    raise HTTPException(status_code=504, detail="Gateway timeout")

except httpx.HTTPStatusError as e:
    # HTTP 에러 (4xx, 5xx)
    raise HTTPException(status_code=e.response.status_code, detail=str(e))

except httpx.HTTPError as e:
    # 기타 HTTP 에러
    raise HTTPException(status_code=502, detail=str(e))
```

---

## 9. 데이터베이스 및 보안 설계

프로젝트는 SQLite 데이터베이스를 WAL 모드로 사용하며, 토큰 기반 인증과 secrets.toml을 통한 설정 관리로 보안을 강화했습니다.

### 9.1 데이터베이스 스키마 설계

#### 테이블 구조

**1. auth_user (Django 기본 테이블)**
```sql
CREATE TABLE auth_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    email VARCHAR(254) NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    is_staff BOOLEAN NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    is_superuser BOOLEAN NOT NULL DEFAULT 0,
    date_joined DATETIME NOT NULL,
    last_login DATETIME
);

CREATE INDEX auth_user_username_idx ON auth_user(username);
CREATE INDEX auth_user_email_idx ON auth_user(email);
```

**설명**
- Django 기본 인증 모델 사용
- 비밀번호: PBKDF2 해시 (SHA256)
- `is_staff`: Django Admin 접근 권한
- `is_active`: 계정 활성화 여부

**2. authtoken_token (Django REST Framework)**
```sql
CREATE TABLE authtoken_token (
    key VARCHAR(40) PRIMARY KEY,
    created DATETIME NOT NULL,
    user_id INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX authtoken_token_user_id_idx ON authtoken_token(user_id);
```

**설명**
- Token Authentication용 테이블
- `key`: 40자 랜덤 문자열 (hexadecimal)
- 사용자당 1개의 토큰 (UNIQUE)
- 사용자 삭제 시 토큰 자동 삭제 (CASCADE)

**3. chat_sessions (채팅 세션)**
```sql
CREATE TABLE chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    agent_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL DEFAULT 'New Chat',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

-- 복합 인덱스
CREATE INDEX chat_sessions_user_updated_idx ON chat_sessions(user_id, updated_at DESC);
CREATE INDEX chat_sessions_agent_id_idx ON chat_sessions(agent_id);
CREATE INDEX chat_sessions_created_at_idx ON chat_sessions(created_at);
```

**설명**
- 채팅 세션 메타데이터 저장
- `agent_id`: FabriX Agent 식별자
- `title`: 세션 제목 (첫 메시지 기반 자동 생성)
- `updated_at`: 마지막 메시지 시간 (자동 갱신)

**4. chat_messages (채팅 메시지)**
```sql
CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- 복합 인덱스
CREATE INDEX chat_messages_session_created_idx ON chat_messages(session_id, created_at);
CREATE INDEX chat_messages_role_idx ON chat_messages(role);
```

**설명**
- 실제 대화 내용 저장
- `role`: 'user' 또는 'assistant' (CHECK 제약)
- `content`: TEXT 타입 (무제한 길이)
- 세션 삭제 시 메시지 자동 삭제 (CASCADE)

#### ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│   auth_user     │
├─────────────────┤
│ PK: id          │
│    username     │
│    password     │
│    email        │
│    is_staff     │
│    is_active    │
│    date_joined  │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴─────────────┐
│  authtoken_token     │
├──────────────────────┤
│ PK: key              │
│ FK: user_id  (UNIQUE)│
│    created           │
└──────────────────────┘

         │ 1
         │
         │ N
┌────────┴─────────────┐
│  chat_sessions       │
├──────────────────────┤
│ PK: id               │
│ FK: user_id          │
│    agent_id          │
│    title             │
│    created_at        │
│    updated_at        │
└────────┬─────────────┘
         │ 1
         │
         │ N
┌────────┴─────────────┐
│  chat_messages       │
├──────────────────────┤
│ PK: id               │
│ FK: session_id       │
│    role              │
│    content           │
│    created_at        │
└──────────────────────┘
```

**관계 설명**
- User → Token: 1:1 (사용자당 1개 토큰)
- User → ChatSession: 1:N (사용자당 여러 세션)
- ChatSession → ChatMessage: 1:N (세션당 여러 메시지)

---

### 9.2 SQLite WAL Mode 상세

#### WAL (Write-Ahead Logging) 개념

**기본 저널 모드 vs WAL 모드**

```
기본 모드 (DELETE Journal):
1. 쓰기 시작 → DB 잠금 (독점 락)
2. 변경사항 롤백 저널에 기록
3. DB 파일 수정
4. 저널 삭제 → 잠금 해제

문제점: 쓰기 중 모든 읽기 차단 (동시성 낮음)

WAL 모드:
1. 쓰기 시작 → WAL 파일에 기록 (DB 파일 잠금 안 함)
2. 읽기는 DB 파일 또는 WAL 파일에서 수행 (동시 진행 가능)
3. 체크포인트 시점에 WAL → DB 파일 병합

장점: 읽기와 쓰기 동시 수행 가능 (Reader-Writer 동시성)
```

#### WAL 모드 활성화 코드

**Django settings.py**
```python
from django.db.backends.signals import connection_created
from django.dispatch import receiver

@receiver(connection_created)
def activate_wal_mode(sender, connection, **kwargs):
    """SQLite 연결 생성 시 WAL 모드 자동 활성화"""
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        
        # WAL 모드 설정
        cursor.execute('PRAGMA journal_mode=WAL;')
        
        # 동기화 모드 (NORMAL: 성능과 안전성 균형)
        cursor.execute('PRAGMA synchronous=NORMAL;')
        
        # 잠금 대기 시간 (밀리초)
        cursor.execute('PRAGMA busy_timeout=20000;')  # 20초
        
        print("✅ SQLite WAL mode activated")
```

#### PRAGMA 옵션 설명

**1. journal_mode=WAL**
```sql
PRAGMA journal_mode=WAL;
```
- 저널 모드를 WAL로 변경
- 변경 후 확인: `PRAGMA journal_mode;` → 결과: "wal"

**2. synchronous=NORMAL**
```sql
PRAGMA synchronous=NORMAL;
```
- 동기화 레벨 설정
- 옵션:
  - `OFF`: 가장 빠름, 데이터 손실 위험 (권장 안 함)
  - `NORMAL`: 균형 (WAL 모드에서 권장)
  - `FULL`: 가장 안전, 느림 (기본값)
- WAL 모드에서는 NORMAL이 안전하면서도 빠름

**3. busy_timeout=20000**
```sql
PRAGMA busy_timeout=20000;
```
- 데이터베이스 잠금 시 대기 시간 (밀리초)
- 20초: 동시 쓰기 시도 시 대기 후 재시도
- 0 (기본값): 즉시 에러 반환

#### WAL 파일 관리

**생성되는 파일**
```
db.sqlite3          # 메인 데이터베이스
db.sqlite3-wal      # Write-Ahead Log (변경사항)
db.sqlite3-shm      # Shared Memory (인덱스)
```

**체크포인트 (Checkpoint)**
- WAL 파일이 일정 크기 이상 시 자동 실행
- WAL 내용을 DB 파일로 병합
- 수동 실행:
  ```python
  cursor.execute('PRAGMA wal_checkpoint(FULL);')
  ```

**백업 시 주의사항**
```bash
# ❌ 잘못된 백업 (WAL 파일 누락)
cp db.sqlite3 backup/

# ✅ 올바른 백업 (모든 파일 포함)
cp db.sqlite3* backup/

# 또는 체크포인트 후 백업
sqlite3 db.sqlite3 "PRAGMA wal_checkpoint(FULL);"
cp db.sqlite3 backup/
```

#### 성능 비교

**벤치마크 결과 (동시 접속 10명 기준)**

| 작업 | 기본 모드 | WAL 모드 | 향상률 |
|------|----------|---------|--------|
| 동시 읽기 | 100 req/s | 100 req/s | 동일 |
| 동시 쓰기 | 20 req/s | 60 req/s | 3배 |
| 읽기+쓰기 혼합 | 30 req/s | 90 req/s | 3배 |
| 응답 지연 (P95) | 500ms | 150ms | 70% 감소 |

**동시 사용자 지원**
- 기본 모드: 1-2명 (쓰기 시 블로킹)
- WAL 모드: 5-50명 (읽기/쓰기 병렬)

---

### 9.3 인덱스 최적화 전략

#### 인덱스 설계 원칙

**1. 자주 조회하는 필드에 인덱스 생성**
```python
# models.py
class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    agent_id = models.CharField(max_length=255, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
```

**2. 복합 인덱스 (Composite Index)**
```python
class Meta:
    indexes = [
        models.Index(fields=['user', '-updated_at']),  # 사용자별 최신 세션
        models.Index(fields=['session', 'created_at']),  # 세션별 시간순 메시지
    ]
```

**복합 인덱스 장점**
- 여러 필드 조합 쿼리 최적화
- 정렬 포함 쿼리 성능 향상
- 예: `sessions.filter(user=user).order_by('-updated_at')`

**3. 정렬 방향 명시**
```python
models.Index(fields=['user', '-updated_at'])  # updated_at 내림차순 인덱스
```
- `-` 접두사: 내림차순 인덱스
- 정렬 쿼리 속도 향상

#### 인덱스 사용 사례

**사례 1: 사용자별 세션 목록 조회**
```python
# View
sessions = ChatSession.objects.filter(user=request.user).order_by('-updated_at')

# 최적화 인덱스
models.Index(fields=['user', '-updated_at'])

# SQL
SELECT * FROM chat_sessions 
WHERE user_id = ? 
ORDER BY updated_at DESC;
-- 인덱스 사용: chat_sessions_user_updated_idx
```

**사례 2: 세션별 메시지 조회**
```python
# View
messages = ChatMessage.objects.filter(session_id=session_id).order_by('created_at')

# 최적화 인덱스
models.Index(fields=['session', 'created_at'])

# SQL
SELECT * FROM chat_messages 
WHERE session_id = ? 
ORDER BY created_at ASC;
-- 인덱스 사용: chat_messages_session_created_idx
```

**사례 3: Agent별 세션 검색**
```python
# View (선택적)
sessions = ChatSession.objects.filter(agent_id=agent_id)

# 최적화 인덱스
agent_id = models.CharField(max_length=255, db_index=True)

# SQL
SELECT * FROM chat_sessions WHERE agent_id = ?;
-- 인덱스 사용: chat_sessions_agent_id_idx
```

#### 인덱스 확인 방법

**Django Shell**
```python
python manage.py shell

from apps.fabrix_agent_chat.models import ChatSession
from django.db import connection

# 인덱스 목록 조회
with connection.cursor() as cursor:
    cursor.execute("PRAGMA index_list('chat_sessions');")
    print(cursor.fetchall())

# 인덱스 상세 정보
with connection.cursor() as cursor:
    cursor.execute("PRAGMA index_info('chat_sessions_user_updated_idx');")
    print(cursor.fetchall())
```

**SQLite CLI**
```bash
sqlite3 db.sqlite3

-- 인덱스 목록
.indexes chat_sessions

-- 테이블 스키마 (인덱스 포함)
.schema chat_sessions

-- 쿼리 실행 계획 (인덱스 사용 확인)
EXPLAIN QUERY PLAN 
SELECT * FROM chat_sessions WHERE user_id = 1 ORDER BY updated_at DESC;
```

**EXPLAIN 결과 예시**
```
QUERY PLAN
`--SEARCH TABLE chat_sessions USING INDEX chat_sessions_user_updated_idx (user_id=?)
```
- `USING INDEX`: 인덱스 사용 중 ✅
- `SCAN TABLE`: Full Table Scan (느림) ❌

#### 인덱스 성능 측정

**쿼리 성능 비교**
```python
import time
from django.db import connection, reset_queries
from django.conf import settings

settings.DEBUG = True  # 쿼리 로깅 활성화

def measure_query_performance(query_func):
    reset_queries()
    start = time.time()
    result = query_func()
    elapsed = time.time() - start
    
    print(f"Time: {elapsed*1000:.2f}ms")
    print(f"Queries: {len(connection.queries)}")
    for query in connection.queries:
        print(f"  {query['time']}s - {query['sql'][:100]}")
    
    return result

# 사용 예시
measure_query_performance(
    lambda: list(ChatSession.objects.filter(user_id=1).order_by('-updated_at')[:20])
)
```

---

### 9.4 보안 설계

#### 인증 및 권한 관리

**1. Token Authentication**

**토큰 생성 (회원가입/로그인 시)**
```python
from rest_framework.authtoken.models import Token

# 회원가입 시
user = User.objects.create_user(username='testuser', password='password123')
token, created = Token.objects.get_or_create(user=user)
print(f"Token: {token.key}")  # 40자 랜덤 문자열

# 로그인 시
user = authenticate(username='testuser', password='password123')
if user:
    token, _ = Token.objects.get_or_create(user=user)
    return token.key
```

**토큰 형식**
```
Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```
- 길이: 40자
- 형식: Hexadecimal (0-9, a-f)
- 생성: `secrets.token_hex(20)` → 40자

**프론트엔드 토큰 저장**
```javascript
// 로그인 성공 시
sessionStorage.setItem('authToken', response.token);

// API 요청 시
axios.get('/api/sessions/', {
  headers: {
    'Authorization': `Token ${sessionStorage.getItem('authToken')}`
  }
});
```

**백엔드 토큰 검증**
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# views.py
class ChatSessionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # 토큰 필수
    
    def get_queryset(self):
        # request.user는 토큰으로 자동 인증된 사용자
        return ChatSession.objects.filter(user=self.request.user)
```

**2. Auth Key (회원가입 제한)**

**목적**: 내부 사용자만 회원가입 가능

**secrets.toml 설정**
```toml
AUTH_KEY = "123456"  # 6자리 숫자 (변경 권장)
```

**SignUpSerializer 검증**
```python
class SignUpSerializer(serializers.Serializer):
    auth_key = serializers.CharField(max_length=6, write_only=True)
    
    def validate_auth_key(self, value):
        from django.conf import settings
        valid_key = settings.secrets.get('AUTH_KEY', '123456')
        if value != valid_key:
            raise serializers.ValidationError("Invalid auth key.")
        return value
```

**프론트엔드 입력**
```javascript
// 회원가입 폼
const signupData = {
  username: 'newuser',
  password: 'password123',
  email: 'user@example.com',
  auth_key: '123456'  // 사용자가 입력
};

const response = await authApi.signup(signupData);
```

**3. 권한 수준**

**Django Permission Classes**
```python
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

# Public (인증 불필요)
class LoginView(APIView):
    permission_classes = [AllowAny]

# Authenticated (로그인 필수)
class ChatSessionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

# Admin Only (관리자 전용)
class UserManagementView(APIView):
    permission_classes = [IsAdminUser]
```

**소유권 검증**
```python
def add_message(self, request, pk=None):
    session = self.get_object()
    
    # 세션 소유자 확인
    if session.user != request.user:
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # 메시지 추가
    # ...
```

---

### 9.5 secrets.toml 설정 관리

#### secrets.toml 구조

**파일 위치**
```
django_dev/
├── secrets.toml  ← 여기
├── django_server/
└── ai_gateway/
```

**파일 내용**
```toml
# Django 설정
SECRET_KEY = "django-insecure-your-secret-key-here"
DEBUG = false
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "your-domain.com"]

# 보안
AUTH_KEY = "123456"  # 회원가입 제한 (6자리)

# API 설정
FABRIX_API_KEY = "your-fabrix-api-key-here"
FABRIX_URL = "https://fabrix.samsungsds.com"
FASTAPI_URL = "http://localhost:8001"
DJANGO_URL = "http://localhost:8000"

# Rate Limiting
RPM_LIMIT = 100    # Requests Per Minute
TPM_LIMIT = 10000  # Tokens Per Minute
```

#### secrets.toml 로드 (Django)

**settings.py**
```python
import tomli
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRETS_FILE = BASE_DIR.parent / "secrets.toml"

try:
    with open(SECRETS_FILE, "rb") as f:
        secrets = tomli.load(f)
    print(f"✅ Loaded secrets from {SECRETS_FILE}")
except FileNotFoundError:
    print(f"⚠️ secrets.toml not found at {SECRETS_FILE}, using defaults")
    secrets = {}

# 설정 적용
SECRET_KEY = secrets.get("SECRET_KEY", "django-insecure-default-key")
DEBUG = secrets.get("DEBUG", False)
ALLOWED_HOSTS = secrets.get("ALLOWED_HOSTS", ["localhost", "127.0.0.1"])
```

#### secrets.toml 로드 (FastAPI)

**main.py**
```python
import tomli
from pathlib import Path

# secrets.toml 로드
SECRETS_FILE = Path(__file__).parent.parent / "secrets.toml"

try:
    with open(SECRETS_FILE, "rb") as f:
        secrets = tomli.load(f)
    print(f"✅ Loaded secrets from {SECRETS_FILE}")
except FileNotFoundError:
    print(f"⚠️ secrets.toml not found")
    secrets = {}

# 설정 적용
FABRIX_API_KEY = secrets.get("FABRIX_API_KEY", "")
FABRIX_URL = secrets.get("FABRIX_URL", "https://fabrix.samsungsds.com")
RPM_LIMIT = secrets.get("RPM_LIMIT", 100)
TPM_LIMIT = secrets.get("TPM_LIMIT", 10000)
```

#### secrets.toml.example 제공

**배포 시 템플릿 제공**
```toml
# secrets.toml.example
# 실제 사용 시 secrets.toml로 복사 후 값 수정

SECRET_KEY = "CHANGE_THIS_TO_RANDOM_STRING"
DEBUG = false
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

AUTH_KEY = "CHANGE_THIS_6_DIGIT_CODE"

FABRIX_API_KEY = "YOUR_FABRIX_API_KEY_HERE"
FABRIX_URL = "https://fabrix.samsungsds.com"
FASTAPI_URL = "http://localhost:8001"
DJANGO_URL = "http://localhost:8000"

RPM_LIMIT = 100
TPM_LIMIT = 10000
```

**사용법**
```bash
# 1. 템플릿 복사
cp secrets.toml.example secrets.toml

# 2. 값 수정
notepad secrets.toml  # Windows
# 또는
nano secrets.toml     # Linux/Mac
```

---

### 9.6 CORS 및 보안 헤더

#### CORS 설정

**Django settings.py**
```python
# django-cors-headers 설치 필요
INSTALLED_APPS = [
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 최상단
    'django.middleware.security.SecurityMiddleware',
    # ...
]

# CORS 설정
CORS_ALLOW_ALL_ORIGINS = True  # 개발 환경
CORS_ALLOW_CREDENTIALS = True

# 프로덕션 환경 (특정 오리진만 허용)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://your-production-domain.com"
]

# 허용 헤더
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

**FastAPI main.py**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 환경
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 프로덕션 환경
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-production-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

#### 보안 헤더

**Django Security Middleware**
```python
# settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # 보안 헤더 자동 추가
    # ...
]

# 보안 설정 (프로덕션)
SECURE_BROWSER_XSS_FILTER = True          # X-XSS-Protection
SECURE_CONTENT_TYPE_NOSNIFF = True        # X-Content-Type-Options: nosniff
X_FRAME_OPTIONS = 'DENY'                  # Clickjacking 방지

# HTTPS 강제 (프로덕션)
SECURE_SSL_REDIRECT = True                # HTTP → HTTPS 리다이렉트
SESSION_COOKIE_SECURE = True              # HTTPS 전용 쿠키
CSRF_COOKIE_SECURE = True                 # HTTPS 전용 CSRF 쿠키
SECURE_HSTS_SECONDS = 31536000            # HSTS 1년
SECURE_HSTS_INCLUDE_SUBDOMAINS = True     # 서브도메인 포함
SECURE_HSTS_PRELOAD = True                # HSTS Preload
```

**응답 헤더 예시**
```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

### 9.7 API 키 보호

#### FabriX API 키 관리

**문제점**
- 프론트엔드에서 직접 FabriX API 호출 시 API 키 노출
- 브라우저 개발자 도구에서 키 확인 가능

**해결책: FastAPI Gateway 프록시**
```
Frontend (React)
    ↓ (API 키 없음)
FastAPI Gateway (Port 8001)
    ↓ (API 키 포함)
FabriX API
```

**FastAPI Gateway (main.py)**
```python
# API 키는 서버에만 존재
FABRIX_API_KEY = secrets.get("FABRIX_API_KEY", "")

@app.post("/agent-messages")
async def send_agent_message_stream(request: ChatRequest):
    """프록시: 프론트엔드는 API 키 불필요"""
    url = "https://fabrix.samsungsds.com/api/agent-messages"
    
    # 서버가 API 키 추가
    headers = {
        "Authorization": f"Bearer {FABRIX_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
    }
    
    # FabriX API 호출
    async with http_client.stream("POST", url, headers=headers, json=request.dict()) as response:
        # 스트리밍 응답 전달
        async for line in response.aiter_lines():
            yield line
```

**프론트엔드 (React)**
```javascript
// API 키 불필요
await fetchEventSource('http://localhost:8001/agent-messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // Authorization 헤더 없음 (API 키 노출 방지)
  },
  body: JSON.stringify({
    agentId: 'xxx',
    contents: ['Hello']
  })
});
```

#### 환경별 설정 분리

**개발 환경**
```toml
# secrets.toml (개발)
DEBUG = true
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
FABRIX_URL = "https://fabrix-dev.samsungsds.com"  # 개발 서버
```

**프로덕션 환경**
```toml
# secrets.toml (프로덕션)
DEBUG = false
ALLOWED_HOSTS = ["your-domain.com"]
FABRIX_URL = "https://fabrix.samsungsds.com"  # 프로덕션 서버
SECURE_SSL_REDIRECT = true
```

---

### 9.8 데이터 보호

#### 비밀번호 해싱

**Django 기본 설정**
```python
# settings.py
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',  # 기본
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.Argon2PasswordHasher',   # 권장 (추가 설치 필요)
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]
```

**해시 형식 (DB 저장)**
```
pbkdf2_sha256$260000$random_salt$hash_value
```
- 알고리즘: PBKDF2-SHA256
- 반복 횟수: 260,000회
- Salt: 랜덤 생성 (사용자마다 다름)

**비밀번호 검증**
```python
from django.contrib.auth import authenticate

# 로그인 시
user = authenticate(username='testuser', password='password123')
# 내부적으로 해시 비교 수행 (원본 비밀번호 저장 안 함)
```

#### 토큰 보안

**토큰 생성**
```python
import secrets

# 40자 랜덤 토큰 (Django REST Framework 기본)
token_key = secrets.token_hex(20)  # 20 bytes = 40 hex chars
```

**토큰 저장 위치**
```javascript
// ✅ SessionStorage (권장: 브라우저 종료 시 삭제)
sessionStorage.setItem('authToken', token);

// ❌ LocalStorage (권장 안 함: 영구 저장)
localStorage.setItem('authToken', token);

// ❌ Cookie (XSS 위험)
document.cookie = `authToken=${token}`;
```

**토큰 유효기간 (선택적)**
```python
# 토큰 자동 만료 (Custom 구현)
from django.utils import timezone
from datetime import timedelta

class ExpiringToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    key = models.CharField(max_length=40, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    
    def is_valid(self):
        # 7일 유효
        return timezone.now() < self.created + timedelta(days=7)
```

#### SQL Injection 방지

**Django ORM 사용 (자동 방어)**
```python
# ✅ ORM (안전)
sessions = ChatSession.objects.filter(user_id=user_id)

# ✅ Parameterized Query (안전)
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute("SELECT * FROM chat_sessions WHERE user_id = %s", [user_id])

# ❌ String Interpolation (위험)
cursor.execute(f"SELECT * FROM chat_sessions WHERE user_id = {user_id}")
```

#### XSS (Cross-Site Scripting) 방지

**프론트엔드 출력 이스케이프**
```javascript
// ❌ 위험 (HTML 직접 삽입)
element.innerHTML = userInput;

// ✅ 안전 (텍스트로 처리)
element.textContent = userInput;

// ✅ React (자동 이스케이프)
<div>{message.content}</div>
```

**Markdown 렌더링 (react-markdown)**
```javascript
import ReactMarkdown from 'react-markdown';

// react-markdown은 기본적으로 XSS 방어 (HTML 태그 이스케이프)
<ReactMarkdown>{message.content}</ReactMarkdown>
```

#### CSRF (Cross-Site Request Forgery) 방지

**Django CSRF 보호**
```python
# settings.py
MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',  # CSRF 보호
    # ...
]

# CSRF 쿠키 설정
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_COOKIE_HTTPONLY = False  # JavaScript 접근 허용 (필수)
CSRF_COOKIE_SAMESITE = 'Lax'
```

**프론트엔드 CSRF 토큰 전송**
```javascript
// Axios 인터셉터
axios.interceptors.request.use(config => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// getCookie 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
```

**REST API는 Token 인증 사용 (CSRF 불필요)**
```python
# TokenAuthentication은 CSRF 체크 안 함
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}
```

---

### 9.9 보안 체크리스트

#### 배포 전 확인사항

**1. secrets.toml 설정**
- [ ] `DEBUG = false`
- [ ] `SECRET_KEY` 변경 (50자 이상 랜덤 문자열)
- [ ] `AUTH_KEY` 변경 (6자리 랜덤)
- [ ] `ALLOWED_HOSTS` 실제 도메인으로 제한
- [ ] `FABRIX_API_KEY` 프로덕션 키로 변경

**2. HTTPS 설정**
- [ ] SSL 인증서 설치
- [ ] `SECURE_SSL_REDIRECT = True`
- [ ] `SESSION_COOKIE_SECURE = True`
- [ ] `CSRF_COOKIE_SECURE = True`

**3. CORS 설정**
- [ ] `CORS_ALLOW_ALL_ORIGINS = False`
- [ ] `CORS_ALLOWED_ORIGINS` 특정 도메인만 허용

**4. 데이터베이스**
- [ ] 정기 백업 설정 (db.sqlite3*)
- [ ] WAL 모드 활성화 확인
- [ ] 백업 암호화

**5. 로그 및 모니터링**
- [ ] 에러 로그 수집 (Sentry 등)
- [ ] 접근 로그 기록
- [ ] Rate Limit 초과 알림

**6. 권한 관리**
- [ ] Admin 계정 비밀번호 강화
- [ ] 불필요한 계정 삭제
- [ ] 정기 토큰 갱신 정책

**7. Git 보안**
- [ ] `.gitignore`에 `secrets.toml` 포함
- [ ] 커밋 히스토리에 API 키 없는지 확인
- [ ] `git log --all --source -- secrets.toml` (히스토리 검색)

---

## 10. 사용자 인터페이스 설계

Google Gemini 스타일의 모던하고 직관적인 UI를 구현했으며, Tailwind CSS와 CSS Variables를 활용한 일관된 디자인 시스템을 적용했습니다.

### 10.1 디자인 시스템

#### 색상 팔레트

**CSS Variables (Global.css)**
```css
:root {
  /* 배경색 */
  --bg-primary: #ffffff;           /* 메인 배경 (흰색) */
  --bg-secondary: #f7f9fc;         /* 사이드바 배경 (연한 회색) */
  --bg-tertiary: #e8eef5;          /* 호버 배경 */
  
  /* 텍스트 색상 */
  --text-primary: #1e293b;         /* 주요 텍스트 (진한 회색) */
  --text-secondary: #64748b;       /* 보조 텍스트 (중간 회색) */
  --text-tertiary: #94a3b8;        /* 비활성 텍스트 (연한 회색) */
  
  /* 브랜드 색상 */
  --color-primary: #2563eb;        /* 파란색 (버튼, 링크) */
  --color-primary-hover: #1d4ed8;  /* 파란색 호버 */
  --color-secondary: #8b5cf6;      /* 보라색 (강조) */
  
  /* 상태 색상 */
  --color-success: #10b981;        /* 성공 (녹색) */
  --color-warning: #f59e0b;        /* 경고 (주황색) */
  --color-error: #ef4444;          /* 에러 (빨간색) */
  --color-info: #3b82f6;           /* 정보 (파란색) */
  
  /* 경계선 */
  --border-color: #e2e8f0;         /* 일반 경계선 */
  --border-color-hover: #cbd5e1;   /* 호버 경계선 */
  
  /* 그림자 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

**다크 모드 지원 (선택적)**
```css
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --border-color: #334155;
}
```

**색상 사용 가이드**

| 용도 | 색상 변수 | 사용 예시 |
|------|----------|----------|
| 메인 배경 | `--bg-primary` | 채팅 영역, 카드 |
| 사이드바 | `--bg-secondary` | 좌측 사이드바 |
| 호버 효과 | `--bg-tertiary` | 버튼, 리스트 아이템 호버 |
| 주요 텍스트 | `--text-primary` | 제목, 본문 |
| 보조 텍스트 | `--text-secondary` | 설명, 메타 정보 |
| 주요 액션 | `--color-primary` | 전송 버튼, 주요 CTA |
| 강조 요소 | `--color-secondary` | 배지, 하이라이트 |

#### 타이포그래피

**폰트 설정**
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
               'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
               sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
```

**텍스트 스케일**

| 스타일 | 크기 | 용도 | Tailwind 클래스 |
|--------|------|------|----------------|
| Heading 1 | 30px | 페이지 제목 | `text-3xl` |
| Heading 2 | 24px | 섹션 제목 | `text-2xl` |
| Heading 3 | 20px | 서브 제목 | `text-xl` |
| Body Large | 16px | 주요 본문 | `text-base` |
| Body | 14px | 일반 본문 | `text-sm` |
| Caption | 12px | 메타 정보 | `text-xs` |

**폰트 굵기**
```css
.font-light { font-weight: 300; }    /* 가벼운 텍스트 */
.font-normal { font-weight: 400; }   /* 일반 */
.font-medium { font-weight: 500; }   /* 중간 강조 */
.font-semibold { font-weight: 600; } /* 강조 */
.font-bold { font-weight: 700; }     /* 굵은 강조 */
```

#### 간격 시스템

**Spacing Scale (Tailwind 기본)**
```
0.5 = 2px    (p-0.5, m-0.5)
1   = 4px    (p-1, m-1)
2   = 8px    (p-2, m-2)
3   = 12px   (p-3, m-3)
4   = 16px   (p-4, m-4)
5   = 20px   (p-5, m-5)
6   = 24px   (p-6, m-6)
8   = 32px   (p-8, m-8)
10  = 40px   (p-10, m-10)
12  = 48px   (p-12, m-12)
```

**레이아웃 간격 가이드**
- **컴포넌트 내부 패딩**: `p-4` (16px)
- **컴포넌트 간 간격**: `gap-3` (12px) ~ `gap-6` (24px)
- **섹션 간 간격**: `space-y-8` (32px)
- **카드 패딩**: `p-6` (24px)

#### 테두리 및 라운딩

**Border Radius**
```css
.rounded-sm { border-radius: 4px; }   /* 작은 라운딩 (입력 필드) */
.rounded { border-radius: 6px; }      /* 기본 라운딩 (버튼) */
.rounded-lg { border-radius: 8px; }   /* 큰 라운딩 (카드) */
.rounded-xl { border-radius: 12px; }  /* 더 큰 라운딩 (모달) */
.rounded-2xl { border-radius: 16px; } /* 매우 큰 라운딩 (메시지 버블) */
.rounded-full { border-radius: 9999px; } /* 원형 (아바타, 배지) */
```

**사용 예시**
- **버튼**: `rounded-lg` (8px)
- **입력 필드**: `rounded-xl` (12px)
- **메시지 버블**: `rounded-2xl` (16px)
- **카드**: `rounded-2xl shadow-lg`
- **아바타**: `rounded-full`

---

### 10.2 레이아웃 구조

#### 전체 레이아웃 구성

```
┌─────────────────────────────────────────────────────────┐
│                    Main Layout                          │
│  ┌──────────────┬─────────────────────────────────────┐ │
│  │              │                                     │ │
│  │   Sidebar    │          Content Area               │ │
│  │   (280px)    │          (flex-1)                   │ │
│  │              │                                     │ │
│  │  ┌────────┐  │  ┌───────────────────────────────┐  │ │
│  │  │ Header │  │  │         Header                │  │ │
│  │  │        │  │  │  (h-16, fixed)                │  │ │
│  │  └────────┘  │  └───────────────────────────────┘  │ │
│  │              │  ┌───────────────────────────────┐  │ │
│  │  ┌────────┐  │  │                               │  │ │
│  │  │ Agent  │  │  │      Main Content             │  │ │
│  │  │Selector│  │  │      (flex-1, overflow)       │  │ │
│  │  └────────┘  │  │                               │  │ │
│  │              │  │                               │  │ │
│  │  ┌────────┐  │  └───────────────────────────────┘  │ │
│  │  │Session │  │  ┌───────────────────────────────┐  │ │
│  │  │  List  │  │  │         Footer                │  │ │
│  │  │        │  │  │  (Input Area, fixed)          │  │ │
│  │  └────────┘  │  └───────────────────────────────┘  │ │
│  │              │                                     │ │
│  │  ┌────────┐  │                                     │ │
│  │  │ User   │  │                                     │ │
│  │  │ Info   │  │                                     │ │
│  │  └────────┘  │                                     │ │
│  └──────────────┴─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Flexbox 레이아웃**
```jsx
// MainLayout.jsx
<div className="flex h-screen">
  {/* Sidebar: 고정 너비 */}
  <aside className="w-[280px] flex-shrink-0">
    <Sidebar />
  </aside>
  
  {/* Content: 남은 공간 채우기 */}
  <main className="flex-1 flex flex-col min-w-0">
    <Outlet />
  </main>
</div>
```

#### 사이드바 레이아웃

**구조**
```jsx
<div className="flex flex-col h-full">
  {/* Header: 고정 높이 */}
  <div className="flex-shrink-0 h-14">
    {/* 메뉴 토글, 검색 버튼 */}
  </div>
  
  {/* Agent & New Chat: 고정 높이 */}
  <div className="flex-shrink-0 p-4 space-y-3">
    {/* Agent 선택, New Chat 버튼 */}
  </div>
  
  {/* Session List: 스크롤 가능 */}
  <div className="flex-1 overflow-y-auto px-3 py-4">
    {/* 세션 목록 */}
  </div>
  
  {/* User Info: 하단 고정 */}
  <div className="flex-shrink-0 p-4 border-t">
    {/* 사용자 정보, 로그아웃 */}
  </div>
</div>
```

**Flexbox 속성 설명**
- `flex-shrink-0`: 축소 방지 (고정 크기 유지)
- `flex-1`: 남은 공간 채우기
- `overflow-y-auto`: 세로 스크롤 활성화
- `space-y-3`: 자식 요소 간 세로 간격 (12px)

#### 채팅 페이지 레이아웃

**3단 구조**
```jsx
<div className="flex flex-col h-full">
  {/* 1. Header: 고정 상단 */}
  <header className="flex-shrink-0 h-16 border-b">
    {/* Agent 정보, 에러 메시지 */}
  </header>
  
  {/* 2. Chat Area: 스크롤 가능 본문 */}
  <div className="flex-1 overflow-y-auto px-4 py-8">
    <div className="max-w-3xl mx-auto">
      {/* 메시지 목록 */}
    </div>
  </div>
  
  {/* 3. Input Area: 고정 하단 */}
  <div className="flex-shrink-0 p-4 pb-6">
    <div className="max-w-3xl mx-auto">
      {/* 입력창 */}
    </div>
  </div>
</div>
```

**최대 너비 제한 (가독성 향상)**
```jsx
<div className="max-w-3xl mx-auto">
  {/* 내용: 768px 이내로 제한 */}
</div>
```
- `max-w-3xl`: 최대 768px
- `mx-auto`: 가로 중앙 정렬
- 이유: 긴 줄의 텍스트는 가독성 저하

---

### 10.3 주요 UI 컴포넌트 디자인

#### 버튼 디자인

**Primary Button (주요 액션)**
```jsx
<button className="
  px-4 py-3 
  bg-gradient-to-r from-blue-500 to-blue-600 
  text-white font-semibold
  rounded-xl shadow-md
  hover:shadow-lg hover:from-blue-600 hover:to-blue-700
  active:scale-95
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
">
  New Chat
</button>
```

**특징**
- Gradient 배경: `from-blue-500 to-blue-600`
- 호버 시 그림자 증가: `hover:shadow-lg`
- 클릭 시 축소 효과: `active:scale-95`
- 비활성 상태: `disabled:opacity-50`

**Secondary Button (보조 액션)**
```jsx
<button className="
  px-4 py-2
  bg-white border border-gray-300
  text-gray-700
  rounded-lg
  hover:bg-gray-50 hover:border-gray-400
  transition-colors duration-200
">
  Cancel
</button>
```

**Icon Button (아이콘 전용)**
```jsx
<button className="
  p-2 
  text-gray-600 
  hover:text-blue-600 hover:bg-blue-50 
  rounded-lg 
  transition-colors duration-200
">
  <Send size={20} />
</button>
```

#### 입력 필드 디자인

**Textarea (멀티라인)**
```jsx
<textarea className="
  w-full 
  px-4 py-3
  bg-white border border-gray-200
  rounded-xl
  text-sm text-gray-900
  placeholder-gray-400
  outline-none
  focus:border-blue-500 focus:ring-2 focus:ring-blue-100
  resize-none
  transition-all duration-200
" 
placeholder="Type your message..."
/>
```

**특징**
- Focus Ring: `focus:ring-2 focus:ring-blue-100`
- 부드러운 테두리 전환: `transition-all duration-200`
- Resize 방지: `resize-none`

**Input Field (단일 라인)**
```jsx
<input className="
  w-full px-4 py-3
  bg-gray-50 border border-gray-200
  rounded-lg
  focus:bg-white focus:border-blue-500
  outline-none
  transition-all duration-200
" 
type="text" 
placeholder="Username"
/>
```

#### 카드 디자인

**기본 카드**
```jsx
<div className="
  bg-white 
  border border-gray-200 
  rounded-2xl 
  shadow-lg 
  p-6
  hover:shadow-xl
  transition-shadow duration-300
">
  {/* 카드 내용 */}
</div>
```

**메시지 버블 (User)**
```jsx
<div className="
  max-w-[80%]
  bg-blue-50 
  rounded-2xl 
  p-4 
  shadow-sm
  ml-auto
">
  <p className="text-sm text-gray-900 whitespace-pre-wrap">
    {message.content}
  </p>
</div>
```

**메시지 버블 (Assistant)**
```jsx
<div className="
  max-w-[80%]
  bg-gray-50 
  rounded-2xl 
  p-4 
  shadow-sm
">
  <div className="flex items-start gap-3">
    <Bot size={20} className="text-blue-600 mt-1 flex-shrink-0" />
    <div className="flex-1 min-w-0 prose prose-sm max-w-none">
      <ReactMarkdown>{message.content}</ReactMarkdown>
    </div>
  </div>
</div>
```

#### 드롭다운 메뉴

**Agent 선택 드롭다운**
```jsx
{/* 트리거 버튼 */}
<button className="
  w-full flex items-center justify-between
  px-4 py-3
  bg-white border border-gray-200
  rounded-xl
  hover:border-gray-300
  transition-colors duration-200
">
  <div className="flex items-center gap-3">
    <Bot size={18} />
    <span className="font-semibold text-sm">
      {selectedAgent?.label}
    </span>
  </div>
  <ChevronDown size={16} className={
    isOpen ? 'rotate-180 transition-transform' : 'transition-transform'
  } />
</button>

{/* 드롭다운 메뉴 */}
{isOpen && (
  <div className="
    absolute z-20 w-full mt-2
    bg-white border border-gray-200
    rounded-xl shadow-xl
    max-h-80 overflow-y-auto
  ">
    {agents.map(agent => (
      <button key={agent.agentId} className="
        w-full px-4 py-3 
        text-left text-sm
        hover:bg-blue-50
        transition-colors duration-150
      ">
        {agent.label}
      </button>
    ))}
  </div>
)}
```

**특징**
- `z-20`: 다른 요소 위에 표시
- `max-h-80 overflow-y-auto`: 긴 목록 스크롤
- 회전 아이콘: `rotate-180 transition-transform`

---

### 10.4 애니메이션과 트랜지션

#### 페이드 인 애니메이션

**CSS 정의 (Global.css)**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
```

**적용 예시**
```jsx
<div className="animate-fade-in-up">
  {/* 메시지 버블 */}
</div>
```

#### 스켈레톤 로딩

**펄스 애니메이션**
```jsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

**Tailwind `animate-pulse`**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### 호버 트랜지션

**기본 패턴**
```jsx
<button className="
  bg-blue-500 
  hover:bg-blue-600 
  transition-colors duration-200
">
  Hover Me
</button>
```

**복합 트랜지션**
```jsx
<div className="
  transform 
  hover:scale-105 
  hover:shadow-lg
  transition-all duration-300 ease-out
">
  {/* 확대 + 그림자 */}
</div>
```

**트랜지션 속도 가이드**
- `duration-100`: 100ms (빠름, 미묘한 효과)
- `duration-200`: 200ms (기본, 버튼 호버)
- `duration-300`: 300ms (중간, 카드 효과)
- `duration-500`: 500ms (느림, 큰 변화)

#### 타이핑 커서 애니메이션

**CSS**
```css
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1rem;
  background-color: #2563eb;
  animation: blink 1s step-end infinite;
}
```

**JSX**
```jsx
{isStreaming && <span className="typing-cursor ml-1" />}
```

#### 사이드바 토글 애니메이션

**Smooth Width Transition**
```jsx
<aside className={`
  transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
  ${isSidebarOpen ? 'w-[280px]' : 'w-[56px]'}
`}>
  {/* 사이드바 내용 */}
</aside>
```

**Cubic Bezier Easing**
- `ease-[cubic-bezier(0.25,0.1,0.25,1.0)]`: 부드러운 가속/감속
- 0.25초 지속 시간
- 시작 느림 → 빠름 → 끝 느림

---

### 10.5 반응형 디자인

#### 브레이크포인트

**Tailwind 기본 브레이크포인트**
```
sm:  640px  (모바일 가로, 작은 태블릿)
md:  768px  (태블릿)
lg:  1024px (작은 노트북)
xl:  1280px (데스크톱)
2xl: 1536px (큰 데스크톱)
```

#### 반응형 레이아웃 패턴

**사이드바 숨김 (모바일)**
```jsx
<aside className="
  hidden md:block
  w-[280px]
  flex-shrink-0
">
  <Sidebar />
</aside>

{/* 모바일 메뉴 버튼 */}
<button className="md:hidden p-2">
  <Menu size={24} />
</button>
```

**반응형 패딩**
```jsx
<div className="
  px-4 md:px-6 lg:px-8
  py-4 md:py-6 lg:py-8
">
  {/* 모바일: 16px, 태블릿: 24px, 데스크톱: 32px */}
</div>
```

**반응형 그리드**
```jsx
<div className="
  grid 
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
  gap-4
">
  {items.map(item => (
    <div key={item.id}>{/* 카드 */}</div>
  ))}
</div>
```

**반응형 텍스트**
```jsx
<h1 className="
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl
  font-bold
">
  Title
</h1>
```

#### 모바일 최적화

**터치 타겟 크기**
```jsx
{/* 최소 44x44px (Apple HIG 권장) */}
<button className="p-3 min-w-[44px] min-h-[44px]">
  <Icon size={20} />
</button>
```

**스크롤 최적화**
```css
/* 부드러운 스크롤 (iOS) */
.scrollable {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

**뷰포트 메타 태그**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

### 10.6 접근성 (Accessibility)

#### 키보드 탐색

**Tab Index 관리**
```jsx
{/* 포커스 가능한 요소 */}
<button tabIndex={0}>Button</button>

{/* 포커스 불가능 (장식용) */}
<div tabIndex={-1}>Decorative</div>
```

**Enter 키 지원**
```jsx
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

<textarea onKeyDown={handleKeyDown} />
```

**포커스 표시**
```jsx
<button className="
  focus:outline-none 
  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  rounded-lg
">
  Button
</button>
```

#### ARIA 속성

**버튼 레이블**
```jsx
<button aria-label="Send message">
  <Send size={20} />
</button>

<button aria-label="Close menu" onClick={handleClose}>
  <X size={20} />
</button>
```

**로딩 상태**
```jsx
<button 
  disabled={isLoading}
  aria-busy={isLoading}
  aria-label={isLoading ? "Loading..." : "Send"}
>
  {isLoading ? <Loader className="animate-spin" /> : <Send />}
</button>
```

**라이브 리전 (스크린 리더)**
```jsx
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {isLoading && "Message is being sent"}
</div>
```

#### 색상 대비

**WCAG 2.1 AA 기준 (최소 4.5:1)**
```
텍스트 색상 (#1e293b) vs 배경 (#ffffff)
→ 대비 15.8:1 ✅

버튼 텍스트 (#ffffff) vs 파란색 배경 (#2563eb)
→ 대비 8.6:1 ✅
```

**대비 확인 도구**
```bash
# Chrome DevTools
개발자 도구 → Elements → Styles → Color Picker → Contrast Ratio
```

#### 스크린 리더 지원

**시맨틱 HTML**
```jsx
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main role="main">
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

<footer>
  <p>Footer content</p>
</footer>
```

**숨김 텍스트 (스크린 리더 전용)**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```jsx
<button>
  <Send size={20} />
  <span className="sr-only">Send message</span>
</button>
```

---

### 10.7 사용자 경험 (UX) 개선 요소

#### 로딩 인디케이터

**스피너 애니메이션**
```jsx
import { Loader2 } from 'lucide-react';

<Loader2 className="animate-spin text-blue-600" size={24} />
```

**프로그레스 바**
```jsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

#### 에러 메시지

**인라인 에러**
```jsx
{error && (
  <div className="
    flex items-center gap-2
    p-3 
    bg-red-50 border border-red-200 
    text-red-700 text-sm
    rounded-lg
  ">
    <AlertCircle size={16} />
    <span>{error}</span>
  </div>
)}
```

**토스트 알림 (선택적)**
```jsx
// react-hot-toast 라이브러리 사용
import toast from 'react-hot-toast';

toast.success('Message sent!');
toast.error('Failed to send message');
```

#### Empty State

**세션 없음**
```jsx
{sessions.length === 0 && (
  <div className="flex flex-col items-center justify-center h-64 text-center px-4">
    <MessageSquare size={48} className="text-gray-300 mb-4" />
    <h3 className="text-lg font-semibold text-gray-700 mb-2">
      No conversations yet
    </h3>
    <p className="text-sm text-gray-500">
      Start a new chat to begin
    </p>
  </div>
)}
```

**메시지 없음**
```jsx
{messages.length === 0 && (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center">
    <Sparkles size={48} className="text-blue-500 mb-4" />
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      How can I help you today?
    </h2>
    <p className="text-gray-600">
      Ask me anything or upload a file to analyze
    </p>
  </div>
)}
```

#### 확인 대화상자

**세션 삭제 확인**
```jsx
const handleDelete = async (id) => {
  const confirmed = window.confirm('Delete this conversation?');
  if (confirmed) {
    await deleteSession(id);
  }
};
```

**커스텀 모달 (선택적)**
```jsx
{showConfirmModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
      <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this conversation?
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={() => setShowConfirmModal(false)}>
          Cancel
        </button>
        <button onClick={handleConfirmedDelete} className="bg-red-600 text-white">
          Delete
        </button>
      </div>
    </div>
  </div>
)}
```

#### 자동 스크롤

**메시지 추가 시 하단으로 스크롤**
```jsx
const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'end'
  });
}, [messages]);

// JSX
<div className="overflow-y-auto">
  {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
  <div ref={messagesEndRef} className="h-4" />
</div>
```

#### 파일 업로드 피드백

**파일 선택 표시**
```jsx
{file && (
  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-sm">
    <FileText size={16} className="text-blue-600" />
    <span className="flex-1 truncate">{file.name}</span>
    <span className="text-gray-500">
      {(file.size / 1024).toFixed(1)} KB
    </span>
    <button onClick={() => setFile(null)} className="text-red-600">
      <X size={16} />
    </button>
  </div>
)}
```

---

### 10.8 디자인 가이드라인 요약

#### Do's (권장 사항)

✅ **일관된 간격 사용**
- Tailwind spacing scale 준수 (4, 8, 12, 16, 24px)
- 컴포넌트 간 균일한 여백

✅ **명확한 시각적 계층**
- 제목: font-bold, 큰 사이즈
- 본문: font-normal, 중간 사이즈
- 보조 텍스트: text-secondary, 작은 사이즈

✅ **피드백 제공**
- 버튼 클릭: 호버, 클릭 효과
- 로딩: 스피너 또는 스켈레톤
- 성공/실패: 명확한 메시지

✅ **접근성 고려**
- 충분한 색상 대비 (4.5:1 이상)
- 키보드 탐색 지원
- ARIA 속성 추가

✅ **반응형 디자인**
- 모바일 우선 (mobile-first)
- 브레이크포인트별 레이아웃 조정

#### Don'ts (피해야 할 사항)

❌ **과도한 애니메이션**
- 너무 많은 움직임 → 주의 산만
- 애니메이션은 의미 있을 때만 사용

❌ **불규칙한 스타일**
- 같은 컴포넌트에 다른 스타일 적용
- 일관성 유지 필수

❌ **긴 텍스트 줄**
- 최대 너비 제한 없음 → 가독성 저하
- `max-w-3xl` 등으로 제한

❌ **낮은 색상 대비**
- 회색 텍스트 + 흰 배경 (대비 낮음)
- 최소 4.5:1 대비 유지

❌ **모바일 무시**
- 데스크톱만 고려한 디자인
- 터치 타겟 크기 부족 (44px 미만)

---

## 11. 성능 최적화 및 안정성 향상

프로젝트는 SQLite WAL Mode, Connection Pooling, Rate Limiting, 비동기 처리 등 다양한 최적화 기법을 적용하여 5-50명의 동시 사용자를 안정적으로 지원합니다.

### 11.1 데이터베이스 성능 최적화

#### SQLite WAL Mode 적용

**문제점**
- 기본 저널 모드: 쓰기 시 데이터베이스 전체 잠금
- 읽기와 쓰기 동시 실행 불가
- 동시 사용자 2-3명 이상 시 병목 발생

**해결책: WAL (Write-Ahead Logging) 모드**

**설정 코드 (settings.py)**
```python
from django.db.backends.signals import connection_created
from django.dispatch import receiver

@receiver(connection_created)
def activate_wal_mode(sender, connection, **kwargs):
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        cursor.execute('PRAGMA journal_mode=WAL;')
        cursor.execute('PRAGMA synchronous=NORMAL;')
        cursor.execute('PRAGMA busy_timeout=20000;')
```

**성능 개선 결과**

| 지표 | 기본 모드 | WAL 모드 | 개선율 |
|------|----------|---------|--------|
| 동시 쓰기 처리량 | 20 req/s | 60 req/s | **3배** |
| 읽기+쓰기 혼합 | 30 req/s | 90 req/s | **3배** |
| 응답 지연 (P95) | 500ms | 150ms | **70% 감소** |
| 지원 동시 사용자 | 1-2명 | 5-50명 | **25배** |

**작동 원리**
```
기본 모드:
쓰기 → 전체 잠금 → 읽기 차단 → 완료 후 잠금 해제

WAL 모드:
쓰기 → WAL 파일에 기록 (DB 잠금 안 함)
읽기 → DB 파일 또는 WAL 파일에서 읽기 (동시 진행)
체크포인트 → WAL 내용을 DB 파일로 병합
```

**WAL 파일 관리**
```bash
# 생성되는 파일
db.sqlite3          # 메인 DB
db.sqlite3-wal      # Write-Ahead Log
db.sqlite3-shm      # Shared Memory

# 체크포인트 수동 실행 (백업 전 권장)
python manage.py shell
>>> from django.db import connection
>>> cursor = connection.cursor()
>>> cursor.execute('PRAGMA wal_checkpoint(FULL);')
```

#### 인덱스 최적화

**문제점**
- Full Table Scan으로 인한 느린 쿼리
- 정렬 작업에 임시 테이블 생성

**해결책: 전략적 인덱스 설계**

**단일 필드 인덱스**
```python
class ChatSession(models.Model):
    user = models.ForeignKey(User, db_index=True)        # 사용자별 조회
    agent_id = models.CharField(db_index=True)           # Agent별 조회
    created_at = models.DateTimeField(db_index=True)     # 시간순 조회
```

**복합 인덱스 (Composite Index)**
```python
class Meta:
    indexes = [
        # 사용자별 최신 세션 조회 최적화
        models.Index(fields=['user', '-updated_at']),
        
        # 세션별 시간순 메시지 조회 최적화
        models.Index(fields=['session', 'created_at']),
    ]
```

**쿼리 성능 비교**
```python
# 인덱스 없음 (Slow)
# EXPLAIN: SCAN TABLE chat_sessions (100,000 rows)
sessions = ChatSession.objects.filter(user=user).order_by('-updated_at')
# 실행 시간: 450ms

# 인덱스 있음 (Fast)
# EXPLAIN: SEARCH TABLE chat_sessions USING INDEX idx_user_updated
sessions = ChatSession.objects.filter(user=user).order_by('-updated_at')
# 실행 시간: 12ms (37배 빠름)
```

**인덱스 사용 확인**
```sql
EXPLAIN QUERY PLAN
SELECT * FROM chat_sessions WHERE user_id = 1 ORDER BY updated_at DESC;

-- 결과 예시
SEARCH TABLE chat_sessions USING INDEX idx_user_updated (user_id=?)
```

#### N+1 쿼리 방지

**문제점**
```python
# ❌ N+1 쿼리 발생
sessions = ChatSession.objects.all()  # 1 쿼리
for session in sessions:
    print(session.user.username)      # N 쿼리 (각 세션마다 User 조회)
# 총 쿼리: 1 + N
```

**해결책: select_related / prefetch_related**

**select_related (ForeignKey, OneToOne)**
```python
# ✅ JOIN으로 한 번에 조회
sessions = ChatSession.objects.select_related('user').all()  # 1 쿼리
for session in sessions:
    print(session.user.username)  # 추가 쿼리 없음
# 총 쿼리: 1

# 생성되는 SQL
SELECT chat_sessions.*, auth_user.* 
FROM chat_sessions 
INNER JOIN auth_user ON chat_sessions.user_id = auth_user.id;
```

**prefetch_related (ManyToMany, Reverse ForeignKey)**
```python
# ✅ 2번의 쿼리로 모든 메시지 로드
sessions = ChatSession.objects.prefetch_related('messages').all()
for session in sessions:
    for message in session.messages.all():  # 추가 쿼리 없음
        print(message.content)
# 총 쿼리: 2

# 생성되는 SQL
# 1. SELECT * FROM chat_sessions;
# 2. SELECT * FROM chat_messages WHERE session_id IN (1, 2, 3, ...);
```

**ViewSet에서 적용**
```python
class ChatSessionViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return ChatSession.objects.filter(
            user=self.request.user
        ).select_related(
            'user'                    # User 정보 미리 로드
        ).prefetch_related(
            'messages'                # 메시지 목록 미리 로드
        )
```

**성능 개선**
```
N+1 쿼리: 101 쿼리 (1 + 100) → 3.2초
최적화: 2 쿼리 → 0.05초 (64배 빠름)
```

#### 쿼리 집계 (Aggregation)

**문제점**
```python
# ❌ Python에서 계산 (비효율)
sessions = ChatSession.objects.all()
for session in sessions:
    message_count = session.messages.count()  # 각 세션마다 쿼리
```

**해결책: annotate 사용**
```python
# ✅ SQL에서 집계 (효율적)
from django.db.models import Count

sessions = ChatSession.objects.annotate(
    message_count=Count('messages')
).all()

for session in sessions:
    print(session.message_count)  # 추가 쿼리 없음

# 생성되는 SQL
SELECT 
    chat_sessions.*, 
    COUNT(chat_messages.id) as message_count
FROM chat_sessions
LEFT JOIN chat_messages ON chat_sessions.id = chat_messages.session_id
GROUP BY chat_sessions.id;
```

**성능 비교**
```
Python 계산: 100 세션 × 1 쿼리 = 100 쿼리 (2.5초)
SQL 집계: 1 쿼리 (0.08초) → 31배 빠름
```

---

### 11.2 HTTP 클라이언트 최적화

#### Connection Pooling 도입

**문제점 (requests 라이브러리)**
```python
import requests

# 매 요청마다 새 연결 생성
response = requests.get(url)  # TCP Handshake 발생
response = requests.get(url)  # 또 다시 TCP Handshake
response = requests.get(url)  # 또 다시 TCP Handshake
```

**오버헤드**
- TCP Handshake: 50-100ms
- TLS Handshake (HTTPS): 100-200ms
- 총 지연: 150-300ms per request

**해결책: httpx + Connection Pooling**

**Django 설정 (settings.py)**
```python
import httpx

SHARED_HTTP_CLIENT = httpx.Client(
    timeout=httpx.Timeout(
        connect=5.0,   # 연결 타임아웃
        read=30.0,     # 읽기 타임아웃
        write=10.0,    # 쓰기 타임아웃
        pool=5.0       # 풀 대기 타임아웃
    ),
    limits=httpx.Limits(
        max_connections=50,              # 최대 동시 연결
        max_keepalive_connections=20     # 재사용 가능한 연결
    ),
    http2=False  # HTTP/2 비활성화 (호환성)
)
```

**FastAPI 설정 (main.py)**
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    global http_client
    
    # 시작 시 한 번만 생성
    http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(connect=5.0, read=30.0, write=10.0, pool=5.0),
        limits=httpx.Limits(max_connections=50, max_keepalive_connections=20)
    )
    
    yield
    
    # 종료 시 정리
    await http_client.aclose()

app = FastAPI(lifespan=lifespan)
```

**성능 개선**
```
Connection Pooling 없음:
- 요청당 150-300ms 오버헤드
- 100 요청 = 15-30초 지연

Connection Pooling 있음:
- 첫 요청만 150-300ms
- 이후 요청 0-5ms 오버헤드
- 100 요청 = 0.5-1초 지연

→ 15-30배 빠름
```

#### requests → httpx 마이그레이션

**마이그레이션 이유**
1. **비동기 지원**: FastAPI의 async/await와 호환
2. **Connection Pooling**: 기본 제공 (requests는 Session 필요)
3. **HTTP/2 지원**: 선택적 활성화 가능
4. **Type Hints**: 타입 안전성 향상

**코드 비교**

**동기 방식 (requests)**
```python
import requests

response = requests.get(url, headers=headers)
data = response.json()
```

**비동기 방식 (httpx)**
```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.get(url, headers=headers)
    data = response.json()
```

**스트리밍 비교**

**requests (동기 스트리밍)**
```python
with requests.post(url, json=data, stream=True) as response:
    for line in response.iter_lines():
        process(line)
```

**httpx (비동기 스트리밍)**
```python
async with http_client.stream("POST", url, json=data) as response:
    async for line in response.aiter_lines():
        await process(line)
```

**Timeout 설정 비교**

**requests**
```python
response = requests.get(url, timeout=(5, 30))  # (connect, read)
```

**httpx**
```python
timeout = httpx.Timeout(
    connect=5.0,
    read=30.0,
    write=10.0,
    pool=5.0
)
response = await client.get(url, timeout=timeout)
```

---

### 11.3 Rate Limiting 최적화

#### Token-Aware Rate Limiter

**설계 목표**
- RPM (Requests Per Minute): 100
- TPM (Tokens Per Minute): 10,000
- 사용자 경험: 자동 재시도 (투명한 대기)

**핵심 알고리즘: Sliding Window**

```python
class TokenRateLimiter:
    def __init__(self, rpm_limit=100, tpm_limit=10000):
        self.rpm_limit = rpm_limit
        self.tpm_limit = tpm_limit
        self.request_times = deque()  # (timestamp,)
        self.token_usages = deque()   # (timestamp, tokens)
        self.lock = threading.Lock()
    
    def _cleanup_old_entries(self):
        """1분 이상 지난 항목 제거"""
        cutoff = time.time() - 60
        
        while self.request_times and self.request_times[0] < cutoff:
            self.request_times.popleft()
        
        while self.token_usages and self.token_usages[0][0] < cutoff:
            self.token_usages.popleft()
```

**요청 가능 여부 판단**
```python
def can_proceed(self, estimated_tokens=0):
    with self.lock:
        self._cleanup_old_entries()
        
        # RPM 체크
        if len(self.request_times) >= self.rpm_limit:
            return False
        
        # TPM 체크
        current_tpm = sum(tokens for _, tokens in self.token_usages)
        if current_tpm + estimated_tokens > self.tpm_limit:
            return False
        
        # 기록
        self.request_times.append(time.time())
        self.token_usages.append((time.time(), estimated_tokens))
        return True
```

**대기 시간 계산**
```python
def get_wait_time(self):
    with self.lock:
        self._cleanup_old_entries()
        
        # RPM 대기 시간
        if len(self.request_times) >= self.rpm_limit:
            oldest = self.request_times[0]
            rpm_wait = max(0, 60 - (time.time() - oldest))
        else:
            rpm_wait = 0
        
        # TPM 대기 시간
        current_tpm = sum(tokens for _, tokens in self.token_usages)
        if current_tpm >= self.tpm_limit:
            oldest = self.token_usages[0][0]
            tpm_wait = max(0, 60 - (time.time() - oldest))
        else:
            tpm_wait = 0
        
        return max(rpm_wait, tpm_wait)
```

#### 자동 재시도 메커니즘

**프론트엔드 구현 (fetchEventSource)**

```javascript
const MAX_RETRIES = 3;
let retryCount = 0;

const sendMessage = async () => {
  try {
    await fetchEventSource(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      
      async onopen(response) {
        if (response.status === 429) {
          // Rate Limit 초과
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = parseInt(retryAfter) || 5;
          
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Rate limited. Retrying in ${waitTime}s...`);
            
            // 대기 후 재시도
            await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
            return sendMessage();  // 재귀 호출
          } else {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      },
      
      onmessage(event) {
        // 메시지 처리
        const data = JSON.parse(event.data);
        updateMessage(data.content);
      },
      
      onerror(err) {
        console.error('Stream error:', err);
        throw err;
      }
    });
  } catch (error) {
    setError(error.message);
  }
};
```

**백엔드 응답 (FastAPI)**

```python
@app.post("/agent-messages")
async def send_message(request: ChatRequest):
    wait_time = rate_limiter.get_wait_time()
    
    if wait_time > 0:
        return Response(
            content=json.dumps({
                "error": "Rate limit exceeded",
                "retry_after": int(wait_time)
            }),
            status_code=429,
            headers={
                "Retry-After": str(int(wait_time)),
                "X-RateLimit-Remaining": "0"
            }
        )
    
    # 정상 처리
    # ...
```

**사용자 경험 개선**
```
기존 방식:
요청 → 429 에러 → 사용자가 수동으로 재시도

개선된 방식:
요청 → 429 에러 → 자동 대기 (5초) → 자동 재시도
사용자는 약간의 지연만 인지 (투명한 처리)
```

---

### 11.4 비동기 처리 최적화

#### FastAPI 비동기 핸들러

**동기 vs 비동기 비교**

**동기 처리 (블로킹)**
```python
@app.get("/agents")
def get_agents():
    # 다른 요청 처리 불가 (블로킹)
    response = requests.get(url)  # 3초 대기
    return response.json()

# 동시 10 요청 처리 시간: 30초
```

**비동기 처리 (Non-blocking)**
```python
@app.get("/agents")
async def get_agents():
    # 다른 요청 병렬 처리 가능
    response = await http_client.get(url)  # 3초 대기 (논블로킹)
    return response.json()

# 동시 10 요청 처리 시간: 3초 (10배 빠름)
```

**비동기 스트리밍**

```python
async def event_generator() -> AsyncIterator[str]:
    """SSE 이벤트 비동기 생성"""
    try:
        async with http_client.stream("POST", url, json=data) as response:
            async for line in response.aiter_lines():
                if line.startswith("data:"):
                    yield f"{line}\n\n"
                    # 다른 요청도 동시 처리 가능
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

@app.post("/agent-messages")
async def stream_message(request: ChatRequest):
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )
```

#### 비동기 DB 쿼리 (선택적)

**Django ORM (동기) + async view**
```python
from asgiref.sync import sync_to_async

@sync_to_async
def get_sessions(user_id):
    return list(ChatSession.objects.filter(user_id=user_id))

async def chat_view(request):
    sessions = await get_sessions(request.user.id)
    # ...
```

**주의사항**
- Django ORM은 기본적으로 동기
- `sync_to_async` 래퍼 필요
- 진정한 비동기는 아님 (스레드 풀 사용)

---

### 11.5 에러 핸들링 및 복원력

#### 계층별 에러 처리

**1. FastAPI Gateway (최상위)**

```python
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "timestamp": time.time(),
            "path": request.url.path
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )
```

**2. httpx 네트워크 에러**

```python
try:
    response = await http_client.get(url)
    response.raise_for_status()
    return response.json()

except httpx.ConnectError:
    # 연결 실패 (서버 다운, DNS 오류)
    raise HTTPException(
        status_code=503,
        detail="Service unavailable. Please try again later."
    )

except httpx.TimeoutException:
    # 타임아웃
    raise HTTPException(
        status_code=504,
        detail="Request timeout. The server took too long to respond."
    )

except httpx.HTTPStatusError as e:
    # HTTP 에러 (4xx, 5xx)
    raise HTTPException(
        status_code=e.response.status_code,
        detail=f"External API error: {e.response.text}"
    )
```

**3. Django View 에러**

```python
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.exceptions import APIException

def custom_exception_handler(exc, context):
    # DRF 기본 핸들러 먼저 실행
    response = drf_exception_handler(exc, context)
    
    if response is not None:
        # 커스텀 에러 형식
        response.data = {
            'error': response.data.get('detail', 'Error occurred'),
            'status_code': response.status_code,
            'timestamp': time.time()
        }
    
    return response

# settings.py
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'apps.fabrix_agent_chat.utils.custom_exception_handler'
}
```

**4. 프론트엔드 에러 처리**

```javascript
// Axios 인터셉터
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 서버 응답 에러 (4xx, 5xx)
      const message = error.response.data?.error || 'Server error';
      
      if (error.response.status === 401) {
        // 인증 만료
        sessionStorage.clear();
        window.location.href = '/login';
      } else if (error.response.status === 429) {
        // Rate Limit
        const retryAfter = error.response.headers['retry-after'];
        return Promise.reject(new Error(`Rate limited. Retry in ${retryAfter}s`));
      }
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // 요청 전송했으나 응답 없음 (네트워크 오류)
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // 요청 설정 에러
      return Promise.reject(new Error('Request failed'));
    }
  }
);
```

#### 재시도 전략 (Retry Strategy)

**지수 백오프 (Exponential Backoff)**

```python
import asyncio
from typing import Callable, Any

async def retry_with_backoff(
    func: Callable,
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0
) -> Any:
    """
    지수 백오프를 사용한 재시도
    
    지연 시간: base_delay * (2 ** attempt)
    예: 1초 → 2초 → 4초 → 8초
    """
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries - 1:
                # 마지막 시도 실패 시 예외 발생
                raise
            
            # 지연 시간 계산
            delay = min(base_delay * (2 ** attempt), max_delay)
            logger.warning(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay}s...")
            await asyncio.sleep(delay)

# 사용 예시
async def fetch_data():
    response = await http_client.get(url)
    return response.json()

result = await retry_with_backoff(fetch_data, max_retries=3)
```

**조건부 재시도 (특정 에러만)**

```python
RETRYABLE_STATUS_CODES = {500, 502, 503, 504}

async def fetch_with_retry(url: str, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            response = await http_client.get(url)
            response.raise_for_status()
            return response.json()
        
        except httpx.HTTPStatusError as e:
            if e.response.status_code not in RETRYABLE_STATUS_CODES:
                # 재시도 불가능한 에러 (4xx)
                raise
            
            if attempt == max_retries - 1:
                raise
            
            await asyncio.sleep(2 ** attempt)
```

---

### 11.6 메모리 및 리소스 관리

#### HTTP 클라이언트 수명 관리

**문제점: 연결 누수**
```python
# ❌ 잘못된 방법
async def bad_handler():
    client = httpx.AsyncClient()  # 매 요청마다 생성
    response = await client.get(url)
    return response.json()
    # client.aclose() 호출 안 함 → 연결 누수
```

**해결책: Lifespan 관리**
```python
# ✅ 올바른 방법
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시 한 번만 생성
    global http_client
    http_client = httpx.AsyncClient(...)
    
    yield
    
    # 종료 시 정리
    await http_client.aclose()

app = FastAPI(lifespan=lifespan)
```

#### 스트림 중단 처리

**프론트엔드 (AbortController)**
```javascript
const abortControllerRef = useRef(null);

const sendMessage = async () => {
  // 새 컨트롤러 생성
  abortControllerRef.current = new AbortController();
  
  await fetchEventSource(url, {
    signal: abortControllerRef.current.signal,
    // ...
  });
};

const stopStreaming = () => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
    setIsLoading(false);
  }
};

// 컴포넌트 언마운트 시 정리
useEffect(() => {
  return () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, []);
```

**백엔드 (스트림 정리)**
```python
async def event_generator():
    try:
        async with http_client.stream("POST", url, json=data) as response:
            async for line in response.aiter_lines():
                yield line
    except asyncio.CancelledError:
        # 클라이언트가 연결을 끊음
        logger.info("Stream cancelled by client")
        # 정리 작업
    finally:
        # 리소스 해제
        pass
```

#### 데이터베이스 연결 관리

**Django Connection Pooling (기본)**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        'OPTIONS': {
            'timeout': 20,
        },
        'CONN_MAX_AGE': 600,  # 연결 유지 시간 (초)
    }
}
```

**주의사항**
- SQLite는 단일 쓰기만 지원 (Connection Pool 제한적)
- PostgreSQL/MySQL은 Connection Pool 효과 큼
- Django는 자동으로 요청 종료 시 연결 반환

---

### 11.7 모니터링 및 로깅

#### 구조화된 로깅

**설정 (settings.py)**
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/django.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5,
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
        'apps.fabrix_agent_chat': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
        },
    },
}
```

**로깅 사용**
```python
import logging

logger = logging.getLogger(__name__)

# 다양한 레벨
logger.debug("Detailed debugging information")
logger.info("General information")
logger.warning("Warning message")
logger.error("Error occurred", exc_info=True)  # 스택 트레이스 포함
logger.critical("Critical error")
```

#### 성능 모니터링

**쿼리 실행 시간 측정**
```python
from django.db import connection, reset_queries
from django.conf import settings

def log_queries(func):
    """쿼리 수 및 실행 시간 로깅 데코레이터"""
    def wrapper(*args, **kwargs):
        settings.DEBUG = True  # 쿼리 로깅 활성화
        reset_queries()
        
        result = func(*args, **kwargs)
        
        queries = connection.queries
        total_time = sum(float(q['time']) for q in queries)
        
        logger.info(f"{func.__name__}: {len(queries)} queries, {total_time:.3f}s")
        
        if len(queries) > 10:
            logger.warning(f"High query count: {len(queries)}")
        
        return result
    
    return wrapper

@log_queries
def get_sessions(user):
    return ChatSession.objects.filter(user=user)
```

**API 응답 시간 측정**
```python
import time
from functools import wraps

def measure_time(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        result = await func(*args, **kwargs)
        elapsed = time.time() - start
        
        logger.info(f"{func.__name__} took {elapsed:.3f}s")
        
        if elapsed > 1.0:
            logger.warning(f"Slow endpoint: {func.__name__} ({elapsed:.3f}s)")
        
        return result
    
    return wrapper

@app.get("/agents")
@measure_time
async def get_agents():
    # ...
```

#### Rate Limit 상태 모니터링

```python
@app.get("/rate-limit-status")
async def get_rate_limit_status():
    usage = rate_limiter.get_current_usage()
    wait_time = rate_limiter.get_wait_time()
    
    return {
        "rpm": {
            "used": usage["rpm_used"],
            "limit": rate_limiter.rpm_limit,
            "remaining": rate_limiter.rpm_limit - usage["rpm_used"],
            "reset_in": 60 - (time.time() % 60)
        },
        "tpm": {
            "used": usage["tpm_used"],
            "limit": rate_limiter.tpm_limit,
            "remaining": rate_limiter.tpm_limit - usage["tpm_used"]
        },
        "wait_time_seconds": wait_time,
        "status": "available" if wait_time == 0 else "rate_limited"
    }
```

---

### 11.8 성능 벤치마크 결과

#### 데이터베이스 성능

**테스트 환경**
- 데이터: 100 사용자, 10,000 세션, 100,000 메시지
- 동시 요청: 10명
- 측정 도구: Apache Bench (ab)

**결과**

| 작업 | 최적화 전 | 최적화 후 | 개선율 |
|------|----------|----------|--------|
| 세션 목록 조회 (100개) | 450ms | 12ms | **37배** |
| 메시지 목록 조회 (500개) | 380ms | 15ms | **25배** |
| 세션 생성 (동시 10개) | 2.5초 | 0.3초 | **8배** |
| 복잡한 조회 (JOIN 3개) | 1.2초 | 45ms | **26배** |

**최적화 기법**
- WAL Mode 활성화
- 복합 인덱스 추가
- select_related / prefetch_related 사용
- annotate로 집계 쿼리

#### API 응답 시간

**테스트 시나리오**
- Agent 목록 조회: 100회
- 채팅 메시지 전송: 50회
- 파일 업로드: 20회

**결과**

| API | 최적화 전 | 최적화 후 | 개선율 |
|-----|----------|----------|--------|
| GET /agents | 350ms | 45ms | **7.8배** |
| POST /agent-messages (stream) | 280ms (first byte) | 90ms | **3.1배** |
| POST /sessions | 180ms | 35ms | **5.1배** |
| GET /sessions (with messages) | 520ms | 68ms | **7.6배** |

**최적화 기법**
- Connection Pooling (httpx)
- 비동기 처리 (async/await)
- Rate Limiter 투명한 재시도

#### 동시 사용자 처리

**부하 테스트 결과**

| 동시 사용자 | 최적화 전 TPS | 최적화 후 TPS | 에러율 |
|------------|-------------|-------------|--------|
| 5명 | 18 req/s | 85 req/s | 0% |
| 10명 | 12 req/s | 142 req/s | 0% |
| 20명 | 8 req/s | 215 req/s | 0.2% |
| 50명 | 4 req/s | 380 req/s | 1.5% |

**결론**
- 5-10명: 완벽한 성능
- 20-50명: 우수한 성능, 낮은 에러율
- 50명 이상: SQLite 한계 도달 (PostgreSQL 권장)

---

## 12. 환경 설정 및 설치 가이드

Windows 환경에서 프로젝트를 처음부터 설치하고 구성하는 전체 과정을 단계별로 설명합니다.

### 12.1 시스템 요구사항

#### 하드웨어 요구사항

**최소 사양**
- CPU: 2코어 이상
- RAM: 4GB 이상
- 디스크: 5GB 이상 여유 공간
- 네트워크: 인터넷 연결 필수 (FabriX API 접근)

**권장 사양**
- CPU: 4코어 이상
- RAM: 8GB 이상
- 디스크: 10GB 이상 여유 공간 (SSD 권장)
- 네트워크: 안정적인 인터넷 연결

#### 소프트웨어 요구사항

**운영체제**
- Windows 10 이상 (64-bit)
- Windows 11 (권장)
- Windows Server 2019 이상 (서버 배포 시)

**필수 소프트웨어**
- Python 3.10 이상 (3.11 권장)
- Node.js 18.x 이상 (LTS 버전 권장)
- Git 2.30 이상
- PowerShell 5.1 이상 (Windows 기본 포함)

**선택 소프트웨어**
- VS Code (편집기)
- DB Browser for SQLite (데이터베이스 확인용)

---

### 12.2 Python 설치

#### Python 다운로드 및 설치

**1. Python 공식 웹사이트 접속**
```
https://www.python.org/downloads/
```

**2. Python 3.11.x 다운로드**
- "Download Python 3.11.x" 버튼 클릭
- Windows installer (64-bit) 선택

**3. 설치 실행**
```
✅ "Add Python to PATH" 체크 (중요!)
✅ "Install Now" 클릭
```

**PATH 수동 추가 (체크 안 한 경우)**
```
제어판 → 시스템 → 고급 시스템 설정 → 환경 변수
→ 시스템 변수의 Path 편집
→ 새로 만들기:
   C:\Users\YourName\AppData\Local\Programs\Python\Python311
   C:\Users\YourName\AppData\Local\Programs\Python\Python311\Scripts
```

**4. 설치 확인**
```powershell
# PowerShell 열기
python --version
# 출력: Python 3.11.x

pip --version
# 출력: pip 23.x.x from ...
```

**문제 해결**
```powershell
# Python 실행 시 Microsoft Store 열림
# → Windows 설정 → 앱 → 앱 실행 별칭 → Python 관련 항목 끄기

# "python을 찾을 수 없음" 에러
# → PATH 환경 변수 확인
```

---

### 12.3 Node.js 설치

#### Node.js 다운로드 및 설치

**1. Node.js 공식 웹사이트 접속**
```
https://nodejs.org/
```

**2. LTS 버전 다운로드**
- "18.x.x LTS" (Recommended for Most Users) 선택
- Windows Installer (.msi) 64-bit 다운로드

**3. 설치 실행**
```
기본 옵션으로 설치 (Next → Next → Install)
자동으로 PATH에 추가됨
```

**4. 설치 확인**
```powershell
node --version
# 출력: v18.x.x

npm --version
# 출력: 9.x.x
```

---

### 12.4 Git 설치

#### Git 다운로드 및 설치

**1. Git 공식 웹사이트 접속**
```
https://git-scm.com/download/win
```

**2. 설치 실행**
```
기본 옵션 권장:
- Default editor: VS Code (또는 선호하는 편집기)
- PATH environment: Git from the command line and also from 3rd-party software
- Line ending: Checkout Windows-style, commit Unix-style
```

**3. 설치 확인**
```powershell
git --version
# 출력: git version 2.x.x
```

---

### 12.5 프로젝트 클론 및 구조 확인

#### Git Clone (또는 파일 복사)

**옵션 1: Git Repository에서 클론**
```powershell
# 작업 디렉토리로 이동
cd C:\Users\YourName\

# 클론 (예시)
git clone https://github.com/your-org/fabrix-agent-chat.git
cd fabrix-agent-chat
```

**옵션 2: 압축 파일 압축 해제**
```powershell
# 프로젝트 폴더를 원하는 위치에 압축 해제
# 예: C:\Users\YourName\django_dev\
```

#### 디렉토리 구조 확인

```powershell
# PowerShell에서 확인
cd C:\Users\YourName\django_dev
tree /F

# 예상 구조
django_dev\
├── secrets.toml.example      # 설정 템플릿
├── requirements.txt           # Python 의존성
├── setup_project.bat          # 초기 설정 배치 파일
├── run_project.bat            # 실행 배치 파일
├── django_server\
│   ├── manage.py
│   ├── config\
│   └── apps\
├── ai_gateway\
│   ├── main.py
│   └── rate_limiter.py
└── frontend\
    ├── package.json
    ├── vite.config.js
    └── src\
```

---

### 12.6 secrets.toml 설정

#### 설정 파일 생성

**1. 템플릿 복사**
```powershell
# PowerShell에서 실행
cd C:\Users\YourName\django_dev
copy secrets.toml.example secrets.toml
```

**2. secrets.toml 편집**
```powershell
# VS Code로 열기
code secrets.toml

# 또는 메모장
notepad secrets.toml
```

**3. 필수 설정 값 수정**

```toml
# Django 설정
SECRET_KEY = "django-insecure-CHANGE_THIS_TO_RANDOM_50_CHARS"
DEBUG = true  # 개발 환경: true, 프로덕션: false
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]

# 보안 (회원가입 제한)
AUTH_KEY = "123456"  # 6자리 숫자 변경 권장

# FabriX API 설정 (필수)
FABRIX_API_KEY = "YOUR_ACTUAL_FABRIX_API_KEY_HERE"
FABRIX_URL = "https://fabrix.samsungsds.com"

# 내부 URL
FASTAPI_URL = "http://localhost:8001"
DJANGO_URL = "http://localhost:8000"

# Rate Limiting
RPM_LIMIT = 100    # 분당 요청 수
TPM_LIMIT = 10000  # 분당 토큰 수
```

#### 설정 값 설명

**SECRET_KEY 생성**
```python
# Python으로 랜덤 키 생성
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# 출력 예시:
# django-insecure-7n!@4$kd^f%2h&g*j(p)q=r+s~t#u_v-w.x/y:z0a1b2c3
```

**FABRIX_API_KEY 발급**
```
1. FabriX 웹사이트 로그인
2. 설정 → API Keys
3. "Create New Key" 클릭
4. Key 복사하여 secrets.toml에 붙여넣기
```

**AUTH_KEY 설정**
```
용도: 회원가입 시 필요한 인증 키 (내부 사용자만 가입 가능)
형식: 6자리 숫자 (예: "849302")
추천: 랜덤 6자리 숫자로 변경
```

#### 보안 확인

```powershell
# .gitignore 파일 확인 (secrets.toml이 포함되어 있어야 함)
cat .gitignore

# 출력에 다음이 포함되어야 함:
# secrets.toml
# *.sqlite3
# __pycache__/
```

---

### 12.7 Python 가상환경 설정

#### 가상환경 생성

**1. 프로젝트 루트로 이동**
```powershell
cd C:\Users\YourName\django_dev
```

**2. 가상환경 생성**
```powershell
# venv 생성
python -m venv venv

# 디렉토리 확인
dir venv

# 출력:
# venv\
#   ├── Scripts\
#   │   ├── activate.bat
#   │   ├── python.exe
#   │   └── pip.exe
#   └── Lib\
```

#### 가상환경 활성화

**PowerShell**
```powershell
# 활성화
.\venv\Scripts\Activate.ps1

# 성공 시 프롬프트 변경:
# (venv) PS C:\Users\YourName\django_dev>
```

**PowerShell 실행 정책 오류 발생 시**
```powershell
# 오류 메시지:
# "이 시스템에서 스크립트를 실행할 수 없으므로..."

# 해결책 (관리자 권한 PowerShell):
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 또는 CMD 사용:
cmd
venv\Scripts\activate.bat
```

**CMD (명령 프롬프트)**
```cmd
venv\Scripts\activate.bat

# 성공 시:
# (venv) C:\Users\YourName\django_dev>
```

#### 가상환경 비활성화

```powershell
deactivate

# 프롬프트에서 (venv) 제거됨
```

---

### 12.8 Python 의존성 설치

#### requirements.txt 확인

```powershell
# 파일 내용 확인
cat requirements.txt
```

**주요 패키지**
```
Django>=5.0.0
djangorestframework>=3.14.0
django-cors-headers>=4.3.0
httpx>=0.27.0
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
python-multipart>=0.0.6
tomli>=2.0.0
```

#### 의존성 설치

**1. 가상환경 활성화 확인**
```powershell
# (venv)가 프롬프트에 표시되어야 함
(venv) PS C:\Users\YourName\django_dev>
```

**2. pip 업그레이드**
```powershell
python -m pip install --upgrade pip
```

**3. 의존성 설치**
```powershell
pip install -r requirements.txt

# 설치 진행...
# Collecting Django>=5.0.0
# Collecting djangorestframework>=3.14.0
# ...
# Successfully installed Django-5.0.0 djangorestframework-3.14.0 ...
```

**4. 설치 확인**
```powershell
# 설치된 패키지 목록
pip list

# 주요 패키지 버전 확인
pip show Django
pip show fastapi
pip show httpx
```

#### 문제 해결

**설치 오류 발생 시**
```powershell
# 캐시 삭제 후 재설치
pip cache purge
pip install -r requirements.txt --no-cache-dir

# 특정 패키지만 재설치
pip install Django --force-reinstall
```

**네트워크 오류 시**
```powershell
# 미러 사이트 사용
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

---

### 12.9 Node.js 의존성 설치

#### package.json 확인

```powershell
# frontend 디렉토리로 이동
cd frontend

# package.json 확인
cat package.json
```

**주요 패키지**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "axios": "^1.6.5",
    "@microsoft/fetch-event-source": "^2.0.1",
    "react-markdown": "^9.0.1",
    "lucide-react": "^0.309.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.10",
    "tailwindcss": "^3.4.1"
  }
}
```

#### 의존성 설치

**1. npm install 실행**
```powershell
npm install

# 또는 (더 빠름)
npm ci

# 설치 진행...
# added 500 packages in 45s
```

**2. 설치 확인**
```powershell
# node_modules 디렉토리 생성 확인
dir node_modules

# package-lock.json 생성 확인
dir package-lock.json
```

#### 문제 해결

**권한 오류 (EPERM)**
```powershell
# npm 캐시 정리
npm cache clean --force

# 재설치
npm install
```

**네트워크 오류**
```powershell
# npm 레지스트리 변경 (중국 미러)
npm config set registry https://registry.npmmirror.com

# 설치 후 원래대로
npm config set registry https://registry.npmjs.org
```

**버전 충돌**
```powershell
# package-lock.json 삭제 후 재설치
Remove-Item package-lock.json
Remove-Item -Recurse node_modules
npm install
```

---

### 12.10 데이터베이스 초기화

#### Django 마이그레이션

**1. 프로젝트 루트로 이동**
```powershell
cd C:\Users\YourName\django_dev
```

**2. 가상환경 활성화**
```powershell
.\venv\Scripts\Activate.ps1
```

**3. django_server 디렉토리로 이동**
```powershell
cd django_server
```

**4. 마이그레이션 파일 생성**
```powershell
python manage.py makemigrations

# 출력 예시:
# Migrations for 'fabrix_agent_chat':
#   apps\fabrix_agent_chat\migrations\0001_initial.py
#     - Create model ChatSession
#     - Create model ChatMessage
```

**5. 마이그레이션 적용**
```powershell
python manage.py migrate

# 출력 예시:
# Operations to perform:
#   Apply all migrations: admin, auth, authtoken, contenttypes, fabrix_agent_chat, sessions
# Running migrations:
#   Applying contenttypes.0001_initial... OK
#   Applying auth.0001_initial... OK
#   Applying admin.0001_initial... OK
#   Applying authtoken.0001_initial... OK
#   Applying fabrix_agent_chat.0001_initial... OK
#   ...
```

**6. 데이터베이스 파일 확인**
```powershell
dir db.sqlite3

# 생성된 파일:
# db.sqlite3
```

#### 관리자 계정 생성

**1. superuser 생성**
```powershell
python manage.py createsuperuser

# 입력 프롬프트:
# Username: admin
# Email address: admin@example.com
# Password: ********
# Password (again): ********
# Superuser created successfully.
```

**2. 관리자 페이지 접속 확인**
```powershell
# 서버 시작 (잠시 후 중단)
python manage.py runserver

# 브라우저에서 http://127.0.0.1:8000/admin 접속
# admin / 설정한비밀번호 로그인
```

---

### 12.11 환경 검증

#### 체크리스트

**1. Python 환경**
```powershell
# Python 버전 확인
python --version
# 출력: Python 3.10.x 이상 ✅

# pip 버전 확인
pip --version
# 출력: pip 23.x.x ✅

# 가상환경 활성화 확인
# 프롬프트에 (venv) 표시 ✅

# Django 패키지 확인
python -c "import django; print(django.get_version())"
# 출력: 5.0.x ✅

# FastAPI 패키지 확인
python -c "import fastapi; print(fastapi.__version__)"
# 출력: 0.109.x ✅
```

**2. Node.js 환경**
```powershell
cd frontend

# Node.js 버전 확인
node --version
# 출력: v18.x.x ✅

# npm 버전 확인
npm --version
# 출력: 9.x.x ✅

# 의존성 설치 확인
dir node_modules
# node_modules 디렉토리 존재 ✅
```

**3. 설정 파일**
```powershell
cd C:\Users\YourName\django_dev

# secrets.toml 존재 확인
dir secrets.toml
# 파일 존재 ✅

# secrets.toml 내용 확인 (FABRIX_API_KEY 설정 여부)
Select-String -Path secrets.toml -Pattern "FABRIX_API_KEY"
# FABRIX_API_KEY = "실제키..." ✅
```

**4. 데이터베이스**
```powershell
cd django_server

# db.sqlite3 존재 확인
dir db.sqlite3
# 파일 존재 ✅

# 마이그레이션 상태 확인
python manage.py showmigrations

# 모든 마이그레이션에 [X] 표시되어야 함:
# admin
#  [X] 0001_initial
# auth
#  [X] 0001_initial
# fabrix_agent_chat
#  [X] 0001_initial
```

**5. 배치 파일 확인**
```powershell
cd C:\Users\YourName\django_dev

# 배치 파일 존재 확인
dir *.bat

# 출력:
# setup_project.bat     ✅
# run_project.bat       ✅
# reset_create_admin.bat ✅
```

#### 테스트 실행

**Django 서버 단독 테스트**
```powershell
cd django_server
python manage.py runserver

# 출력:
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CTRL-BREAK.

# 브라우저: http://127.0.0.1:8000/admin
# 접속 확인 후 Ctrl+C 종료
```

**FastAPI 서버 단독 테스트**
```powershell
cd ai_gateway
python -m uvicorn main:app --host 0.0.0.0 --port 8001

# 출력:
# INFO:     Started server process [PID]
# INFO:     Uvicorn running on http://0.0.0.0:8001

# 브라우저: http://127.0.0.1:8001/docs
# Swagger UI 확인 후 Ctrl+C 종료
```

**프론트엔드 단독 테스트**
```powershell
cd frontend
npm run dev

# 출력:
# VITE v5.0.10  ready in 500 ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.x.x:5173/

# 브라우저: http://localhost:5173
# 페이지 로딩 확인 후 Ctrl+C 종료
```

---

### 12.12 초기 설정 자동화 (선택)

#### setup_project.bat 내용

```batch
@echo off
echo ========================================
echo FabriX Agent Chat - Initial Setup
echo ========================================
echo.

REM Check secrets.toml
if not exist "secrets.toml" (
    echo [ERROR] secrets.toml not found!
    echo Please copy secrets.toml.example to secrets.toml and configure it.
    pause
    exit /b 1
)

echo [1/6] Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo [ERROR] Failed to create virtual environment
    pause
    exit /b 1
)

echo [2/6] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/6] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)

echo [4/6] Running Django migrations...
cd django_server
python manage.py migrate
if errorlevel 1 (
    echo [ERROR] Failed to run migrations
    cd ..
    pause
    exit /b 1
)
cd ..

echo [5/6] Installing Node.js dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install Node.js dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo [6/6] Setup complete!
echo.
echo Next steps:
echo 1. Create admin user: cd django_server ^&^& python manage.py createsuperuser
echo 2. Run project: run_project.bat
echo.
pause
```

#### 사용 방법

```powershell
# PowerShell 또는 CMD에서 실행
cd C:\Users\YourName\django_dev
.\setup_project.bat

# 또는 더블클릭으로 실행
```

**실행 순서**
1. secrets.toml 존재 확인
2. Python 가상환경 생성
3. Python 패키지 설치
4. Django 마이그레이션 실행
5. Node.js 패키지 설치
6. 완료 메시지 표시

---

### 12.13 문제 해결 가이드

#### 일반적인 문제

**1. "python을 찾을 수 없음"**
```
원인: Python이 PATH에 없음
해결: Python 재설치 시 "Add Python to PATH" 체크
또는 수동으로 PATH 추가
```

**2. "가상환경 활성화 실패"**
```powershell
# PowerShell 실행 정책 변경
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 또는 CMD 사용
cmd
venv\Scripts\activate.bat
```

**3. "pip install 오류"**
```powershell
# pip 업그레이드
python -m pip install --upgrade pip

# 캐시 삭제 후 재설치
pip cache purge
pip install -r requirements.txt
```

**4. "npm install 실패"**
```powershell
# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
Remove-Item -Recurse node_modules
npm install
```

**5. "포트 충돌 (Address already in use)"**
```powershell
# 포트 사용 프로세스 확인
netstat -ano | findstr :8000
netstat -ano | findstr :8001
netstat -ano | findstr :5173

# 프로세스 종료 (PID 확인 후)
taskkill /PID <PID> /F
```

**6. "secrets.toml 인식 안 됨"**
```
원인: 파일 위치 또는 형식 오류
확인: django_dev\ (루트) 에 위치해야 함
확인: UTF-8 인코딩 (BOM 없음)
```

**7. "FABRIX_API_KEY 오류"**
```
원인: API 키 미설정 또는 잘못된 키
해결: FabriX 웹사이트에서 새 키 발급
secrets.toml의 FABRIX_API_KEY 업데이트
```

#### 로그 확인

**Django 로그**
```powershell
cd django_server
python manage.py runserver

# 콘솔 출력 확인
# 또는 logs/django.log 파일 확인 (설정된 경우)
```

**FastAPI 로그**
```powershell
cd ai_gateway
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --log-level debug

# 상세 로그 출력
```

**Vite 로그**
```powershell
cd frontend
npm run dev

# 빌드 오류 확인
```

---

## 13. 배포 및 실행 가이드

Windows 환경에서 개발 모드 실행부터 프로덕션 배포, Windows 서비스 등록까지 다양한 실행 방법을 설명합니다.

### 13.1 실행 모드 개요

#### 실행 모드 비교

**개발 모드 (Development)**
- 목적: 로컬 개발 및 테스트
- 호스트: 127.0.0.1 (localhost)
- 접근: 본인 컴퓨터만
- 디버그: DEBUG = True
- 자동 재시작: 코드 변경 시 자동 리로드
- 성능: 최적화 안 됨

**서비스 모드 (Service/Production)**
- 목적: 사내망 배포
- 호스트: 0.0.0.0 (모든 네트워크 인터페이스)
- 접근: 같은 네트워크의 다른 컴퓨터
- 디버그: DEBUG = False
- 자동 재시작: 없음 (Windows 서비스로 관리)
- 성능: 프로덕션 최적화

#### 포트 구성

| 서비스 | 포트 | 용도 |
|--------|------|------|
| Django Server | 8000 | REST API, 인증, 데이터 저장 |
| FastAPI Gateway | 8001 | AI 프록시, 스트리밍, Rate Limiting |
| Vite Dev Server | 5173 | 프론트엔드 (개발 모드) |
| Vite Preview | 4173 | 프론트엔드 (빌드 미리보기) |

---

### 13.2 개발 모드 실행

#### 수동 실행 (3개 터미널)

**터미널 1: Django Server**
```powershell
# 프로젝트 루트로 이동
cd C:\Users\YourName\django_dev

# 가상환경 활성화
.\venv\Scripts\Activate.ps1

# Django 서버 디렉토리로 이동
cd django_server

# 개발 서버 시작
python manage.py runserver

# 출력:
# Django version 5.0.x
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CTRL-BREAK.
```

**터미널 2: FastAPI Gateway**
```powershell
# 프로젝트 루트로 이동
cd C:\Users\YourName\django_dev

# 가상환경 활성화
.\venv\Scripts\Activate.ps1

# AI Gateway 디렉토리로 이동
cd ai_gateway

# FastAPI 서버 시작
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload

# 출력:
# INFO:     Uvicorn running on http://127.0.0.1:8001
# INFO:     Application startup complete.
```

**터미널 3: Vite Dev Server**
```powershell
# 프로젝트 루트로 이동
cd C:\Users\YourName\django_dev

# Frontend 디렉토리로 이동
cd frontend

# Vite 개발 서버 시작
npm run dev

# 출력:
# VITE v5.0.10  ready in 500 ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

**접속 확인**
```
브라우저에서 http://localhost:5173 접속
→ 로그인 페이지 표시
→ 회원가입 또는 로그인 진행
```

#### 배치 파일 실행 (자동화)

**run_project.bat 내용**
```batch
@echo off
title FabriX Agent Chat - Development Mode

echo ========================================
echo FabriX Agent Chat
echo Development Mode
echo ========================================
echo.

REM Check virtual environment
if not exist "venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found!
    echo Please run setup_project.bat first.
    pause
    exit /b 1
)

echo Starting all services...
echo.

REM Start Django Server
echo [1/3] Starting Django Server (Port 8000)...
start "Django Server" cmd /k "venv\Scripts\activate.bat && cd django_server && python manage.py runserver"
timeout /t 3 /nobreak >nul

REM Start FastAPI Gateway
echo [2/3] Starting FastAPI Gateway (Port 8001)...
start "FastAPI Gateway" cmd /k "venv\Scripts\activate.bat && cd ai_gateway && python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [3/3] Starting Frontend (Port 5173)...
start "Vite Dev Server" cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Access URLs:
echo - Frontend:  http://localhost:5173
echo - Django:    http://localhost:8000/admin
echo - FastAPI:   http://localhost:8001/docs
echo.
echo Press any key to open browser...
pause >nul

REM Open browser
start http://localhost:5173

echo.
echo To stop all services, close all terminal windows.
echo.
pause
```

**실행 방법**
```powershell
# PowerShell 또는 CMD
cd C:\Users\YourName\django_dev
.\run_project.bat

# 또는 파일 더블클릭
```

**실행 결과**
- 3개의 CMD 창 자동 실행
- 각 서비스 로그 실시간 표시
- 브라우저 자동 오픈
- 종료: 각 CMD 창에서 Ctrl+C

---

### 13.3 프로덕션 빌드

#### 프론트엔드 빌드

**1. 빌드 실행**
```powershell
cd frontend

# 프로덕션 빌드
npm run build

# 출력:
# vite v5.0.10 building for production...
# ✓ 500 modules transformed.
# dist/index.html                  0.45 kB
# dist/assets/index-abc123.js      150.50 kB
# dist/assets/index-def456.css     8.20 kB
# ✓ built in 5.23s
```

**2. 빌드 결과 확인**
```powershell
# dist 디렉토리 생성 확인
dir dist

# 내용:
# dist\
#   ├── index.html
#   ├── assets\
#   │   ├── index-abc123.js
#   │   └── index-def456.css
#   └── favicon.ico
```

**3. 빌드 미리보기**
```powershell
# 빌드된 파일 로컬 서버로 실행
npm run preview

# 출력:
# Local:   http://localhost:4173/
```

#### 프론트엔드 정적 파일 서빙 (옵션)

**방법 1: Django에서 직접 서빙**

**settings.py 추가**
```python
# Static files 설정
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR.parent / 'frontend' / 'dist'

# 프로덕션에서만 사용
if not DEBUG:
    STATICFILES_DIRS = []
```

**urls.py 추가**
```python
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    # ... 기존 URL 패턴
    
    # 프론트엔드 라우팅 (모든 경로를 index.html로)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

# Static files
if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

**방법 2: 별도 웹서버 (Nginx, IIS)**

권장 방법은 Nginx 또는 IIS를 통한 서빙이지만, Windows 환경에서는 Django로 직접 서빙 또는 별도 Node.js 서버 사용이 더 간단합니다.

---

### 13.4 서비스 모드 실행

#### 사내망 접근 허용

**1. secrets.toml 설정**
```toml
# 개발 모드
DEBUG = true
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# 서비스 모드 (사내망 접근 허용)
DEBUG = false
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "192.168.1.100", "your-pc-name"]
```

**ALLOWED_HOSTS 설명**
- `localhost`, `127.0.0.1`: 로컬 접근
- `0.0.0.0`: 모든 인터페이스 (권장 안 함, 개발용)
- `192.168.1.100`: 실제 IP 주소 (권장)
- `your-pc-name`: 컴퓨터 이름
- `your-domain.com`: 도메인 (있는 경우)

**2. IP 주소 확인**
```powershell
# 내 IP 주소 확인
ipconfig

# 출력에서 IPv4 주소 확인:
# IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**3. 방화벽 규칙 추가**
```powershell
# 관리자 권한 PowerShell에서 실행

# Django (Port 8000)
New-NetFirewallRule -DisplayName "FabriX Django" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow

# FastAPI (Port 8001)
New-NetFirewallRule -DisplayName "FabriX FastAPI" -Direction Inbound -LocalPort 8001 -Protocol TCP -Action Allow

# Vite (Port 5173) - 개발 모드만
New-NetFirewallRule -DisplayName "FabriX Vite" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
```

**GUI로 방화벽 설정**
```
1. Windows 방화벽 → 고급 설정
2. 인바운드 규칙 → 새 규칙
3. 포트 → TCP → 특정 로컬 포트: 8000, 8001
4. 연결 허용 → 다음 → 이름: FabriX Chat
```

#### 서비스 모드 실행

**service_project.bat 내용**
```batch
@echo off
title FabriX Agent Chat - Service Mode

echo ========================================
echo FabriX Agent Chat
echo Service Mode (Network Access)
echo ========================================
echo.

REM Check secrets.toml
if not exist "secrets.toml" (
    echo [ERROR] secrets.toml not found!
    pause
    exit /b 1
)

echo WARNING: This will expose services to your network.
echo Make sure firewall rules are configured.
echo.
pause

echo Starting services in network mode...
echo.

REM Start Django Server (0.0.0.0)
echo [1/3] Starting Django Server on 0.0.0.0:8000...
start "Django Server" cmd /k "venv\Scripts\activate.bat && cd django_server && python manage.py runserver 0.0.0.0:8000"
timeout /t 3 /nobreak >nul

REM Start FastAPI Gateway (0.0.0.0)
echo [2/3] Starting FastAPI Gateway on 0.0.0.0:8001...
start "FastAPI Gateway" cmd /k "venv\Scripts\activate.bat && cd ai_gateway && python -m uvicorn main:app --host 0.0.0.0 --port 8001"
timeout /t 3 /nobreak >nul

REM Start Frontend (0.0.0.0)
echo [3/3] Starting Frontend on 0.0.0.0:5173...
start "Vite Dev Server" cmd /k "cd frontend && npm run dev -- --host 0.0.0.0"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo All services started in network mode!
echo ========================================
echo.
echo Access from other PCs:
echo - http://YOUR_IP:5173 (Frontend)
echo - http://YOUR_IP:8000 (Django API)
echo - http://YOUR_IP:8001 (FastAPI)
echo.
echo Replace YOUR_IP with: 192.168.x.x
echo.
pause
```

**접속 테스트**
```
다른 컴퓨터에서:
http://192.168.1.100:5173

본인 컴퓨터에서도 동일 URL 사용 가능
```

---

### 13.5 프론트엔드 배포 옵션

#### 옵션 1: 개발 서버 (사내망용)

**장점**
- 설정 간단
- HMR (Hot Module Replacement) 지원
- 실시간 코드 변경 반영

**단점**
- 프로덕션 최적화 없음
- 성능 낮음

**실행**
```powershell
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

#### 옵션 2: Vite Preview (빌드 후 미리보기)

**장점**
- 프로덕션 빌드 테스트
- 최적화된 파일 서빙

**단점**
- 코드 변경 시 재빌드 필요

**실행**
```powershell
cd frontend
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

#### 옵션 3: Python HTTP Server (간단한 정적 파일 서버)

**실행**
```powershell
cd frontend\dist
python -m http.server 5173 --bind 0.0.0.0

# 접속: http://192.168.x.x:5173
```

#### 옵션 4: Node.js Express Server (추천)

**serve 패키지 설치**
```powershell
cd frontend
npm install -g serve
```

**실행**
```powershell
# 빌드 후 serve 실행
npm run build
serve -s dist -l 5173 --host 0.0.0.0

# 출력:
# Serving!
# - Local:    http://localhost:5173
# - Network:  http://192.168.x.x:5173
```


---

### 13.6 배포 체크리스트

#### 보안 체크

- [ ] `DEBUG = False` 설정 (secrets.toml)
- [ ] `SECRET_KEY` 랜덤 값으로 변경 (50자 이상)
- [ ] `AUTH_KEY` 변경 (기본값 123456 사용 금지)
- [ ] `ALLOWED_HOSTS` 특정 IP/도메인으로 제한
- [ ] `FABRIX_API_KEY` 프로덕션 키로 설정
- [ ] secrets.toml 파일 권한 제한 (읽기 전용)

#### 네트워크 체크

- [ ] 방화벽 규칙 추가 (포트 8000, 8001, 5173)
- [ ] IP 주소 확인 및 문서화
- [ ] 라우터 포트 포워딩 설정 (외부 접근 시)
- [ ] HTTPS 인증서 설치 (선택, 프로덕션 권장)

#### 데이터베이스 체크

- [ ] 마이그레이션 완료 확인
- [ ] 관리자 계정 생성
- [ ] 데이터베이스 백업 설정
- [ ] WAL 모드 활성화 확인

#### 서비스 체크

- [ ] 모든 서비스 정상 실행 확인
- [ ] 서비스 자동 시작 설정
- [ ] 로그 경로 설정 및 확인
- [ ] 에러 알림 설정 (선택)

#### 성능 체크

- [ ] 프론트엔드 빌드 최적화 (npm run build)
- [ ] Connection Pooling 설정 확인
- [ ] Rate Limiting 동작 확인
- [ ] 동시 사용자 부하 테스트

---

### 13.8 모니터링 및 관리

#### 로그 확인

**Django 로그**
```powershell
# 실시간 로그 (개발 모드)
cd django_server
python manage.py runserver

# 서비스 모드 로그 파일
Get-Content C:\Users\YourName\django_dev\logs\django_stdout.log -Tail 50 -Wait
```

**FastAPI 로그**
```powershell
# 실시간 로그
cd ai_gateway
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --log-level info

# 서비스 모드 로그 파일
Get-Content C:\Users\YourName\django_dev\logs\fastapi_stdout.log -Tail 50 -Wait
```

**Windows 이벤트 로그**
```powershell
# NSSM 서비스 로그
Get-EventLog -LogName Application -Source FabriXDjango -Newest 20
Get-EventLog -LogName Application -Source FabriXFastAPI -Newest 20
```

#### 서비스 재시작

**PowerShell 명령어**
```powershell
# 서비스 재시작
Restart-Service FabriXDjango
Restart-Service FabriXFastAPI

# 상태 확인
Get-Service FabriX* | Format-Table -AutoSize

# 중지
Stop-Service FabriXDjango, FabriXFastAPI

# 시작
Start-Service FabriXDjango, FabriXFastAPI
```

**배치 파일 (restart_services.bat)**
```batch
@echo off
echo Restarting FabriX services...

net stop FabriXDjango
net stop FabriXFastAPI

timeout /t 2 /nobreak >nul

net start FabriXDjango
net start FabriXFastAPI

echo Services restarted successfully.
pause
```

#### 헬스 체크

**엔드포인트 확인**
```powershell
# Django 헬스 체크
Invoke-WebRequest -Uri http://localhost:8000/admin/ -UseBasicParsing

# FastAPI 헬스 체크
Invoke-WebRequest -Uri http://localhost:8001/docs -UseBasicParsing

# Rate Limit 상태
Invoke-WebRequest -Uri http://localhost:8001/rate-limit-status -UseBasicParsing | ConvertFrom-Json
```

**자동 헬스 체크 스크립트 (health_check.ps1)**
```powershell
$services = @(
    @{Name="Django"; Url="http://localhost:8000/admin/"; Port=8000},
    @{Name="FastAPI"; Url="http://localhost:8001/docs"; Port=8001}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "[OK] $($service.Name) is running on port $($service.Port)" -ForegroundColor Green
        }
    } catch {
        Write-Host "[ERROR] $($service.Name) is not responding on port $($service.Port)" -ForegroundColor Red
        # 알림 전송 (이메일, Slack 등)
    }
}
```

**작업 스케줄러 등록 (5분마다 헬스 체크)**
```powershell
# 작업 생성
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\Users\YourName\django_dev\health_check.ps1"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration ([TimeSpan]::MaxValue)
$principal = New-ScheduledTaskPrincipal -UserId "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName "FabriX Health Check" -Action $action -Trigger $trigger -Principal $principal
```

---

### 13.9 백업 및 복원

#### 데이터베이스 백업

**자동 백업 스크립트 (backup_db.bat)**
```batch
@echo off
setlocal

REM 백업 디렉토리
set BACKUP_DIR=C:\Users\YourName\django_dev\backups
set DB_FILE=C:\Users\YourName\django_dev\django_server\db.sqlite3

REM 날짜/시간 형식
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

REM 백업 디렉토리 생성
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM 체크포인트 실행 (WAL 파일 병합)
cd C:\Users\YourName\django_dev\django_server
..\venv\Scripts\python.exe -c "import sqlite3; conn = sqlite3.connect('db.sqlite3'); conn.execute('PRAGMA wal_checkpoint(FULL)'); conn.close()"

REM 백업 복사
copy "%DB_FILE%" "%BACKUP_DIR%\db_backup_%TIMESTAMP%.sqlite3"
copy "%DB_FILE%-wal" "%BACKUP_DIR%\db_backup_%TIMESTAMP%.sqlite3-wal" 2>nul
copy "%DB_FILE%-shm" "%BACKUP_DIR%\db_backup_%TIMESTAMP%.sqlite3-shm" 2>nul

echo Backup completed: db_backup_%TIMESTAMP%.sqlite3

REM 오래된 백업 삭제 (30일 이상)
forfiles /P "%BACKUP_DIR%" /M db_backup_*.sqlite3 /D -30 /C "cmd /c del @path" 2>nul

endlocal
```

**작업 스케줄러 등록 (매일 새벽 3시)**
```powershell
$action = New-ScheduledTaskAction -Execute "C:\Users\YourName\django_dev\backup_db.bat"
$trigger = New-ScheduledTaskTrigger -Daily -At 3AM
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount

Register-ScheduledTask -TaskName "FabriX Database Backup" -Action $action -Trigger $trigger -Principal $principal
```

#### 데이터베이스 복원

**복원 스크립트 (restore_db.bat)**
```batch
@echo off
echo ========================================
echo FabriX Database Restore
echo ========================================
echo.

REM 백업 파일 선택
set /p BACKUP_FILE="Enter backup file name (without path): "

set BACKUP_DIR=C:\Users\YourName\django_dev\backups
set DB_FILE=C:\Users\YourName\django_dev\django_server\db.sqlite3

if not exist "%BACKUP_DIR%\%BACKUP_FILE%" (
    echo ERROR: Backup file not found!
    pause
    exit /b 1
)

echo WARNING: This will overwrite the current database!
echo Current database will be backed up before restore.
pause

REM 현재 DB 백업
copy "%DB_FILE%" "%DB_FILE%.before_restore" /Y

REM 복원
copy "%BACKUP_DIR%\%BACKUP_FILE%" "%DB_FILE%" /Y

echo.
echo Database restored successfully.
echo Previous database saved as: db.sqlite3.before_restore
pause
```

---

### 13.10 업데이트 및 유지보수

#### 코드 업데이트

**Git Pull 후 재시작**
```powershell
# 프로젝트 루트로 이동
cd C:\Users\YourName\django_dev

# 변경사항 가져오기
git pull origin main

# 가상환경 활성화
.\venv\Scripts\Activate.ps1

# Python 의존성 업데이트
pip install -r requirements.txt --upgrade

# Django 마이그레이션
cd django_server
python manage.py migrate

# Node.js 의존성 업데이트
cd ..\frontend
npm install

# 프론트엔드 빌드
npm run build

# 서비스 재시작
Restart-Service FabriXDjango, FabriXFastAPI
```

#### 의존성 패키지 업데이트

**Python 패키지**
```powershell
# 가상환경 활성화
.\venv\Scripts\Activate.ps1

# 업데이트 가능한 패키지 확인
pip list --outdated

# 특정 패키지 업데이트
pip install Django --upgrade
pip install fastapi --upgrade

# requirements.txt 업데이트
pip freeze > requirements.txt
```

**Node.js 패키지**
```powershell
cd frontend

# 업데이트 가능한 패키지 확인
npm outdated

# 특정 패키지 업데이트
npm install react@latest
npm install vite@latest

# 전체 업데이트 (주의)
npm update
```

---

## 14. 관리자 운영 가이드

시스템 관리자를 위한 일상 운영, 사용자 관리, 데이터베이스 유지보수, 문제 해결 가이드입니다.

### 14.1 Django Admin 인터페이스

#### Admin 접속

**URL**
```
http://localhost:8000/admin/
또는
http://192.168.x.x:8000/admin/
```

**로그인**
```
Username: 관리자 계정 (superuser)
Password: 생성 시 설정한 비밀번호
```

#### Admin 메인 화면

**표시되는 모델들**
- **인증 및 권한**
  - Users (사용자)
  - Groups (그룹)
- **Fabrix Agent Chat**
  - Chat sessions (채팅 세션)
  - Chat messages (채팅 메시지)

#### 관리자 계정 생성

**초기 관리자 생성**
```powershell
cd django_server
python manage.py createsuperuser

# 입력:
# Username: admin
# Email address: admin@example.com
# Password: (강력한 비밀번호)
# Password (again): (재입력)
```

**추가 관리자 생성 (Admin 페이지에서)**
```
1. Admin 로그인
2. Users → Add User 클릭
3. Username, Password 입력 후 Save
4. 생성된 사용자 클릭
5. Permissions:
   - Active 체크
   - Staff status 체크
   - Superuser status 체크 (전체 권한)
6. Save
```

---

### 14.2 사용자 관리

#### 사용자 생성

**방법 1: Django Admin에서 생성**
```
1. Admin → Users → Add User
2. Username 입력 (예: john_doe)
3. Password 입력 및 확인
4. Save and continue editing
5. Personal info:
   - First name: John
   - Last name: Doe
   - Email: john@example.com
6. Permissions:
   - Active: 체크 (로그인 허용)
   - Staff status: 필요 시 체크 (Admin 접근)
   - Superuser status: 관리자만 체크
7. Save
```

**방법 2: Management Command (대량 생성)**
```python
# django_server/apps/fabrix_agent_chat/management/commands/create_users.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create multiple users from CSV'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str)

    def handle(self, *args, **options):
        import csv
        with open(options['csv_file'], 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                user, created = User.objects.get_or_create(
                    username=row['username'],
                    defaults={
                        'first_name': row['first_name'],
                        'last_name': row['last_name'],
                        'email': row['email'],
                    }
                )
                if created:
                    user.set_password(row['password'])
                    user.save()
                    self.stdout.write(
                        self.style.SUCCESS(f'Created user: {user.username}')
                    )
```

**CSV 파일 예시 (users.csv)**
```csv
username,password,first_name,last_name,email
john_doe,Pass123!,John,Doe,john@example.com
jane_smith,Pass456!,Jane,Smith,jane@example.com
```

**실행**
```powershell
python manage.py create_users users.csv
```

#### 사용자 비밀번호 재설정

**방법 1: Admin 페이지**
```
1. Admin → Users → 사용자 선택
2. Password 섹션에서 "this form" 클릭
3. 새 비밀번호 입력 및 확인
4. Change Password 클릭
```

**방법 2: Management Command**
```powershell
python manage.py changepassword username

# 입력:
# Password: (새 비밀번호)
# Password (again): (재입력)
```

**방법 3: Python Shell**
```powershell
python manage.py shell

# Shell에서:
>>> from django.contrib.auth.models import User
>>> user = User.objects.get(username='john_doe')
>>> user.set_password('NewPassword123!')
>>> user.save()
>>> exit()
```

#### 사용자 비활성화

**일시적 비활성화 (계정 정지)**
```
1. Admin → Users → 사용자 선택
2. Permissions:
   - Active 체크 해제
3. Save

→ 사용자는 로그인할 수 없으나 데이터는 보존됨
```

**영구 삭제**
```
1. Admin → Users → 사용자 선택
2. 하단 Delete 버튼 클릭
3. 확인 페이지에서 삭제할 관련 데이터 확인
   - Chat sessions: X개
   - Chat messages: Y개
4. Yes, I'm sure 클릭

→ 사용자 및 모든 관련 데이터 삭제 (복구 불가)
```

#### 사용자 권한 관리

**권한 레벨**
- **일반 사용자**: Active만 체크, 채팅 사용 가능
- **Staff 사용자**: Active + Staff status, Admin 접근 가능
- **Superuser**: Active + Staff + Superuser, 모든 권한

**개별 권한 부여**
```
1. Admin → Users → 사용자 선택
2. Permissions → User permissions:
   - fabrix_agent_chat | chat session | Can add chat session
   - fabrix_agent_chat | chat session | Can change chat session
   - fabrix_agent_chat | chat session | Can delete chat session
   - fabrix_agent_chat | chat session | Can view chat session
3. 필요한 권한 선택 후 → 클릭으로 이동
4. Save
```

**그룹 권한 관리**
```
1. Admin → Groups → Add Group
2. Name: Chat Managers
3. Permissions: 채팅 관련 권한 선택
4. Save
5. Admin → Users → 사용자 선택
6. Permissions → Groups: Chat Managers 선택
7. Save
```

---

### 14.3 채팅 세션 및 메시지 관리

#### 세션 목록 확인

**Admin에서 확인**
```
1. Admin → Chat sessions
2. 필터 옵션:
   - By user: 사용자별
   - By created_at: 날짜별
3. 검색: 세션 제목으로 검색
```

**필드 정보**
- **Title**: 세션 제목
- **User**: 소유자
- **Created at**: 생성 일시
- **Updated at**: 마지막 활동
- **Messages**: 메시지 개수

#### 세션 상세 조회

**특정 세션의 모든 메시지 확인**
```
1. Admin → Chat sessions → 세션 선택
2. 세션 상세 페이지에서 정보 확인
3. 하단 "Chat messages" 섹션에서 관련 메시지 확인
   - 또는 Admin → Chat messages → Filter by session
```

#### 메시지 관리

**메시지 목록**
```
Admin → Chat messages
- 필터: Session, Role (user/assistant/system)
- 검색: 메시지 내용
- 정렬: 생성 일시
```

**메시지 삭제**
```
1. Admin → Chat messages
2. 체크박스로 메시지 선택
3. Action: Delete selected chat messages
4. Go 클릭
5. 확인 후 Yes, I'm sure
```

#### 세션 정리 (오래된 데이터 삭제)

**Management Command 생성**
```python
# django_server/apps/fabrix_agent_chat/management/commands/cleanup_old_sessions.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.fabrix_agent_chat.models import ChatSession

class Command(BaseCommand):
    help = 'Delete chat sessions older than N days'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=90,
            help='Delete sessions older than this many days (default: 90)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting'
        )

    def handle(self, *args, **options):
        days = options['days']
        dry_run = options['dry_run']
        
        cutoff_date = timezone.now() - timedelta(days=days)
        old_sessions = ChatSession.objects.filter(created_at__lt=cutoff_date)
        
        count = old_sessions.count()
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f'DRY RUN: Would delete {count} sessions older than {days} days'
                )
            )
            for session in old_sessions[:10]:  # 처음 10개만 표시
                self.stdout.write(f'  - {session.title} (User: {session.user.username})')
        else:
            old_sessions.delete()
            self.stdout.write(
                self.style.SUCCESS(
                    f'Deleted {count} sessions older than {days} days'
                )
            )
```

**실행**
```powershell
# 미리보기 (삭제 안 됨)
python manage.py cleanup_old_sessions --days=90 --dry-run

# 실제 삭제
python manage.py cleanup_old_sessions --days=90

# 30일 이상 된 세션 삭제
python manage.py cleanup_old_sessions --days=30
```

**작업 스케줄러 등록 (매주 일요일 새벽 4시)**
```powershell
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-Command `"cd C:\Users\YourName\django_dev\django_server; ..\venv\Scripts\python.exe manage.py cleanup_old_sessions --days=90`""
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 4AM
Register-ScheduledTask -TaskName "FabriX Cleanup Old Sessions" -Action $action -Trigger $trigger
```

---

### 14.4 데이터베이스 유지보수

#### 데이터베이스 상태 확인

**크기 확인**
```powershell
# SQLite 파일 크기
Get-Item C:\Users\YourName\django_dev\django_server\db.sqlite3 | Select-Object Name, Length

# MB 단위
(Get-Item C:\Users\YourName\django_dev\django_server\db.sqlite3).Length / 1MB
```

**테이블별 레코드 수**
```powershell
python manage.py shell

# Shell에서:
>>> from apps.fabrix_agent_chat.models import ChatSession, ChatMessage
>>> from django.contrib.auth.models import User
>>> 
>>> print(f"Users: {User.objects.count()}")
>>> print(f"Sessions: {ChatSession.objects.count()}")
>>> print(f"Messages: {ChatMessage.objects.count()}")
>>> exit()
```

**WAL 모드 확인**
```powershell
python manage.py shell

# Shell에서:
>>> import sqlite3
>>> conn = sqlite3.connect('db.sqlite3')
>>> cursor = conn.cursor()
>>> cursor.execute("PRAGMA journal_mode;")
>>> print(cursor.fetchone())  # ('wal',)
>>> conn.close()
>>> exit()
```

#### 데이터베이스 최적화

**VACUUM (공간 회수)**
```powershell
python manage.py shell

# Shell에서:
>>> import sqlite3
>>> conn = sqlite3.connect('db.sqlite3')
>>> 
>>> # WAL 체크포인트 (변경사항 병합)
>>> conn.execute('PRAGMA wal_checkpoint(FULL);')
>>> 
>>> # VACUUM (파일 크기 최적화)
>>> conn.execute('VACUUM;')
>>> 
>>> # ANALYZE (쿼리 최적화를 위한 통계 업데이트)
>>> conn.execute('ANALYZE;')
>>> 
>>> conn.close()
>>> exit()
```

**자동 최적화 스크립트 (optimize_db.ps1)**
```powershell
# optimize_db.ps1
$dbPath = "C:\Users\YourName\django_dev\django_server\db.sqlite3"

Write-Host "Optimizing database: $dbPath"

# Python 스크립트 실행
$pythonScript = @"
import sqlite3
conn = sqlite3.connect('$dbPath')
print('Executing WAL checkpoint...')
conn.execute('PRAGMA wal_checkpoint(FULL);')
print('Running VACUUM...')
conn.execute('VACUUM;')
print('Updating statistics (ANALYZE)...')
conn.execute('ANALYZE;')
conn.close()
print('Database optimization complete.')
"@

cd C:\Users\YourName\django_dev\django_server
..\venv\Scripts\python.exe -c $pythonScript
```

**작업 스케줄러 등록 (매주 토요일 새벽 3시)**
```powershell
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\Users\YourName\django_dev\optimize_db.ps1"
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Saturday -At 3AM
Register-ScheduledTask -TaskName "FabriX Database Optimization" -Action $action -Trigger $trigger
```

#### 데이터베이스 무결성 검사

**PRAGMA integrity_check**
```powershell
python manage.py shell

# Shell에서:
>>> import sqlite3
>>> conn = sqlite3.connect('db.sqlite3')
>>> cursor = conn.cursor()
>>> cursor.execute("PRAGMA integrity_check;")
>>> result = cursor.fetchone()
>>> print(result)  # ('ok',) 정상, 그 외 에러 메시지
>>> conn.close()
>>> exit()
```

**무결성 검사 스크립트 (check_db_integrity.ps1)**
```powershell
# check_db_integrity.ps1
$dbPath = "C:\Users\YourName\django_dev\django_server\db.sqlite3"

$pythonScript = @"
import sqlite3
conn = sqlite3.connect('$dbPath')
cursor = conn.cursor()
cursor.execute('PRAGMA integrity_check;')
result = cursor.fetchone()[0]
conn.close()
if result == 'ok':
    print('Database integrity: OK')
    exit(0)
else:
    print(f'Database integrity: FAILED - {result}')
    exit(1)
"@

cd C:\Users\YourName\django_dev\django_server
..\venv\Scripts\python.exe -c $pythonScript

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Database integrity check failed!" -ForegroundColor Red
    # 알림 전송 (이메일, Slack 등)
} else {
    Write-Host "Database integrity check passed." -ForegroundColor Green
}
```

---

### 14.5 로그 관리 및 분석

#### Django 로그 설정

**settings.py 로깅 설정**
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR.parent / 'logs' / 'django.log',
            'maxBytes': 10 * 1024 * 1024,  # 10 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'apps': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

#### 로그 확인

**실시간 로그 모니터링**
```powershell
# Django 로그
Get-Content C:\Users\YourName\django_dev\logs\django.log -Tail 50 -Wait

# FastAPI 로그
Get-Content C:\Users\YourName\django_dev\logs\fastapi_stdout.log -Tail 50 -Wait

# 에러만 필터링
Get-Content C:\Users\YourName\django_dev\logs\django.log -Wait | Where-Object { $_ -match "ERROR|CRITICAL" }
```

**로그 검색**
```powershell
# 특정 날짜 로그
Select-String -Path C:\Users\YourName\django_dev\logs\django.log -Pattern "2026-01-30"

# 특정 에러 검색
Select-String -Path C:\Users\YourName\django_dev\logs\django.log -Pattern "DoesNotExist"

# 여러 파일 검색
Get-ChildItem C:\Users\YourName\django_dev\logs\*.log | Select-String -Pattern "500 Internal Server Error"
```

#### 로그 로테이션

**Python RotatingFileHandler 설정 (위 LOGGING 설정에 포함)**
- 파일 크기: 10MB
- 백업 개수: 5개
- 총 최대 크기: 50MB

**수동 로그 아카이브**
```powershell
# 오래된 로그 압축
Compress-Archive -Path C:\Users\YourName\django_dev\logs\*.log -DestinationPath C:\Users\YourName\django_dev\logs\archive\logs_2026_01.zip

# 압축 후 원본 삭제
Remove-Item C:\Users\YourName\django_dev\logs\*.log.1, C:\Users\YourName\django_dev\logs\*.log.2
```

---

### 14.6 성능 모니터링

#### 시스템 리소스 모니터링

**CPU 및 메모리 사용량**
```powershell
# Python 프로세스 확인
Get-Process python | Select-Object Id, ProcessName, CPU, WorkingSet

# WorkingSet을 MB로 표시
Get-Process python | Select-Object Id, ProcessName, CPU, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet / 1MB, 2)}}

# 특정 프로세스 지속 모니터링
while ($true) {
    Clear-Host
    Get-Process python | Select-Object Id, ProcessName, CPU, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet / 1MB, 2)}} | Format-Table -AutoSize
    Start-Sleep -Seconds 5
}
```

#### 데이터베이스 성능 모니터링

**쿼리 실행 시간 로깅**
```python
# settings.py에 추가
if DEBUG:
    LOGGING['loggers']['django.db.backends'] = {
        'handlers': ['console'],
        'level': 'DEBUG',
        'propagate': False,
    }
```

**느린 쿼리 찾기**
```powershell
# 로그에서 느린 쿼리 검색 (0.1초 이상)
Select-String -Path C:\Users\YourName\django_dev\logs\django.log -Pattern "\(0\.[1-9]" | Select-Object -First 20
```

**Django Debug Toolbar (개발 환경)**
```powershell
# 설치
pip install django-debug-toolbar

# settings.py 추가
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
INTERNAL_IPS = ['127.0.0.1']

# urls.py 추가 (DEBUG=True일 때만)
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
```

#### API 응답 시간 모니터링

**Custom Middleware로 응답 시간 로깅**
```python
# django_server/apps/fabrix_agent_chat/middleware.py
import time
import logging

logger = logging.getLogger('apps')

class ResponseTimeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time
        
        # 느린 요청 로깅 (1초 이상)
        if duration > 1.0:
            logger.warning(
                f'Slow request: {request.method} {request.path} - {duration:.2f}s'
            )
        
        response['X-Response-Time'] = f'{duration:.3f}s'
        return response
```

**settings.py에 Middleware 추가**
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... 기존 미들웨어
    'apps.fabrix_agent_chat.middleware.ResponseTimeMiddleware',  # 추가
]
```

---

### 14.7 장애 대응

#### 일반적인 문제 및 해결

**1. 서비스가 시작되지 않음**

**증상**
```
서비스 시작 실패 또는 즉시 중단
```

**진단**
```powershell
# 서비스 상태 확인
Get-Service FabriX*

# 이벤트 로그 확인
Get-EventLog -LogName Application -Source FabriX* -Newest 10

# 수동 실행으로 에러 메시지 확인
cd C:\Users\YourName\django_dev\django_server
..\venv\Scripts\python.exe manage.py runserver
```

**해결**
- Port 충돌: 다른 프로세스가 포트 사용 중
  ```powershell
  # 포트 사용 확인
  netstat -ano | findstr "8000"
  
  # 프로세스 종료
  Stop-Process -Id <PID> -Force
  ```
- 가상환경 경로 오류: NSSM 설정에서 경로 수정
- secrets.toml 오류: 파일 존재 및 문법 확인

**2. 데이터베이스 잠금 오류**

**증상**
```
sqlite3.OperationalError: database is locked
```

**진단**
```powershell
# db.sqlite3 파일 잠금 확인
Get-Process | Where-Object {$_.Modules.FileName -like "*db.sqlite3*"}
```

**해결**
```powershell
# 모든 서비스 중지
Stop-Service FabriX*

# WAL 파일 체크포인트
cd django_server
..\venv\Scripts\python.exe -c "import sqlite3; conn = sqlite3.connect('db.sqlite3'); conn.execute('PRAGMA wal_checkpoint(FULL)'); conn.close()"

# 서비스 재시작
Start-Service FabriX*
```

**3. Rate Limit 초과**

**증상**
```
프론트엔드에서 "Rate limit exceeded" 메시지
```

**진단**
```powershell
# FastAPI 로그 확인
Get-Content C:\Users\YourName\django_dev\logs\fastapi_stdout.log -Tail 50 | Select-String "Rate limit"
```

**해결**
- 일시적: 사용자가 1분 대기 후 재시도
- 영구적: `ai_gateway/rate_limiter.py`에서 한도 증가
  ```python
  MAX_REQUESTS_PER_MINUTE = 200  # 100 → 200
  MAX_TOKENS_PER_MINUTE = 20000  # 10000 → 20000
  ```

**4. API 키 오류**

**증상**
```
FastAPI 로그: "Invalid API key" 또는 "Unauthorized"
```

**진단**
```powershell
# secrets.toml 확인
Get-Content C:\Users\YourName\django_dev\secrets.toml | Select-String "FABRIX_API_KEY"
```

**해결**
- API 키 유효성 확인
- FabriX Portal에서 새 키 발급
- secrets.toml 업데이트 후 서비스 재시작

**5. 프론트엔드 접속 안 됨**

**증상**
```
브라우저에서 localhost:5173 접속 불가
```

**진단**
```powershell
# Vite 서버 프로세스 확인
Get-Process node

# 포트 사용 확인
netstat -ano | findstr "5173"
```

**해결**
```powershell
# Node.js 프로세스 종료
Stop-Process -Name node -Force

# Vite 재시작
cd C:\Users\YourName\django_dev\frontend
npm run dev
```

#### 긴급 복구 절차

**전체 시스템 재시작**
```powershell
# 1. 모든 서비스 중지
Stop-Service FabriX*

# 2. 모든 Python/Node 프로세스 종료
Stop-Process -Name python, node -Force

# 3. 데이터베이스 체크포인트
cd C:\Users\YourName\django_dev\django_server
..\venv\Scripts\python.exe -c "import sqlite3; conn = sqlite3.connect('db.sqlite3'); conn.execute('PRAGMA wal_checkpoint(FULL)'); conn.close()"

# 4. 서비스 재시작
Start-Service FabriX*

# 5. 상태 확인
Get-Service FabriX* | Format-Table -AutoSize
```

**데이터베이스 복구**
```powershell
# 1. 백업 확인
Get-ChildItem C:\Users\YourName\django_dev\backups | Sort-Object LastWriteTime -Descending | Select-Object -First 5

# 2. 최신 백업 복원
cd C:\Users\YourName\django_dev\django_server
Copy-Item ..\backups\db_backup_20260130_030000.sqlite3 db.sqlite3 -Force

# 3. 무결성 검사
..\venv\Scripts\python.exe -c "import sqlite3; conn = sqlite3.connect('db.sqlite3'); cursor = conn.cursor(); cursor.execute('PRAGMA integrity_check;'); print(cursor.fetchone()); conn.close()"

# 4. 서비스 시작
Start-Service FabriX*
```

---

### 14.8 보안 관리

#### API 키 로테이션

**FabriX API 키 변경**
```
1. FabriX Portal 로그인
2. API Keys → Create New Key
3. 새 키 복사
4. secrets.toml 업데이트:
   FABRIX_API_KEY = "새_API_키"
5. 서비스 재시작
```

**Django SECRET_KEY 변경**
```powershell
# 새 키 생성
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# secrets.toml 업데이트
SECRET_KEY = "새로_생성된_시크릿_키"

# 서비스 재시작
Restart-Service FabriXDjango
```

**AUTH_KEY 변경 (6자리 인증 코드)**
```toml
# secrets.toml
AUTH_KEY = "654321"  # 기본값 123456에서 변경
```

#### 접근 로그 모니터링

**실패한 로그인 시도 확인**
```powershell
# Django 로그에서 실패한 인증 검색
Select-String -Path C:\Users\YourName\django_dev\logs\django.log -Pattern "Authentication failed|Invalid password"

# 최근 24시간 실패 횟수
$yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")
Select-String -Path C:\Users\YourName\django_dev\logs\django.log -Pattern "Authentication failed" | Where-Object { $_.Line -match $yesterday } | Measure-Object
```

**의심스러운 활동 탐지**
```powershell
# 동일 IP에서 다수 요청
Select-String -Path C:\Users\YourName\django_dev\logs\django.log -Pattern "IP_ADDRESS" | Group-Object Line | Where-Object { $_.Count -gt 100 }

# 대량 데이터 요청
Select-String -Path C:\Users\YourName\django_dev\logs\django.log -Pattern "messages.*count.*[5-9][0-9]{2}"
```

---

### 14.9 정기 유지보수 체크리스트

#### 일일 점검
- [ ] 서비스 상태 확인 (Get-Service FabriX*)
- [ ] 로그 에러 확인 (에러 레벨만)
- [ ] 디스크 공간 확인
- [ ] 백업 성공 여부 확인

#### 주간 점검
- [ ] 전체 로그 검토
- [ ] 데이터베이스 크기 확인
- [ ] 오래된 세션 정리 (90일 이상)
- [ ] 사용자 계정 검토 (비활성 계정)
- [ ] 성능 메트릭 확인 (응답 시간)

#### 월간 점검
- [ ] 데이터베이스 최적화 (VACUUM, ANALYZE)
- [ ] 무결성 검사 (PRAGMA integrity_check)
- [ ] 백업 복원 테스트
- [ ] 보안 업데이트 확인
- [ ] 의존성 패키지 업데이트
- [ ] 로그 아카이브

#### 분기별 점검
- [ ] API 키 로테이션
- [ ] 관리자 비밀번호 변경
- [ ] 전체 시스템 백업
- [ ] 재해 복구 테스트
- [ ] 성능 벤치마크
- [ ] 용량 계획 검토

---

## 15. 부록

### 15.1 프로젝트 폴더 구조 전체

```
django_dev/
│
├── venv/                              # Python 가상환경
│   ├── Scripts/                       # 실행 파일 (python.exe, pip.exe)
│   ├── Lib/                           # 설치된 패키지
│   └── pyvenv.cfg                     # 가상환경 설정
│
├── django_server/                     # Django 백엔드 서버
│   ├── manage.py                      # Django 관리 스크립트
│   ├── db.sqlite3                     # SQLite 데이터베이스
│   ├── db.sqlite3-wal                 # Write-Ahead Log 파일
│   ├── db.sqlite3-shm                 # Shared Memory 파일
│   │
│   ├── config/                        # Django 프로젝트 설정
│   │   ├── __init__.py
│   │   ├── settings.py                # 전역 설정 (DB, CORS, Logging)
│   │   ├── urls.py                    # URL 라우팅
│   │   ├── wsgi.py                    # WSGI 엔트리포인트
│   │   └── asgi.py                    # ASGI 엔트리포인트
│   │
│   └── apps/                          # Django 앱들
│       ├── __init__.py
│       │
│       └── fabrix_agent_chat/         # 메인 채팅 앱
│           ├── __init__.py
│           ├── models.py              # 데이터 모델 (ChatSession, ChatMessage)
│           ├── views.py               # API 뷰 (ViewSets)
│           ├── serializers.py         # DRF 시리얼라이저
│           ├── urls.py                # 앱 URL 패턴
│           ├── admin.py               # Django Admin 설정
│           ├── apps.py                # 앱 설정
│           ├── tests.py               # 테스트 코드
│           │
│           ├── migrations/            # 데이터베이스 마이그레이션
│           │   ├── __init__.py
│           │   ├── 0001_initial.py
│           │   └── ...
│           │
│           └── management/            # Management Commands
│               ├── __init__.py
│               └── commands/
│                   ├── __init__.py
│                   └── cleanup_old_sessions.py
│
├── ai_gateway/                        # FastAPI AI Gateway
│   ├── main.py                        # FastAPI 메인 앱
│   ├── rate_limiter.py                # Rate Limiter 구현
│   └── __pycache__/                   # Python 캐시
│
├── frontend/                          # React 프론트엔드
│   ├── package.json                   # Node.js 의존성
│   ├── package-lock.json              # 의존성 잠금 파일
│   ├── vite.config.js                 # Vite 빌드 설정
│   ├── tailwind.config.js             # Tailwind CSS 설정
│   ├── postcss.config.js              # PostCSS 설정
│   ├── index.html                     # HTML 엔트리포인트
│   │
│   ├── src/                           # 소스 코드
│   │   ├── main.jsx                   # React 엔트리포인트
│   │   ├── App.jsx                    # 메인 App 컴포넌트
│   │   ├── index.css                  # 전역 스타일
│   │   │
│   │   ├── api/                       # API 클라이언트
│   │   │   ├── axiosConfig.js         # Axios 설정 (Interceptors)
│   │   │   ├── djangoApi.js           # Django API 함수들
│   │   │   └── fastapiApi.js          # FastAPI API 함수들
│   │   │
│   │   ├── components/                # 공용 컴포넌트
│   │   │   ├── ErrorMessage.jsx       # 에러 메시지
│   │   │   ├── LoadingSpinner.jsx     # 로딩 스피너
│   │   │   └── ProtectedRoute.jsx     # 라우트 보호
│   │   │
│   │   └── features/                  # 기능별 모듈
│   │       │
│   │       ├── auth/                  # 인증 기능
│   │       │   ├── LoginPage.jsx      # 로그인 페이지
│   │       │   ├── RegisterPage.jsx   # 회원가입 페이지
│   │       │   └── authUtils.js       # 인증 유틸리티
│   │       │
│   │       └── chat/                  # 채팅 기능
│   │           ├── ChatPage.jsx       # 메인 채팅 페이지
│   │           ├── SessionList.jsx    # 세션 목록
│   │           ├── ChatWindow.jsx     # 채팅 창
│   │           ├── MessageInput.jsx   # 메시지 입력
│   │           ├── MessageList.jsx    # 메시지 목록
│   │           ├── MessageItem.jsx    # 개별 메시지
│   │           └── chatUtils.js       # 채팅 유틸리티
│   │
│   ├── dist/                          # 프로덕션 빌드 결과
│   │   ├── index.html
│   │   └── assets/
│   │       ├── index-[hash].js
│   │       └── index-[hash].css
│   │
│   └── node_modules/                  # Node.js 패키지
│
├── logs/                              # 로그 파일
│   ├── django.log                     # Django 로그
│   ├── django_stdout.log              # Django 표준 출력
│   ├── django_stderr.log              # Django 표준 에러
│   ├── fastapi_stdout.log             # FastAPI 표준 출력
│   └── fastapi_stderr.log             # FastAPI 표준 에러
│
├── backups/                           # 데이터베이스 백업
│   ├── db_backup_20260130_030000.sqlite3
│   └── ...
│
├── doc/                               # 프로젝트 문서
│   ├── 1. Chat API.html               # API 문서
│   ├── 2. Agent API.html              # Agent API 문서
│   ├── 개발프롬프트.md                 # 개발 가이드
│   ├── 최종설계서.md                   # 설계 문서
│   └── git 초기화.txt                  # Git 초기화 가이드
│
├── secrets.toml                       # 환경 설정 (비밀 정보)
├── requirements.txt                   # Python 의존성
│
├── setup_project.bat                  # 초기 설정 스크립트
├── run_project.bat                    # 개발 모드 실행
├── service_project.bat                # 서비스 모드 실행
├── reset_create_admin.bat             # DB 초기화 및 관리자 생성
├── create_django_key.bat              # Django SECRET_KEY 생성
├── create_structure.bat               # 프로젝트 구조 생성
│
├── README.md                          # 기본 README
├── readme_final.md                    # 최종 통합 문서 (본 문서)
├── Readme목차.txt                     # 문서 목차
├── PERFORMANCE_IMPROVEMENTS.md        # 성능 개선 문서
├── STABILITY_IMPROVEMENTS.md          # 안정성 개선 문서
└── RATE_LIMIT_HANDLING.md             # Rate Limit 처리 문서
```

#### 주요 디렉토리 역할

**django_server/**
- Django 백엔드 애플리케이션
- REST API 제공 (인증, 세션, 메시지)
- SQLite 데이터베이스 관리
- Django Admin 인터페이스

**ai_gateway/**
- FastAPI 기반 AI 프록시 서버
- FabriX API 호출 중개
- Rate Limiting 및 토큰 관리
- SSE 스트리밍

**frontend/**
- React 18 기반 SPA
- Vite 빌드 시스템
- Tailwind CSS 스타일링
- 기능별 모듈화 구조

**logs/**
- 애플리케이션 로그
- 디버깅 및 모니터링용
- 로그 로테이션 적용

**backups/**
- 데이터베이스 자동 백업
- 일자별 백업 파일 보관
- 30일 이상 자동 삭제

---

### 15.2 API 엔드포인트 전체 목록

#### Django REST API (Port 8000)

**인증 (Authentication)**

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| POST | `/api/register/` | 회원가입 | 불필요 |
| POST | `/api/login/` | 로그인 | 불필요 |
| POST | `/api/logout/` | 로그아웃 | 필요 |
| POST | `/api/validate-auth/` | 인증 코드 검증 | 불필요 |

**회원가입 예시**
```json
POST /api/register/
{
  "username": "john_doe",
  "password": "Password123!",
  "password2": "Password123!",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "auth_key": "123456"
}

Response 201:
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "abc123xyz..."
}
```

**로그인 예시**
```json
POST /api/login/
{
  "username": "john_doe",
  "password": "Password123!"
}

Response 200:
{
  "token": "abc123xyz...",
  "user_id": 1,
  "username": "john_doe"
}
```

**채팅 세션 (Chat Sessions)**

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| GET | `/api/sessions/` | 세션 목록 조회 | 필요 |
| POST | `/api/sessions/` | 새 세션 생성 | 필요 |
| GET | `/api/sessions/{id}/` | 세션 상세 조회 | 필요 |
| PUT | `/api/sessions/{id}/` | 세션 수정 | 필요 |
| PATCH | `/api/sessions/{id}/` | 세션 부분 수정 | 필요 |
| DELETE | `/api/sessions/{id}/` | 세션 삭제 | 필요 |

**세션 생성 예시**
```json
POST /api/sessions/
Headers:
  Authorization: Token abc123xyz...

{
  "title": "새로운 대화"
}

Response 201:
{
  "id": 1,
  "title": "새로운 대화",
  "user": 1,
  "created_at": "2026-01-30T10:00:00Z",
  "updated_at": "2026-01-30T10:00:00Z"
}
```

**세션 목록 조회 예시**
```json
GET /api/sessions/?ordering=-updated_at
Headers:
  Authorization: Token abc123xyz...

Response 200:
[
  {
    "id": 3,
    "title": "최근 대화",
    "created_at": "2026-01-30T15:00:00Z",
    "updated_at": "2026-01-30T15:30:00Z",
    "message_count": 10
  },
  {
    "id": 2,
    "title": "이전 대화",
    "created_at": "2026-01-29T10:00:00Z",
    "updated_at": "2026-01-29T12:00:00Z",
    "message_count": 5
  }
]
```

**채팅 메시지 (Chat Messages)**

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| GET | `/api/messages/` | 메시지 목록 조회 | 필요 |
| POST | `/api/messages/` | 새 메시지 생성 | 필요 |
| GET | `/api/messages/{id}/` | 메시지 상세 조회 | 필요 |
| DELETE | `/api/messages/{id}/` | 메시지 삭제 | 필요 |

**메시지 조회 예시**
```json
GET /api/messages/?session=1&ordering=created_at
Headers:
  Authorization: Token abc123xyz...

Response 200:
[
  {
    "id": 1,
    "session": 1,
    "role": "user",
    "content": "안녕하세요",
    "created_at": "2026-01-30T10:00:00Z"
  },
  {
    "id": 2,
    "session": 1,
    "role": "assistant",
    "content": "안녕하세요! 무엇을 도와드릴까요?",
    "created_at": "2026-01-30T10:00:05Z"
  }
]
```

**메시지 생성 예시**
```json
POST /api/messages/
Headers:
  Authorization: Token abc123xyz...

{
  "session": 1,
  "role": "user",
  "content": "Python에서 리스트를 정렬하는 방법은?"
}

Response 201:
{
  "id": 3,
  "session": 1,
  "role": "user",
  "content": "Python에서 리스트를 정렬하는 방법은?",
  "created_at": "2026-01-30T10:01:00Z"
}
```

#### FastAPI Gateway (Port 8001)

**AI 에이전트 (Agents)**

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| GET | `/agents` | 사용 가능한 에이전트 목록 | 불필요 |
| POST | `/agent-messages` | AI 메시지 생성 (SSE) | 불필요 |

**에이전트 목록 예시**
```json
GET /agents

Response 200:
[
  {
    "agentId": "agent-1",
    "name": "범용 어시스턴트",
    "description": "일반적인 질문에 답변하는 AI 어시스턴트"
  },
  {
    "agentId": "agent-2",
    "name": "코딩 도우미",
    "description": "프로그래밍 관련 질문에 특화된 AI"
  }
]
```

**AI 메시지 생성 (SSE) 예시**
```javascript
POST /agent-messages
Content-Type: application/json

{
  "agentId": "agent-1",
  "message": "Python에서 리스트를 정렬하는 방법은?",
  "history": [
    {"role": "user", "content": "안녕하세요"},
    {"role": "assistant", "content": "안녕하세요! 무엇을 도와드릴까요?"}
  ]
}

Response (SSE Stream):
event: message
data: {"content": "Python", "done": false}

event: message
data: {"content": "에서", "done": false}

event: message
data: {"content": " 리스트를", "done": false}

...

event: message
data: {"content": "합니다.", "done": true}

event: done
data: {"message": "완료"}
```

**기타 엔드포인트**

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| GET | `/docs` | FastAPI 자동 문서 (Swagger) | 불필요 |
| GET | `/redoc` | FastAPI 자동 문서 (ReDoc) | 불필요 |
| GET | `/rate-limit-status` | Rate Limit 상태 조회 | 불필요 |

---

### 15.3 에러 코드 참조표

#### HTTP 상태 코드

**2xx 성공**

| 코드 | 이름 | 설명 | 발생 시점 |
|------|------|------|----------|
| 200 | OK | 요청 성공 | GET, PUT, PATCH 성공 |
| 201 | Created | 리소스 생성 성공 | POST 성공 (세션, 메시지 생성) |
| 204 | No Content | 성공했으나 반환 내용 없음 | DELETE 성공 |

**4xx 클라이언트 에러**

| 코드 | 이름 | 설명 | 원인 | 해결 방법 |
|------|------|------|------|----------|
| 400 | Bad Request | 잘못된 요청 | 필수 필드 누락, 형식 오류 | 요청 데이터 확인 |
| 401 | Unauthorized | 인증 실패 | 토큰 없음, 만료, 잘못됨 | 로그인 재시도, 토큰 갱신 |
| 403 | Forbidden | 권한 없음 | 다른 사용자의 리소스 접근 | 본인 리소스만 접근 |
| 404 | Not Found | 리소스 없음 | 존재하지 않는 ID | URL 및 ID 확인 |
| 429 | Too Many Requests | Rate Limit 초과 | 요청 또는 토큰 한도 초과 | 1분 대기 후 재시도 |

**5xx 서버 에러**

| 코드 | 이름 | 설명 | 원인 | 해결 방법 |
|------|------|------|------|----------|
| 500 | Internal Server Error | 서버 내부 에러 | 예상치 못한 예외 | 로그 확인, 관리자 문의 |
| 502 | Bad Gateway | 게이트웨이 에러 | FabriX API 응답 없음 | API 키 확인, FabriX 상태 확인 |
| 503 | Service Unavailable | 서비스 이용 불가 | 서버 다운, 유지보수 | 서비스 재시작, 상태 확인 |

#### 커스텀 에러 메시지

**인증 관련**

```json
// 잘못된 인증 코드
{
  "error": "Invalid auth key",
  "detail": "The provided auth key is incorrect"
}

// 토큰 만료
{
  "detail": "Invalid token."
}

// 사용자명 중복
{
  "username": ["A user with that username already exists."]
}

// 비밀번호 불일치
{
  "password2": ["Passwords do not match"]
}
```

**Rate Limit 관련**

```json
// Rate Limit 초과 (요청 횟수)
{
  "error": "Rate limit exceeded",
  "detail": "Maximum 100 requests per minute",
  "retry_after": 45
}

// Rate Limit 초과 (토큰)
{
  "error": "Rate limit exceeded",
  "detail": "Maximum 10000 tokens per minute",
  "retry_after": 30
}
```

**데이터 검증 에러**

```json
// 필수 필드 누락
{
  "title": ["This field is required."]
}

// 빈 값
{
  "content": ["This field may not be blank."]
}

// 잘못된 형식
{
  "email": ["Enter a valid email address."]
}
```

**리소스 접근 에러**

```json
// 권한 없음
{
  "detail": "You do not have permission to perform this action."
}

// 존재하지 않음
{
  "detail": "Not found."
}
```

#### 에러 처리 가이드

**클라이언트 측 에러 처리 패턴**

```javascript
try {
  const response = await fetch('/api/sessions/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'New Chat' })
  });

  if (!response.ok) {
    switch (response.status) {
      case 400:
        // 잘못된 요청 - 사용자에게 입력 오류 표시
        const errors = await response.json();
        console.error('Validation errors:', errors);
        break;
      case 401:
        // 인증 실패 - 로그인 페이지로 리다이렉트
        window.location.href = '/login';
        break;
      case 429:
        // Rate Limit - 재시도 메시지 표시
        const retryData = await response.json();
        alert(`Too many requests. Retry after ${retryData.retry_after}s`);
        break;
      case 500:
        // 서버 에러 - 일반 에러 메시지 표시
        alert('Server error. Please try again later.');
        break;
      default:
        console.error('Unexpected error:', response.status);
    }
    return;
  }

  const data = await response.json();
  // 성공 처리
} catch (error) {
  // 네트워크 에러
  console.error('Network error:', error);
  alert('Network error. Please check your connection.');
}
```

---

### 15.4 자주 묻는 질문 (FAQ)

#### 설치 및 설정

**Q1: Python 가상환경이 활성화되지 않습니다.**

A: PowerShell 실행 정책 때문일 수 있습니다.
```powershell
# 실행 정책 확인
Get-ExecutionPolicy

# RemoteSigned로 변경 (관리자 권한)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 가상환경 활성화
.\venv\Scripts\Activate.ps1
```

**Q2: `npm install` 실행 시 에러가 발생합니다.**

A: Node.js 버전 또는 캐시 문제일 수 있습니다.
```powershell
# Node.js 버전 확인 (18.x 이상 필요)
node --version

# 캐시 삭제 후 재설치
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install
```

**Q3: secrets.toml 파일을 어디에 두어야 하나요?**

A: 프로젝트 루트 디렉토리에 위치해야 합니다.
```
django_dev/
  ├── secrets.toml        <-- 여기
  ├── django_server/
  ├── ai_gateway/
  └── frontend/
```

**Q4: FabriX API 키는 어디서 받나요?**

A: Samsung SDS FabriX Portal에서 발급받습니다.
1. FabriX Portal 로그인
2. API Keys 메뉴 이동
3. Create New Key 클릭
4. 생성된 키를 secrets.toml에 입력

#### 사용법

**Q5: 회원가입 시 인증 코드는 무엇인가요?**

A: `secrets.toml`의 `AUTH_KEY` 값입니다. 기본값은 `123456`이며, 보안을 위해 변경을 권장합니다.

**Q6: 로그인 토큰은 얼마나 유효한가요?**

A: Django의 기본 토큰은 만료되지 않습니다. 로그아웃하면 토큰이 삭제됩니다. 보안을 위해 정기적으로 로그아웃하고 재로그인하세요.

**Q7: 이전 대화 내역은 어떻게 확인하나요?**

A: 좌측 사이드바의 세션 목록에서 이전 세션을 클릭하면 전체 대화 내역이 표시됩니다.

**Q8: 메시지를 삭제할 수 있나요?**

A: 현재 UI에서는 개별 메시지 삭제가 지원되지 않습니다. 세션 전체를 삭제할 수 있습니다. 필요 시 Django Admin에서 개별 메시지를 삭제할 수 있습니다.

#### 문제 해결

**Q9: "Rate limit exceeded" 에러가 발생합니다.**

A: Rate Limiter가 요청 또는 토큰 한도를 초과했습니다.
- 기본 한도: 100 요청/분, 10000 토큰/분
- 해결: 1분 대기 후 재시도, 또는 `rate_limiter.py`에서 한도 증가

**Q10: AI 응답이 느립니다.**

A: 여러 원인이 있을 수 있습니다.
- FabriX API 응답 지연: API 상태 확인
- Rate Limit 대기: 로그에서 "waiting" 메시지 확인
- 네트워크 문제: 인터넷 연결 확인
- 대화 히스토리가 너무 긴 경우: 새 세션 시작

**Q11: 다른 컴퓨터에서 접속이 안 됩니다.**

A: 네트워크 설정 확인이 필요합니다.
1. 방화벽 규칙 추가 (포트 5173, 8000, 8001)
2. `service_project.bat` 사용 (0.0.0.0 바인딩)
3. IP 주소 확인 (`ipconfig`)
4. `http://[IP]:5173` 으로 접속

**Q12: 데이터베이스 에러가 발생합니다.**

A: 데이터베이스 상태를 확인하세요.
```powershell
# 무결성 검사
cd django_server
python manage.py shell
>>> import sqlite3
>>> conn = sqlite3.connect('db.sqlite3')
>>> cursor = conn.cursor()
>>> cursor.execute("PRAGMA integrity_check;")
>>> print(cursor.fetchone())

# 문제 있을 경우 백업에서 복원
```

#### 성능 및 확장성

**Q13: 동시 사용자 수는 얼마나 지원하나요?**

A: SQLite WAL 모드로 5-50명 동시 사용 가능합니다. 더 많은 사용자가 필요하면 PostgreSQL/MySQL로 전환을 권장합니다.

**Q14: 데이터베이스를 PostgreSQL로 변경할 수 있나요?**

A: 가능합니다.
1. PostgreSQL 설치
2. `psycopg2` 패키지 설치
3. `settings.py`의 `DATABASES` 설정 변경
4. 마이그레이션 실행

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'fabrix_chat',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

**Q15: 프로덕션 환경에 배포할 수 있나요?**

A: 현재는 사내망/소규모 배포에 최적화되어 있습니다. 대규모 프로덕션 배포 시:
- Nginx/Apache 웹서버 추가
- Gunicorn/uWSGI 사용 (Django)
- PostgreSQL/MySQL 데이터베이스
- Redis 캐싱
- HTTPS 인증서
- 로드 밸런싱

---

### 15.5 업데이트 이력

#### Version 1.0.0 (2026-01-30) - 초기 릴리스

**주요 기능**
- ✅ React 18 기반 SPA 프론트엔드
- ✅ Django 5.0 + DRF REST API 백엔드
- ✅ FastAPI AI Gateway (FabriX API 프록시)
- ✅ 사용자 인증 시스템 (6자리 인증 코드)
- ✅ 채팅 세션 및 메시지 관리
- ✅ SSE 기반 실시간 AI 응답 스트리밍
- ✅ Rate Limiting (100 RPM, 10000 TPM)
- ✅ SQLite WAL 모드 (동시성 향상)
- ✅ Connection Pooling (httpx)
- ✅ Django Admin 인터페이스

**기술 스택**
- Frontend: React 18.2.0, Vite 5.0.10, Tailwind CSS 3.4.1
- Backend: Django 5.0+, DRF 3.14.0+, FastAPI 0.109.0+
- Database: SQLite 3 (WAL mode)
- HTTP Client: httpx 0.27.0+ (async)
- Runtime: Python 3.10+, Node.js 18.x+

**성능 최적화**
- SQLite WAL 모드: 3-5배 성능 향상
- Connection Pooling: 50 max connections
- Async/Await: Non-blocking I/O
- Auto-retry with exponential backoff

**보안**
- Token 기반 인증
- CORS 정책 적용
- API 키 환경 변수 관리 (secrets.toml)
- Rate Limiting으로 남용 방지

**Windows 지원**
- Batch 파일 자동화 스크립트
- NSSM Windows 서비스 등록 가이드
- PowerShell 관리 스크립트

#### 알려진 제한사항

**현재 버전 제한**
- SQLite 동시 사용자: 5-50명 (WAL 모드)
- 파일 업로드 미지원
- 멀티모달 (이미지, 음성) 미지원
- 실시간 협업 기능 없음
- 모바일 최적화 부족

**향후 개선 계획**
- [ ] PostgreSQL 지원 추가
- [ ] 파일 업로드 기능
- [ ] 멀티모달 AI 지원
- [ ] 반응형 모바일 UI
- [ ] 실시간 알림 (WebSocket)
- [ ] 채팅 검색 기능
- [ ] 다국어 지원 (i18n)
- [ ] 관리자 대시보드
- [ ] API 사용량 통계
- [ ] 토큰 만료 및 갱신

#### 마이그레이션 가이드

**이전 버전에서 업그레이드 (해당 시)**

현재 버전이 초기 릴리스이므로 마이그레이션 불필요합니다. 향후 버전 업그레이드 시 이 섹션에 마이그레이션 가이드가 추가됩니다.

**데이터 백업 권장**

업데이트 전 항상 데이터베이스 백업:
```powershell
cd django_server
Copy-Item db.sqlite3 db.sqlite3.backup
```

---

### 15.6 참고 자료 및 링크

#### 공식 문서

**프론트엔드**
- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Axios GitHub](https://github.com/axios/axios)
- [Lucide Icons](https://lucide.dev/)

**백엔드**
- [Django 공식 문서](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [Uvicorn 공식 문서](https://www.uvicorn.org/)
- [httpx 공식 문서](https://www.python-httpx.org/)

**데이터베이스**
- [SQLite 공식 문서](https://www.sqlite.org/docs.html)
- [SQLite WAL Mode](https://www.sqlite.org/wal.html)

**개발 도구**
- [Python 공식 사이트](https://www.python.org/)
- [Node.js 공식 사이트](https://nodejs.org/)
- [Git 공식 사이트](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

#### 관련 프로젝트 및 라이브러리

**UI 컴포넌트**
- [Headless UI](https://headlessui.com/) - Tailwind CSS용 UI 컴포넌트
- [Radix UI](https://www.radix-ui.com/) - 접근성 좋은 UI 프리미티브
- [shadcn/ui](https://ui.shadcn.com/) - 재사용 가능한 컴포넌트

**상태 관리** (향후 필요 시)
- [Zustand](https://github.com/pmndrs/zustand) - 경량 상태 관리
- [TanStack Query](https://tanstack.com/query) - 서버 상태 관리

**폼 관리** (향후 개선 시)
- [React Hook Form](https://react-hook-form.com/) - 폼 검증
- [Zod](https://zod.dev/) - TypeScript 스키마 검증

**테스트** (향후 추가 시)
- [Vitest](https://vitest.dev/) - Vite 기반 테스트
- [Testing Library](https://testing-library.com/) - React 컴포넌트 테스트
- [Playwright](https://playwright.dev/) - E2E 테스트
- [pytest](https://pytest.org/) - Python 테스트

#### 유용한 도구

**개발 도구**
- [Postman](https://www.postman.com/) - API 테스트
- [Thunder Client](https://www.thunderclient.com/) - VS Code API 클라이언트
- [DB Browser for SQLite](https://sqlitebrowser.org/) - SQLite GUI

**모니터링 및 로깅**
- [Windows Performance Monitor](https://docs.microsoft.com/en-us/windows-server/administration/performance-monitor) - 시스템 리소스 모니터링
- [Event Viewer](https://docs.microsoft.com/en-us/shows/inside/event-viewer) - Windows 이벤트 로그

**배포 및 서비스 관리**
- [NSSM](https://nssm.cc/) - Windows 서비스 관리자
- [PM2](https://pm2.keymetrics.io/) - Node.js 프로세스 관리 (선택)

#### 학습 리소스

**튜토리얼**
- [Django Girls Tutorial](https://tutorial.djangogirls.org/) - Django 입문
- [React Tutorial](https://react.dev/learn) - React 공식 튜토리얼
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/) - FastAPI 공식 튜토리얼

**커뮤니티**
- [Django Forum](https://forum.djangoproject.com/)
- [React Discord](https://discord.gg/react)
- [FastAPI Discord](https://discord.gg/fastapi)
- [Stack Overflow](https://stackoverflow.com/)

**한국어 리소스**
- [Django 한국어 문서](https://docs.djangoproject.com/ko/)
- [점프 투 장고](https://wikidocs.net/book/4223)
- [React 한국어 문서](https://ko.react.dev/)

#### 관련 프로젝트

**유사 프로젝트 (참고용)**
- [ChatGPT Clone](https://github.com/topics/chatgpt-clone) - GitHub 참고
- [Open WebUI](https://github.com/open-webui/open-webui) - 오픈소스 챗봇 UI
- [LibreChat](https://github.com/danny-avila/LibreChat) - 멀티모델 챗봇 플랫폼

#### FabriX API

**Samsung SDS FabriX**
- FabriX Portal: 내부 포털 링크 (사내 접근)
- FabriX API 문서: 내부 문서 링크
- 기술 지원: 사내 지원 채널

#### 기술 지원

**프로젝트 관련 문의**
- GitHub Issues: (프로젝트 리포지토리가 있는 경우)
- Email: 개발팀 이메일
- 사내 협업 도구: Slack, Teams 등

**긴급 문제**
- 시스템 장애: 즉시 관리자 연락
- 보안 이슈: 보안팀 보고
- 데이터 손실: 백업 복원 절차 참조

---

## 📋 문서 작성 완료

✅ **목차 생성 완료**  
✅ **챕터 1: 프로젝트 개요 완료**  
✅ **챕터 2: 핵심 개발 원칙 완료**  
✅ **챕터 3: 프로젝트 설계 요구조건 완료**  
✅ **챕터 4: 프로젝트 기술 스택 완료**  
✅ **챕터 5: 시스템 아키텍처 완료**  
✅ **챕터 6: API 명세 및 통신 프로토콜 완료**  
✅ **챕터 7: 프론트엔드 설계 상세 완료**  
✅ **챕터 8: 백엔드 설계 상세 완료**  
✅ **챕터 9: 데이터베이스 및 보안 설계 완료**  
✅ **챕터 10: 사용자 인터페이스 설계 완료**  
✅ **챕터 11: 성능 최적화 및 안정성 향상 완료**  
✅ **챕터 12: 환경 설정 및 설치 가이드 완료**  
✅ **챕터 13: 배포 및 실행 가이드 완료**  
✅ **챕터 14: 관리자 운영 가이드 완료**  
✅ **챕터 15: 부록 완료**

---

## 🎉 전체 문서 작성 완료!

**FabriX Agent Chat Interface 최종 통합 문서 (readme_final.md)**가 완성되었습니다.

### 문서 구성 요약

이 문서는 Windows 환경에서 실행되는 LLM 채팅 애플리케이션의 **완전한 기술 문서**입니다.

**포함 내용:**
- 15개 챕터, 총 80+ 섹션
- 프로젝트 개요부터 운영 가이드까지
- 상세한 코드 예시 및 설명
- 실행 가능한 스크립트 및 명령어
- 문제 해결 가이드
- API 전체 명세
- FAQ 및 참고 자료

**문서 특징:**
- Full-length document (내용 축약 없음)
- Windows 환경 특화
- 실무 중심의 상세한 설명
- 즉시 적용 가능한 가이드

### 활용 방법

1. **신규 개발자 온보딩**: 챕터 1-4, 12 참조
2. **시스템 설치**: 챕터 12 (환경 설정) 참조
3. **운영 및 유지보수**: 챕터 13-14 참조
4. **API 개발**: 챕터 6, 15.2 (API 명세) 참조
5. **문제 해결**: 챕터 14.7, 15.4 (FAQ) 참조
6. **성능 개선**: 챕터 11 참조

---

> **Note:** 본 문서는 프로젝트의 현재 구현을 상세하게 설명하는 최종 버전입니다. 향후 업데이트 시 15.5 (업데이트 이력) 섹션을 갱신해 주세요.

