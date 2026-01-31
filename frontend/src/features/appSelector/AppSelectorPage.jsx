import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ImageIcon, Bot, ChevronRight } from 'lucide-react';

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
    }
  ];

  const handleSelectApp = (app) => {
    navigate(app.path);
  };

  // 사용자 정보
  const username = sessionStorage.getItem('username') || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
            <Bot className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fabrix Platform
          </h1>
          <p className="text-gray-600 text-sm">
            안녕하세요, <span className="font-semibold text-gray-900">{username}</span>님! 사용할 앱을 선택하세요.
          </p>
        </div>

        {/* App Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => handleSelectApp(app)}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-left overflow-hidden border-2 border-transparent hover:border-blue-200"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${app.color} mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={22} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {app.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {app.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>시작하기</span>
                    <ChevronRight size={18} className="ml-1" />
                  </div>
                </div>

                {/* Decorative Circle */}
                <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${app.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            직접 접속: 
            <a href="/chat" className="ml-2 text-blue-600 hover:underline">/chat</a>
            <span className="mx-2">또는</span>
            <a href="/image-compare" className="text-purple-600 hover:underline">/image-compare</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppSelectorPage;
