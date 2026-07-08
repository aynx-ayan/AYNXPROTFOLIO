import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles, Code, Smartphone, Gamepad2, Video, Layers, LineChart, ShieldAlert } from 'lucide-react';
import { Project } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function SearchModal({ isOpen, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch projects list for searching
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => {
          setProjects(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load search index', err);
          setLoading(false);
        });

      // Auto focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const services = [
    { name: 'Website Development', path: '/services/web-development', icon: Code, desc: 'High-speed holographic structures and reactive layouts.' },
    { name: 'App Development', path: '/services/app-development', icon: Smartphone, desc: 'Tactile gesture-driven mobile ecosystems.' },
    { name: 'Game Development', path: '/services/game-development', icon: Gamepad2, desc: 'Immersive procedural WebGL worlds.' },
    { name: 'Video Editing', path: '/services/video-editing', icon: Video, desc: 'Cinematic pacing and high-fidelity soundscapes.' },
    { name: 'Motion Graphics', path: '/services/motion-graphics', icon: Layers, desc: 'Kinetic typography and morphing shapes.' },
    { name: 'Thumbnail Design', path: '/services/thumbnail-design', icon: Sparkles, desc: 'Volumetric layouts that dominate click rates.' },
    { name: 'Business Solutions', path: '/services/business-solutions', icon: LineChart, desc: 'High-octane visual analytics & automations.' }
  ];

  const quickLinks = [
    { name: 'AI Architect Co-Pilot', path: '/ai-architect', badge: 'AI Powered' },
    { name: 'Submit a Review', path: '/reviews', badge: 'Feedback' },
    { name: 'Secure Client Inquiry', path: '/contact', badge: 'Contact' },
    { name: 'Browse Portfolio', path: '/portfolio', badge: 'Works' }
  ];

  // Filter logic
  const filteredServices = query.trim() === '' 
    ? [] 
    : services.filter(svc => 
        svc.name.toLowerCase().includes(query.toLowerCase()) || 
        svc.desc.toLowerCase().includes(query.toLowerCase())
      );

  const filteredProjects = query.trim() === ''
    ? []
    : projects.filter(proj =>
        proj.title.toLowerCase().includes(query.toLowerCase()) ||
        proj.description.toLowerCase().includes(query.toLowerCase()) ||
        proj.category.toLowerCase().includes(query.toLowerCase()) ||
        proj.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

  const handleItemClick = (path: string) => {
    onNavigate(path);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center pt-24 px-4 overflow-y-auto">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            id="search-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden z-10"
            id="search-modal"
          >
            {/* Top gold line gradient */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

            {/* Input Header */}
            <div className="relative flex items-center mb-6">
              <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search services, portfolio, features or AI sandbox..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all font-mono"
                id="search-input"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  id="clear-search-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="absolute right-4 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer text-xs font-mono uppercase tracking-widest border border-white/10 px-2 py-1 rounded bg-white/5"
                  id="close-search-btn"
                >
                  ESC
                </button>
              )}
            </div>

            {/* Content Results panel */}
            <div className="max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {query.trim() === '' ? (
                /* SUGGESTIONS VIEW */
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">
                      Core Disciplines
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {services.slice(0, 4).map((svc) => {
                        const Icon = svc.icon;
                        return (
                          <div
                            key={svc.name}
                            onClick={() => handleItemClick(svc.path)}
                            className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:border-gold-500/20 hover:bg-gold-500/5 cursor-pointer transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center bg-white/5 text-gold-400 group-hover:border-gold-500/40">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-bold text-white group-hover:text-gold-400 transition-colors uppercase tracking-wide">
                                {svc.name}
                              </div>
                              <div className="text-[9px] text-neutral-500 truncate max-w-[200px]">
                                {svc.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">
                      Quick Channels
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {quickLinks.map((link) => (
                        <button
                          key={link.path}
                          onClick={() => handleItemClick(link.path)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs font-mono text-neutral-300 cursor-pointer text-left"
                        >
                          <span>{link.name}</span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20 font-bold uppercase tracking-wider">
                            {link.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* SEARCH RESULTS VIEW */
                <div className="space-y-6">
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-neutral-500">
                      <div className="w-6 h-6 border-2 border-t-gold-500 border-white/10 rounded-full animate-spin" />
                      <span className="text-xs font-mono uppercase tracking-wider">Syncing database index...</span>
                    </div>
                  )}

                  {!loading && filteredServices.length === 0 && filteredProjects.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl bg-white/5">
                      <div className="flex justify-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 border border-white/10">
                          <Search className="w-5 h-5" />
                        </div>
                      </div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                        No matches found
                      </h4>
                      <p className="text-[10px] text-neutral-500 mt-1 max-w-xs mx-auto">
                        Could not find any services or projects matching "{query}". Try checking your spelling or search for "Web", "App", "3D", or "Video".
                      </p>
                    </div>
                  )}

                  {/* Matched Services Section */}
                  {filteredServices.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 mb-3">
                        Matching Disciplines ({filteredServices.length})
                      </h4>
                      <div className="space-y-2">
                        {filteredServices.map((svc) => {
                          const Icon = svc.icon;
                          return (
                            <div
                              key={svc.name}
                              onClick={() => handleItemClick(svc.path)}
                              className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:border-gold-500/20 hover:bg-gold-500/5 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center bg-white/5 text-gold-400 group-hover:border-gold-500/40">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-bold text-white group-hover:text-gold-400 transition-colors uppercase tracking-wide">
                                    {svc.name}
                                  </div>
                                  <div className="text-[10px] text-neutral-400">
                                    {svc.desc}
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-gold-500 transform group-hover:translate-x-1 transition-all" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Matched Projects Section */}
                  {filteredProjects.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 mb-3">
                        Matching Portfolio Masterpieces ({filteredProjects.length})
                      </h4>
                      <div className="space-y-2">
                        {filteredProjects.map((proj) => (
                          <div
                            key={proj.id}
                            onClick={() => handleItemClick('/portfolio')}
                            className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:border-gold-500/20 hover:bg-gold-500/5 cursor-pointer transition-all group"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img
                                src={proj.image}
                                alt={proj.title}
                                className="w-10 h-10 object-cover rounded-lg border border-white/10"
                                referrerPolicy="no-referrer"
                              />
                              <div className="text-left overflow-hidden">
                                <div className="text-xs font-bold text-white group-hover:text-gold-400 transition-colors uppercase tracking-wide truncate">
                                  {proj.title}
                                </div>
                                <div className="text-[10px] text-neutral-400 truncate max-w-[320px]">
                                  {proj.description}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <span className="text-[7px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                                    {proj.category}
                                  </span>
                                  {proj.tags.slice(0, 2).map(t => (
                                    <span key={t} className="text-[7px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-gold-500 transform group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer status bar */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                <span>INDEXED BLUEPRINTS</span>
              </div>
              <div>
                PRESS <kbd className="bg-white/5 border border-white/10 px-1 rounded text-neutral-400">ESC</kbd> TO EXIT
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
