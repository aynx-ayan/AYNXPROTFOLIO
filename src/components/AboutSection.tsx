import { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Trophy, Compass, Star, Calendar, ArrowRight } from 'lucide-react';
import { AdminSettings } from '../types';

interface AboutSectionProps {
  settings: AdminSettings;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const [selectedPin, setSelectedPin] = useState<'IN' | 'PK' | 'US' | null>('IN');

  const timelineItems = [
    {
      year: '2023',
      title: 'Post-Production Genesis',
      desc: 'Launched digital media career specializing in Adobe Creative Suite (Premiere & After Effects). Dispatched 50+ localized corporate videos and custom thumbnails, achieving immediate local market traction.'
    },
    {
      year: '2024',
      title: 'The Full-Stack Expansion',
      desc: 'Broke boundaries by incorporating web, application, and game development. Expanded operations globally to serve professional creatives and businesses in Pakistan and the United States, pushing client count to 150+.'
    },
    {
      year: '2025',
      title: 'Automated Operations & Sandboxes',
      desc: 'Engineered robust, real-time enterprise boards and interactive WebGL environments. Successfully passed the milestone of 250+ happy clients, refining standard workflows for faster, premium turnarounds.'
    },
    {
      year: '2026',
      title: 'Advanced Shaders & Color Pipelines',
      desc: 'Mastering high-fidelity color grading within DaVinci Resolve alongside responsive WebGL shaders. Striving to design and develop the world\'s most polished virtual masterpieces.'
    }
  ];

