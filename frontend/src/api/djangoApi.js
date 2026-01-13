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
};

export const chatApi = {
  // 대화방 목록 조회
  getSessions: async () => {
    const response = await djangoClient.get('/api/sessions/');
    return response.data;
  },

  // 새 대화방 생성
  createSession: async (agentId, title) => {
    const response = await djangoClient.post('/api/sessions/', {
      agent_id: agentId,
      title: title || "New Chat",
    });
    return response.data;
  },

  // 대화방 상세 조회 (메시지 내역 포함)
  getSessionDetail: async (sessionId) => {
    const response = await djangoClient.get(`/api/sessions/${sessionId}/`);
    return response.data;
  },

  // 메시지 저장 (User 질문 또는 AI 답변)
  saveMessage: async (sessionId, role, content) => {
    const response = await djangoClient.post(`/api/sessions/${sessionId}/messages/`, {
      role,
      content,
    });
    return response.data;
  },

  // 대화방 삭제
  deleteSession: async (sessionId) => {
    await djangoClient.delete(`/api/sessions/${sessionId}/`);
  },
};