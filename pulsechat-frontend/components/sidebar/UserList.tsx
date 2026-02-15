'use client';

import { User } from '@/types/user';
import UserItem from './UserItem';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface UserListProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (user: User) => void;
}

export default function UserList({ users, selectedUserId, onSelectUser }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Sort: Online users first, then alphabetically
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      // Online users first
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      // Then alphabetically by username
      return a.username.localeCompare(b.username);
    });
  }, [filteredUsers]);

  // Count online users
  const onlineCount = useMemo(() => {
    return users.filter(u => u.isOnline).length;
  }, [users]);

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-xl">
      {/* Search Header */}
      <div className="p-6 border-b border-slate-800/50 bg-gradient-to-b from-slate-900/95 to-transparent sticky top-0 z-10 backdrop-blur-xl shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-blue-100 to-slate-100 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Messages
          </motion.h2>
          <motion.div
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl backdrop-blur-sm shadow-lg shadow-emerald-500/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm" />
            <span className="text-sm font-semibold text-emerald-300">
              {onlineCount} Online
            </span>
          </motion.div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 text-sm text-slate-100 bg-slate-850/80 border-2 border-slate-700/50 rounded-3xl focus:ring-4 focus:ring-sky-500/30 focus:border-sky-400 focus:bg-slate-800/90 outline-none transition-all placeholder:text-slate-500 backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-slate-500/20"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {sortedUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-3xl flex items-center justify-center shadow-xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Search className="text-slate-600" size={28} />
            </motion.div>
            <p className="text-slate-400 text-lg font-medium mb-1">
              {searchQuery ? 'No users found' : 'No users available'}
            </p>
            <p className="text-sm text-slate-500">
              {searchQuery ? 'Try a different search term' : 'Register another account to start chatting'}
            </p>
          </motion.div>
        ) : (
          <div className="divide-y divide-slate-800/50 space-y-1 px-2">
            {sortedUsers.map((user, index) => (
              <motion.div
                key={user.id || user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.4 }}
              >
                <UserItem
                  user={user}
                  isActive={(user.id || user._id) === selectedUserId}
                  onClick={() => onSelectUser(user)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
