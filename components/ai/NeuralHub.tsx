"use client";

import { motion } from "framer-motion";
import AIChat from "./AIChat";

interface Props {
  onBack: () => void;
}

export default function NeuralHub({ onBack }: Props) {
  return (
    <div className="h-screen w-full flex flex-col bg-[#02070d] relative overflow-hidden">
      {/* Visual Flair */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-risen-primary/50 to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,219,255,0.05),transparent_50%)] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#030913]/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
          >
            <span className="text-white/40">✕</span>
          </button>
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">Neural Hub</h2>
            <div className="flex items-center gap-2 mt-0.5">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">General Cognitive Protocol</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
           <div className="text-right">
              <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Core Status</div>
              <div className="text-[10px] font-black text-risen-primary uppercase tracking-widest">Optimized</div>
           </div>
           <div className="h-8 w-px bg-white/5" />
           <div className="h-10 w-10 rounded-full border-2 border-risen-primary/30 flex items-center justify-center bg-risen-primary/5">
              <span className="text-lg">🧠</span>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative">
        <AIChat />
      </div>

      {/* Bottom Bar Styling */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </div>
  );
}
