import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Smartphone, Gamepad2, Video, Layers, Sparkles, LineChart, ArrowRight } from 'lucide-react';
import CinemaLoader from './components/CinemaLoader';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import AboutSection from './components/AboutSection';
import ServiceDetail from './components/ServiceDetail';
import PortfolioSection from './components/PortfolioSection';
import ReviewsSection from './components/ReviewsSection';
import ContactSection from './components/ContactSection';
import AdminSection from './components/AdminSection';
import AiArchitectSection from './components/AiArchitectSection';
import PageTransitionLoader from './components/PageTransitionLoader';
import Footer from './components/Footer';
import { Project, Review, Message, AdminSettings, AnalyticsData } from './types';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [pageTransitioning, setPageTransitioning] = useState(false);

  // Synced full-stack states
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({
    aboutText: '',
    experience: '3+ Years',
    clientsCount: '250+',
    countriesCount: '3+',
    contactPhone: '+91 8477824872',
    contactTelegram: 'https://t.me/Aynxxzzz',
    contactWhatsApp: 'https://wa.me/918477824872'
  });
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    viewsByCountry: {},
    viewsByService: {},
    recentVisits: []
  });

  // Redirect parameter from active subpage
  const [selectedInquiryService, setSelectedInquiryService] = useState<string | undefined>(undefined);

  // Fetch initial data from full-stack server
    useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchData = async () => {
      try {
        const [projRes, revRes, setRes, analRes] = await Promise.all([
          fetch('/api/projects', { signal }),
          fetch('/api/reviews', { signal }),
          fetch('/api/settings', { signal }),
          fetch('/api/analytics', { signal })
        ]);

        const [projData, revData, setData, analData] = await Promise.all([
          projRes.json(),
          revRes.json(),
          setRes.json(),
          analRes.json()
        ]);

        if (!signal.aborted) {
          setProjects(projData);
          setReviews(revData);
          setSettings(setData);
          setAnalytics(analData);
        }

        // Messages can only be requested if authenticated
        const token = sessionStorage.getItem('ayn_session');
        if (token) {
          const msgRes = await fetch('/api/messages', { 
            headers: { 'Authorization': `Bearer ${token}` },
            signal
          });
          const msgData = await msgRes.json();
          if (!signal.aborted) {
            if (Array.isArray(msgData)) {
              setMessages(msgData);
            } else {
              setMessages([]);
              if (msgRes.status === 401) {
                sessionStorage.removeItem('ayn_session');
              }
            }
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Could not fetch intelligence from Full-Stack backend.', error);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [currentPath]);

  // Handle SPA Routing triggers
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (path === currentPath) return;
    setPageTransitioning(true);
    setTimeout(() => {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 400);
    setTimeout(() => {
      setPageTransitioning(false);
    }, 1100);
  };

  // Submit contact lead form trigger
  const handleAddMessage = async (msg: Omit<Message, 'id' | 'date' | 'status'>) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [data.message, ...prev]);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Submit client review form trigger
  const handleAddReview = async (rev: Omit<Review, 'id' | 'approved' | 'featured' | 'date'>) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rev)
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => [...prev, data.review]);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Redirect to contact form preloaded with service name
  const handleNavigateInquiry = (serviceName: string) => {
    setSelectedInquiryService(serviceName);
    handleNavigate('/contact');
  };

  const servicesList = [
    { id: 'web-development', name: 'Website Development', path: '/services/web-development', icon: Code, desc: 'High-speed holographic structures and reactive layouts.' },
    { id: 'app-development', name: 'App Development', path: '/services/app-development', icon: Smartphone, desc: 'Tactile gesture-driven mobile ecosystems.' },
    { id: 'game-development', name: 'Game Development', path: '/services/game-development', icon: Gamepad2, desc: 'Immersive procedural WebGL worlds.' },
    { id: 'video-editing', name: 'Video Editing', path: '/services/video-editing', icon: Video, desc: 'Cinematic pacing and high-fidelity soundscapes.' },
    { id: 'motion-graphics', name: 'Motion Graphics', path: '/services/motion-graphics', icon: Layers, desc: 'Kinetic typography and morphing shapes.' },
    { id: 'thumbnail-design', name: 'Thumbnail Design', path: '/services/thumbnail-design', icon: Sparkles, desc: 'Volumetric layouts that dominate click rates.' },
    { id: 'business-solutions', name: 'Business Solutions', path: '/services/business-solutions', icon: LineChart, desc: 'High-octane visual analytics & automations.' }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-gold-500 selection:text-black">
      
      {/* 1. CINEMATIC INTRO SEQUENCING SCREEN */}
      <AnimatePresence>
        {loading && (
          <CinemaLoader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Page navigation micro transition loader */}
      <PageTransitionLoader isVisible={pageTransitioning} />

      {!loading && (
        <div className="flex flex-col min-h-screen">
          
          {/* Global Interactive Interactive Particles canvas */}
          <ParticleBackground />

          {/* Floating Premium Header Nav Bar */}
          <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

          {/* SPA Main Router Screens container */}
          <main className="flex-grow relative z-10 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Router matches */}

                {/* Home Path */}
                {currentPath === '/' && (
                  <HomeSection onNavigate={handleNavigate} settings={settings} />
                )}

                {/* About Path */}
                {currentPath === '/about' && (
                  <AboutSection settings={settings} />
                )}

                {/* Service Details Catch-alls */}
                {currentPath.startsWith('/services/') && (
                  <ServiceDetail 
                    serviceId={currentPath.split('/').pop() || ''} 
                    onBack={() => handleNavigate('/services')}
                    onNavigateContact={handleNavigateInquiry}
                  />
                )}

                {/* Main Services overview lists page */}
                {currentPath === '/services' && (
                  <div className="min-h-screen pb-24 pt-24 px-6 md:px-12 relative overflow-hidden select-none">
                    <div className="absolute inset-0 grid-overlay pointer-events-none opacity-25" />
                    <div className="max-w-6xl mx-auto">
                      
                      <div className="mb-16 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <span className="text-xs font-mono tracking-[0.3em] text-gold-400 uppercase mb-2 block">
                          Service Blueprint Catalog
                        </span>
                        <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white uppercase">
                          OUR <span className="metallic-gold-text">DISCIPLINES</span>
                        </h1>
                        <p className="text-sm font-sans text-neutral-400 mt-4 leading-relaxed max-w-xl">
                          Select an active blueprint channel below to initiate a premium live reactive simulation sandbox.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesList.map((svc) => {
                          const Icon = svc.icon;
                          return (
                            <div
                              key={svc.id}
                              onClick={() => handleNavigate(svc.path)}
                              className="glass-premium p-8 rounded-3xl cursor-pointer glass-premium-hover flex flex-col justify-between"
                            >
                              <div>
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-gold-400 mb-6">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-2">
                                  {svc.name}
                                </h3>
                                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                                  {svc.desc}
                                </p>
                              </div>
                              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase flex items-center gap-2 mt-8">
                                Active Simulation <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                )}

                {/* Portfolio Path */}
                {currentPath === '/portfolio' && (
                  <PortfolioSection projects={projects} onNavigateContact={handleNavigateInquiry} />
                )}

                {/* Public Reviews List & Submission */}
                {currentPath === '/reviews' && (
                  <ReviewsSection reviews={reviews} onSubmitReview={handleAddReview} />
                )}

                {/* Contact Lead Dispatch */}
                {currentPath === '/contact' && (
                  <ContactSection onSubmitMessage={handleAddMessage} preselectedService={selectedInquiryService} />
                )}

                {/* AI Architect Co-Pilot Sandbox */}
                {currentPath === '/ai-architect' && (
                  <AiArchitectSection onNavigateContact={handleNavigateInquiry} />
                )}

                {/* Administrative Dashboard */}
                {currentPath === '/admin' && (
                  <AdminSection 
                    projects={projects}
                    reviews={reviews}
                    messages={messages}
                    settings={settings}
                    analytics={analytics}
                    onUpdateProjects={setProjects}
                    onUpdateReviews={setReviews}
                    onUpdateMessages={setMessages}
                    onUpdateSettings={setSettings}
                    onUpdateAnalytics={setAnalytics}
                  />
                )}

              </motion.div>
            </AnimatePresence>
          </main>

          {/* Shared Premium Footer Layout */}
          {currentPath !== '/admin' && (
            <Footer onNavigate={handleNavigate} />
          )}

        </div>
      )}

    </div>
  );
}
