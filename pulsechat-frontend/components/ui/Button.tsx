'use client';

import { ButtonHTMLAttributes, ReactNode, DragEventHandler } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-3xl transition-all duration-200 inline-flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm shadow-lg hover:shadow-xl border border-slate-800/50 hover:border-slate-700/70';
  
  const variants = {
    primary: 'bg-gradient-to-r from-sky-500 to-violet-500 text-white hover:from-sky-400 hover:to-violet-400 shadow-sky-500/40 hover:shadow-sky-500/50 ring-1 ring-sky-500/30 hover:ring-sky-400/40',
    secondary: 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 hover:text-slate-100 shadow-slate-500/20 hover:shadow-slate-500/30 ring-1 ring-slate-700/40 hover:ring-slate-600/50',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-400 hover:to-rose-400 shadow-red-500/40 hover:shadow-red-500/50 ring-1 ring-red-500/30 hover:ring-red-400/40',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 shadow-slate-500/10 hover:shadow-slate-500/20 ring-1 ring-transparent hover:ring-slate-700/30',
    outline: 'bg-slate-900/50 text-slate-200 border-slate-700/50 hover:border-sky-500/50 hover:text-sky-300 hover:bg-sky-500/10 shadow-slate-500/20 hover:shadow-sky-500/30 ring-1 ring-transparent hover:ring-sky-500/30'
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3.5 text-base',
    lg: 'px-8 py-4.5 text-lg'
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <motion.svg 
            className="animate-spin h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </motion.svg>
          <span className="text-sm font-medium">Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
}
