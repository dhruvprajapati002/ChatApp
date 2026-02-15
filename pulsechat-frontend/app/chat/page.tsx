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
import { LogOut, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/ui/Logo';

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  
  // Use a ref to scroll to bottom
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
      setOnlineUserIds(userIds);

      setUsers(prevUsers =>
        prevUsers.map(user => ({
          ...user,
          isOnline: user.id ? userIds.includes(user.id) : false
        }))
      );
    });

    socket.on('user_status_changed', ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
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
    <div className="h-screen flex bg-slate-950 text-white overflow-hidden">
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* Sidebar Container */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${selectedUser ? 'hidden lg:flex' : 'flex'} lg:w-[380px] w-full flex-col z-10`}
      >
        {/* Sidebar Header */}
        <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 border-r border-slate-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
             <Logo size="sm" className="shadow-none ring-0 w-8 h-8 rounded-lg" />
             <span className="font-bold text-lg text-white tracking-tight">PulseChat</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-sky-500/50 transition-all" />
                ) : (
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs text-slate-300 ring-2 ring-slate-800 group-hover:bg-slate-700 transition-all">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-slate-900 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
             </div>
             
             <button 
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 min-h-0 bg-transparent">
          <UserList
            users={users}
            selectedUserId={selectedUser?.id}
            onSelectUser={setSelectedUser}
          />
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className={`${selectedUser ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-slate-900/40 backdrop-blur-xl relative z-10`}>
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full"
            >
              <ChatHeader 
                user={selectedUser} 
                onBack={() => setSelectedUser(null)}
              />

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                <div className="min-h-full flex flex-col justify-end p-4 md:p-8 space-y-6">
                  <AnimatePresence>
                    {messages.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col items-center justify-center py-20 opacity-50"
                      >
                         <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="text-slate-600" size={32} />
                         </div>
                         <p className="text-slate-400 font-medium">No messages yet</p>
                      </motion.div>
                    ) : (
                      messages.map((msg, idx) => (
                        <div key={`${msg.timestamp}-${idx}`}>
                          {/* Date Separator (Optional - logic can be added later) */}
                          <MessageBubble
                            message={msg}
                            isOwn={msg.senderId === currentUser.id}
                          />
                        </div>
                      ))
                    )}
                  </AnimatePresence>
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} className="h-px" />
                </div>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-gradient-to-tr from-sky-500/20 to-violet-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/5">
                   <MessageSquare className="text-sky-400" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">PulseChat</h2>
                <p className="text-slate-400 max-w-sm mx-auto">
                  Select a context to start messaging or create a new group to collaborate with your team.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
