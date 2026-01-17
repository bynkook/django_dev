import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageSquare, Plus, Trash2, MoreHorizontal, UserCircle, Bot, ChevronDown, Check, LogOut, Menu, Search } from 'lucide-react';
import { chatApi, agentApi } from '../../../api/djangoApi';

const Sidebar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSessionId = searchParams.get('session_id');
  
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Agent 상태 관리
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);

  // Email 정보 가져오기 (없으면 기본값)
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

  // Agent 목록 로드 함수
  const loadAgents = async () => {
    try {
      const data = await agentApi.getAgents();
      // API 응답 구조: { items: [...] }
      const items = data.items || [];
      setAgents(items);
      // 기본값 선택
      if (items.length > 0 && !selectedAgent) {
        setSelectedAgent(items[0]);
        // ChatPage에 선택된 Agent 전달 (agent 객체도 함께)
        window.dispatchEvent(new CustomEvent('agent-selected', { 
          detail: { 
            agentId: items[0].agentId,
            agent: items[0]
          } 
        }));
      }
    } catch (error) {
      console.error("Failed to load agents:", error);
    }
  };

  // Agent 선택 핸들러
  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setIsAgentMenuOpen(false);
    // ChatPage에 선택 이벤트 전달 (agent 객체도 함께)
    window.dispatchEvent(new CustomEvent('agent-selected', { 
      detail: { 
        agentId: agent.agentId,
        agent: agent
      } 
    }));
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

  // 로그아웃 핸들러
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      sessionStorage.clear(); // 세션 만료
      navigate('/login'); // 로그인 페이지로 이동
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] font-sans">
      
      {/* Gemini-style Top Bar: Breadcrumb + Search */}
      <div className="flex-shrink-0 h-14 flex items-center justify-between px-4">
        {/* Left: Breadcrumb (Menu Icon) */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-all duration-200"
          title="Close Sidebar"
        >
          <Menu size={20} />
        </button>
        
        {/* Right: Search Icon */}
        <button
          onClick={() => {/* TODO: Search functionality */}}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-all duration-200"
          title="Search conversations"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Header Area - Agent Selector */}
      <div className="p-4 space-y-3 border-b border-[var(--border-color)]">
        
        {/* [문제 1 해결] Agent Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[var(--border-color)] rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Bot size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-[var(--text-primary)]">
                  {selectedAgent ? selectedAgent.label : 'Select Agent'}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {selectedAgent ? `ID: ${selectedAgent.agentId.slice(0, 12)}...` : 'Choose your assistant'}
                </p>
              </div>
            </div>
            <ChevronDown size={16} className={`text-[var(--text-secondary)] shrink-0 transition-transform ${isAgentMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isAgentMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsAgentMenuOpen(false)} />
              <div className="absolute z-20 w-full mt-2 bg-white border border-[var(--border-color)] rounded-xl shadow-xl max-h-80 overflow-y-auto custom-scrollbar">
                {agents.length > 0 ? agents.map(agent => (
                  <button
                    key={agent.agentId}
                    onClick={() => handleAgentSelect(agent)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-blue-50 transition-colors text-left border-b border-[var(--border-color)] last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${selectedAgent?.agentId === agent.agentId ? 'text-blue-600' : 'text-[var(--text-primary)]'}`}>
                        {agent.label}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                        {agent.agentId}
                      </p>
                    </div>
                    {selectedAgent?.agentId === agent.agentId && (
                      <Check size={16} className="text-blue-600 ml-2 shrink-0" />
                    )}
                  </button>
                )) : (
                  <div className="p-4 text-xs text-[var(--text-secondary)] text-center">No agents available</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold text-sm group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 px-3">
          Recent Conversations
        </div>

        {isLoading && sessions.length === 0 ? (
          <div className="text-center text-xs text-[var(--text-secondary)] py-8 animate-pulse">Loading history...</div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className={`
                  group relative flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer text-sm
                  transition-all duration-200 border
                  ${String(currentSessionId) === String(session.id)
                    ? 'bg-white border-blue-200 shadow-md text-[var(--text-primary)] font-medium'
                    : 'border-transparent text-[var(--text-secondary)] hover:bg-white/60 hover:text-[var(--text-primary)]'}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden w-full">
                  <MessageSquare 
                    size={16} 
                    className={`flex-shrink-0 ${String(currentSessionId) === String(session.id) ? 'text-blue-500' : 'text-gray-400'}`} 
                  />
                  <span className="truncate pr-8">{session.title || "New Conversation"}</span>
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

      {/* Footer: User Profile + Logout */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-[var(--text-primary)]">{username}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate" title={userEmail}>
                {userEmail}
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="p-2.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
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