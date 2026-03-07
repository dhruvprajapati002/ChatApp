'use client';

import { MessagePayload } from '@/types/socket';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck, SmilePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface MessageBubbleProps {
  message: MessagePayload;
  isOwn: boolean;
  onAddReaction?: (messageId: string, emoji: string) => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export default function MessageBubble({ message, isOwn, onAddReaction }: MessageBubbleProps) {
  const [showPicker, setShowPicker] = useState(false);

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

  const handleReact = (emoji: string) => {
    const msgId = message._id || message.timestamp.toString();
    if (onAddReaction) onAddReaction(msgId, emoji);
    setShowPicker(false);
  };

  // Group reactions by emoji to count them
  const reactionCounts = message.reactions?.reduce((acc, curr) => {
    acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-5`}
      onHoverStart={() => setShowPicker(true)}
      onHoverEnd={() => setShowPicker(false)}
    >
      <div className={`max-w-[72%] relative flex flex-col ${isOwn ? 'items-end' : 'items-start'} ${isOwn ? 'order-2' : 'order-1'}`}>
        
        {/* Emoji Picker Popover */}
        <AnimatePresence>
          {showPicker && onAddReaction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className={`absolute top-[-40px] ${isOwn ? 'right-0' : 'left-0'} flex items-center gap-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg z-20`}
            >
              {COMMON_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-110 active:scale-95 transition-all rounded-full text-lg"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 relative">
          {/* Message Bubble */}
          <motion.div
            whileHover={{ scale: isOwn ? 1.02 : 1.01 }}
            className={`px-5 py-3.5 rounded-3xl shadow-xl backdrop-blur-sm border ${
              isOwn
                ? 'bg-gradient-to-r from-sky-500/90 via-blue-500/90 to-violet-500/90 text-white rounded-br-none border-sky-400/50 ring-1 ring-sky-500/30 hover:shadow-sky-500/40 hover:shadow-2xl'
                : 'bg-white/90 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-bl-none border-slate-200 dark:border-slate-700/50 ring-1 ring-slate-200 dark:ring-slate-700/30 shadow-slate-200/50 dark:shadow-none hover:shadow-slate-300/50 dark:hover:shadow-slate-500/20 hover:shadow-xl'
            }`}
          >
            <p className="text-sm leading-relaxed break-words max-w-full">{message.message}</p>
          </motion.div>
        </div>

        {/* Display Reactions */}
        {reactionCounts && Object.keys(reactionCounts).length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'} z-10 -translate-y-2`}>
            {Object.entries(reactionCounts).map(([emoji, count]) => (
              <motion.div 
                key={emoji}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-50 border-slate-200 dark:bg-slate-800/90 border dark:border-slate-700/80 shadow-sm"
              >
                <span>{emoji}</span>
                {count > 1 && <span className="text-slate-600 dark:text-slate-400 font-medium">{count}</span>}
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Timestamp & Status */}
        <div className={`flex items-center gap-1.5 mt-0.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <p className={`text-[10px] font-medium ${isOwn ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500/80'}`}>
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
                <CheckCheck size={14} className="text-sky-500 drop-shadow-sm" />
              ) : message.status === 'delivered' ? (
                <CheckCheck size={14} className="text-slate-400" />
              ) : (
                <Check size={14} className="text-slate-500" />
              )}
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
