import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import { toggleAmbientDrone } from '../utils/audio';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'AI Architect', path: '/ai-architect' },
    { name: 'Contact', path: '/contact' }
  ];

  const toggleAudio = () => {
    const newState = !isAudioOn;
    setIsAudioOn(newState);
    toggleAmbientDrone(newState);
  };

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 flex items-center justify-between select-none">
        
        {/* Logo */}
        <div 
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center bg-black/60 backdrop-blur-md group-hover:border-gold-500 transition-all duration-300">
            <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-gold-400 transition-colors">
              AN
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-sm tracking-widest text-white">
              A.YNX_
            </span>
            <span className="text-[8px] font-mono tracking-widest text-neutral-500 group-hover:text-gold-500/80 transition-colors">
              CREATIVE ENGINE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Controls */}
        <div className="hidden md:flex items-center gap-1 bg-black/40 backdrop-blur-xl border border-white/5 rounded-full px-2 py-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleLinkClick(item.path)}
                className={`px-4 py-2 rounded-full text-xs font-display tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'text-black bg-gold-500 font-bold shadow-[0_0_15px_rgba(212,163,23,0.3)]' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Action Tray */}
        <div className="flex items-center gap-3">
          {/* Sound Synthesizer toggle */}
          <button
            onClick={toggleAudio}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-500/30 flex items-center justify-center bg-black/60 backdrop-blur-md text-white transition-all duration-300 cursor-pointer"
            title={isAudioOn ? "Mute Background Music" : "Unmute Background Music"}
          >
            {isAudioOn ? <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black/60 backdrop-blur-md text-white hover:border-gold-500/30 transition-all cursor-pointer"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Premium Full-Screen Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-24 select-none overflow-y-auto"
          >
            {/* Custom Grid Overlay */}
            <div className="absolute inset-0 grid-overlay pointer-events-none opacity-40" />

            {/* Subtle light guides */}
            <div className="absolute top-0 left-1/3 bottom-0 w-[1px] bg-gold-500/5 pointer-events-none" />
            <div className="absolute top-0 left-2/3 bottom-0 w-[1px] bg-gold-500/5 pointer-events-none" />

            {/* Header placeholder for grid alignment */}
            <div className="h-12" />

            {/* Menu Items */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10 w-full max-w-7xl mx-auto">
              {/* Core Links */}
              <div className="flex flex-col gap-3 md:gap-6">
                <span className="text-[10px] font-mono tracking-[0.4em] text-gold-500 uppercase">
                  Menu Navigation
                </span>
                {navItems.map((item, idx) => {
                  const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                  return (
                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
                      key={item.path}
                    >
                      <button
                        onClick={() => handleLinkClick(item.path)}
                        className={`text-3xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight uppercase text-left transition-all duration-300 relative group cursor-pointer ${
                          isActive 
                            ? 'text-gold-400 pl-4' 
                            : 'text-neutral-500 hover:text-white hover:translate-x-2'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(212,163,23,0.8)]" />
                        )}
                        {item.name}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Brand Meta Data & Contact Hooks */}
              <div className="flex flex-col gap-6 max-w-xs font-mono text-xs text-neutral-400 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-12">
                <div>
                  <h4 className="text-white font-display font-semibold tracking-widest text-[10px] uppercase mb-2">
                    AYAN NAYAK (A.YNX_)
                  </h4>
                  <p className="leading-relaxed">
                    Multidisciplinary Creator specializing in premium software development, cinematic visual edits, and immersive gaming experiences.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-display font-semibold tracking-widest text-[10px] uppercase mb-1">
                    CLIENT LOCATIONS
                  </h4>
                  <p>India 🇮🇳 • USA 🇺🇸 • Pakistan 🇵🇰</p>
                </div>

                <div>
                  <h4 className="text-white font-display font-semibold tracking-widest text-[10px] uppercase mb-1">
                    GET IN TOUCH
                  </h4>
                  <a href="https://t.me/Aynxxzzz" target="_blank" rel="noreferrer" className="block text-gold-400 hover:underline">
                    Telegram: Aynxxzzz
                  </a>
                  <a href="https://wa.me/918477824872" target="_blank" rel="noreferrer" className="block text-neutral-300 hover:underline mt-1">
                    WhatsApp: +91 8477824872
                  </a>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-600 border-t border-white/5 pt-6 z-10 w-full max-w-7xl mx-auto">
              <span>© 2026 A.YNX_ STUDIO. ALL RIGHTS RESERVED.</span>
              <span className="hidden sm:inline">LUXURY CRAFT • AWWWARDS GOLD PRESET</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
