'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { api } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { User, Mail, Lock, AlertCircle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log('✅ Registration successful:', data);

      // Redirect to OTP verification
      window.location.href = `/verify-otp?tempUserId=${data.tempUserId}&email=${encodeURIComponent(
        data.email
      )}`;
    } catch (err: any) {
      console.error('❌ Registration error:', err.response?.data);
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setError('');
      setLoading(true);
      const { data } = await api.post('/api/auth/google', {
        credential: credentialResponse.credential,
      });
      setAuth(data.token, data.user);
      router.push('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google signup failed. Please try again.');
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
    {/* Background glows */}
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600/30 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/25 blur-3xl rounded-full" />
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
      {/* Square card, two columns, no internal scroll */}
      <div className="relative w-full max-w-3xl">
        {/* Glow border */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 rounded-3xl opacity-70 blur-xl" />

        <div className="relative bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl p-6 md:p-7">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* LEFT: Info / Highlights */}
            <div className="md:w-5/12 flex flex-col justify-between gap-4">
              {/* Top */}
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 mb-3">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-200">
                    OTP-secured registration · No fake accounts
                  </span>
                </div>

                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-sky-500 to-violet-500 rounded-2xl shadow-xl mb-3">
                  <Sparkles className="text-white" size={26} />
                </div>

                <h1 className="text-2xl md:text-[1.6rem] font-bold mb-1 tracking-tight">
                  Create your{' '}
                  <span className="bg-gradient-to-r from-sky-400 to-violet-300 bg-clip-text text-transparent">
                    PulseChat
                  </span>{' '}
                  account
                </h1>
                <p className="text-slate-400 text-xs sm:text-[13px]">
                  Secure email + password signup with email OTP verification. Designed for
                  production-ready chat apps.
                </p>
              </div>

              {/* Middle: bullets */}
              <div className="mt-4 space-y-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Encrypted credentials, never stored in plain text</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span>OTP-based email verification before chat access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Unified experience with live presence & modern UI</span>
                </div>
              </div>

              {/* Bottom: login link */}
              <div className="mt-4 text-[11px] text-slate-500">
                <p>
                  Already have an account?{' '}
                  <Link href="/login" className="text-sky-400 hover:text-sky-300 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* RIGHT: Form (no scroll, compact) */}
            <div className="md:w-7/12 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
              {/* Optional: small label row */}
              <div className="flex items-center justify-between mb-3 text-[11px] text-slate-500">
                <span>Use Google or email to continue</span>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="hidden md:inline-block hover:text-slate-300 transition-colors"
                >
                  ← Back to home
                </button>
              </div>

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

              {/* Google */}
              <div className="mb-4 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  theme="outline"
                  text="signup_with"
                  width="100%"
                />
              </div>

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wide">
                  <span className="px-2 bg-slate-950 text-slate-400">Or register with email</span>
                </div>
              </div>

              {/* Form – compact so it fits without scrolling */}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-[13px]">
                {/* Username */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 outline-none transition-all text-slate-100 placeholder:text-slate-500"
                      placeholder="johndoe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 outline-none transition-all text-slate-100 placeholder:text-slate-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 outline-none transition-all text-slate-100 placeholder:text-slate-500"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
                  {formData.password && (
                    <div className="mt-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            className={`h-full ${passwordStrength.color} transition-all`}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-200 mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="w-full pl-9 pr-9 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 outline-none transition-all text-slate-100 placeholder:text-slate-500"
                      placeholder="••••••••"
                      required
                    />
                    {formData.confirmPassword &&
                      formData.password === formData.confirmPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CheckCircle2 className="text-emerald-400" size={16} />
                        </div>
                      )}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 bg-gradient-to-r from-sky-500 to-blue-500 text-white py-2.5 rounded-xl font-semibold hover:from-sky-400 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>

                <p className="mt-2 text-[10px] text-slate-500 text-center">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-sky-400 hover:underline">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-sky-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

}
