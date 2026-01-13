import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 밝은 테마 추천
import { User, Bot } from 'lucide-react';

const ChatBubble = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[90%] md:max-w-[85%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm mt-1
          ${isUser ? 'bg-[var(--accent-color)]' : 'bg-white border border-gray-200'}
        `}>
          {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-[var(--accent-color)]" />}
        </div>

        {/* Content */}
        <div className={`
          relative px-5 py-3.5 rounded-2xl shadow-sm text-[var(--text-primary)] overflow-hidden
          ${isUser 
            ? 'bg-[var(--accent-color)] text-white rounded-tr-sm' 
            : 'bg-white border border-[var(--border-color)] rounded-tl-sm'}
        `}>
          {isUser ? (
            <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
              {message.content}
            </div>
          ) : (
            <div className={`markdown-body text-[15px] ${isStreaming ? 'cursor-blink' : ''}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="rounded-lg overflow-hidden my-3 border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 font-mono border-b border-gray-200 flex justify-between">
                            <span>{match[1]}</span>
                        </div>
                        <SyntaxHighlighter
                          {...props}
                          style={oneLight}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: '1rem', background: '#ffffff', fontSize: '13px' }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-[13px] font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content || ""}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;