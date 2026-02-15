'use client';

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-200 mb-2.5 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              {icon}
            </div>
          )}
          <motion.input
            ref={ref}
            whileFocus={{ scale: 1.02 }}
            className={`
              w-full px-4 py-4 text-slate-100
              ${icon ? 'pl-12' : 'pl-4'} pr-4
              bg-slate-900/80 border-2 rounded-3xl backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-slate-500/20
              transition-all duration-200
              placeholder:text-slate-500 text-sm font-medium
              disabled:bg-slate-900/50 disabled:text-slate-600 disabled:cursor-not-allowed
              ${error 
                ? 'border-red-500/60 focus:border-red-400 focus:ring-red-500/30 ring-1 ring-red-500/20 shadow-red-500/20' 
                : 'border-slate-700/50 focus:border-sky-400 focus:ring-sky-500/30 ring-1 ring-transparent hover:border-slate-600/70'
              }
              ${className}
            `}
            {...(props as any)}
          />
        </div>
        {error && (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-2 text-sm text-red-400 flex items-center gap-2 font-medium bg-red-500/10 px-3 py-1.5 rounded-2xl border border-red-500/30 backdrop-blur-sm shadow-md shadow-red-500/20"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
