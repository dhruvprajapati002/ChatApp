'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Smile, Paperclip, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping: () => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, onTyping, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (value: string) => {
    setMessage(value);
    onTyping();
  };

  return (
    <div className="border-t border-slate-800/50 p-5 bg-slate-900/95 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center space-x-3 max-w-4xl mx-auto">
        {/* Emoji button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          disabled={disabled}
          className="p-3 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 disabled:text-slate-700 disabled:hover:bg-transparent rounded-2xl transition-all backdrop-blur-sm border border-slate-800/50 hover:border-sky-500/30 shadow-lg hover:shadow-sky-500/20 disabled:shadow-none"
        >
          <Smile size={20} />
        </motion.button>
        
        {/* Attachment button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          disabled={disabled}
          className="p-3 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 disabled:text-slate-700 disabled:hover:bg-transparent rounded-2xl transition-all backdrop-blur-sm border border-slate-800/50 hover:border-sky-500/30 shadow-lg hover:shadow-sky-500/20 disabled:shadow-none"
        >
          <Paperclip size={20} />
        </motion.button>

        {/* Message input */}
        <div className="flex-1 relative min-w-0">
          <input
            type="text"
            value={message}
            onChange={(e) => handleChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Connecting..." : "Type a message..."}
            disabled={disabled}
            className="w-full px-5 py-4 text-slate-100 bg-slate-850/80 border-2 border-slate-700/50 rounded-3xl focus:ring-4 focus:ring-sky-500/30 focus:border-sky-400 focus:bg-slate-800/90 outline-none transition-all disabled:bg-slate-900/50 disabled:cursor-not-allowed disabled:text-slate-600 placeholder:text-slate-500 text-sm backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-slate-500/20 resize-none"
          />
        </div>

        {/* Send button */}
        <motion.button
          whileHover={message.trim() && !disabled ? { scale: 1.05 } : {}}
          whileTap={message.trim() && !disabled ? { scale: 0.95 } : {}}
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="p-4 bg-gradient-to-r from-sky-500 to-violet-500 text-white rounded-3xl hover:from-sky-400 hover:to-violet-400 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed transition-all shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/40 disabled:shadow-none disabled:from-slate-800/50 disabled:to-slate-900/50 flex items-center justify-center border border-sky-400/50"
        >
          <Send size={20} className={message.trim() && !disabled ? "rotate-[-20deg]" : ""} />
        </motion.button>
      </div>
    </div>
  );
}
