# Rate Limit 처리 방식 가이드

## 📌 Rate Limit 초과 시 처리 흐름

### **1. 사용자 관점 (Frontend)**

```
사용자 요청 전송
    ↓
Loading Spinner 표시
    ↓
[Backend에서 자동 처리]
    ↓
응답 수신 (1~10초 내)
```

**사용자가 보는 것:**
- ✅ Spinner/Loading 표시
- ✅ 자연스럽게 응답 대기
- ⚠️ 10초 이상 대기 시 에러 메시지 (매우 드묾)

---

### **2. Backend 처리 방식**

#### **시나리오 A: Rate Limit 여유 있음**
```python
요청 접수 → 즉시 처리 → 응답 반환 (정상)
```

#### **시나리오 B: Rate Limit 초과 (자동 재시도)**
```python
요청 접수
    ↓
Rate Limit 체크 → 초과 감지
    ↓
대기 시간 계산 (예: 2.5초)
    ↓
[자동 대기] await asyncio.sleep(2.5)
    ↓
재시도 (최대 3회)
    ↓
성공 → 응답 반환
```

**사용자는 단지 "조금 느린 응답"으로만 느낌**

#### **시나리오 C: 대기 시간이 너무 길 때**
```python
요청 접수
    ↓
Rate Limit 체크 → 초과 감지
    ↓
대기 시간 계산 (예: 15초)
    ↓
대기 시간 > 최대 허용(10초) → 즉시 에러 반환
    ↓
429 Too Many Requests + retry_after 정보 전달
```

---

## 🔧 **구현 세부사항**

### **1. Rate Limiter 주요 함수**

#### `can_proceed(estimated_tokens)` 
```python
# 현재 요청 가능 여부 확인
can_proceed, error_msg = rate_limiter.can_proceed(100)
if can_proceed:
    # 요청 처리
else:
    # 대기 또는 거부
```

#### `get_wait_time(estimated_tokens)` ⭐ 새로 추가
```python
# 얼마나 기다려야 요청 가능한지 계산
wait_time = rate_limiter.get_wait_time(100)
# wait_time = 0.0    → 즉시 가능
# wait_time = 2.5    → 2.5초 후 가능
# wait_time = 30.0   → 30초 후 가능 (너무 김)
```

---

### **2. 자동 재시도 파라미터**

| 항목 | 일반 채팅 | 파일 업로드 |
|------|-----------|-------------|
| **최대 재시도 횟수** | 3회 | 3회 |
| **최대 대기 시간** | 10초 | 15초 |
| **대기 방식** | 비동기 sleep | 비동기 sleep |

```python
# 예시: 채팅 요청
max_retries = 3
max_wait_time = 10.0  # 10초

for attempt in range(max_retries):
    can_proceed, error_msg = rate_limiter.can_proceed(estimated_tokens)
    
    if can_proceed:
        break  # 성공! 요청 진행
    
    wait_time = rate_limiter.get_wait_time(estimated_tokens)
    
    if wait_time > max_wait_time or attempt == max_retries - 1:
        # 너무 오래 걸리거나 마지막 시도 → 에러
        raise HTTPException(status_code=429, detail={
            "error": "rate_limit_exceeded",
            "retry_after": wait_time,
            "current_usage": rate_limiter.get_current_usage()
        })
    
    # 대기 후 재시도
    await asyncio.sleep(wait_time)
```

---

## 📊 **실제 동작 예시**

### **예시 1: 일시적 초과 (성공 케이스)**

```
[요청 1] 12:00:00 → 즉시 처리 ✅
[요청 2] 12:00:01 → 즉시 처리 ✅
[요청 3] 12:00:02 → 즉시 처리 ✅
... (RPM=100 도달)
[요청 101] 12:00:58 → Rate Limit 초과
                     → 2초 대기 (12:01:00까지)
                     → 재시도 성공 ✅
                     → 사용자에게 정상 응답 (약 2초 지연)
```

**사용자 경험**: "서버가 조금 바쁜가보다" (2초 지연은 자연스러움)

---

### **예시 2: 과부하 상태 (에러 케이스)**

```
[대량 요청] 100개/분 지속 유지
[신규 요청] 12:00:59 → Rate Limit 초과
                     → 대기 시간 계산: 45초 필요
                     → max_wait_time(10초) 초과
                     → 즉시 429 에러 반환
```

**응답 내용:**
```json
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded: 100 requests in last minute (limit: 100)",
  "retry_after": 45.0,
  "current_usage": {
    "current_rpm": 100,
    "current_tpm": 8500,
    "remaining_rpm": 0,
    "remaining_tpm": 1500,
    "rpm_limit": 100,
    "tpm_limit": 10000
  }
}
```

---

## 🎯 **프론트엔드 권장 처리**

### **일반적인 경우 (Backend가 자동 처리)**
```javascript
// 그냥 평소처럼 요청
const response = await fetch('/agent-messages', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Backend가 알아서 대기 후 응답
// 사용자는 spinner만 보고 기다림
```

### **429 에러 수신 시 (드문 경우)**
```javascript
try {
  const response = await fetch('/agent-messages', {...});
  
  if (response.status === 429) {
    const errorData = await response.json();
    
    // retry_after 초 후 자동 재시도
    showToast(`서버가 혼잡합니다. ${Math.ceil(errorData.retry_after)}초 후 재시도...`);
    
    await sleep(errorData.retry_after * 1000);
    return retryRequest();  // 재귀 호출
  }
} catch (error) {
  showError('요청 처리 실패');
}
```

---

## 📈 **모니터링**

### **Rate Limit 현황 확인**
```bash
# API 호출
GET http://localhost:8001/rate-limit-status

# 응답
{
  "current_rpm": 45,
  "current_tpm": 3200,
  "remaining_rpm": 55,
  "remaining_tpm": 6800,
  "rpm_limit": 100,
  "tpm_limit": 10000
}
```

### **로그 확인**
```log
# 정상 처리
INFO: Request allowed: 45/100 requests, 3200/10000 tokens

# 대기 후 재시도
INFO: Rate limit reached, waiting 2.50s (attempt 1/3)
INFO: Request allowed: 46/100 requests, 3300/10000 tokens

# 거부
WARNING: Rate limit exceeded after 3 attempts: Rate limit exceeded: 100 requests...
```

---

## ✅ **정리**

### **핵심 동작**
1. ✅ **투명한 재시도**: 사용자는 단지 "약간 느린 응답"으로만 느낌
2. ✅ **최소 지연**: 필요한 최소 시간만 대기 (2~5초 일반적)
3. ✅ **과부하 보호**: 너무 긴 대기는 즉시 거부 (서버 보호)
4. ✅ **명확한 피드백**: 에러 발생 시 상세 정보 제공

### **장점**
- 😊 사용자는 대부분 에러를 경험하지 않음
- 🔒 서버 리소스 보호 (무한 대기 방지)
- 📊 투명한 모니터링 가능
- 🚀 자동 복구 (일시적 트래픽 급증 대응)

### **사용자가 느끼는 경험**
```
일반적인 경우 (95%):
"메시지 전송" → [2~3초 대기] → "응답 받음" ✅

일시적 혼잡 (4%):
"메시지 전송" → [5~8초 대기] → "응답 받음" ✅ (약간 느림)

극심한 과부하 (1%):
"메시지 전송" → [1초] → "서버 혼잡, 잠시 후 재시도" ⚠️
```

**대부분의 사용자는 자동 재시도를 인지하지 못하고 정상적으로 서비스 이용!** 🎉
