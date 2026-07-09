import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code, Smartphone, Gamepad2, Video, Layers, Sparkles, LineChart, Globe, Trophy, Users, Star, Search } from 'lucide-react';
import SearchModal from './SearchModal';
import { AdminSettings } from '../types';
// @ts-ignore
import ayanProfile from '../assets/images/ayan_profile_1783140395006.jpg';

interface HomeSectionProps {
  onNavigate: (path: string) => void;
  settings: AdminSettings;
}

export default function HomeSection({ onNavigate, settings }: HomeSectionProps) {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const displayImage = settings.profileImage || ayanProfile;

  // Parallax Tilt State for the circular profile frame
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  // Stats counting values
  const [stats, setStats] = useState({ exp: 0, clients: 0, countries: 0 });

  useEffect(() => {
    const targetExp = parseInt(settings.experience) || 3;
    const targetClients = parseInt(settings.clientsCount) || 250;
    const targetCountries = parseInt(settings.countriesCount) || 3;

    setStats({ exp: 0, clients: 0, countries: 0 });

    // Staggered stats counting simulation
    const interval = setInterval(() => {
      setStats(prev => {
        const nextExp = prev.exp < targetExp ? prev.exp + 1 : targetExp;
        const nextClients = prev.clients < targetClients ? prev.clients + Math.ceil(targetClients / 15) : targetClients;
        const nextCountries = prev.countries < targetCountries ? prev.countries + 1 : targetCountries;
        
        const finalClients = nextClients > targetClients ? targetClients : nextClients;

        if (nextExp === targetExp && finalClients === targetClients && nextCountries === targetCountries) {
          clearInterval(interval);
        }
        return { exp: nextExp, clients: finalClients, countries: nextCountries };
      });
    }, 40);
    return () => clearInterval(interval);
  }, [settings]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Calculate tilt angles (max 15 degrees)
    const tiltX = (mouseY / (height / 2)) * -12;
    const tiltY = (mouseX / (width / 2)) * 12;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const services = [
    { name: 'Website Development', path: '/services/web-development', icon: Code, desc: 'High-speed holographic structures and reactive layouts.' },
    { name: 'App Development', path: '/services/app-development', icon: Smartphone, desc: 'Tactile gesture-driven mobile ecosystems.' },
    { name: 'Game Development', path: '/services/game-development', icon: Gamepad2, desc: 'Immersive procedural WebGL worlds.' },
    { name: 'Video Editing', path: '/services/video-editing', icon: Video, desc: 'Cinematic pacing and high-fidelity soundscapes.' },
    { name: 'Motion Graphics', path: '/services/motion-graphics', icon: Layers, desc: 'Kinetic typography and morphing shapes.' },
    { name: 'Thumbnail Design', path: '/services/thumbnail-design', icon: Sparkles, desc: 'Volumetric layouts that dominate click rates.' },
    { name: 'Business Solutions', path: '/services/business-solutions', icon: LineChart, desc: 'High-octane visual analytics & automations.' }
  ];

  return (
    <section className="relative min-h-screen bg-black overflow-hidden select-none">
      
      {/* Background Lights */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Content Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Side: Copy, Taglines & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-neutral-300 uppercase">
              Accepting Global COMMISSIONS
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-none mb-6 text-white"
          >
            AYAN <br />
            <span className="metallic-gold-text">NAYAK</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-base sm:text-lg font-display font-light tracking-wide text-neutral-400 mb-8 max-w-lg leading-relaxed"
          >
            Creative • Professional • Reliable. Crafting luxury digital masterpieces, interactive software, and cinematic motion production.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 w-full sm:w-auto"
          >
            <button 
              onClick={() => onNavigate('/portfolio')}
              className="px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black text-xs font-display font-bold uppercase tracking-[0.25em] rounded-full shadow-[0_0_20px_rgba(212,163,23,0.3)] hover:shadow-[0_0_35px_rgba(212,163,23,0.6)] transition-all cursor-pointer text-center shine-effect animate-pulse"
            >
              Explore Craft
            </button>
            <button 
              onClick={() => onNavigate('/contact')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-display font-bold uppercase tracking-[0.25em] rounded-full transition-all text-center"
            >
              Secure Lead
            </button>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="px-8 py-4 bg-white/5 hover:bg-gold-500/10 hover:border-gold-500/30 border border-white/10 text-gold-400 text-xs font-display font-bold uppercase tracking-[0.25em] rounded-full transition-all text-center flex items-center justify-center gap-2 cursor-pointer group"
              id="hero-search-btn"
            >
              <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-gold-500" />
              Search Studio
            </button>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 border-t border-white/5 pt-8 w-full"
          >
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
                {stats.exp}+
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mt-1">
                YEARS EXP
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-display font-black tracking-tight text-gold-400">
                {stats.clients}+
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mt-1">
                CLIENT LEADS
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
                {stats.countries}+
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mt-1">
                COUNTRIES SERVED
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive 3D Frame holding Portrait */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            ref={frameRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              perspective: '1000px'
            }}
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-gold-500/30 bg-neutral-900 relative flex items-center justify-center p-3 cursor-pointer shadow-2xl transition-all duration-300 hover:border-gold-500"
          >
            {/* Ambient Gold Halo Glow inside */}
            <div className="absolute inset-4 rounded-full bg-gold-600/5 blur-2xl animate-pulse pointer-events-none" />

            {/* Glowing neon accent ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-gold-500/10 animate-[spin_100s_linear_infinite]" />

            {/* Profile circular crop */}
            <div className="w-full h-full rounded-full overflow-hidden border border-white/5 relative z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
              <motion.img 
                src={displayImage} 
                alt="Ayan Nayak (A.ynx_)" 
                initial={{ scale: 1.25, filter: 'brightness(0.3) blur(10px)', opacity: 0 }}
                animate={{ scale: 1, filter: 'brightness(1) blur(0px)', opacity: 1 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              {/* Sweeping golden scanner line reveal overlay on load */}
              <motion.div 
                initial={{ top: '-100%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
                className="absolute left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-gold-400/40 to-transparent pointer-events-none z-20"
              />
              {/* Subtle metallic shadow overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
            </div>

            {/* Bottom Floating Tag in 3D Space */}
            <div 
              style={{ transform: 'translateZ(40px)' }}
              className="absolute -bottom-4 bg-black border border-gold-500/40 text-gold-400 font-mono text-[9px] font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-20 pointer-events-none"
            >
              A.YNX_
            </div>
          </motion.div>
        </div>

      </div>

      {/* INFINITE MARQUEE LINE */}
      <div className="w-full bg-neutral-950 border-y border-white/5 py-4 overflow-hidden relative select-none">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {[1, 2].map((group) => (
            <div key={group} className="flex gap-8 items-center text-xs font-display uppercase tracking-[0.4em] text-neutral-500">
              <span>WEBSITE DEVELOPMENT</span> <span className="text-gold-500">•</span>
              <span>APP DEVELOPMENT</span> <span className="text-gold-500">•</span>
              <span>GAME DEVELOPMENT</span> <span className="text-gold-500">•</span>
              <span>VIDEO EDITING</span> <span className="text-gold-500">•</span>
              <span>MOTION GRAPHICS</span> <span className="text-gold-500">•</span>
              <span>THUMBNAIL DESIGN</span> <span className="text-gold-500">•</span>
              <span>BUSINESS SOLUTIONS</span> <span className="text-gold-500">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK PREVIEW SERVICES */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col items-start">
            <span className="text-xs font-mono tracking-[0.3em] text-gold-400 uppercase mb-2">
              Our Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white">
              7 SERVICES, 1 STANDARD
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('/services')}
            className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 hover:text-gold-400 uppercase transition-colors"
          >
            All Services Detail <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Services Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.name}
                onClick={() => onNavigate(svc.path)}
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
                className="glass-premium p-8 rounded-3xl cursor-pointer glass-premium-hover relative overflow-hidden transition-all duration-300"
              >
                {/* Glowing light on hover */}
                {hoveredService === idx && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/5 via-transparent to-transparent pointer-events-none" />
                )}

                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-gold-400 mb-6 group-hover:border-gold-500 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-2">
                  {svc.name}
                </h3>
                
                <p className="text-xs font-sans text-neutral-400 leading-relaxed max-w-xs mb-6">
                  {svc.desc}
                </p>

                <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase flex items-center gap-2 mt-auto">
                  Explore Blueprint <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={onNavigate} 
      />

    </section>
  );
}
