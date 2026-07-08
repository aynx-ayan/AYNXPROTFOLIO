import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Cpu, Layers, Workflow, Clock, Coins, 
  MessageSquare, RefreshCw, AlertCircle, ArrowRight, CheckCircle2 
} from 'lucide-react';

interface AiArchitectSectionProps {
  onNavigateContact: (serviceName: string) => void;
}

interface BlueprintResult {
  recommendedDisciplines: string[];
  suggestedArchitecture: string;
  keyFeatures: { title: string; description: string }[];
  budgetEstimate: string;
  timelineEstimate: string;
  actionPlanSteps: string[];
  aiArchitectNotes: string;
}

export default function AiArchitectSection({ onNavigateContact }: AiArchitectSectionProps) {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('Web & Browser');
  const [approxBudgetRange, setApproxBudgetRange] = useState('Competitive');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<BlueprintResult | null>(null);

  const platforms = [
    'Web & Browser',
    'Mobile Application',
    '3D WebGL / Retro Game',
    'Full Hybrid Experience'
  ];

  const getTierPrice = (tierName: string, selectedCurrency: 'INR' | 'USD') => {
    if (selectedCurrency === 'INR') {
      if (tierName === 'Starter') return '₹8,999 INR';
      if (tierName === 'Competitive') return '₹18,999 INR';
      return '₹29,999 INR';
    } else {
      if (tierName === 'Starter') return '$150 USD';
      if (tierName === 'Competitive') return '$450 USD';
      return '$799 USD';
    }
  };

  const budgetLevels = [
    { name: 'Starter', desc: 'MVP-focused build' },
    { name: 'Competitive', desc: 'Premium custom design' },
    { name: 'Enterprise', desc: 'Immersive luxury solution' }
  ];

  const loadingStatuses = [
    'Establishing Secure Core Engine Connection...',
    'Synthesizing Technical Stack Blueprints...',
    'Analyzing Creative Architecture Vectors...',
    'Estimating Costing and Milestone Timelines...',
    'Finalizing Custom Personal Consultant Report...'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectDescription.trim()) return;

    setLoading(true);
    setError(null);
    setBlueprint(null);
    setLoadingStep(0);

    // Simulate loading steps for premium user experience
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingStatuses.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1200);

    try {
      const response = await fetch('/api/ai/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          projectDescription,
          targetPlatform,
          approxBudgetRange,
          selectedCurrency: currency,
          explicitPrice: getTierPrice(approxBudgetRange, currency)
        })
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.success && data.blueprint) {
        setBlueprint(data.blueprint);
      } else {
        setError(data.error || 'Failed to synthesize blueprint channel.');
      }
    } catch (err: any) {
      clearInterval(interval);
      setError('A system error occurred. Please check your core internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBlueprint = () => {
    if (!blueprint) return;
    
    const prefillData = {
      projectName: projectName || 'Holographic Simulation Concept',
      targetPlatform,
      budgetEstimate: blueprint.budgetEstimate,
      timelineEstimate: blueprint.timelineEstimate,
      suggestedArchitecture: blueprint.suggestedArchitecture,
      keyFeatures: blueprint.keyFeatures,
      actionPlanSteps: blueprint.actionPlanSteps,
      service: blueprint.recommendedDisciplines[0] || 'Website Development'
    };

    sessionStorage.setItem('ayn_prefill_blueprint', JSON.stringify(prefillData));
    onNavigateContact(blueprint.recommendedDisciplines[0] || 'Website Development');
  };

  return (
    <div id="ai-architect-container" className="min-h-screen pb-24 pt-24 px-6 md:px-12 relative overflow-hidden select-none">
      {/* Visual Backdrops */}
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-20" />
      <div className="absolute -top-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-gold-300 uppercase">
              CO-PILOT BLUEPRINT SANDBOX
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white uppercase">
            AI <span className="metallic-gold-text">ARCHITECT</span>
          </h1>
          <p className="text-sm font-sans text-neutral-400 mt-4 leading-relaxed max-w-xl">
            Pitch your project concept and let our system automatically engineer the optimal tech stack, estimated scope, action milestones, and custom cost breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Input Console */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-premium p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-0.5 bg-neutral-900 border border-white/10 rounded-full text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                ARCHITECT CONSOLE v2.1
              </div>

              <form onSubmit={handleGenerate} className="space-y-6 text-left">
                {/* Project Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    Project Identifier (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Neon Horizon Racer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500 transition-all font-sans"
                  />
                </div>

                {/* Target Platform */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    Target Deployment Domain
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {platforms.map(plat => (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setTargetPlatform(plat)}
                        className={`px-3 py-2.5 rounded-xl border text-[10px] text-left transition-all cursor-pointer font-mono ${
                          targetPlatform === plat 
                            ? 'border-gold-500/50 bg-gold-500/10 text-white' 
                            : 'border-white/5 bg-white/5 text-neutral-400 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range Selection */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      Target Budget Mode
                    </label>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setCurrency('INR')}
                        className={`px-2 py-1 rounded text-[8px] font-bold font-mono transition-all cursor-pointer uppercase ${
                          currency === 'INR'
                            ? 'bg-gold-500 text-black shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        INR (₹)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('USD')}
                        className={`px-2 py-1 rounded text-[8px] font-bold font-mono transition-all cursor-pointer uppercase ${
                          currency === 'USD'
                            ? 'bg-gold-500 text-black shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        USD ($)
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {budgetLevels.map(level => (
                      <button
                        key={level.name}
                        type="button"
                        onClick={() => setApproxBudgetRange(level.name)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          approxBudgetRange === level.name 
                            ? 'border-gold-500/50 bg-gold-500/10' 
                            : 'border-white/5 bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="text-[10px] font-bold font-mono text-white">{level.name}</div>
                        <div className="text-[8px] text-neutral-500 font-sans mt-0.5">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Concept Pitch */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    CONCEPT PITCH & FUNCTIONAL GOALS *
                  </label>
                  <textarea 
                    required
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your goals, reference apps, specific design aesthetic, and key requirements. The more details, the more precise the technical stack recommendations..."
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500 transition-all font-sans resize-none leading-relaxed"
                  />
                </div>

                {/* Trigger */}
                <button
                  type="submit"
                  disabled={loading || !projectDescription.trim()}
                  className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black text-xs font-display font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(212,163,23,0.3)] hover:shadow-[0_0_35px_rgba(212,163,23,0.6)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 select-none"
                >
                  <Cpu className="w-4 h-4 animate-spin-slow" />
                  GENERATE ARCHITECTURE ROADMAP
                </button>
              </form>
            </div>
          </div>

          {/* Right: Output Board / Results screen */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-premium p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,163,23,0.08)_0%,transparent_70%)] pointer-events-none" />
                  
                  {/* Rotating loader shapes */}
                  <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                    <div className="absolute w-28 h-28 border border-dashed border-gold-500/10 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute w-24 h-24 border border-gold-500/30 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
                    <div className="absolute w-16 h-16 border-2 border-dashed border-gold-500/50 rounded-full animate-spin" />
                    <Cpu className="w-8 h-8 text-gold-400 animate-pulse relative z-10" />
                  </div>

                  <h3 className="text-sm font-mono text-gold-400 uppercase tracking-[0.25em] mb-2 font-bold animate-pulse">
                    CO-PILOT RECONSTRUCTING...
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm text-center h-8 font-mono">
                    {loadingStatuses[loadingStep]}
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-premium p-8 rounded-3xl border border-red-500/20 text-center flex flex-col items-center justify-center min-h-[400px]"
                >
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
                  <h3 className="text-lg font-display font-bold text-white uppercase mb-2">
                    Synthesis Failure
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mb-6">
                    {error}
                  </p>
                  <button 
                    onClick={() => setError(null)}
                    className="px-6 py-2.5 rounded-full border border-white/10 hover:border-white/20 text-xs font-mono text-white transition-all cursor-pointer"
                  >
                    Reset Console
                  </button>
                </motion.div>
              )}

              {blueprint && !loading && !error && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-left"
                >
                  {/* Status Banner */}
                  <div className="glass-premium p-4 rounded-2xl border border-gold-500/20 bg-gold-500/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono tracking-widest text-gold-400 uppercase font-bold">
                          BLUEPRINT SECURED
                        </div>
                        <div className="text-[8px] text-neutral-400 font-mono">
                          Ready for secure digital development pipeline
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setBlueprint(null); setProjectName(''); setProjectDescription(''); }}
                      className="text-[9px] font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
                    >
                      <RefreshCw className="w-3 h-3" /> Re-Architect
                    </button>
                  </div>

                  {/* High level visual cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Budget Estimate */}
                    <div className="glass-premium p-5 rounded-2xl border border-white/5 flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">ESTIMATED BUDGET</div>
                        <div className="text-xl font-display font-black text-white mt-0.5">{blueprint.budgetEstimate}</div>
                      </div>
                    </div>

                    {/* Timeline Estimate */}
                    <div className="glass-premium p-5 rounded-2xl border border-white/5 flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">DEV TIMELINE</div>
                        <div className="text-xl font-display font-black text-white mt-0.5">{blueprint.timelineEstimate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Tech stack / Architecture suggestion */}
                  <div className="glass-premium p-6 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-gold-400" />
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-white font-bold">
                        RECOMMENDED ARCHITECTURE
                      </h4>
                    </div>
                    <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                      {blueprint.suggestedArchitecture}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {blueprint.recommendedDisciplines.map(disc => (
                        <span key={disc} className="text-[8px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gold-400">
                          {disc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="glass-premium p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-gold-400" />
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-white font-bold">
                        KEY FEATURES ENVISIONED
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {blueprint.keyFeatures.map((feat, idx) => (
                        <div key={idx} className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold-500/20 rounded-xl transition-all flex gap-3">
                          <div className="text-[10px] font-mono text-gold-400 font-bold select-none">0{idx + 1}</div>
                          <div>
                            <h5 className="text-xs font-display font-bold text-white uppercase tracking-wider">{feat.title}</h5>
                            <p className="text-[11px] font-sans text-neutral-400 leading-relaxed mt-1">{feat.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Roadmap steps */}
                  <div className="glass-premium p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-gold-400" />
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-white font-bold">
                        DEVELOPMENT ROADMAP
                      </h4>
                    </div>
                    <div className="relative border-l border-white/10 ml-2.5 pl-5 space-y-4">
                      {blueprint.actionPlanSteps.map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[25.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold-500 border border-neutral-950 shadow-[0_0_5px_rgba(212,163,23,0.8)]" />
                          <div className="text-[10px] font-mono text-neutral-500 uppercase">Phase 0{idx + 1}</div>
                          <p className="text-xs font-sans text-neutral-300 mt-0.5 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Architect comment notes */}
                  <div className="p-5 border border-dashed border-gold-500/30 rounded-2xl bg-gold-500/5 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-gold-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="text-[9px] font-mono text-gold-400 uppercase tracking-widest font-bold mb-1.5">
                      Expert Recommendation
                    </div>
                    <p className="text-xs font-sans text-neutral-400 italic leading-relaxed">
                      "{blueprint.aiArchitectNotes}"
                    </p>
                  </div>

                  {/* CTA trigger redirect */}
                  <button
                    onClick={handleApplyBlueprint}
                    className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black text-xs font-display font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(212,163,23,0.3)] hover:shadow-[0_0_35px_rgba(212,163,23,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    DISPATCH DIRECT INQUIRY WITH THIS BLUEPRINT
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </motion.div>
              )}

              {!loading && !blueprint && !error && (
                <div className="glass-premium p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center min-h-[500px] relative text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_60%)] pointer-events-none" />
                  <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center bg-white/5 text-neutral-500 mb-6">
                    <Cpu className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white uppercase mb-2">
                    Awaiting Project Parameter Set
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                    Input your creative concept and budget settings in the console on the left to initiate the AI Blueprint Synthesis engine.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
