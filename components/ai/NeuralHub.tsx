"use client";

import { motion } from "framer-motion";
import AIChat from "./AIChat";

interface Props {
  onBack: () => void;
}

export default function NeuralHub({ onBack }: Props) {
  return (
    <div className="h-screen w-full flex flex-col bg-[#02070d] relative overflow-hidden font-sans">
      {/* Visual Flair */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-risen-primary/40 to-transparent animate-pulse z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,219,255,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#030913]/90 backdrop-blur-2xl relative z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 group"
          >
            <span className="text-white/20 group-hover:text-white transition-colors">✕</span>
          </button>
          <div className="h-10 w-px bg-white/5" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white italic">Neural Hub</h2>
            <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Elite Cognitive Protocol 2.1</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
           <div className="text-right">
              <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Matrix Status</div>
              <div className="text-[10px] font-black text-risen-primary uppercase tracking-[0.2em] italic">Full_Synchronization</div>
           </div>
           <div className="h-12 w-12 rounded-full border-2 border-risen-primary/30 flex items-center justify-center bg-risen-primary/5 shadow-[0_0_20px_rgba(46,219,255,0.1)] relative group">
              <div className="absolute inset-[-4px] rounded-full border border-dashed border-white/10 animate-[spin_20s_linear_infinite]" />
              <span className="text-xl group-hover:scale-110 transition-transform">🧠</span>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative bg-[#010812]/40 backdrop-blur-sm">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-risen-primary/5 rounded-full blur-[150px] pointer-events-none opacity-20" />
        <AIChat />
      </div>

      {/* Bottom Bar Styling */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </div>
  );
}
