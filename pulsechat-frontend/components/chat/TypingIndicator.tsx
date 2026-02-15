'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-xl shadow-slate-900/50"
    >
      {/* Animated typing dots */}
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2.5 h-2.5 bg-gradient-to-r from-sky-400 to-violet-400 rounded-full shadow-lg shadow-sky-500/50"
          animate={{ 
            y: [0, -6, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="w-2.5 h-2.5 bg-gradient-to-r from-sky-400 to-violet-400 rounded-full shadow-lg shadow-sky-500/50"
          animate={{ 
            y: [0, -6, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        <motion.div
          className="w-2.5 h-2.5 bg-gradient-to-r from-sky-400 to-violet-400 rounded-full shadow-lg shadow-sky-500/50"
          animate={{ 
            y: [0, -6, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4
          }}
        />
      </div>
      
      {/* Typing text */}
      <motion.span 
        className="text-sm font-medium text-slate-300 bg-gradient-to-r from-sky-400/80 to-violet-400/80 bg-clip-text"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ 
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {`Someone is typing...`}
      </motion.span>
    </motion.div>
  );
}
