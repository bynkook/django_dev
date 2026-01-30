import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import ChatPage from './features/chat/ChatPage';

// --- Route Guard ---
// 토큰이 없으면 로그인 페이지로 리다이렉트시키는 보호 컴포넌트
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('authToken');
  // 실제로는 토큰 유효성 검증 API 호출이 필요할 수 있으나, 
  // 여기서는 존재 여부로만 간단히 체크합니다.
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: 로그인/회원가입 */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes: 인증된 사용자만 접근 가능 */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          {/* 기본 접속 시 /chat으로 이동 */}
          <Route path="/" element={<Navigate to="/chat" replace />} />
          {/* 메인 채팅 페이지 */}
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        {/* 404: 알 수 없는 경로는 로그인 페이지로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;