'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import OtpInput from 'react-otp-input';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(600);

  const router = useRouter();
  const searchParams = useSearchParams();
  const tempUserId = searchParams.get('tempUserId');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!tempUserId || !email) return;
  }, [tempUserId, email]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setError('OTP expired. Please register again.');
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/api/auth/verify-otp', {
        tempUserId,
        otp,
      });

      setSuccess(true);
      setAuth(data.token, data.user);

      setTimeout(() => {
        router.push('/chat');
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Invalid or expired OTP';
      setError(errorMsg);
      setOtp('');

      if (errorMsg.includes('expired') || errorMsg.includes('register again')) {
        setTimeout(() => {
          router.push('/register');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');

    try {
      await api.post('/api/auth/resend-otp', { tempUserId });
      setTimer(600);
      setOtp('');

      const toast = document.createElement('div');
      toast.className =
        'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-sm';
      toast.textContent = '✅ New OTP sent to your email!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to resend OTP';
      setError(errorMsg);

      if (errorMsg.includes('expired') || errorMsg.includes('register again')) {
        setTimeout(() => {
          router.push('/register');
        }, 3000);
      }
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6 && !loading && timer > 0 && !success) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  if (!tempUserId || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-slate-900/90 rounded-2xl shadow-2xl border border-red-500/40 max-w-md"
        >
          <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-50 mb-2">Invalid access</h2>
          <p className="text-slate-400 mb-4 text-sm">
            No verification session found. Please register again to get a fresh verification code.
          </p>
          <Link
            href="/register"
            className="inline-block px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-500 text-white rounded-xl hover:from-sky-400 hover:to-violet-400 font-semibold text-sm transition-colors"
          >
            Go to register
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/25 blur-3xl rounded-full" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full px-4 flex justify-center"
      >
        <div className="relative w-full max-w-3xl">
          {/* Glow border */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 rounded-3xl opacity-70 blur-xl" />

          <div className="relative bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl p-6 md:p-7">
            <div className="mb-4 flex items-center justify-between text-[11px] text-slate-500">
              <button
                onClick={() => router.push('/register')}
                className="inline-flex items-center gap-1 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to register</span>
              </button>
              <span className="hidden md:inline-block">
                Step 2 of 2 · Email verification
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* LEFT: Info */}
              <div className="md:w-5/12 flex flex-col justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 mb-3">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-medium text-slate-200">
                      OTP-secured account creation
                    </span>
                  </div>

                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-sky-500 to-violet-500 rounded-2xl shadow-xl mb-3">
                    <Mail className="text-white" size={26} />
                  </div>

                  <h1 className="text-2xl md:text-[1.6rem] font-bold mb-1 tracking-tight">
                    Verify your{' '}
                    <span className="bg-gradient-to-r from-sky-400 to-violet-300 bg-clip-text text-transparent">
                      email
                    </span>
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-[13px]">
                    A 6-digit verification code has been sent to:
                  </p>
                  <p className="mt-1 text-sky-400 font-semibold text-xs break-all">{email}</p>
                </div>

                <div className="mt-4 space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Code is valid for 10 minutes from generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span>Check spam or promotions if you do not see the email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>New OTP replaces the previous one instantly</span>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-slate-500">
                  <p>
                    Entering the correct code will complete your registration and log you into
                    PulseChat automatically.
                  </p>
                </div>
              </div>

              {/* RIGHT: OTP form */}
              <div className="md:w-7/12 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {!success ? (
                    <motion.div
                      key="verify"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mb-3 p-2.5 bg-red-500/10 border border-red-500/60 text-red-100 rounded-lg text-[11px] flex items-start gap-2"
                        >
                          <AlertCircle className="mt-0.5 w-4 h-4 flex-shrink-0" />
                          <p>{error}</p>
                        </motion.div>
                      )}

                      <div className="mb-4">
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          renderInput={(props) => (
                            <input
                              {...props}
                              className="!w-10 !h-12 mx-1 text-center text-xl font-semibold border border-slate-700 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 outline-none transition-all text-slate-50 bg-slate-900/80 disabled:bg-slate-800"
                              disabled={timer === 0 || loading}
                            />
                          )}
                          containerStyle="justify-center"
                          shouldAutoFocus
                        />
                      </div>

                      <div className="mb-4 text-center">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${
                            timer === 0
                              ? 'bg-red-500/10 border border-red-500/50'
                              : timer < 60
                              ? 'bg-amber-500/10 border border-amber-500/40'
                              : 'bg-slate-900/80 border border-slate-700'
                          }`}
                        >
                          <Clock
                            size={16}
                            className={
                              timer === 0
                                ? 'text-red-400'
                                : timer < 60
                                ? 'text-amber-300'
                                : 'text-slate-300'
                            }
                          />
                          <span
                            className={`text-[11px] font-semibold ${
                              timer === 0
                                ? 'text-red-300'
                                : timer < 60
                                ? 'text-amber-200'
                                : 'text-slate-200'
                            }`}
                          >
                            {timer === 0 ? 'Code expired' : `Expires in ${formatTime(timer)}`}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: loading || otp.length !== 6 || timer === 0 ? 1 : 1.02 }}
                        whileTap={{ scale: loading || otp.length !== 6 || timer === 0 ? 1 : 0.98 }}
                        onClick={handleVerify}
                        disabled={loading || otp.length !== 6 || timer === 0}
                        className="w-full bg-gradient-to-r from-sky-500 to-violet-500 text-white py-2.5 rounded-xl font-semibold hover:from-sky-400 hover:to-violet-400 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 flex items-center justify-center gap-2 text-xs sm:text-sm"
                      >
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Verifying...
                          </>
                        ) : (
                          'Verify code'
                        )}
                      </motion.button>

                      <div className="mt-4 text-center">
                        <p className="text-slate-400 text-[11px] mb-1">
                          Did not receive the code?
                        </p>
                        <button
                          onClick={handleResendOTP}
                          disabled={resending || timer > 540}
                          className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold disabled:text-slate-500 disabled:cursor-not-allowed flex items-center gap-2 mx-auto transition-colors"
                        >
                          <RefreshCw
                            size={16}
                            className={resending ? 'animate-spin text-sky-300' : ''}
                          />
                          {resending
                            ? 'Sending...'
                            : timer > 540
                            ? `Wait ${formatTime(timer - 540)}`
                            : 'Resend code'}
                        </button>

                        <p className="mt-3 text-[10px] text-slate-500">
                          Check spam or promotions folder if the email is not in your inbox.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      >
                        <CheckCircle className="mx-auto text-emerald-400 mb-4" size={56} />
                      </motion.div>
                      <h2 className="text-xl font-bold text-slate-50 mb-2">
                        Email verified successfully
                      </h2>
                      <p className="text-slate-400 text-sm mb-4">
                        Your account is now active. Redirecting you to PulseChat.
                      </p>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full mx-auto"
                      />
                      <p className="text-[11px] text-slate-500 mt-2">
                        This window will close automatically in a moment.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
