import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, MessageSquare, ArrowUpRight, ShieldAlert, Sparkles, Globe, Coins } from 'lucide-react';

interface ContactSectionProps {
  onSubmitMessage: (message: {
    name: string;
    email: string;
    country: string;
    service: string;
    budget: string;
    message: string;
  }) => Promise<boolean>;
  preselectedService?: string;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  presets: string[];
}

const currencies: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '💵',
    presets: ['< 1,000', '1,000 - 3,000', '3,000 - 5,000', '5,000 - 10,000', '10,000+']
  },
  {
    code: 'USDT',
    symbol: '₮',
    name: 'Tether',
    flag: '🪙',
    presets: ['< 1,000', '1,000 - 3,000', '3,000 - 5,000', '5,000 - 10,000', '10,000+']
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    presets: ['< 50,000', '50,000 - 1,50,000', '1,50,000 - 3,00,000', '3,00,000 - 5,00,000', '5,00,000+']
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    presets: ['< 1,000', '1,000 - 3,000', '3,000 - 5,000', '5,000 - 10,000', '10,000+']
  },
  {
    code: 'BTC',
    symbol: '₿',
    name: 'Bitcoin',
    flag: '₿',
    presets: ['< 0.02', '0.02 - 0.05', '0.05 - 0.1', '0.1 - 0.2', '0.2+']
  },
  {
    code: 'ETH',
    symbol: 'Ξ',
    name: 'Ethereum',
    flag: '🔷',
    presets: ['< 0.5', '0.5 - 1.5', '1.5 - 3.0', '3.0 - 5.0', '5.0+']
  }
];

