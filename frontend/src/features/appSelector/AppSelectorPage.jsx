import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ImageIcon, Bot, ChevronRight, BarChart3, Settings } from 'lucide-react';

const AppSelectorPage = () => {
  const navigate = useNavigate();

  const apps = [
    {
      id: 'chat',
      name: 'Fabrix Agent Chat',
      description: 'AI 에이전트와 대화하고 파일을 분석합니다',
      icon: MessageCircle,
      color: 'from-blue-500 to-indigo-600',
      path: '/chat'
    },
    {
      id: 'image-inspector',
      name: 'Image Inspector',
      description: '두 이미지/도면을 비교하고 차이점을 분석합니다',
      icon: ImageIcon,
      color: 'from-purple-500 to-pink-600',
      path: '/image-compare'
    },
    {
      id: 'data-explorer',
      name: 'Data Explorer',
      description: '데이터를 탐색하고 시각화하여 인사이트를 도출합니다',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-600',
      path: '/data-explorer'
    }
  ];

  const handleSelectApp = (app) => {
    navigate(app.path);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      sessionStorage.clear();
      navigate('/login');
    }
  };

  // 사용자 정보
  const username = sessionStorage.getItem('username') || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full relative">
        {/* Settings Button (Top Right) */}
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all"
          title="환경 설정"
        >
          <Settings size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
            <Bot className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HT AI-Platform 2026
          </h1>
          <p className="text-gray-600 text-sm">
            안녕하세요, <span className="font-semibold text-gray-900">{username}</span>님! 사용할 앱을 선택하세요.
          </p>
        </div>

        {/* App Cards */}
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => handleSelectApp(app)}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 text-left overflow-hidden border-2 border-transparent hover:border-blue-200 w-full sm:w-[calc(50%-8px)] md:w-[220px] max-w-[220px]"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${app.color} mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white" size={18} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {app.name}
                    </h3>
                    
                    <p className="text-gray-500 text-xs mb-2 leading-relaxed line-clamp-2">
                      {app.description}
                    </p>
                    
                    <div className="flex items-center text-xs text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>시작하기</span>
                      <ChevronRight size={14} className="ml-0.5" />
                    </div>
                  </div>

                  {/* Decorative Circle */}
                  <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br ${app.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-4">
          <div className="text-sm text-gray-500">
            직접 접속: 
            <a href="/chat" className="ml-2 text-blue-600 hover:underline">/chat</a>
            <span className="mx-2">,</span>
            <a href="/image-compare" className="text-purple-600 hover:underline">/image-compare</a>
            <span className="mx-2">또는</span>
            <a href="/data-explorer" className="text-green-600 hover:underline">/data-explorer</a>
          </div>
          
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1 mx-auto"
          >
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSelectorPage;
