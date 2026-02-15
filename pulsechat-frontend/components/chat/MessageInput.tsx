'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping: () => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, onTyping, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onTyping();
    
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="p-4 md:p-6 bg-transparent">
      <div className="max-w-4xl mx-auto relative">
        <motion.div 
          layout
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-2 flex items-end shadow-2xl ring-1 ring-white/5"
        >
          {/* Attachments */}
          <div className="flex items-center gap-1 pb-1 pl-1">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(56, 189, 248, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              disabled={disabled}
              className="p-2.5 text-slate-400 hover:text-sky-400 rounded-full transition-colors"
            >
              <Paperclip size={20} className="stroke-[1.5]" />
            </motion.button>
          </div>

          {/* Input Area */}
          <div className="flex-1 min-w-0 py-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              placeholder={disabled ? "Connecting..." : "Message..."}
              disabled={disabled}
              rows={1}
              className="w-full bg-transparent border-none focus:ring-0 resize-none text-slate-200 placeholder:text-slate-500 max-h-[120px] py-1 px-2 custom-scrollbar text-[15px] leading-relaxed"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 pb-1 pr-1">
             <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(167, 139, 250, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              disabled={disabled}
              className="p-2.5 text-slate-400 hover:text-violet-400 rounded-full transition-colors hidden sm:block"
            >
              <Smile size={20} className="stroke-[1.5]" />
            </motion.button>

            <AnimatePresence mode="popLayout">
              {message.trim() ? (
                <motion.button
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  key="send"
                  className="p-2.5 bg-sky-500 text-white rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition-colors"
                >
                  <Send size={18} className="ml-0.5" />
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
