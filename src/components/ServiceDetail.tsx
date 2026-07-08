import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Code, Cpu, Gamepad2, Video, Layers, Sparkles, LineChart, 
  ArrowLeft, Terminal, Smartphone, Flame, Play, Eye, Maximize2, Zap, Download
} from 'lucide-react';

interface ServiceDetailProps {
  serviceId: string;
  onBack: () => void;
  onNavigateContact: (serviceName: string) => void;
}

export default function ServiceDetail({ serviceId, onBack, onNavigateContact }: ServiceDetailProps) {
  // 1. Web Dev State
  const [activeTab, setActiveTab] = useState<'code' | 'render' | 'terminal'>('render');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  // 2. App Dev State
  const [activeScreen, setActiveScreen] = useState<'home' | 'wallet' | 'nfts'>('home');
  const [gestureStatus, setGestureStatus] = useState('Swipe left/right to change preview');

  // 3. Game Dev State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');

  // 4. Video Editing State
  const [gradingProgress, setGradingProgress] = useState(50); // 0-100 percentage slider

  // 5. Motion Graphics State
  const [kineticText, setKineticText] = useState('A.YNX_');
  const [morphShape, setMorphShape] = useState<'circle' | 'polygon' | 'wave'>('circle');

  // 6. Thumbnail Design State
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [lensActive, setLensActive] = useState(false);

  // 7. Business Solutions State
  const [businessMetric, setBusinessMetric] = useState<'revenue' | 'conversion' | 'growth'>('revenue');

  // Terminal log simulation
  useEffect(() => {
    if (serviceId === 'web-development' && activeTab === 'terminal') {
      setTerminalLogs([
        "[SYSTEM] Initiating premium compilation of client core...",
        "[COMPILER] Loading Tailwind V4 @import engine...",
        "[VITE] Serving assets from standard port 3000.",
        "[DB] Firestore & cache engine synchronized.",
        "[RENDER] Layout score: 100/100 (Awwwards Golden Preset).",
        "[SUCCESS] Application live."
      ]);
      const int = setInterval(() => {
        setTerminalLogs(prev => [
          ...prev,
          `[LOG] System health OK. Session traffic active at ${new Date().toLocaleTimeString()}`
        ].slice(-8));
      }, 3000);
      return () => clearInterval(int);
    }
  }, [serviceId, activeTab]);

  // Mini Cyberpunk game implementation for Game Dev service
  useEffect(() => {
    if (serviceId === 'game-development' && gameState === 'playing') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 400;
      canvas.height = 300;

      let animationId: number;
      let playerX = 200;
      let stars: Array<{ x: number; y: number; speed: number }> = [];
      let obstacles: Array<{ x: number; y: number; size: number; speed: number }> = [];
      let localScore = 0;

      for (let i = 0; i < 20; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 2 + 1
        });
      }

      const spawnObstacle = () => {
        obstacles.push({
          x: Math.random() * canvas.width,
          y: -20,
          size: Math.random() * 15 + 10,
          speed: Math.random() * 3 + 2
        });
      };

      let ticks = 0;

      const loop = () => {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Stars
        ctx.fillStyle = 'rgba(212, 163, 23, 0.4)';
        stars.forEach(s => {
          ctx.fillRect(s.x, s.y, 2, 2);
          s.y += s.speed;
          if (s.y > canvas.height) {
            s.y = 0;
            s.x = Math.random() * canvas.width;
          }
        });

        // Draw Player Ship (Golden Triangle)
        ctx.fillStyle = '#d4a317';
        ctx.beginPath();
        ctx.moveTo(playerX, canvas.height - 40);
        ctx.lineTo(playerX - 15, canvas.height - 15);
        ctx.lineTo(playerX + 15, canvas.height - 15);
        ctx.closePath();
        ctx.fill();

        // Engine glow
        ctx.fillStyle = Math.random() > 0.5 ? '#dc2626' : '#ef4444';
        ctx.fillRect(playerX - 5, canvas.height - 15, 10, 8);

        // Obstacles (Crimson Meteors)
        ticks++;
        if (ticks % 35 === 0) spawnObstacle();

        ctx.fillStyle = '#dc2626';
        obstacles.forEach((o, index) => {
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Flame tail
          ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
          ctx.beginPath();
          ctx.moveTo(o.x - o.size, o.y);
          ctx.lineTo(o.x, o.y - o.size * 2);
          ctx.lineTo(o.x + o.size, o.y);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#dc2626';

          o.y += o.speed;

          // Collision Check
          const dist = Math.sqrt((o.x - playerX) ** 2 + (o.y - (canvas.height - 25)) ** 2);
          if (dist < o.size + 15) {
            setGameState('gameover');
            cancelAnimationFrame(animationId);
            return;
          }

          if (o.y > canvas.height + 20) {
            obstacles.splice(index, 1);
            localScore += 10;
            setGameScore(localScore);
          }
        });

        // Keyboard Controls
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowLeft' && playerX > 20) playerX -= 15;
          if (e.key === 'ArrowRight' && playerX < canvas.width - 20) playerX += 15;
        };
        window.addEventListener('keydown', handleKeyDown);

        animationId = requestAnimationFrame(loop);
      };

      loop();

      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [serviceId, gameState]);

  // Details for each service
  const serviceDetailsMap: Record<string, {
    title: string;
    icon: any;
    tagline: string;
    longDescription: string;
    capabilities: string[];
    accentColor: string;
  }> = {
    'web-development': {
      title: 'Website Development',
      icon: Code,
      tagline: 'High-speed holographic structures and reactive layouts',
      longDescription: 'We assemble ultra-high performance digital hubs representing premium brands. Prioritizing pixel precision, responsive mechanics, search engine dominance, and fluid load transitions.',
      capabilities: ['TypeScript & Next.js Core', 'Responsive Layout Engineering', 'Vite & esbuild Optimization', 'Awwwards-Level Motion Pipelines'],
      accentColor: 'from-amber-500 to-gold-600'
    },
    'app-development': {
      title: 'App Development',
      icon: Smartphone,
      tagline: 'Tactile gesture-driven mobile ecosystems',
      longDescription: 'Developing high-fidelity iOS and Android native architectures. Merging crisp typography with fluid touch animations, reliable databases, and intuitive screen gestures.',
      capabilities: ['React Native & Flutter', 'Haptic Response Integrations', 'Durable Offline Caching', 'Interactive Smooth Overlays'],
      accentColor: 'from-amber-500 to-gold-600'
    },
    'game-development': {
      title: 'Game Development',
      icon: Gamepad2,
      tagline: 'Immersive procedural WebGL worlds',
      longDescription: 'Engineering rich, real-time interactive entertainment experiences for web browsers and native platforms. Crafting physical simulations, custom ambient audio engines, and particle emitters.',
      capabilities: ['Three.js & Canvas Mechanics', 'Procedural Level Generation', 'Audio Wave Synthesizers', 'Low-Latency Command Pipelines'],
      accentColor: 'from-red-600 to-amber-600'
    },
    'video-editing': {
      title: 'Video Editing',
      icon: Video,
      tagline: 'Cinematic pacing and high-fidelity soundscapes',
      longDescription: 'Converting raw cinematic footage into cohesive, high-impact stories. Mastering complex timing structures, additive color grading, sub-bass design, and emotional soundscapes.',
      capabilities: ['4K Multi-cam Post-production', 'Pro-Grade Color Grading (Log/HDR)', 'Soundscape Sound Design', 'Dynamic Rhythm Cuts'],
      accentColor: 'from-amber-500 to-gold-500'
    },
    'motion-graphics': {
      title: 'Motion Graphics',
      icon: Layers,
      tagline: 'Kinetic typography and morphing shapes',
      longDescription: 'Animating brand assets into high-octane visual experiences. We design physics-based graphic layers, fluid morphing transitions, and title openers.',
      capabilities: ['Adobe After Effects Pipeline', 'Procedural Layout Morphing', 'Kinetic Title Typography', 'Vector Graphic Choreography'],
      accentColor: 'from-gold-600 to-gold-400'
    },
    'thumbnail-design': {
      title: 'Thumbnail Design',
      icon: Sparkles,
      tagline: 'Volumetric layouts that dominate click rates',
      longDescription: 'Strategizing YouTube cover assets to maximize click rates. Using layered lighting, custom brushwork, 3D text extrusions, and emotional color theory.',
      capabilities: ['Click-Rate Audience Psychology', 'Gold-Inlaid Volumetric Glows', 'Handcrafted Custom Lettering', 'High-Contrast Depth Layering'],
      accentColor: 'from-gold-500 to-red-600'
    },
    'business-solutions': {
      title: 'Business Solutions',
      icon: LineChart,
      tagline: 'High-octane visual analytics & automations',
      longDescription: 'Assembling executive automation suites, real-time CRM dashboards, and automated lead responders to level up operations for scaling brands.',
      capabilities: ['Real-Time CRM & Dashboards', 'CSV Lead Export Integration', 'Automated Notification Pipelines', 'Corporate Activity Trackers'],
      accentColor: 'from-gold-600 to-amber-700'
    }
  };

  const selected = serviceDetailsMap[serviceId];

  if (!selected) {
    return (
      <div className="text-center py-20">
        <span className="text-red-500">Service not found.</span>
        <button onClick={onBack} className="block mx-auto mt-4 text-white hover:underline">Back to Services</button>
      </div>
    );
  }

  const IconComponent = selected.icon;

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-24 px-4 sm:px-8">
      {/* Dynamic Background Grid Overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Link */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 hover:text-gold-400 transition-colors uppercase mb-12 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all services
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center bg-gold-500/5 text-gold-400">
                <IconComponent className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-xs font-mono tracking-[0.3em] text-gold-400 uppercase">
                Premium Identity
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white mb-6">
              {selected.title}
            </h1>
            
            <p className="text-lg font-display text-neutral-300 font-light leading-relaxed mb-8">
              {selected.tagline}
            </p>

            <p className="text-sm font-sans text-neutral-400 leading-relaxed mb-10 max-w-xl">
              {selected.longDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigateContact(selected.title)}
                className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black text-xs font-display font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(212,163,23,0.3)] hover:shadow-[0_0_35px_rgba(212,163,23,0.5)] transition-all cursor-pointer"
              >
                Inquire About {selected.title}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-premium p-8 rounded-2xl border border-white/5 relative overflow-hidden gold-glow">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 block mb-4">
                Core Capabilities
              </span>
              <ul className="space-y-4">
                {selected.capabilities.map((cap, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-mono text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                    {cap}
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-neutral-500">
                <span>ESTIMATED DELIVERY</span>
                <span className="text-white font-semibold">5-10 BUSINESS DAYS</span>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE EXPERIENCE PLAYGROUND */}
        <div className="border-t border-white/10 pt-16 mb-12">
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-[10px] font-mono tracking-[0.3em] text-gold-400 uppercase">
              Interactive Blueprint Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Simulated {selected.title} Sandbox
            </h2>
            <p className="text-xs font-mono text-neutral-500">
              Hover, drag, or toggle inputs below to witness real-time technical craft.
            </p>
          </div>

          <div className="glass-premium rounded-3xl border border-white/5 overflow-hidden min-h-[400px] flex flex-col justify-between">
            
            {/* Playgrounds per Service ID */}
            {serviceId === 'web-development' && (
              <div className="flex flex-col h-full">
                {/* Simulated Holographic Browser Container */}
                <div className="bg-neutral-950 p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-xs font-mono text-neutral-500 ml-4">https://hologram.ayn.studio</span>
                  </div>
                  <div className="flex gap-2">
                    {(['render', 'code', 'terminal'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider ${
                          activeTab === tab ? 'bg-gold-500 text-black font-semibold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-[#0a0a0a] min-h-[300px] flex items-center justify-center font-mono text-xs">
                  {activeTab === 'render' && (
                    <div className="w-full max-w-md p-6 bg-black/60 border border-gold-500/20 rounded-xl flex flex-col gap-4 text-center select-none shadow-[0_0_40px_rgba(212,163,23,0.1)]">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 mx-auto flex items-center justify-center text-black font-extrabold text-sm animate-bounce">
                        G
                      </div>
                      <h4 className="text-white font-display font-semibold text-lg uppercase tracking-wider">Aura Glow Couture</h4>
                      <p className="text-neutral-400 font-sans text-xs">Interactive layout responding to standard cursor friction and frame boundaries.</p>
                      <button className="px-4 py-2 bg-white/5 hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-[10px] tracking-widest text-gold-400 uppercase rounded transition-all">
                        Animate Frame
                      </button>
                    </div>
                  )}

                  {activeTab === 'code' && (
                    <pre className="text-emerald-400/90 leading-relaxed overflow-x-auto w-full max-w-lg select-all">
{`// Tailwind V4 Fluid Luxury Component
export function AuraCouture() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {models.map(m => (
        <motion.div 
          whileHover={{ scale: 1.05, rotateY: 10 }}
          className="glass-premium text-gold-500 border-gold-500/20"
        >
          <img src={m.url} className="blur-xl hover:blur-0" />
        </motion.div>
      ))}
    </div>
  );
}`}
                    </pre>
                  )}

                  {activeTab === 'terminal' && (
                    <div className="w-full max-w-lg bg-black p-4 rounded border border-white/5 font-mono text-[11px] text-green-500 space-y-1">
                      {terminalLogs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                      <div className="animate-pulse w-2 h-4 bg-green-500 inline-block" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {serviceId === 'app-development' && (
              <div className="p-8 flex flex-col md:flex-row items-center justify-around gap-8">
                {/* Interactive Smartphone Mockup */}
                <div className="w-64 h-[420px] bg-neutral-950 rounded-[40px] border-4 border-neutral-800 p-3 shadow-2xl relative flex flex-col justify-between overflow-hidden">
                  {/* Speaker and Camera notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-neutral-800 rounded-b-2xl z-20 flex justify-center items-center">
                    <span className="w-12 h-1 bg-black rounded-full" />
                  </div>

                  {/* App Screen Content */}
                  <div className="flex-1 bg-[#090909] rounded-[30px] pt-6 pb-2 px-3 flex flex-col justify-between overflow-hidden text-white font-sans text-xs relative z-10">
                    <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 mt-2">
                      <span>9:41 AM</span>
                      <span>LTE 🔋</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-4">
                      {activeScreen === 'home' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500 flex items-center justify-center text-gold-400 mx-auto">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h5 className="font-semibold text-white uppercase text-[10px] tracking-wider">Aura Core Live</h5>
                          <p className="text-[10px] text-neutral-400">Gesture engine successfully initialized.</p>
                          <button 
                            onClick={() => { setActiveScreen('wallet'); setGestureStatus('Swiped to Wallet View'); }}
                            className="px-3 py-1 bg-white/5 hover:bg-gold-500/20 border border-white/10 text-[9px] uppercase rounded"
                          >
                            Explore Wallet
                          </button>
                        </motion.div>
                      )}

                      {activeScreen === 'wallet' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                          <span className="text-[9px] font-mono text-neutral-500 block">TOTAL BALANCE</span>
                          <span className="text-lg font-bold text-white tracking-tight">$42,912.80</span>
                          <div className="p-2 bg-white/5 rounded border border-white/10 flex justify-between items-center text-[10px]">
                            <span>BTC Wallet</span>
                            <span className="text-gold-400 font-mono">+4.2%</span>
                          </div>
                          <button 
                            onClick={() => { setActiveScreen('nfts'); setGestureStatus('Swiped to NFT Collection'); }}
                            className="w-full py-1 bg-gold-500 text-black text-[9px] font-bold uppercase rounded"
                          >
                            View Digital Art
                          </button>
                        </motion.div>
                      )}

                      {activeScreen === 'nfts' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 text-center">
                          <span className="text-[9px] font-mono text-neutral-500 block">COLLECTIBLE ID #9021</span>
                          <div className="w-24 h-24 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 mx-auto relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center font-bold text-[10px]">
                              GOLD CHIME
                            </div>
                          </div>
                          <button 
                            onClick={() => { setActiveScreen('home'); setGestureStatus('Swiped back to Home Screen'); }}
                            className="px-3 py-1 bg-white/5 hover:bg-gold-500/20 border border-white/10 text-[9px] uppercase rounded mx-auto block"
                          >
                            Go Home
                          </button>
                        </motion.div>
                      )}
                    </div>

                    {/* Bottom Navigation Pills */}
                    <div className="flex justify-around items-center border-t border-white/5 pt-2">
                      <button onClick={() => setActiveScreen('home')} className={`w-2 h-2 rounded-full ${activeScreen === 'home' ? 'bg-gold-500' : 'bg-neutral-700'}`} />
                      <button onClick={() => setActiveScreen('wallet')} className={`w-2 h-2 rounded-full ${activeScreen === 'wallet' ? 'bg-gold-500' : 'bg-neutral-700'}`} />
                      <button onClick={() => setActiveScreen('nfts')} className={`w-2 h-2 rounded-full ${activeScreen === 'nfts' ? 'bg-gold-500' : 'bg-neutral-700'}`} />
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 max-w-sm">
                  <h4 className="text-white font-display font-semibold text-lg uppercase tracking-wider">Tactile Haptics Demonstration</h4>
                  <p className="text-neutral-400 text-xs leading-relaxed font-sans">
                    Click the navigation dots or the action buttons inside the phone frame to swipe through the screens of Ayan Nayak's custom app designs.
                  </p>
                  <div className="p-3 bg-black border border-white/10 rounded font-mono text-[10px] text-gold-400">
                    STATUS: <span className="text-white">{gestureStatus}</span>
                  </div>
                </div>
              </div>
            )}

            {serviceId === 'game-development' && (
              <div className="p-6 flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                  <span>SCORE: <strong className="text-gold-400">{gameScore}</strong></span>
                  <span>STATE: <strong className="text-white">{gameState.toUpperCase()}</strong></span>
                </div>

                <div className="relative border border-white/10 rounded-xl overflow-hidden bg-black flex items-center justify-center min-w-[300px] min-h-[220px]">
                  {gameState === 'start' && (
                    <div className="text-center p-6 space-y-4">
                      <Gamepad2 className="w-10 h-10 text-gold-500 mx-auto animate-pulse" />
                      <h5 className="font-display font-bold text-white text-lg uppercase tracking-wider">Cyber Cosmic Runner</h5>
                      <p className="text-neutral-500 text-[10px] font-mono max-w-xs">Avoid falling crimson meteors using left/right arrow controls or clicks.</p>
                      <button 
                        onClick={() => { setGameState('playing'); setGameScore(0); }}
                        className="px-6 py-2 bg-gold-500 text-black text-xs font-bold uppercase rounded-full"
                      >
                        Launch Simulation
                      </button>
                    </div>
                  )}

                  {gameState === 'playing' && (
                    <canvas ref={canvasRef} className="block w-full max-w-[400px]" />
                  )}

                  {gameState === 'gameover' && (
                    <div className="text-center p-6 space-y-4">
                      <Flame className="w-10 h-10 text-red-600 mx-auto" />
                      <h5 className="font-display font-bold text-red-500 text-lg uppercase tracking-wider">COLLISION DETECTED</h5>
                      <p className="text-neutral-400 text-xs font-mono">Shield breached. Final Score: {gameScore}</p>
                      <button 
                        onClick={() => { setGameState('playing'); setGameScore(0); }}
                        className="px-6 py-2 bg-white text-black text-xs font-bold uppercase rounded-full"
                      >
                        Re-engage Core
                      </button>
                    </div>
                  )}
                </div>

                {gameState === 'playing' && (
                  <div className="flex gap-4">
                    <button 
                      onMouseDown={() => {
                        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
                        window.dispatchEvent(event);
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-white hover:bg-gold-500 hover:text-black rounded text-xs font-bold font-mono"
                    >
                      ◀ MOVE LEFT
                    </button>
                    <button 
                      onMouseDown={() => {
                        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
                        window.dispatchEvent(event);
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-white hover:bg-gold-500 hover:text-black rounded text-xs font-bold font-mono"
                    >
                      MOVE RIGHT ▶
                    </button>
                  </div>
                )}
              </div>
            )}

            {serviceId === 'video-editing' && (
              <div className="p-8 flex flex-col items-center gap-6">
                <div className="relative w-full max-w-2xl h-[280px] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  {/* Before Video Simulation (Unfocused Washy look) */}
                  <div 
                    className="absolute inset-0 grayscale contrast-75 brightness-110 pointer-events-none"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />

                  {/* After Video Simulation (Cinematic rich gold grading overlay) */}
                  <div 
                    className="absolute inset-0 border-r-2 border-gold-400 overflow-hidden pointer-events-none"
                    style={{ 
                      width: `${gradingProgress}%`,
                      backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop')", 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center',
                      filter: 'contrast(125%) brightness(90%) sepia(20%) saturate(140%) hue-rotate(-5deg)'
                    }}
                  >
                    {/* Glowing golden text showing insidegraded region */}
                    <div className="absolute top-4 left-4 bg-gold-600/90 text-black text-[9px] font-bold font-mono py-1 px-2 rounded tracking-widest uppercase">
                      AFTER (GOLD GRADE)
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/80 text-white text-[9px] font-bold font-mono py-1 px-2 rounded tracking-widest uppercase pointer-events-none">
                    BEFORE (LOG FOOTAGE)
                  </div>

                  {/* Interactive Slider Guide */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 text-[10px] font-mono text-neutral-300 pointer-events-none">
                    Drag the slider below to witness professional color correction depth.
                  </div>
                </div>

                <div className="w-full max-w-md space-y-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={gradingProgress}
                    onChange={(e) => setGradingProgress(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                    <span>BEFORE (0%)</span>
                    <span className="text-gold-400">BALANCE: {gradingProgress}%</span>
                    <span>AFTER (100%)</span>
                  </div>
                </div>
              </div>
            )}

            {serviceId === 'motion-graphics' && (
              <div className="p-8 flex flex-col md:flex-row items-center justify-around gap-12">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Kinetic Input Modifier</label>
                  <input 
                    type="text" 
                    maxLength={10} 
                    value={kineticText}
                    onChange={(e) => setKineticText(e.target.value.toUpperCase())}
                    className="px-4 py-2 bg-neutral-900 border border-white/10 text-white font-display uppercase tracking-widest text-sm rounded outline-none focus:border-gold-500/50"
                  />

                  <div className="flex gap-2">
                    {(['circle', 'polygon', 'wave'] as const).map(shape => (
                      <button
                        key={shape}
                        onClick={() => setMorphShape(shape)}
                        className={`px-3 py-1 border text-[10px] font-mono uppercase rounded ${
                          morphShape === shape ? 'bg-gold-500 text-black border-gold-500' : 'text-neutral-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Morphing Kinetic Canvas Block */}
                <div className="w-52 h-52 relative border border-white/5 bg-[#080808] rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* Morphing Shape in background */}
                  <motion.div 
                    animate={
                      morphShape === 'circle' 
                        ? { borderRadius: '50%', rotate: 360, scale: 1 }
                        : morphShape === 'polygon'
                        ? { borderRadius: '0%', rotate: 180, scale: 0.9 }
                        : { borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', rotate: -360, scale: 1.1 }
                    }
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute w-36 h-36 border border-gold-500/10 bg-gold-600/5 flex items-center justify-center"
                  />

                  {/* Kinetic text floating */}
                  <motion.span 
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="font-display font-black text-2xl tracking-[0.2em] text-white z-10 metallic-gold-text select-none"
                  >
                    {kineticText || 'A.YNX_'}
                  </motion.span>
                </div>
              </div>
            )}

            {serviceId === 'thumbnail-design' && (
              <div className="p-8 flex flex-col items-center gap-6">
                {/* Simulated Hover Grid with Custom Zoom-Lens Overlay */}
                <div 
                  className="relative w-full max-w-md h-[240px] rounded-xl overflow-hidden border border-white/10 shadow-xl cursor-crosshair"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setLensPos({
                      x: ((e.clientX - rect.left) / rect.width) * 100,
                      y: ((e.clientY - rect.top) / rect.height) * 100,
                    });
                  }}
                  onMouseEnter={() => setLensActive(true)}
                  onMouseLeave={() => setLensActive(false)}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop" 
                    alt="Cover Thumbnail" 
                    className="w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Zoom Lens overlay */}
                  {lensActive && (
                    <div 
                      className="absolute w-28 h-28 rounded-full border-2 border-gold-400 bg-no-repeat shadow-2xl pointer-events-none"
                      style={{
                        left: `calc(${lensPos.x}% - 56px)`,
                        top: `calc(${lensPos.y}% - 56px)`,
                        backgroundImage: `url('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop')`,
                        backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                        backgroundSize: '400%', // Magnified scale
                      }}
                    />
                  )}
                </div>

                <div className="text-center font-sans text-xs text-neutral-400 max-w-sm">
                  Hover your cursor over the cover layout to activate the <span className="text-gold-400 font-bold">Volumetric Zoom-Lens</span>. Inspect layered gold highlights, lighting, and drop shadows in ultra-detail.
                </div>
              </div>
            )}

            {serviceId === 'business-solutions' && (
              <div className="p-8 flex flex-col md:flex-row items-center justify-around gap-8">
                <div className="flex flex-col gap-4">
                  {(['revenue', 'conversion', 'growth'] as const).map(metric => (
                    <button
                      key={metric}
                      onClick={() => setBusinessMetric(metric)}
                      className={`px-4 py-2 border text-[11px] font-mono uppercase rounded text-left ${
                        businessMetric === metric ? 'bg-gold-500 text-black border-gold-500 font-bold' : 'text-neutral-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {metric === 'revenue' && '💰 Revenue Scale (+$42k/mo)'}
                      {metric === 'conversion' && '⚡ Conversion Boost (+14%)'}
                      {metric === 'growth' && '📈 Worldwide Retention (+85%)'}
                    </button>
                  ))}
                </div>

                {/* Animated SVGs Chart representation */}
                <div className="w-64 h-44 border border-white/5 bg-[#090909] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                    <span>Simulated Performance Log</span>
                    <span className="text-green-500 animate-pulse">● Live</span>
                  </div>

                  <svg viewBox="0 0 100 40" className="w-full h-24 overflow-visible">
                    {businessMetric === 'revenue' && (
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8 }}
                        d="M0 35 L20 30 L40 22 L60 15 L80 18 L100 5" 
                        fill="none" 
                        stroke="#d4a317" 
                        strokeWidth="2.5"
                      />
                    )}

                    {businessMetric === 'conversion' && (
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8 }}
                        d="M0 38 L20 35 L40 10 L60 12 L80 5 L100 2" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="2.5"
                      />
                    )}

                    {businessMetric === 'growth' && (
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8 }}
                        d="M0 35 L20 32 L40 30 L60 25 L80 15 L100 8" 
                        fill="none" 
                        stroke="#ffffff" 
                        strokeWidth="2.5"
                      />
                    )}
                  </svg>

                  <div className="flex justify-between text-[8px] font-mono text-neutral-600">
                    <span>Q1</span>
                    <span>Q2</span>
                    <span>Q3</span>
                    <span>Q4</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Panel Branding */}
            <div className="bg-neutral-950 p-3 text-center border-t border-white/5 text-[9px] font-mono text-neutral-600 tracking-widest uppercase">
              A.YNX_ IMMERSIVE DESIGN LAB • ALL RIGHTS RESERVED
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
