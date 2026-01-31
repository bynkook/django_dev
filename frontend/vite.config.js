import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // 사내망 배포(Service Mode)를 위해 0.0.0.0 개방
    host: '0.0.0.0',
    port: 5173,  // 통일된 포트 번호
    
    // [추가됨] 서버 시작 시 브라우저 자동 실행
    open: true, 

    // 개발 편의를 위한 프록시 설정 (선택 사항)
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    }
  }
})