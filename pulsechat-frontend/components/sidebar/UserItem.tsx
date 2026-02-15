'use client';

import { User } from '@/types/user';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface UserItemProps {
  user: User;
  isActive?: boolean;
  onClick: () => void;
}

export default function UserItem({ user, isActive, onClick }: UserItemProps) {
  const formatLastSeen = () => {
    if (!user.lastSeen) return 'Never';
    try {
      return formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative
        ${isActive 
          ? 'bg-sky-500/10 border border-sky-500/20 shadow-sm' 
          : 'hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
        }
      `}
    >
      {/* Avatar */}
      <div className="relative">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.username}
            className={`w-12 h-12 rounded-full object-cover bg-slate-800 ${
              isActive ? 'ring-2 ring-sky-500/30' : ''
            }`}
          />
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
            isActive 
              ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white' 
              : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-slate-200'
          }`}>
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Online Badge */}
        {user.isOnline && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className={`font-semibold text-sm truncate ${
            isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
          }`}>
            {user.username}
          </h4>
          {user.isOnline && (
            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
              Online
            </span>
          )}
        </div>
        
        <p className={`text-xs truncate ${
          isActive ? 'text-sky-200/70' : 'text-slate-500 group-hover:text-slate-400'
        }`}>
          {user.isOnline ? 'Active now' : `Seen ${formatLastSeen()}`}
        </p>
      </div>

      {/* Active Indicator Bar */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-500 rounded-r-full" />
      )}
    </motion.button>
  );
}
