'use client';

import { User } from '@/types/user';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  user: User;
  onBack?: () => void;
}

export default function ChatHeader({ user, onBack }: ChatHeaderProps) {
  return (
    <div className="border-b border-slate-800/50 p-4 bg-slate-900/80 backdrop-blur-xl z-20 sticky top-0">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          {onBack && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack} 
              className="lg:hidden p-2.5 hover:bg-slate-800/50 rounded-xl transition-all text-slate-400 hover:text-slate-200"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </motion.button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="relative">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                </span>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-slate-100 leading-snug">{user.username}</h3>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                {user.isOnline ? (
                  <span className="text-emerald-400">Active Now</span>
                ) : (
                  <span>Offline</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl text-slate-400 hover:text-sky-400 transition-colors"
          >
            <Phone size={20} className="stroke-[1.5]" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl text-slate-400 hover:text-sky-400 transition-colors"
          >
            <Video size={20} className="stroke-[1.5]" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
          >
            <MoreVertical size={20} className="stroke-[1.5]" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