export default function ContactSection({ onSubmitMessage, preselectedService }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India 🇮🇳');
  const [service, setService] = useState(preselectedService || 'Website Development');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [budgetMode, setBudgetMode] = useState<'presets' | 'manual'>('presets');
  const [activePresetIndex, setActivePresetIndex] = useState(2);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const prefilledBlueprint = sessionStorage.getItem('ayn_prefill_blueprint');
    if (prefilledBlueprint) {
      try {
        const bp = JSON.parse(prefilledBlueprint);
        if (bp.projectName) {
          setName(bp.projectName);
        }
        
        let descTemplate = `[AI ARCHITECT BLUEPRINT REPORT]
Project Concept: ${bp.projectName || 'My Custom Project'}
Target Domain: ${bp.targetPlatform}
Estimated Budget Recommendation: ${bp.budgetEstimate}
Estimated Timeline: ${bp.timelineEstimate}

Recommended Stack / Architecture:
${bp.suggestedArchitecture}

Key Features:
${bp.keyFeatures?.map((f: any) => `• ${f.title}: ${f.description}`).join('\n') || ''}

Proposed Roadmap Action Steps:
${bp.actionPlanSteps?.map((s: string) => `- ${s}`).join('\n') || ''}

Please finalize my creative blueprint configuration. Let's build!`;

        setMessage(descTemplate);
        
        if (bp.service) {
          // Map AI recommended disciplines to our services list
          const foundService = services.find(s => s.toLowerCase() === bp.service.toLowerCase() || bp.service.toLowerCase().includes(s.toLowerCase()));
          if (foundService) {
            setService(foundService);
          } else {
            setService('Business Solutions');
          }
        }

        // Auto select manual budget mode and input average estimated cost
        if (bp.budgetEstimate) {
          setBudgetMode('manual');
          const cleanBudget = bp.budgetEstimate.replace(/[^0-9]/g, ''); // Extract numbers
          if (cleanBudget.length > 0) {
            // Pick first estimate number if there is a range
            const midIndex = Math.floor(cleanBudget.length / 2);
            const firstEstimateVal = cleanBudget.substring(0, midIndex || cleanBudget.length);
            setCustomAmount(firstEstimateVal);
          }
        }
        
        // Clear session storage so it doesn't prefill subsequent visits
        sessionStorage.removeItem('ayn_prefill_blueprint');
      } catch (e) {
        console.error("Failed to parse prefilled blueprint", e);
      }
    }
  }, []);

  const services = [
    'Website Development',
    'App Development',
    'Game Development',
    'Video Editing',
    'Motion Graphics',
    'Thumbnail Design',
    'Business Solutions'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    let finalBudget = '';
    const currObj = currencies.find(c => c.code === selectedCurrency) || currencies[0];
    if (budgetMode === 'presets') {
      const presetStr = currObj.presets[activePresetIndex];
      finalBudget = `${currObj.symbol}${presetStr} (${currObj.code})`;
    } else {
      const amt = parseFloat(customAmount) || 0;
      finalBudget = `${currObj.symbol}${amt.toLocaleString()} (${currObj.code})`;
    }

    setSubmitting(true);
    try {
      const res = await onSubmitMessage({
        name,
        email,
        country,
        service,
        budget: finalBudget,
        message
      });

      if (res) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        setCustomAmount('');
        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 pt-24 px-6 md:px-12 relative overflow-hidden select-none">
      
      {/* Background neon elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Instant Access Leads & Info */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-start text-left">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] text-gold-400 uppercase mb-2 block">
                Lead Dissemination
              </span>
              <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white uppercase leading-none">
                SECURE <br />
                <span className="metallic-gold-text">COMMISSION</span>
              </h1>
              <p className="text-sm font-sans text-neutral-400 mt-4 leading-relaxed max-w-sm">
                Initiate a high-performance blueprint discussion. Speak directly with Ayan Nayak via private networks.
              </p>
            </div>

            {/* Availability Indicator */}
            <div className="p-4 bg-gold-500/5 border border-gold-500/15 rounded-2xl flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div className="flex flex-col font-mono text-[11px]">
                <span className="text-white font-bold">OPERATIONS STATUS: ACTIVE</span>
                <span className="text-neutral-500">Avg Response Latency: &lt; 30 Mins</span>
              </div>
            </div>

            {/* Direct Instant Channels */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                Instant Channels
              </span>

              {/* Telegram Channel */}
              <a 
                href="https://t.me/Aynxxzzz" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-5 bg-neutral-950 hover:bg-neutral-900 border border-white/5 hover:border-gold-500/20 rounded-2xl transition-all group shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc]">
                    ✈️
                  </div>
                  <div className="flex flex-col font-mono text-xs">
                    <span className="text-white font-bold font-display uppercase tracking-wider">TELEGRAM ENCRYPTED</span>
                    <span className="text-neutral-500">@Aynxxzzz</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-gold-400 transition-colors" />
              </a>

              {/* WhatsApp channel */}
              <a 
                href="https://wa.me/918477824872" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-5 bg-neutral-950 hover:bg-neutral-900 border border-white/5 hover:border-gold-500/20 rounded-2xl transition-all group shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                    💬
                  </div>
                  <div className="flex flex-col font-mono text-xs">
                    <span className="text-white font-bold font-display uppercase tracking-wider">WHATSAPP DIRECT</span>
                    <span className="text-neutral-500">+91 8477824872</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-gold-400 transition-colors" />
              </a>
            </div>

            {/* Quality Standard */}
            <div className="font-mono text-[10px] text-neutral-600 space-y-1 pt-6 border-t border-white/5">
              <span>DESIGN PROTOCOL v3.5 • COMPLIANCE GUARANTEED</span>
              <p>Your details are protected using localized storage layers.</p>
            </div>
          </div>

          {/* Right Column: Premium Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-premium p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden gold-glow">
              <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16 space-y-6"
                  >
                    <CheckCircle className="w-16 h-16 text-gold-500 mx-auto animate-bounce" />
                    <h3 className="text-3xl font-display font-extrabold text-white uppercase tracking-wider">
                      DISPATCH SUCCESSFUL
                    </h3>
                    <p className="text-sm font-sans text-neutral-300 max-w-md mx-auto leading-relaxed">
                      Your proposal has been secure-logged and dispatched. An automated email dispatch notification was simulated for Ayan Nayak.
                    </p>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 font-mono text-xs inline-block text-gold-400">
                      TELEGRAM ACCELERATOR: <a href="https://t.me/Aynxxzzz" className="underline font-bold text-white">@Aynxxzzz</a>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="flex flex-col gap-1.5 font-mono text-xs text-neutral-400">
                        <label className="text-neutral-500 uppercase">Your Name</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rohid Sen"
                          className="px-4 py-3 bg-neutral-900 border border-white/10 focus:border-gold-500 text-white rounded-xl outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 font-mono text-xs text-neutral-400">
                        <label className="text-neutral-500 uppercase">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rohid@domain.com"
                          className="px-4 py-3 bg-neutral-900 border border-white/10 focus:border-gold-500 text-white rounded-xl outline-none transition-colors"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="flex flex-col gap-1.5 font-mono text-xs text-neutral-400">
                        <label className="text-neutral-500 uppercase">Location Country</label>
                        <input 
                          type="text" 
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. USA 🇺🇸"
                          className="px-4 py-3 bg-neutral-900 border border-white/10 focus:border-gold-500 text-white rounded-xl outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 font-mono text-xs text-neutral-400">
                        <label className="text-neutral-500 uppercase">Required Craft</label>
                        <select 
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="px-4 py-3 bg-neutral-900 border border-white/10 focus:border-gold-500 text-white rounded-xl outline-none transition-colors cursor-pointer"
                        >
                          {services.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Premium Currency & Appraisal Selection Section */}
                    <div className="p-6 bg-neutral-900/60 rounded-2xl border border-white/5 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-gold-400" />
                          <span className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-widest">
                            Budget & Appraisal Parameters
                          </span>
                        </div>
                        
                        {/* Preset vs Custom Switch */}
                        <div className="flex bg-neutral-950 p-1 rounded-lg border border-white/5">
                          <button
                            type="button"
                            onClick={() => setBudgetMode('presets')}
                            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all ${
                              budgetMode === 'presets' ? 'bg-gold-500 text-black font-bold shadow-[0_0_10px_rgba(212,163,23,0.3)]' : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            Presets
                          </button>
                          <button
                            type="button"
                            onClick={() => setBudgetMode('manual')}
                            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all ${
                              budgetMode === 'manual' ? 'bg-gold-500 text-black font-bold shadow-[0_0_10px_rgba(212,163,23,0.3)]' : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            Custom
                          </button>
                        </div>
                      </div>

                      {/* Currency Selection Grid */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                          Select Currency Protocol
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {currencies.map(c => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => setSelectedCurrency(c.code)}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                selectedCurrency === c.code 
                                  ? 'bg-gold-500/10 border-gold-500 text-white shadow-[0_0_15px_rgba(212,163,23,0.15)]' 
                                  : 'bg-neutral-950/60 border-white/5 hover:border-white/10 text-neutral-400 hover:text-white'
                              }`}
                            >
                              <span className="text-lg mb-1">{c.flag}</span>
                              <span className="font-mono text-[10px] font-bold tracking-wider">{c.code}</span>
                              <span className="text-[8px] font-mono text-neutral-500">{c.symbol}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Preset select or Manual custom input */}
                      <div className="pt-2 border-t border-white/5">
                        {budgetMode === 'presets' ? (
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                              Select Valuation Bracket ({selectedCurrency})
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {(currencies.find(c => c.code === selectedCurrency) || currencies[0]).presets.map((p, idx) => {
                                const symbol = (currencies.find(c => c.code === selectedCurrency) || currencies[0]).symbol;
                                return (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => setActivePresetIndex(idx)}
                                    className={`py-3 px-2 rounded-lg border font-mono text-center transition-all ${
                                      activePresetIndex === idx
                                        ? 'bg-gradient-to-r from-gold-600/20 to-gold-500/10 border-gold-500/60 text-gold-400 font-bold'
                                        : 'bg-neutral-950/40 border-white/5 hover:border-white/10 text-neutral-300'
                                    }`}
                                  >
                                    <span className="text-xs tracking-wider">
                                      {symbol} {p}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                              Enter Manual Custom Valuation
                            </label>
                            <div className="relative flex items-center">
                              <span className="absolute left-4 font-mono text-lg text-gold-400 font-bold select-none">
                                {(currencies.find(c => c.code === selectedCurrency) || currencies[0]).symbol}
                              </span>
                              <input
                                type="text"
                                required={budgetMode === 'manual'}
                                value={customAmount}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9.]/g, '');
                                  setCustomAmount(val);
                                }}
                                placeholder="e.g. 4500"
                                className="w-full pl-10 pr-20 py-4 bg-neutral-950 border border-white/10 focus:border-gold-500 text-white font-mono text-lg rounded-xl outline-none transition-colors"
                              />
                              <span className="absolute right-4 font-mono text-xs text-neutral-400 font-extrabold select-none">
                                {selectedCurrency}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-neutral-500">
                              Specify any custom valuation according to your specifications.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 font-mono text-xs text-neutral-400">
                      <label className="text-neutral-500 uppercase">Blueprint Details & Notes</label>
                      <textarea 
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Detail the parameters of your project. Timelines, aesthetic expectations, etc..."
                        className="px-4 py-3 bg-neutral-900 border border-white/10 focus:border-gold-500 text-white rounded-xl outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black text-xs font-display font-bold uppercase tracking-[0.25em] rounded-full shadow-[0_0_20px_rgba(212,163,23,0.3)] hover:shadow-[0_0_35px_rgba(212,163,23,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        'DISPATCHING INTEL CORE...'
                      ) : (
                        <>
                          DISPATCH PROPOSAL <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
