import { fastApiClient } from './axiosConfig';

export const fastApi = {
  // 사용 가능한 FabriX Agent 목록 조회
  getAgents: async () => {
    // page, limit은 필요에 따라 파라미터화 가능 (현재 기본값 사용)
    const response = await fastApiClient.get('/agents');
    return response.data;
  },

  // 파일 업로드 및 분석 요청
  // file: File 객체, agentId: 선택된 에이전트 ID, query: 사용자의 요청(프롬프트)
  uploadFile: async (file, agentId, query) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('agentId', agentId);
    formData.append('contents', query); // FastAPI에서 List로 변환 처리됨

    const response = await fastApiClient.post('/agent-messages/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};