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
    <motion.div
      whileHover={{ x: 6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center gap-4 p-5 cursor-pointer transition-all relative rounded-2xl backdrop-blur-sm border border-slate-800/50 hover:border-slate-700/70
        ${isActive 
          ? 'bg-gradient-to-r from-sky-500/10 to-violet-500/10 border-sky-500/40 ring-1 ring-sky-500/30 shadow-xl shadow-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/30' 
          : 'hover:bg-slate-800/50'
        }
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.username}
            className={`w-14 h-14 rounded-2xl object-cover shadow-2xl ${
              user.isOnline 
                ? 'ring-3 ring-emerald-500/50 shadow-emerald-500/30' 
                : 'ring-2 ring-slate-700/50 shadow-slate-500/20'
            }`}
          />
        ) : (
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-2xl backdrop-blur-sm ${
            user.isOnline 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 ring-3 ring-emerald-500/50 shadow-emerald-500/30' 
              : 'bg-gradient-to-br from-slate-700 to-slate-800 ring-2 ring-slate-700/50 shadow-slate-500/20'
          }`}>
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Online Status Indicator */}
        {user.isOnline && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-2 -right-2"
          >
            <div className="w-5 h-5 bg-emerald-400 border-3 border-slate-900 rounded-full shadow-lg shadow-emerald-500/40 animate-pulse" />
          </motion.div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-bold truncate text-lg ${
            isActive 
              ? 'bg-gradient-to-r from-sky-300 to-violet-300 bg-clip-text text-transparent' 
              : 'text-slate-100'
          }`}>
            {user.username}
          </h4>
          {user.isOnline && (
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-shrink-0 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-sm shadow-md shadow-emerald-500/20"
            >
              Online
            </motion.span>
          )}
        </div>
        <div className="text-sm text-slate-400 truncate font-medium">
          {user.isOnline ? (
            <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-sm" />
              Active now
            </span>
          ) : (
            <span>Last seen {formatLastSeen()}</span>
          )}
        </div>
      </div>
      
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-3 h-3 bg-gradient-to-r from-sky-400 to-violet-400 rounded-full shadow-lg shadow-sky-500/50 flex-shrink-0 animate-pulse"
        />
      )}
    </motion.div>
  );
}
