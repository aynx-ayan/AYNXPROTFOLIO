import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Eye, X, ArrowUpRight, Calendar, User, DollarSign, Tag, Play } from 'lucide-react';
import { Project } from '../types';

interface PortfolioSectionProps {
  projects: Project[];
  onNavigateContact: (serviceName: string) => void;
}

export default function PortfolioSection({ projects, onNavigateContact }: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = [
    'All',
    'Website Development',
    'App Development',
    'Game Development',
    'Video Editing',
    'Motion Graphics',
    'Thumbnail Design',
    'Business Solutions'
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black pb-24 pt-24 px-6 md:px-12 relative overflow-hidden select-none">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Title and Introduction */}
        <div className="mb-16 flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-xs font-mono tracking-[0.3em] text-gold-400 uppercase mb-2 block">
            Craftsmanship Showroom
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white uppercase">
            THE <span className="text-white">PORTFOLIO</span> <span className="metallic-gold-text">DISPATCH</span>
          </h1>
          <p className="text-sm font-sans text-neutral-400 mt-4 max-w-xl leading-relaxed">
            A handpicked compilation of digital systems, immersive environments, and cinematic edits dispatched for our global clientele.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-white/5 pb-8 overflow-x-auto select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-black font-bold shadow-[0_0_15px_rgba(212,163,23,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid with Smooth Transitions */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                key={project.id}
                onClick={() => setActiveProject(project)}
                className="glass-premium rounded-3xl cursor-pointer overflow-hidden relative group aspect-[4/3] flex flex-col justify-end"
              >
                {/* Image backdrop */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Luxury dynamic linear dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent transition-opacity duration-300 group-hover:via-black/60 pointer-events-none" />
                </div>

                {/* Information Overlay */}
                <div className="p-6 relative z-10 w-full flex flex-col gap-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[9px] font-mono tracking-widest text-gold-400 uppercase">
                    {project.category}
                  </span>
                  
                  <h3 className="text-lg font-display font-extrabold text-white uppercase tracking-wider line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="text-[10px] font-sans text-neutral-400 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {project.description}
                  </p>

                  <div className="flex gap-2 flex-wrap pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono text-neutral-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-500 flex items-center gap-1 mt-2">
                    Inspect Blueprint <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Cinematic Project Details Full-Screen Overlay Modal */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 select-none"
            >
              {/* Custom micro grids overlay */}
              <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

              <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className="w-full max-w-5xl bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden relative z-10 flex flex-col lg:flex-row max-h-[90vh]"
              >
                
                {/* Left Side: Dynamic Cinematic Frame */}
                <div className="lg:w-1/2 relative bg-black min-h-[250px] lg:min-h-[500px]">
                  <img 
                    src={activeProject.image} 
                    alt={activeProject.title} 
                    className="w-full h-full object-cover absolute inset-0 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Cinematic overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Highlight spark */}
                  <div className="absolute top-6 left-6 bg-gold-600 text-black text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(212,163,23,0.5)]">
                    {activeProject.category}
                  </div>
                </div>

                {/* Right Side: Detailed spec specs */}
                <div className="lg:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-between">
                  {/* Close button */}
                  <button 
                    onClick={() => setActiveProject(null)}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 hover:border-gold-500/30 flex items-center justify-center bg-black/80 text-white hover:text-gold-400 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase block mb-1">
                        PROJECT DOSSIER
                      </span>
                      <h2 className="text-3xl font-display font-extrabold text-white uppercase tracking-wider leading-tight">
                        {activeProject.title}
                      </h2>
                    </div>

                    <p className="text-sm font-sans text-neutral-400 leading-relaxed">
                      {activeProject.description}
                    </p>

                    {/* Meta Specifications */}
                    <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-6 font-mono text-[11px] text-neutral-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gold-400" />
                        <span>CLIENT: <strong className="text-white">{activeProject.client || 'Creative Commission'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-400" />
                        <span>DATE: <strong className="text-white">{activeProject.date || 'June 2026'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <DollarSign className="w-4 h-4 text-gold-400" />
                        <span>INVESTMENT METRIC: <strong className="text-gold-400">{activeProject.budget || 'Inquire Price'}</strong></span>
                      </div>
                    </div>

                    {/* Technology tags */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                        Technologies Dispatched
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-neutral-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        onNavigateContact(activeProject.title);
                        setActiveProject(null);
                      }}
                      className="flex-1 py-3 bg-gold-500 text-black text-xs font-display font-bold uppercase tracking-widest rounded-full text-center hover:bg-gold-400 transition-colors cursor-pointer"
                    >
                      Inquire Similar Build
                    </button>
                    {activeProject.link && activeProject.link !== '#' && (
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-display font-bold uppercase tracking-widest rounded-full text-center flex items-center justify-center gap-1"
                      >
                        Launch Portal <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
