'use client';

import { MessagePayload } from '@/types/socket';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: MessagePayload;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = () => {
    try {
      const date = new Date(message.timestamp);
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-5`}
    >
      <div className={`max-w-[72%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <motion.div
          whileHover={{ scale: isOwn ? 1.02 : 1.01 }}
          className={`px-5 py-3.5 rounded-3xl shadow-xl backdrop-blur-sm border ${
            isOwn
              ? 'bg-gradient-to-r from-sky-500/90 via-blue-500/90 to-violet-500/90 text-white rounded-br-none border-sky-400/50 ring-1 ring-sky-500/30 hover:shadow-sky-500/40 hover:shadow-2xl'
              : 'bg-slate-800/80 text-slate-100 rounded-bl-none border-slate-700/50 ring-1 ring-slate-700/30 hover:shadow-slate-500/20 hover:shadow-xl'
          }`}
        >
          <p className="text-sm leading-relaxed break-words max-w-full">{message.message}</p>
        </motion.div>
        
        {/* Timestamp & Status */}
        <div className={`flex items-center gap-1.5 mt-1.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <p className={`text-xs font-medium ${isOwn ? 'text-sky-200/80' : 'text-slate-500/80'}`}>
            {formatTime()}
          </p>
          {isOwn && (
            <motion.div 
              className="flex gap-0.5"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {message.status === 'read' ? (
                <CheckCheck size={14} className="text-sky-300 drop-shadow-sm" />
              ) : (
                <Check size={14} className="text-sky-400/70" />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
