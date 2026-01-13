import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageSquare, Plus, Trash2, MoreHorizontal, UserCircle } from 'lucide-react';
import { chatApi } from '../../../api/djangoApi';

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSessionId = searchParams.get('session_id');
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const username = localStorage.getItem('username') || 'User';

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

  useEffect(() => {
    loadSessions();
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

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="p-4 pt-5">
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
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-[var(--text-primary)]">{username}</p>
            <p className="text-xs text-[var(--text-secondary)] truncate">Samsung Electronics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;