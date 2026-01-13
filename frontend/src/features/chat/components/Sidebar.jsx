import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// [수정] 아이콘 추가 (Bot, ChevronDown, Check, LogOut)
import { MessageSquare, Plus, Trash2, MoreHorizontal, UserCircle, Bot, ChevronDown, Check, LogOut } from 'lucide-react';
// [수정] agentApi 추가 import
import { chatApi, agentApi } from '../../../api/djangoApi';

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSessionId = searchParams.get('session_id');
  
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // [문제 1 해결용] Agent 상태 관리
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);

  // [문제 5 해결] localStorage -> sessionStorage로 변경
  // [문제 2 해결] Email 정보 가져오기 (없으면 기본값)
  const username = sessionStorage.getItem('username') || 'User';
  const userEmail = sessionStorage.getItem('email') || 'user@example.com';

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

  // [문제 1 해결] Agent 목록 로드 함수
  const loadAgents = async () => {
    try {
      const data = await agentApi.getAgents();
      // API 응답 구조: { items: [...] }
      const items = data.items || [];
      setAgents(items);
      // 기본값 선택
      if (items.length > 0 && !selectedAgent) {
        setSelectedAgent(items[0]);
      }
    } catch (error) {
      console.error("Failed to load agents:", error);
    }
  };

  useEffect(() => {
    loadSessions();
    loadAgents(); // Agent 로드 호출
    window.addEventListener('session-created', loadSessions);
    return () => window.removeEventListener('session-created', loadSessions);
  }, [currentSessionId]);

  const handleNewChat = () => navigate('/chat');
  const handleSelectSession = (id) => navigate(`/chat?session_id=${id}`);
 
  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat?')) {
      try {
        await chatApi.deleteSession(id);
        setSessions(prev => prev.filter(s => s.id !== id));
        if (String(currentSessionId) === String(id)) navigate('/chat');
      } catch (error) { alert('Delete failed'); }
    }
  };

  // [문제 3 해결] 로그아웃 핸들러
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      sessionStorage.clear(); // 세션 만료
      navigate('/login'); // 로그인 페이지로 이동
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] font-sans">
      
      {/* Header Area */}
      <div className="p-4 pt-5 space-y-3">
        
        {/* [문제 1 해결] Agent Selector (Inline Implementation) */}
        {/* Breadcrumb와 겹치지 않도록 Sidebar 내부에 배치됨 */}
        <div className="relative">
            <button 
                onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-[var(--border-color)] rounded-xl shadow-sm hover:border-blue-400 transition-all text-left text-sm group"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1 bg-blue-50 text-blue-600 rounded-md shrink-0">
                        <Bot size={16} />
                    </div>
                    <span className="font-medium truncate text-[var(--text-primary)]">
                        {selectedAgent ? selectedAgent.label : 'Select Agent...'}
                    </span>
                </div>
                <ChevronDown size={14} className="text-[var(--text-secondary)] shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {isAgentMenuOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsAgentMenuOpen(false)} />
                    <div className="absolute z-20 w-full mt-1 bg-white border border-[var(--border-color)] rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                        {agents.length > 0 ? agents.map(agent => (
                            <button
                                key={agent.agentId}
                                onClick={() => {
                                    setSelectedAgent(agent);
                                    setIsAgentMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                            >
                                <span className={`truncate ${selectedAgent?.agentId === agent.agentId ? 'text-blue-600 font-medium' : 'text-[var(--text-primary)]'}`}>
                                    {agent.label}
                                </span>
                                {selectedAgent?.agentId === agent.agentId && <Check size={14} className="text-blue-600" />}
                            </button>
                        )) : (
                            <div className="p-3 text-xs text-[var(--text-secondary)] text-center">No agents found</div>
                        )}
                    </div>
                </>
            )}
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-[var(--border-color)] rounded-xl shadow-sm hover:shadow hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-medium text-sm group"
        >
          <Plus size={18} className="text-[var(--text-secondary)] group-hover:text-blue-600 transition-colors" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
        <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 px-3">
          Recents
        </div>

        {isLoading && sessions.length === 0 ? (
          <div className="text-center text-xs text-[var(--text-secondary)] py-8 animate-pulse">Loading history...</div>
        ) : (
          <div className="flex flex-col gap-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className={`
                  group relative flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm
                  transition-all duration-200 border border-transparent
                  ${String(currentSessionId) === String(session.id)
                    ? 'bg-white border-[var(--border-color)] shadow-sm text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden w-full">
                  <MessageSquare size={16} className={`flex-shrink-0 ${String(currentSessionId) === String(session.id) ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="truncate pr-6">{session.title || "New Conversation"}</span>
                </div>

                <button
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  className="absolute right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: User Profile */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between">
            
            {/* [문제 4 해결] cursor-pointer 제거, hover 효과 제거 */}
            {/* [문제 5 해결] User 정보 표시 영역 */}
            <div className="flex items-center gap-3 p-2 rounded-lg cursor-default select-none">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                    {username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-[var(--text-primary)]">{username}</p>
                    {/* [문제 2 해결] 회사명 -> 이메일 표시 */}
                    <p className="text-xs text-[var(--text-secondary)] truncate" title={userEmail}>
                        {userEmail}
                    </p>
                </div>
            </div>

            {/* [문제 3 해결] Logout 버튼 추가 */}
            <button 
                onClick={handleLogout}
                className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
            >
                <LogOut size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;