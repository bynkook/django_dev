import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import ChatPage from './features/chat/ChatPage';
import ImageComparePage from './features/imageCompare/ImageComparePage';
import DataExplorerPage from './features/dataExplorer/DataExplorerPage';
import AppSelectorPage from './features/appSelector/AppSelectorPage';

// --- Route Guard ---
// 토큰이 없으면 로그인 페이지로 리다이렉트시키는 보호 컴포넌트
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('authToken');
  const location = useLocation();
  
  if (!token) {
    // 로그인 후 돌아올 경로 저장
    sessionStorage.setItem('returnTo', location.pathname);
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: 로그인/회원가입 */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes: 인증된 사용자만 접근 가능 */}
        
        {/* Root - 앱 선택 페이지 */}
        <Route path="/" element={<PrivateRoute><AppSelectorPage /></PrivateRoute>} />
        
        {/* Image Compare - 독립적인 레이아웃 */}
        <Route path="/image-compare" element={<PrivateRoute><ImageComparePage /></PrivateRoute>} />
        
        {/* Chat - MainLayout 사용 */}
        <Route path="/chat" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<ChatPage />} />
        </Route>

        {/* Data Explorer - Standalone Layout */}
        <Route path="/data-explorer" element={<PrivateRoute><DataExplorerPage /></PrivateRoute>} />

        {/* 404: 알 수 없는 경로는 로그인 페이지로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;