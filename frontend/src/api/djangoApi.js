import { djangoClient } from './axiosConfig';

export const authApi = {
  // 회원가입
  signup: async (userData) => {
    // userData: { username, password, email, auth_key }
    const response = await djangoClient.post('/api/auth/signup/', userData);
    return response.data;
  },
  
  // 로그인
  login: async (credentials) => {
    // credentials: { username, password }
    const response = await djangoClient.post('/api/auth/login/', credentials);
    return response.data;
  },
  
  // 로그아웃
  logout: async () => {
    const response = await djangoClient.post('/api/auth/logout/');
    return response.data;
  },
};

// [추가] Agent 목록 조회 API
// Backend urls.py에 추가한 path('agents/', ...) 와 매핑됩니다.
export const agentApi = {
  getAgents: async () => {
    const response = await djangoClient.get('/api/chat/agents/');
    return response.data;
  },
};

export const chatApi = {
  // 대화방 목록 조회
  getSessions: async () => {
    const response = await djangoClient.get('/api/chat/sessions/');
    return response.data;
  },

  // 새 대화방 생성
  createSession: async (agentId, title) => {
    const response = await djangoClient.post('/api/chat/sessions/', {
      agent_id: agentId,
      title: title || "New Chat",
    });
    return response.data;
  },

  // 대화방 상세 조회 (메시지 내역 포함)
  getSessionDetail: async (sessionId) => {
    const response = await djangoClient.get(`/api/chat/sessions/${sessionId}/`);
    return response.data;
  },

  // 메시지 저장 (User 질문 또는 AI 답변)
  saveMessage: async (sessionId, role, content) => {
    const response = await djangoClient.post(`/api/chat/sessions/${sessionId}/messages/`, {
      role,
      content,
    });
    return response.data;
  },

  // 대화방 삭제
  deleteSession: async (sessionId) => {
    const response = await djangoClient.delete(`/api/chat/sessions/${sessionId}/`);
    return response.data;
  },
};

export const dataExplorerApi = {

  // 샘플 데이터 로드 (GET)

  getSampleData: async () => {

    const response = await djangoClient.get('/api/data-explorer/data/');

    return response.data;

  },

  

  // CSV 파일 업로드 및 분석 (POST)

  uploadCsv: async (file) => {

    const formData = new FormData();

    formData.append('file', file);

    

    const response = await djangoClient.post('/api/data-explorer/data/', formData, {

      headers: {

        'Content-Type': 'multipart/form-data',

      },

    });

    return response.data;

  },

};
