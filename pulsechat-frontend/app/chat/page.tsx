'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, clearAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { User } from '@/types/user';
import { MessagePayload } from '@/types/socket';
import UserList from '@/components/sidebar/UserList';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { LogOut, MessageSquare, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const router = useRouter();
  const { isConnected, joinRoom, sendMessage, startTyping, onReceiveMessage, onUserTyping, socket } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const user = getStoredUser();

        if (!user || !user.id) {
          router.push('/login');
          return;
        }

        setCurrentUser(user);
        await fetchUsers();
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to load chat. Please try logging in again.');
        setTimeout(() => {
          clearAuth();
          router.push('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/users/all');
      setUsers(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        clearAuth();
        router.push('/login');
      } else {
        setError('Failed to load users. Please refresh the page.');
      }
    }
  };

  useEffect(() => {
    if (selectedUser?.id && currentUser?.id) {
      fetchMessages(selectedUser.id);
      const conversationId = [currentUser.id, selectedUser.id].sort().join('_');
      joinRoom(conversationId);
    }
  }, [selectedUser?.id, currentUser?.id]);

  const fetchMessages = async (otherUserId: string) => {
    try {
      const { data } = await api.get(`/api/messages/${otherUserId}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (!currentUser?.id || !selectedUser?.id) return;

    const cleanupReceive = onReceiveMessage((data: MessagePayload) => {
      if (data.senderId !== currentUser.id) {
        setMessages(prev => [...prev, data]);
      }
    });

    const cleanupTyping = onUserTyping((data) => {
      if (data.userId === selectedUser.id) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      cleanupReceive();
      cleanupTyping();
    };
  }, [currentUser?.id, selectedUser?.id, onReceiveMessage, onUserTyping]);

  useEffect(() => {
    if (!socket) return;

    socket.on('online_users', (userIds: string[]) => {
      console.log('🟢 Online users:', userIds);
      setOnlineUserIds(userIds);

      setUsers(prevUsers =>
        prevUsers.map(user => ({
          ...user,
          isOnline: user.id ? userIds.includes(user.id) : false
        }))
      );
    });

    socket.on('user_status_changed', ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      console.log(`👤 User ${userId} is now ${isOnline ? 'online' : 'offline'}`);

      setOnlineUserIds(prev =>
        isOnline
          ? [...prev, userId]
          : prev.filter(id => id !== userId)
      );

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, isOnline } : user
        )
      );

      if (selectedUser?.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, isOnline } : null);
      }
    });

    return () => {
      socket.off('online_users');
      socket.off('user_status_changed');
    };
  }, [socket, selectedUser?.id]);

  const handleSendMessage = useCallback((message: string) => {
    if (!currentUser?.id || !selectedUser?.id) return;

    const messageData: MessagePayload = {
      conversationId: [currentUser.id, selectedUser.id].sort().join('_'),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      message,
      timestamp: new Date()
    };

    sendMessage(messageData);
    setMessages(prev => [...prev, messageData]);
  }, [currentUser?.id, selectedUser?.id, sendMessage]);

  const handleTyping = useCallback(() => {
    if (!currentUser?.id || !selectedUser?.id) return;

    startTyping({
      conversationId: [currentUser.id, selectedUser.id].sort().join('_'),
      userId: currentUser.id,
      username: currentUser.username
    });
  }, [currentUser, selectedUser, startTyping]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-slate-200"
        >
          <div className="relative mx-auto mb-6">
            <div className="w-20 h-20 border-4 border-slate-800 border-t-sky-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-400" size={28} />
          </div>
          <p className="text-lg font-medium">Loading your chats...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-slate-900/90 rounded-3xl shadow-2xl border border-red-500/40 max-w-md backdrop-blur-xl"
        >
          <div className="text-red-400 text-5xl mb-6 mx-auto">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Something went wrong</h2>
          <p className="text-slate-400 mb-8 text-sm">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/login')}
            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-violet-500 text-white rounded-xl hover:from-sky-400 hover:to-violet-400 font-semibold shadow-lg shadow-sky-500/30 transition-all"
          >
            Back to login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="h-screen flex bg-slate-950 text-white">
      {/* Background glows & grid */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-sky-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/20 blur-3xl rounded-full" />
        <div
          className="opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25 }}
        className={`${selectedUser ? 'hidden lg:flex' : 'flex'} lg:w-80 w-full flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.username}
                  className="w-14 h-14 rounded-full ring-3 ring-sky-500/30 object-cover shadow-2xl"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-violet-500 backdrop-blur rounded-full flex items-center justify-center text-white font-bold text-xl ring-3 ring-sky-500/30 shadow-2xl">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
                  PulseChat
                </h1>
                <p className="text-sm text-slate-400">{currentUser.username}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 hover:bg-slate-800/50 rounded-2xl text-slate-400 hover:text-slate-200 transition-all backdrop-blur-sm"
              title="Logout"
            >
              <LogOut size={20} />
            </motion.button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm bg-slate-800/50 backdrop-blur px-4 py-2.5 rounded-2xl border border-slate-700/50">
            {isConnected ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold text-emerald-300">Connected</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="font-semibold text-red-300">Connecting...</span>
              </>
            )}
          </div>
        </div>

        {/* User List */}
        <AnimatePresence mode="wait">
          {users.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center p-12"
            >
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 text-slate-600" size={64} />
                <p className="text-slate-400 font-medium mb-2 text-lg">No users yet</p>
                <p className="text-sm text-slate-500">Register another account to chat!</p>
              </div>
            </motion.div>
          ) : (
            <UserList
              users={users}
              selectedUserId={selectedUser?.id}
              onSelectUser={setSelectedUser}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Area */}
      <div className={`${selectedUser ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-slate-900/90 backdrop-blur-xl border-l border-slate-800`}>
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <ChatHeader 
                user={selectedUser} 
                onBack={() => setSelectedUser(null)}
              />

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-8 space-y-5 bg-slate-950/50">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="text-center text-slate-500 bg-slate-900/50 backdrop-blur-xl p-12 rounded-3xl border border-slate-800/50 shadow-2xl">
                        <MessageSquare className="mx-auto mb-4 text-slate-600" size={56} />
                        <p className="text-xl font-medium mb-1">No messages yet</p>
                        <p className="text-sm">Start the conversation by saying hi! 👋</p>
                      </div>
                    </motion.div>
                  ) : (
                    messages.map((msg, idx) => (
                      <MessageBubble
                        key={`${msg.timestamp}-${idx}`}
                        message={msg}
                        isOwn={msg.senderId === currentUser.id}
                      />
                    ))
                  )}
                </AnimatePresence>
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              <MessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                disabled={!isConnected}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center bg-slate-950/50"
            >
              <div className="text-center px-12">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 3, -3, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-7xl mb-8 bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent"
                >
                  💬
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-200 mb-3">
                  Welcome to PulseChat!
                </h2>
                <p className="text-slate-500 max-w-md text-lg">
                  {users.length === 0 
                    ? 'Register another account to start your first conversation'
                    : 'Select a user from the sidebar to start chatting'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
