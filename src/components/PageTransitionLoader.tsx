import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionLoaderProps {
  isVisible: boolean;
}

export default function PageTransitionLoader({ isVisible }: PageTransitionLoaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md select-none pointer-events-auto"
        >
          {/* Outer circular gold scan line */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,163,23,0.12)_0%,transparent_60%)] pointer-events-none" />

          {/* Micro interlocking logo inside the loader */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Spinning background rings */}
            <div className="absolute w-36 h-36 border border-gold-500/10 rounded-full animate-[spin_8s_linear_infinite]" />
            <div className="absolute w-28 h-28 border border-dashed border-gold-500/20 rounded-full animate-[spin_4s_linear_infinite_reverse]" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-20 h-20 relative flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-500 fill-none stroke-current">
                <defs>
                  <linearGradient id="loaderGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fefdf0" />
                    <stop offset="50%" stopColor="#d4a317" />
                    <stop offset="100%" stopColor="#744911" />
                  </linearGradient>
                </defs>
                
                {/* Outer Hexagon */}
                <polygon 
                  points="50,5 90,27 90,73 50,95 10,73 10,27"
                  stroke="url(#loaderGoldGradient)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Central Geometric 'A' */}
                <path 
                  d="M32 70 L50 25 L68 70 M40 55 L60 55"
                  stroke="url(#loaderGoldGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Overlapping 'N' Element */}
                <path 
                  d="M50 25 L50 70 L68 25 L68 70"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* Glowing Text Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex flex-col items-center gap-1 font-mono"
            >
              <span className="text-[9px] uppercase tracking-[0.4em] text-gold-400 font-bold animate-pulse">
                SYNCING CHANNELS...
              </span>
              <span className="text-[7px] text-neutral-500 uppercase tracking-widest">
                Please Stand By
              </span>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
