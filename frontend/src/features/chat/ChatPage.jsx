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
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Agent 선택 이벤트 수신 (MainLayout에서 관리)
  useEffect(() => {
    const handleAgentSelected = (e) => {
      setSelectedAgentId(e.detail.agentId);
      setSelectedAgent(e.detail.agent);
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

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Error Display - Top of Page */}
      {error && (
        <div className="flex-shrink-0 px-6 py-3 bg-red-50 border-b border-red-200">
          <div className="max-w-3xl mx-auto text-red-600 text-sm font-medium flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        </div>
      )}

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
                Select an agent from the sidebar and start a conversation.
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
      <div className="flex-shrink-0 bg-[var(--bg-primary)] p-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <InputBox onSend={handleSend} isLoading={isLoading} onStop={handleStop} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;