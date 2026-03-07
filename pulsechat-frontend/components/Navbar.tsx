'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Logo from '@/components/ui/Logo';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Logic: If at top (< 50px), expanded.
    // If scrolled down (> 50px), compact.
    // For smoother feeling, we can also check direction if needed, 
    // but stable resizing based on position is usually better for this layout style.
    if (latest > 50) {
      setIsCompact(true);
    } else {
      setIsCompact(false);
    }
  });

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4">
        <motion.nav
          initial={false}
          animate={isCompact ? 'compact' : 'expanded'}
          variants={{
            expanded: {
              width: '100%',
              maxWidth: '1200px',
              padding: '1.25rem 2.5rem',
              borderRadius: '2rem',
            },
            compact: {
              width: '100%',
              maxWidth: '750px',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
            }
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.4 }}
          className={`flex items-center justify-between transition-colors duration-300 ${
            isCompact 
              ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl'
              : 'bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border border-slate-200/30 dark:border-slate-800/30 shadow-lg'
          }`}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={isCompact ? 'sm' : 'md'} />
              <motion.span 
                animate={{ opacity: isCompact ? 0 : 1, width: isCompact ? 0 : 'auto', display: isCompact ? 'none' : 'block' }}
                className="font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden"
              >
                PulseChat
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <motion.span 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-white/10 ${
                    pathname === link.href ? 'text-foreground font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
             
             {mounted && (
               <button
                 onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                 className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                 aria-label="Toggle Dark Mode"
               >
                 {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
               </button>
             )}

             <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
               Log in
             </Link>
             <Link href="/register">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className={`
                   ${isCompact ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-sm'}
                   bg-gradient-to-r from-sky-500 to-violet-600 
                   text-white font-semibold rounded-full 
                   shadow-lg shadow-sky-500/20 
                   flex items-center gap-2
                   transition-all
                 `}
               >
                 Get Started
                 {!isCompact && <ArrowRight size={16} />}
               </motion.button>
             </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-xl pt-32 px-6 md:hidden"
          >
            <div className="flex flex-col items-center gap-6">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-3 mb-4 flex items-center gap-2 rounded-full text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-white/10 transition-colors"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              )}
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-500 dark:hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="w-20 border-slate-200 dark:border-slate-800 my-4" />
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-8 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold rounded-full shadow-lg shadow-sky-500/20"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
