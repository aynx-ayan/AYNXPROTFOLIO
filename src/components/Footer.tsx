import { motion } from 'motion/react';
import { ArrowUp, Github, Linkedin, MessageSquare, Send } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black border-t border-white/5 py-16 px-6 md:px-12 select-none relative z-10 overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gold-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Main Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-left">
          
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gold-500/20 flex items-center justify-center bg-black/40">
                <span className="font-display font-bold text-xs text-gold-400">AN</span>
              </div>
              <span className="font-display font-extrabold text-sm tracking-widest text-white">A.YNX_ STUDIO</span>
            </div>
            <p className="text-xs font-sans text-neutral-400 max-w-sm leading-relaxed">
              Crafting premium high-performance software systems, interactive digital screens, and cinematic color grades. Dispatched with absolute craftsmanship.
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4 font-mono text-xs">
            <span className="text-[10px] text-gold-500 uppercase tracking-widest font-bold">DIRECTORY</span>
            <div className="flex flex-col gap-2 text-neutral-400">
              <button onClick={() => onNavigate('/')} className="text-left hover:text-white transition-colors cursor-pointer">/ Home</button>
              <button onClick={() => onNavigate('/about')} className="text-left hover:text-white transition-colors cursor-pointer">/ About Me</button>
              <button onClick={() => onNavigate('/services')} className="text-left hover:text-white transition-colors cursor-pointer">/ Services</button>
              <button onClick={() => onNavigate('/portfolio')} className="text-left hover:text-white transition-colors cursor-pointer">/ Portfolio</button>
              <button onClick={() => onNavigate('/ai-architect')} className="text-left hover:text-white transition-colors cursor-pointer">/ AI Architect</button>
              <button onClick={() => onNavigate('/reviews')} className="text-left hover:text-white transition-colors cursor-pointer">/ Client Reviews</button>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4 font-mono text-xs">
            <span className="text-[10px] text-gold-500 uppercase tracking-widest font-bold">DISPATCH LOCATIONS</span>
            <div className="text-neutral-400 space-y-1">
              <p>India 🇮🇳 ( Mainland HQ )</p>
              <p>USA 🇺🇸 ( Corporate Partnerships )</p>
              <p>Pakistan 🇵🇰 ( Creative Studio )</p>
            </div>
            
            <a 
              href="https://t.me/Aynxxzzz" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gold-400 hover:underline inline-flex items-center gap-1 mt-2"
            >
              Secure Telegram <Send className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Footer Meta bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-mono text-neutral-600">
          <span>© 2026 A.YNX_ STUDIO. ALL RIGHTS RESERVED.</span>
          
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">MADE WITH METALLIC DESIGN PROTOCOL 3.5</span>
            <button 
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full border border-white/10 hover:border-gold-500/40 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer shadow-md"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
