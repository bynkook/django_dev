import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';

import ChatBubble from './components/ChatBubble';
import InputBox from './components/InputBox';
import { chatApi } from '../../api/djangoApi';
import { fastApi } from '../../api/fastapiApi';
import { getFastApiUrl } from '../../api/axiosConfig';

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSessionId = searchParams.get('session_id');

  const [messages, setMessages] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Agent 목록을 window 이벤트로부터 받음 (Sidebar에서 관리)
  useEffect(() => {
    const handleAgentSelected = (e) => {
      setSelectedAgentId(e.detail.agentId);
      // Agent 정보도 함께 받아서 저장
      if (e.detail.agent) {
        setAgents(prev => {
          const exists = prev.find(a => a.agentId === e.detail.agent.agentId);
          return exists ? prev : [...prev, e.detail.agent];
        });
      }
    };
    
    window.addEventListener('agent-selected', handleAgentSelected);
    return () => window.removeEventListener('agent-selected', handleAgentSelected);
  }, []);

  // --- Session Load ---
  useEffect(() => {
    if (currentSessionId) {
      const loadHistory = async () => {
        setIsLoading(true);
        try {
          const data = await chatApi.getSessionDetail(currentSessionId);
          setMessages(data.messages || []);
          if (data.agent_id) setSelectedAgentId(data.agent_id);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
      };
      loadHistory();
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  // --- Scroll ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Handlers (Send & Stop) ---
  const handleSend = async (text, file) => {
    if (isLoading) return;
    if (!selectedAgentId) {
      setError("Please select an agent first.");
      return;
    }
    
    setError(null);
    setIsLoading(true);

    const userMsg = { role: 'user', content: text || `File: ${file.name}` };
    setMessages(prev => [...prev, userMsg]);

    try {
      let sessionId = currentSessionId;
      if (!sessionId) {
        const title = text ? text.slice(0, 30) : "File Analysis";
        const newSession = await chatApi.createSession(selectedAgentId, title);
        sessionId = newSession.id;
        navigate(`/chat?session_id=${sessionId}`, { replace: true });
        // 사이드바 갱신 이벤트 트리거
        window.dispatchEvent(new Event('session-created'));
      }

      await chatApi.saveMessage(sessionId, 'user', userMsg.content);
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
     
      if (file) {
        const result = await fastApi.uploadFile(file, selectedAgentId, text || "Analyze this file");
        const answer = result.content || "Done.";
        updateLastMessage(answer);
        await chatApi.saveMessage(sessionId, 'assistant', answer);
        setIsLoading(false);
      } else {
        abortControllerRef.current = new AbortController();
        let accumulatedAnswer = "";

        await fetchEventSource(getFastApiUrl('/agent-messages'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId: selectedAgentId, contents: [text], isStream: true, isRagOn: true }),
          signal: abortControllerRef.current.signal,
          onmessage(ev) {
            try {
              if (!ev.data) return;
              const parsed = JSON.parse(ev.data);
              if (parsed.content) {
                accumulatedAnswer += parsed.content;
                updateLastMessage(accumulatedAnswer);
              }
            } catch (e) { }
          },
          onerror(err) { throw err; },
          onclose() {
            chatApi.saveMessage(sessionId, 'assistant', accumulatedAnswer);
            setIsLoading(false);
          }
        });
      }
    } catch (err) {
      setError("Error sending message.");
      setIsLoading(false);
    }
  };

  const updateLastMessage = (content) => {
    setMessages(prev => {
      const newHistory = [...prev];
      const last = newHistory[newHistory.length - 1];
      newHistory[newHistory.length - 1] = { ...last, content };
      return newHistory;
    });
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      if (currentSessionId && messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role === 'assistant') chatApi.saveMessage(currentSessionId, 'assistant', lastMsg.content);
      }
    }
  };

  const currentAgent = agents.find(a => a.agentId === selectedAgentId);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
     
      {/* Header: 선택된 Agent 표시만 (선택은 Sidebar에서) */}
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-[var(--accent-color)]">
            <Bot size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              {currentAgent?.label || 'No Agent Selected'}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {currentAgent?.agentId ? `ID: ${currentAgent.agentId.slice(0, 8)}...` : 'Select from sidebar'}
            </p>
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-xs font-medium flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full animate-fade-in">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar scroll-smooth">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white">
                <Sparkles size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">How can I help you today?</h2>
              <p className="text-[var(--text-secondary)] max-w-md leading-relaxed">
                Select an agent from the sidebar and start a conversation. I can help you analyze files, write code, or answer questions.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <ChatBubble
                key={idx}
                message={msg}
                isStreaming={isLoading && idx === messages.length - 1 && msg.role === 'assistant'}
              />
            ))
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 pb-6 bg-[var(--bg-primary)] z-20">
        <div className="max-w-3xl mx-auto">
          <InputBox onSend={handleSend} isLoading={isLoading} onStop={handleStop} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;