import React, { useState } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Plus, 
  Bot, 
  ChevronDown, 
  Check, 
  LogOut
} from 'lucide-react';

const Sidebar = ({ 
  sessions = [], 
  currentSessionId, 
  onSelectSession,
  onNewChat, 
  isLoading,
  onDeleteSession,
  selectedAgent = null,
  agents = [],
  onAgentSelect,
  username = 'User',
  userEmail = '',
  onLogout
}) => {
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);

  const handleSelectSession = (sessionId) => {
    if (onSelectSession) {
      onSelectSession(sessionId);
    }
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      if (onDeleteSession) {
        onDeleteSession(sessionId);
      }
    }
  };

  const handleAgentSelect = (agent) => {
    if (onAgentSelect) {
      onAgentSelect(agent);
    }
    setIsAgentMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="w-full h-full bg-[var(--bg-secondary)] flex flex-col">
      {/* Header Area */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Fabrix Agent Chat</h1>
        </div>

        {/* Agent Selector */}
        <div className="relative mb-4">
          <button
            onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
            className="flex items-center justify-between gap-3 w-full px-4 py-3 bg-white border border-[var(--border-color)] rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Bot size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-secondary)] font-medium mb-0.5">
                  Select Agent
                </p>
                <p className="font-semibold text-sm truncate text-[var(--text-primary)]">
                  {selectedAgent ? (selectedAgent.label.length > 20 ? selectedAgent.label.slice(0, 20) + '...' : selectedAgent.label) : 'Choose an AI agent'}
                </p>
              </div>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-[var(--text-secondary)] group-hover:text-blue-500 transition-transform ${isAgentMenuOpen ? 'rotate-180' : ''}`} 
            />
          </button>

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
      <div className="p-4 bg-[var(--bg-secondary)]">
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
