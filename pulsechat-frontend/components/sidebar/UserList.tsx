'use client';

import { User } from '@/types/user';
import UserItem from './UserItem';
import { Search, Users, MessageSquarePlus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      // Online users first
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return a.username.localeCompare(b.username);
    });
  }, [filteredUsers]);

  const onlineCount = useMemo(() => {
    return users.filter(u => u.isOnline).length;
  }, [users]);

  return (
    <div className="flex flex-col h-full bg-slate-950/50 backdrop-blur-xl border-r border-slate-800/50">
      {/* Sidebar Header */}
      <div className="px-6 pt-6 pb-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            Contacts
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs font-medium text-slate-400">
              {users.length}
            </span>
            <button className="p-2 rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors">
              <MessageSquarePlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all shadow-sm"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Online Status Tab */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 border-b border-slate-800/50 pb-1">
          <button className="text-sky-400 border-b-2 border-sky-400 pb-2 -mb-1.5 transition-colors">
            All Chats
          </button>
          <button className="hover:text-slate-300 pb-2 transition-colors flex items-center gap-1.5">
            Online
            {onlineCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
          <button className="hover:text-slate-300 pb-2 transition-colors">
            Groups
          </button>
        </div>
      </div>

      {/* User List Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {sortedUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-900/50 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-slate-400 font-medium">No results found</p>
              <p className="text-xs text-slate-500 mt-1">
                We couldn&apos;t find any users matching &quot;{searchQuery}&quot;
              </p>
            </motion.div>
          ) : (
            sortedUsers.map((user, index) => (
              <motion.div
                key={user.id || user._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <UserItem
                  user={user}
                  isActive={(user.id || user._id) === selectedUserId}
                  onClick={() => onSelectUser(user)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
