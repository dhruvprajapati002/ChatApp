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
    <div className="border-b border-slate-800/50 p-5 bg-slate-900/95 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack} 
              className="lg:hidden p-2.5 hover:bg-slate-800/50 rounded-2xl transition-all backdrop-blur-sm text-slate-400 hover:text-slate-200"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </motion.button>
          )}
          
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover ring-3 ring-sky-500/40 shadow-2xl"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-lg ring-3 ring-sky-500/40 shadow-2xl backdrop-blur-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            {user.isOnline && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-3 border-slate-900 rounded-full ring-2 ring-emerald-400/50 shadow-lg"
              />
            )}
          </motion.div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-xl text-slate-100 truncate">{user.username}</h3>
            <div className="text-sm flex items-center gap-1.5">
              {user.isOnline ? (
                <div className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg" />
                  Online
                </div>
              ) : (
                <div className="text-slate-500 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-slate-500/50 rounded-full" />
                  Offline
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 hover:bg-slate-800/50 rounded-2xl transition-all backdrop-blur-sm text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 shadow-lg hover:shadow-sky-500/20 border border-slate-800/50 hover:border-sky-500/30"
            title="Start video call" 
            aria-label="Start video call"
          >
            <Video size={20} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 hover:bg-slate-800/50 rounded-2xl transition-all backdrop-blur-sm text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 shadow-lg hover:shadow-sky-500/20 border border-slate-800/50 hover:border-sky-500/30"
            title="Start phone call" 
            aria-label="Start phone call"
          >
            <Phone size={20} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 hover:bg-slate-800/50 rounded-2xl transition-all backdrop-blur-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 shadow-lg hover:shadow-slate-500/20 border border-slate-800/50"
            title="More options" 
            aria-label="More options"
          >
            <MoreVertical size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
