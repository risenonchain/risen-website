"use client";

import { motion, AnimatePresence } from "framer-motion";
import AIChat from "./AIChat";
import { useState } from "react";

interface Props {
  onBack: () => void;
}

const PRESETS = [
  {
    id: "commander",
    label: "Elite Commander",
    icon: "🎖️",
    desc: "Black and gold armor, cybernetic enhancements.",
    prompt: "Generate a high-fidelity avatar of a futuristic crypto commander. Cybernetic enhancements, sleek black and gold armor, tactical display in eyes. Risen-themed palette. Cinematic lighting."
  },
  {
    id: "nomad",
    label: "Neural Nomad",
    icon: "🧤",
    desc: "Holographic cloak, neon cyan wires, tech-wear.",
    prompt: "Generate a nomadic hacker avatar. Holographic cloak, neon cyan wires, desert tech-wear. Cyberpunk aesthetic, Risen branding on gear. Atmospheric depth."
  },
  {
    id: "deity",
    label: "On-Chain Deity",
    icon: "👼",
    desc: "Ethereal god, blockchain data skin, obsidian.",
    prompt: "Generate an ethereal digital god avatar. Translucent skin glowing with blockchain data packets, floating geometric shapes, obsidian background. Minimalist but powerful. Hyper-realistic texture."
  },
  {
    id: "architect",
    label: "Void Architect",
    icon: "📐",
    desc: "Futuristic cowl, glowing air blueprints.",
    prompt: "Generate a dark architect persona. Futuristic cowl, blueprints glowing in the air, robotic arm drafting neural maps. Navy and purple palette. Dramatic shadows."
  },
  {
    id: "scout",
    label: "Core Scout",
    icon: "🛰️",
    desc: "Agile scout, drone interface, urban recon.",
    prompt: "Generate a futuristic scout avatar. Sleek agile armor, hovering recon drones, neural link headset. Urban cyberpunk setting. Risen primary color accents."
  }
];

export default function AvatarForge({ onBack }: Props) {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (preset: any) => {
    setActivePreset(preset.id);
    window.dispatchEvent(new CustomEvent("ai-preset", { detail: preset.prompt }));
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#02040a] relative overflow-hidden font-sans">
      {/* Visual Flair */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(46,219,255,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Blueprint Grid Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="h-full w-full bg-[linear-gradient(90deg,rgba(46,219,255,0.05)_1px,transparent_1px),linear-gradient(rgba(46,219,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-[#020612]/90 backdrop-blur-2xl z-20 relative">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="h-11 w-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group"
          >
            <span className="text-white/40 group-hover:text-white">✕</span>
          </button>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white italic">
               <span className="text-risen-primary">💎</span> Persona Forge
            </h2>
            <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-risen-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">High-Fidelity Neural Synthesis Active</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
           <div className="text-right">
              <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">Protocol</div>
              <div className="text-[11px] font-black text-risen-primary uppercase tracking-widest italic">Matrix_Render_V2.1</div>
           </div>
           <div className="h-12 w-12 rounded-[22px] border-2 border-risen-primary/30 bg-risen-primary/5 flex items-center justify-center text-xl shadow-[0_0_30px_rgba(46,219,255,0.1)] transition-transform hover:rotate-12">👤</div>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Chat Area - Left side */}
        <div className="flex-1 flex flex-col h-full border-r border-white/5 relative bg-[#010309]/50">
           <div className="flex-1 overflow-hidden relative">
              {/* Drafting Visual Overlay */}
              <div className="absolute top-4 left-4 p-3 border border-white/5 bg-black/40 rounded-xl z-10 pointer-events-none opacity-20">
                 <div className="text-[7px] font-black text-white/40 uppercase tracking-widest mb-1">Matrix_Status</div>
                 <div className="text-[9px] font-black text-risen-primary uppercase">Uplink_Optimal</div>
              </div>
              <AIChat />
           </div>
        </div>

        {/* Presets Sidebar - Right side */}
        <div className="hidden lg:flex w-80 flex-col p-8 bg-[#01060e] backdrop-blur-xl">
           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-10 px-2 italic flex items-center gap-3">
              <div className="h-1 w-1 bg-risen-primary" /> Matrix_Presets
           </div>

           <div className="space-y-4 flex-1 overflow-y-auto custom-scroll pr-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`w-full p-5 rounded-[28px] border transition-all duration-500 text-left flex flex-col gap-2 group relative overflow-hidden ${
                    activePreset === preset.id
                    ? "bg-risen-primary/10 border-risen-primary/40 shadow-[0_0_20px_rgba(46,219,255,0.08)]"
                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                     <span className={`text-xl transition-all duration-500 group-hover:scale-110 ${activePreset === preset.id ? "grayscale-0" : "grayscale opacity-40"}`}>{preset.icon}</span>
                     <span className={`text-[8px] font-black uppercase tracking-widest ${activePreset === preset.id ? "text-risen-primary" : "text-white/20"}`}>Core Sector</span>
                  </div>
                  <div className="relative z-10">
                    <span className={`text-[11px] font-black uppercase tracking-widest italic ${activePreset === preset.id ? "text-white" : "text-white/40 group-hover:text-white/60"}`}>
                      {preset.label}
                    </span>
                    <div className="text-[9px] font-bold text-white/20 leading-relaxed mt-1 uppercase italic group-hover:text-white/60">
                      {preset.desc}
                    </div>
                  </div>
                  {activePreset === preset.id && (
                    <motion.div layoutId="forge-glow" className="absolute inset-0 bg-gradient-to-br from-risen-primary/5 to-transparent pointer-events-none" />
                  )}
                </button>
              ))}
           </div>

           <div className="mt-8 p-6 rounded-[35px] border border-white/20 bg-white/5 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-risen-primary/40 to-transparent" />
              <div className="text-[9px] font-black text-risen-primary/80 mb-3 uppercase tracking-widest italic flex items-center gap-2 relative z-10">
                 <span className="h-1 w-1 bg-risen-primary rounded-full animate-pulse" /> Forge Advisory
              </div>
              <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase italic relative z-10 text-center">
                Persona synthesis utilizes advanced DALL-E architectures. Generation requires approximately 12.4s of neural compute.
              </p>
           </div>
        </div>
      </div>

      {/* Bottom Bar Styling */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-risen-primary/30 to-transparent" />

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(46,219,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
