import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playMetallicChime, toggleAmbientDrone } from '../utils/audio';

interface CinemaLoaderProps {
  onComplete: () => void;
}

export default function CinemaLoader({ onComplete }: CinemaLoaderProps) {
  const [phase, setPhase] = useState<'emerging' | 'formed' | 'ready' | 'transitioning'>('emerging');
  const [percent, setPercent] = useState(0);

  // Loading bar increment
  useEffect(() => {
    if (phase === 'emerging') {
      const interval = setInterval(() => {
        setPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase('formed');
            return 100;
          }
          return prev + Math.floor(Math.random() * 8) + 4;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleActivate = () => {
    // 1. Play synthesized metallic sound effect
    playMetallicChime();
    // 2. Start cosmic background drone
    toggleAmbientDrone(true);
    // 3. Move to transitioning phase (scale up/fly-through logo)
    setPhase('transitioning');
    
    // 4. Complete loading after animation finish
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div id="cinema-loader" className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden select-none">
        
        {/* Subtle Ambient Cosmic Starfield during loading */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,163,23,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Dynamic Golden Particle Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[500px] h-[500px] border border-gold-500/10 rounded-full animate-[spin_40s_linear_infinite] absolute" />
          <div className="w-[300px] h-[300px] border border-gold-500/5 rounded-full animate-[spin_20s_linear_infinite_reverse] absolute" />
          <div className="w-[600px] h-[600px] border-dashed border-gold-500/5 rounded-full animate-[spin_60s_linear_infinite] absolute" />
        </div>

        {/* Cinematic Header Text */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-12 text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold-400/60 font-mono">
            A.YNX_ DIGITAL ENGINE v3.5
          </span>
        </motion.div>

        {/* Logo Container */}
        <div className="relative flex flex-col items-center justify-center z-10">
          <motion.div
            animate={
              phase === 'transitioning'
                ? { scale: 12, opacity: 0, filter: 'blur(10px)' }
                : phase === 'formed'
                ? { scale: [1, 1.05, 1], filter: 'drop-shadow(0 0 30px rgba(212,163,23,0.6))' }
                : { scale: 1 }
            }
            transition={{
              duration: phase === 'transitioning' ? 1.5 : 3,
              ease: phase === 'transitioning' ? "easeInOut" : "easeInOut",
              repeat: phase === 'formed' ? Infinity : 0,
              repeatType: "reverse"
            }}
            className="w-40 h-40 flex items-center justify-center cursor-pointer relative"
          >
            {/* SVG AN Interlocking Logo with luxury strokes */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-gold-500 fill-none stroke-current">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fefdf0" />
                  <stop offset="50%" stopColor="#d4a317" />
                  <stop offset="100%" stopColor="#744911" />
                </linearGradient>
              </defs>
              
              {/* Outer Golden Glow Hexagon */}
              <motion.polygon 
                points="50,5 90,27 90,73 50,95 10,73 10,27"
                stroke="url(#goldGradient)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />

              {/* Central Geometric 'A' */}
              <motion.path 
                d="M32 70 L50 25 L68 70 M40 55 L60 55"
                stroke="url(#goldGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: percent / 100 }}
                transition={{ duration: 0.5 }}
              />

              {/* Overlapping 'N' Element */}
              <motion.path 
                d="M50 25 L50 70 L68 25 L68 70"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: percent > 50 ? (percent - 50) / 50 : 0,
                  opacity: percent > 40 ? 0.95 : 0
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Tiny Sparkles */}
              {phase === 'formed' && (
                <motion.circle 
                  cx="50" cy="25" r="2" 
                  fill="#ffffff" 
                  animate={{ scale: [1, 2.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </svg>
          </motion.div>

          {/* Interactive Gate Reveal */}
          <div className="h-20 mt-8 flex flex-col items-center justify-center">
            {phase === 'emerging' && (
              <div className="flex flex-col items-center">
                <span className="text-xs tracking-[0.3em] font-mono text-gold-400 mb-2">
                  SYNCHRONIZING PARTICLES... {percent}%
                </span>
                <div className="w-48 h-[2px] bg-neutral-900 overflow-hidden relative rounded-full">
                  <motion.div 
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-gold-600 to-gold-400"
                    animate={{ width: `${percent}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {phase === 'formed' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleActivate}
                className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black text-xs font-display font-bold uppercase tracking-[0.25em] rounded-full shadow-[0_0_30px_rgba(212,163,23,0.4)] hover:shadow-[0_0_50px_rgba(212,163,23,0.7)] transition-all cursor-pointer border border-gold-300 shine-effect"
              >
                ENTER THE DIGITAL UNIVERSE
              </motion.button>
            )}

            {phase === 'transitioning' && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-mono tracking-[0.4em] text-white/80 uppercase animate-pulse"
              >
                WARPING TIME & SPACE...
              </motion.span>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="absolute bottom-10 flex flex-col items-center font-mono text-[9px] text-neutral-600 tracking-wider">
          <span>CREATIVE STUDIO • MOTION PRODUCTION • ENTERPRISE CORE</span>
          <span className="mt-1 text-neutral-800">Designed with absolute craftsmanship</span>
        </div>
      </div>
    </AnimatePresence>
  );
}
