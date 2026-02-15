'use client';

import { useRouter } from 'next/navigation';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { api } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import {
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
  Wifi,
  CheckCircle2,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const { data } = await api.post('/api/auth/google', {
        credential: credentialResponse.credential,
      });
      setAuth(data.token, data.user);
      router.push('/chat');
    } catch (err: any) {
      console.error('Google signup failed', err.response?.data || err);
    }
  };

  const handleGoogleError = () => {
    console.error('Google signup failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-sky-500/30">
      <Navbar />

      {/* Dynamic Background */}

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left space-y-8"
          >
            

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Chat that feels <br className="hidden lg:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 animate-gradient-x">
                magically instant
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the next evolution of messaging. Real-time typing indicators, 
              secure end-to-end encryption, and a beautifully crafted interface that 
              makes every conversation a delight.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => router.push('/register')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 to-violet-600 rounded-2xl text-white font-bold hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Start Chatting Free
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 text-white rounded-2xl font-bold border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
              >
                Live Demo
              </button>
            </div>

            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-slate-800/60">
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-white">100ms</h4>
                <p className="text-slate-500 text-sm">Latency</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-white">99.9%</h4>
                <p className="text-slate-500 text-sm">Uptime</p>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-1">
                <h4 className="text-2xl font-bold text-white">256-bit</h4>
                <p className="text-slate-500 text-sm">Encryption</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-[600px] perspective-1000"
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-slate-900/90 border border-slate-700/50 rounded-[2rem] p-6 lg:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
                
                {/* Auth Area */}
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-violet-500 mx-auto flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Welcome Back</h3>
                    <p className="text-slate-400 text-sm">Sign in to access your workspace</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        width="100%"
                        logo_alignment="left"
                      />
                    </div>
                    
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-700"></div>
                      <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-wider">Or continue with</span>
                      <div className="flex-grow border-t border-slate-700"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => router.push('/login')} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all group/btn">
                        <Lock className="w-4 h-4 text-slate-400 group-hover/btn:text-sky-400 transition-colors" />
                        <span className="text-sm font-medium text-slate-300">Login</span>
                      </button>
                      <button onClick={() => router.push('/register')} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all group/btn">
                        <Globe className="w-4 h-4 text-slate-400 group-hover/btn:text-violet-400 transition-colors" />
                        <span className="text-sm font-medium text-slate-300">Register</span>
                      </button>
                    </div>
                  </div>

                  {/* Fake Chat Preview */}
                  <div className="mt-8 pt-6 border-t border-slate-800/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex -space-x-2">
                         <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-sky-500"></div>
                         <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-violet-500"></div>
                         <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500"></div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">1.2k+ users online</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-end gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0"></div>
                        <div className="px-3 py-2 bg-slate-800 rounded-2xl rounded-bl-none text-xs text-slate-200">
                          Hey! Is the new update live? 🚀
                        </div>
                      </div>
                      <div className="flex items-end gap-2 justify-end">
                        <div className="px-3 py-2 bg-sky-600/20 text-sky-200 border border-sky-500/20 rounded-2xl rounded-br-none text-xs">
                          Yes! Just deployed it. Check it out!
                        </div>
                        <div className="w-6 h-6 rounded-full bg-sky-500 flex-shrink-0"></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Stripes */}
        <div id="features" className="mt-24 mb-32 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-slate-900/50 blur-3xl -z-10 rounded-full"></div>
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Why users love PulseChat</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Built for speed, designed for clarity. Everything you need to communicate effectively.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: ShieldCheck, title: "Secure by Default", desc: "End-to-end encrypted messaging via Socket.IO ensuring your conversations stay private.", color: "text-emerald-400" },
              { icon: Zap, title: "Lightning Fast", desc: "Powered by WebSocket technology for sub-100ms latency real-time communication.", color: "text-amber-400" },
              { icon: Sparkles, title: "Modern Design", desc: "A beautifully crafted glassmorphism UI with smooth 60fps animations.", color: "text-purple-400" },
              { icon: Wifi, title: "Real-time Sync", desc: "Instant synchronization across all your devices. Never miss a message.", color: "text-sky-400" },
              { icon: Users, title: "Group Chats", desc: "Create unlimited groups and collaborate with your team effortlessly.", color: "text-rose-400" },
              { icon: CheckCircle2, title: "Read Receipts", desc: "Know exactly when your messages are delivered and read.", color: "text-blue-400" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm hover:bg-slate-800/40 hover:border-slate-700/50 transition-all text-center md:text-left group"
              >
                <div className={`w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-4 mx-auto md:mx-0 ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="mb-32 max-w-4xl mx-auto relative">
           <div className="absolute -right-20 top-0 w-72 h-72 bg-violet-600/10 blur-[100px] rounded-full"></div>
           <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 md:p-12 backdrop-blur-md relative overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
               <div className="flex-1 space-y-6 text-center md:text-left">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">About PulseChat</h2>
                  <p className="text-slate-400 leading-relaxed">
                    PulseChat started as a passion project to simplify real-time communication. 
                    We believe messaging should be instantaneous, distraction-free, and beautiful.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Built with the latest web technologies like Next.js, Socket.IO, and Tailwind CSS, 
                    we push the boundaries of what's possible in the browser.
                  </p>
               </div>
               <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-tr from-sky-500 to-violet-600 p-1 rotate-3 hover:rotate-0 transition-all duration-300">
                     <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden">
                        <Users size={64} className="text-white/20" />
                     </div>
                  </div>
               </div>
             </div>
           </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="mb-24 max-w-3xl mx-auto text-center">
           <h2 className="text-4xl font-bold mb-6">Get in touch</h2>
           <p className="text-slate-400 mb-10">Have questions or feedback? I'd love to hear from you.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <a href="mailto:hello@pulsechat.dev" className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 transition-colors flex items-center justify-center gap-3 group">
               <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                 <MessageCircle size={20} />
               </div>
               <span className="font-medium text-slate-200">hello@pulsechat.dev</span>
             </a>
             <a href="https://twitter.com/pulsechat" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/50 transition-colors flex items-center justify-center gap-3 group">
              <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all">
                 <Globe size={20} />
               </div>
               <span className="font-medium text-slate-200">@pulsechat_app</span>
             </a>
           </div>

           <div className="mt-16 pt-8 border-t border-slate-800/50 text-slate-500 text-sm">
              <p>&copy; {new Date().getFullYear()} PulseChat. All rights reserved.</p>
              <div className="flex justify-center gap-4 mt-4">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
