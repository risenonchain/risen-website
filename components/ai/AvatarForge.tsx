"use client";

import { motion } from "framer-motion";
import AIChat from "./AIChat";
import { useState } from "react";

interface Props {
  onBack: () => void;
}

const PRESETS = [
  { label: "Elite Commander", prompt: "Generate a high-fidelity avatar of a futuristic crypto commander. Cybernetic enhancements, sleek black and gold armor, tactical display in eyes. Risen-themed palette." },
  { label: "Neural Nomad", prompt: "Generate a nomadic hacker avatar. Holographic cloak, neon cyan wires, desert tech-wear. Cyberpunk aesthetic, Risen branding on gear." },
  { label: "On-Chain Deity", prompt: "Generate an ethereal digital god avatar. Translucent skin glowing with blockchain data packets, floating geometric shapes, obsidian background. Minimalist but powerful." },
  { label: "Void Architect", prompt: "Generate a dark architect persona. Futuristic cowl, blueprints glowing in the air, robotic arm drafting neural maps. Navy and purple palette." },
];

export default function AvatarForge({ onBack }: Props) {
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const applyPreset = (index: number) => {
    setActivePreset(index);
    window.dispatchEvent(new CustomEvent("ai-preset", { detail: PRESETS[index].prompt }));
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#02040a] relative overflow-hidden font-sans">
      {/* Visual Flair */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(46,219,255,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#020612]/90 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <span className="text-white/40">✕</span>
          </button>
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">
               <span className="text-risen-primary">💎</span> Avatar Forge
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
                <div className="h-1 w-1 rounded-full bg-risen-primary animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">High-Fidelity Persona Synthesis</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
           <div className="text-right">
              <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Protocol</div>
              <div className="text-[10px] font-black text-risen-primary uppercase tracking-widest">Image Matrix V2</div>
           </div>
           <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-xl">👤</div>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area - Left side */}
        <div className="flex-1 flex flex-col h-full border-r border-white/5 relative">
           <div className="flex-1 overflow-hidden">
              <AIChat />
           </div>
        </div>

        {/* Presets Sidebar - Right side */}
        <div className="hidden lg:flex w-72 flex-col p-6 bg-[#01060e] z-10">
           <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mb-8 px-2 italic">Matrix Presets</div>

           <div className="space-y-3">
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(i)}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex flex-col gap-1 ${
                    activePreset === i
                    ? "bg-risen-primary/10 border-risen-primary/30 shadow-[0_0_15px_rgba(46,219,255,0.05)]"
                    : "bg-white/5 border-white/5 hover:border-white/10"
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest italic ${activePreset === i ? "text-risen-primary" : "text-white/40"}`}>
                    {preset.label}
                  </span>
                  <span className="text-[8px] font-bold text-white/10 uppercase tracking-tighter">Initialize Blueprint</span>
                </button>
              ))}
           </div>

           <div className="mt-auto p-5 rounded-3xl border border-white/5 bg-white/5">
              <div className="text-[8px] font-black text-white/20 mb-2 uppercase tracking-widest italic">Forge Advisory</div>
              <p className="text-[9px] font-bold text-white/10 leading-relaxed uppercase italic">
                Advanced neural weights are used for high-fidelity rendering. Generation time may vary based on matrix complexity.
              </p>
           </div>
        </div>
      </div>

      {/* Bottom Bar Styling */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-risen-primary/20 to-transparent" />
    </div>
  );
}
