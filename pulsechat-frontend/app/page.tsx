'use client';

import { useRouter } from 'next/navigation';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { api } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
  Wifi,
  CheckCircle2,
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
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background: gradient + orbits */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/25 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-sky-500/25 blur-3xl rounded-full" />
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-14 flex flex-col gap-12 md:gap-16">
        {/* Top nav */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center shadow-lg shadow-sky-500/40">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="font-semibold tracking-tight">PulseChat</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/70">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Realtime presence</span>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border border-slate-600/70 hover:border-slate-400 hover:bg-slate-900/60 transition-colors"
            >
              Sign in
            </button>
          </div>
        </header>

        {/* Hero row */}
        <section className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          {/* Left: text column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70 mb-1">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-200">
                Production-grade chat · OTP-secured auth · Realtime presence
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-extrabold tracking-tight leading-tight">
              Build conversations that feel{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                instant
              </span>
              , secure and alive.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              PulseChat combines smooth animations, live user status, OTP email verification and
              modern auth flows into a single beautiful messaging experience.
            </p>

            {/* Feature chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80">
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <span className="text-slate-200">Online / offline presence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-200">OTP email verification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-slate-200">Framer Motion UI</span>
              </div>
            </div>

            {/* Primary CTA buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/login')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold shadow-lg shadow-sky-500/40 hover:from-sky-400 hover:to-blue-400 transition-all"
              >
                Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/register')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-600/80 bg-slate-900/70 text-slate-100 font-semibold hover:border-slate-300 hover:bg-slate-900/90 transition-all"
              >
                Create account
              </motion.button>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-sky-400 hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-sky-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </motion.div>

          {/* Right: animated auth + chat preview */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative"
          >
            {/* Floating accent shapes */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-6 -right-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-[11px] text-emerald-200 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live typing indicators
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute -bottom-6 -left-4 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/40 text-[11px] text-violet-200"
            >
              OTP-secured onboarding
            </motion.div>

            {/* Main card */}
            <div className="relative">
              {/* Glow border */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 rounded-3xl opacity-70 blur-xl" />
              <div className="relative bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <Sparkles className="w-4 h-4 text-sky-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Get started in seconds
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Choose how you want to join PulseChat
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                    v1.0 · MERN + Socket.IO
                  </span>
                </div>

                {/* Google */}
                <div className="mb-5 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    size="large"
                    theme="outline"
                    text="continue_with"
                  />
                </div>

                {/* Divider */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wide">
                    <span className="px-2 bg-slate-950 text-slate-400">
                      Or use email
                    </span>
                  </div>
                </div>

                {/* Login / Register tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <motion.button
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/login')}
                    className="group text-left rounded-2xl border border-slate-700 bg-slate-900/80 p-4 hover:border-sky-400/70 hover:bg-slate-900 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-100">
                        Login
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Already with us? Jump back into your chats.
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/register')}
                    className="group text-left rounded-2xl border border-slate-700 bg-slate-900/80 p-4 hover:border-violet-400/70 hover:bg-slate-900 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-100">
                        Register
                      </span>
                      <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-violet-300 transition-colors" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      New here? Create an account with OTP verification.
                    </p>
                  </motion.button>
                </div>

                {/* Mini chat preview */}
                <div className="mt-3 mb-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-xs font-semibold">
                        D
                      </div>
                      <div className="text-xs">
                        <p className="text-slate-100 font-medium">Dhruv</p>
                        <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Online
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">Now</span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="max-w-[80%] rounded-2xl bg-slate-800 px-3 py-1.5 text-slate-100">
                      Welcome to your new chat playground 👋
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-3 py-1.5 text-slate-50 flex items-center gap-1.5">
                        <span>Let&apos;s ship something crazy.</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer strip */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-slate-400">
                      Encrypted credentials · OTP-guarded signup
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Built with MERN + Socket.IO
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
