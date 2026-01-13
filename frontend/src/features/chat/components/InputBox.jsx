import React, { useState, useRef } from 'react';
import { Paperclip, Send, Square, X, ArrowUp } from 'lucide-react';

const InputBox = ({ onSend, isLoading, onStop }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if ((!message.trim() && !selectedFile) || isLoading) return;
    onSend(message, selectedFile);
    setMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleInput = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
    setMessage(target.value);
  };

  return (
    <div className="w-full">
      {/* File Preview */}
      {selectedFile && (
        <div className="flex items-center gap-2 mb-2 p-2 px-3 bg-white border border-[var(--border-color)] rounded-xl w-fit shadow-sm animate-slide-up">
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <Paperclip size={14} className="text-gray-500" />
          </div>
          <span className="text-sm text-[var(--text-primary)] max-w-[200px] truncate font-medium">
            {selectedFile.name}
          </span>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-gray-400 hover:text-red-500 ml-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative flex items-end gap-2 bg-white border border-[var(--border-color)] rounded-3xl p-2 shadow-lg hover:shadow-xl focus-within:shadow-xl focus-within:border-blue-300 transition-all duration-300">
       
        {/* File Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-blue-50 rounded-full transition-colors flex-shrink-0 mb-0.5"
          disabled={isLoading}
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Message FabriX Agent..."
          rows={1}
          className="flex-1 bg-transparent text-[var(--text-primary)] resize-none outline-none py-3.5 max-h-[200px] custom-scrollbar placeholder:text-gray-400 leading-relaxed"
          disabled={isLoading && !onStop}
        />

        {/* Send/Stop Button */}
        <div className="mb-1 mr-1">
            {isLoading ? (
            <button
                onClick={onStop}
                className="p-2.5 bg-[var(--text-primary)] text-white rounded-full hover:opacity-80 transition-all shadow-md"
                title="Stop"
            >
                <Square size={16} fill="currentColor" />
            </button>
            ) : (
            <button
                onClick={handleSend}
                disabled={!message.trim() && !selectedFile}
                className={`
                p-2.5 rounded-full transition-all shadow-md
                ${(!message.trim() && !selectedFile)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95'}
                `}
                title="Send"
            >
                <ArrowUp size={20} strokeWidth={3} />
            </button>
            )}
        </div>
      </div>
     
      <div className="text-center mt-3 text-xs text-[var(--text-placeholder)] font-medium">
        FabriX Agent can make mistakes. Please verify important information.
      </div>
    </div>
  );
};

export default InputBox;