  const mapPins = {
    'IN': {
      name: 'India 🇮🇳',
      city: 'Mainland HQ',
      clientRatio: '45% of Projects',
      preferredServices: 'Web & App Development, Thumbnail Design',
      stats: '115+ Clients served'
    },
    'PK': {
      name: 'Pakistan 🇵🇰',
      city: 'Collaborative Hub',
      clientRatio: '20% of Projects',
      preferredServices: 'Video Editing, Motion Graphics',
      stats: '55+ Clients served'
    },
    'US': {
      name: 'United States 🇺🇸',
      city: 'Strategic Enterprise Clientele',
      clientRatio: '35% of Projects',
      preferredServices: 'Business Solutions, Website Design, App Backends',
      stats: '80+ Clients served'
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 pt-24 px-6 md:px-12 relative overflow-hidden select-none">
      
      {/* Dynamic Background Light overlays */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Page Title Header */}
        <div className="mb-20 text-center sm:text-left">
          <span className="text-xs font-mono tracking-[0.3em] text-gold-400 uppercase mb-2 block">
            GENESIS & TIMELINE
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white uppercase">
            ABOUT <span className="metallic-gold-text">A.YNX_</span>
          </h1>
        </div>

        {/* Dual Column Storytelling section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-display font-bold text-white tracking-wide uppercase">
              The Creative Blueprint
            </h3>
            <p className="text-sm font-sans text-neutral-400 leading-relaxed">
              I am Ayan Nayak (A.ynx_), a multidisciplinary creator with over {settings.experience || '3+ Years'} of experience delivering premium digital solutions worldwide.
            </p>
            <p className="text-sm font-sans text-neutral-400 leading-relaxed">
              {settings.aboutText || 'From cinematic editing and motion graphics to website, application, and game development, my mission is to build memorable digital experiences with creativity, professionalism, and reliability.'}
            </p>
            <p className="text-sm font-sans text-neutral-400 leading-relaxed">
              Having successfully served more than {settings.clientsCount || '250+'} clients across India, Pakistan, and the USA, I continue to push boundaries and learn new technologies every day.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="glass-premium p-8 rounded-3xl border border-white/5 relative overflow-hidden gold-glow">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-4">
                Global Standards Achieved
              </span>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs">
                    🏆
                  </div>
                  <span className="text-xs font-mono text-neutral-200">{settings.clientsCount || '250+'} Professional Dispatches</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-500 text-xs">
                    ⚡
                  </div>
                  <span className="text-xs font-mono text-neutral-200">100% Client Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs">
                    🌐
                  </div>
                  <span className="text-xs font-mono text-neutral-200">Serviced in {settings.countriesCount || '3+'} Countries</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WORLD MAP CLIENT INTERACTIVE RADAR */}
        <div className="mb-24 border-t border-white/10 pt-16">
          <div className="mb-12 flex flex-col items-start text-left">
            <span className="text-xs font-mono tracking-[0.25em] text-gold-400 uppercase">
              Global Dispersion Radar
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-white uppercase mt-1">
              Active Client Locations
            </h2>
            <p className="text-xs font-mono text-neutral-500 mt-1">
              Select an active pin on the radar dashboard below to examine regional dispatch metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Visual Radar Locator */}
            <div className="lg:col-span-7 glass-premium rounded-3xl border border-white/5 p-8 relative min-h-[300px] flex items-center justify-center bg-[#070707]">
              
              {/* Radar ring animation loops */}
              <div className="absolute w-72 h-72 border border-gold-500/5 rounded-full animate-ping pointer-events-none" />
              <div className="absolute w-44 h-44 border border-gold-500/10 rounded-full animate-pulse pointer-events-none" />

              {/* Grid background inside */}
              <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

              {/* Golden World Map Silhouette / Abstract Nodes */}
              <svg viewBox="0 0 100 60" className="w-full h-full max-w-lg stroke-gold-500/10 fill-none">
                {/* Simulated continents nodes */}
                <path d="M10 20 L25 15 L35 25 M30 35 L40 45 L50 35 M55 15 L70 10 L85 20 M65 30 L80 35 L90 45" strokeWidth="0.5" strokeDasharray="1 1" />
              </svg>

              {/* Pin USA */}
              <button 
                onClick={() => setSelectedPin('US')}
                className="absolute top-[30%] left-[25%] group cursor-pointer"
              >
                <span className={`absolute -inset-2.5 rounded-full ${selectedPin === 'US' ? 'bg-gold-500/40 animate-ping' : 'bg-transparent group-hover:bg-gold-500/10'} transition-all`} />
                <span className={`w-3.5 h-3.5 rounded-full ${selectedPin === 'US' ? 'bg-gold-400 shadow-[0_0_15px_rgba(212,163,23,0.8)]' : 'bg-neutral-600'} border border-black flex items-center justify-center text-[6px] text-black font-extrabold`}>
                  🇺🇸
                </span>
              </button>

              {/* Pin India */}
              <button 
                onClick={() => setSelectedPin('IN')}
                className="absolute top-[52%] left-[65%] group cursor-pointer"
              >
                <span className={`absolute -inset-2.5 rounded-full ${selectedPin === 'IN' ? 'bg-gold-500/40 animate-ping' : 'bg-transparent group-hover:bg-gold-500/10'} transition-all`} />
                <span className={`w-3.5 h-3.5 rounded-full ${selectedPin === 'IN' ? 'bg-gold-400 shadow-[0_0_15px_rgba(212,163,23,0.8)]' : 'bg-neutral-600'} border border-black flex items-center justify-center text-[6px] text-black font-extrabold`}>
                  🇮🇳
                </span>
              </button>

              {/* Pin Pakistan */}
              <button 
                onClick={() => setSelectedPin('PK')}
                className="absolute top-[48%] left-[60%] group cursor-pointer"
              >
                <span className={`absolute -inset-2.5 rounded-full ${selectedPin === 'PK' ? 'bg-gold-500/40 animate-ping' : 'bg-transparent group-hover:bg-gold-500/10'} transition-all`} />
                <span className={`w-3.5 h-3.5 rounded-full ${selectedPin === 'PK' ? 'bg-gold-400 shadow-[0_0_15px_rgba(212,163,23,0.8)]' : 'bg-neutral-600'} border border-black flex items-center justify-center text-[6px] text-black font-extrabold`}>
                  🇵🇰
                </span>
              </button>

            </div>

            {/* Right Column: Pin Details Metadata panel */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {selectedPin ? (
                <div className="glass-premium p-8 rounded-3xl border border-white/5 relative overflow-hidden gold-glow">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase">
                      ACTIVE REGION DATA
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-neutral-300">
                      SYS_SEC_TRUE
                    </span>
                  </div>

                  <h4 className="text-3xl font-display font-extrabold text-white mb-2">
                    {mapPins[selectedPin].name}
                  </h4>
                  <span className="text-xs font-mono text-neutral-400 block mb-6">
                    {mapPins[selectedPin].city}
                  </span>

                  <div className="space-y-4 font-mono text-xs text-neutral-400 border-t border-white/5 pt-6">
                    <div className="flex justify-between">
                      <span>PROJECT DENSITY</span>
                      <span className="text-white font-bold">{mapPins[selectedPin].clientRatio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CLIENT VOLUME</span>
                      <span className="text-gold-400 font-bold">{mapPins[selectedPin].stats}</span>
                    </div>
                    <div className="border-t border-white/5 pt-4 mt-2">
                      <span className="text-[9px] text-neutral-500 block mb-1">REGIONAL COMMISSION FAVOURITES</span>
                      <span className="text-white font-display text-sm font-semibold">{mapPins[selectedPin].preferredServices}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-premium p-8 rounded-3xl border border-white/5 flex items-center justify-center text-center text-xs font-mono text-neutral-500">
                  Select a coordinate pin on the radar grid to load regional intelligence.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INTERACTIVE TIMELINE */}
        <div className="border-t border-white/10 pt-16">
          <div className="mb-16 flex flex-col items-start text-left">
            <span className="text-xs font-mono tracking-[0.25em] text-gold-400 uppercase">
              Chronological Path
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-white uppercase mt-1">
              THE DEVELOPMENT TIMELINE
            </h2>
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-12 pl-8 md:pl-12 space-y-12">
            {timelineItems.map((item, index) => (
              <div key={item.year} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full border-2 border-gold-500 bg-black flex items-center justify-center text-[10px] font-mono text-white group-hover:bg-gold-500 group-hover:text-black transition-colors z-10 shadow-[0_0_10px_rgba(212,163,23,0.3)]">
                  {item.year.substr(2)}
                </div>

                <div className="glass-premium p-6 sm:p-8 rounded-2xl border border-white/5 group-hover:border-gold-500/20 transition-all duration-300">
                  <span className="text-sm font-mono text-gold-400 font-bold tracking-widest uppercase block mb-1">
                    YEAR {item.year}
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-wide uppercase mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed max-w-3xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
