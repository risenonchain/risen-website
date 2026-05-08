"use client";

import { motion } from "framer-motion";
import AIChat from "./AIChat";
import { useState } from "react";

interface Props {
  onBack: () => void;
}

const TEMPLATES = [
  {
    id: "viral",
    label: "Viral Thread",
    icon: "🐦",
    desc: "10-part viral Twitter architecture.",
    prompt: "Write a viral 10-tweet thread about the future of on-chain intelligence and the RISEN ecosystem. Use high-impact hooks, minimalist formatting, and strategic hashtags."
  },
  {
    id: "lite",
    label: "Litepaper Abstract",
    icon: "📄",
    desc: "Professional project overview.",
    prompt: "Write a high-level executive summary for a new DeFi protocol within the RISEN ecosystem. Focus on the value proposition, tokenomics, and competitive edge."
  },
  {
    id: "video",
    label: "Video Script",
    icon: "🎥",
    desc: "Short-form cinematic script.",
    prompt: "Draft a 60-second cinematic script for a RISEN promotional video. Focus on architectural themes, cyberpunk aesthetics, and a powerful call to action."
  },
  {
    id: "social",
    label: "LinkedIn Authority",
    icon: "💼",
    desc: "Thought-leadership post.",
    prompt: "Write a professional LinkedIn post about the intersection of AI and Blockchain. Position the author as an expert in the RISEN ecosystem. Focus on long-term vision."
  },
];

export default function ContentStudio({ onBack }: Props) {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const applyTemplate = (template: any) => {
    setActiveTemplate(template.id);
    window.dispatchEvent(new CustomEvent("ai-preset", { detail: template.prompt }));
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#02050b] relative overflow-hidden font-sans">
      {/* Visual Flair */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.05),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#020812]/90 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <span className="text-white/40">✕</span>
          </button>
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">
               <span className="text-purple-500">🎭</span> Content Studio
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
                <div className="h-1 w-1 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Social Architecture & Narrative Design</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
           <div className="text-right">
              <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Workspace</div>
              <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Viral Optimized</div>
           </div>
           <div className="h-10 w-10 rounded-xl border border-purple-500/20 bg-purple-500/5 flex items-center justify-center text-xl">✍️</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Templates Grid - Left side */}
        <div className="hidden xl:flex w-80 flex-col p-6 bg-[#01060f] border-r border-white/5">
           <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mb-8 px-2 italic">Narrative Templates</div>

           <div className="space-y-4 flex-1 overflow-y-auto custom-scroll pr-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className={`w-full p-5 rounded-3xl border transition-all text-left flex flex-col gap-2 group ${
                    activeTemplate === t.id
                    ? "bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
                    : "bg-white/5 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                     <span className={`text-xl transition-transform group-hover:scale-110 ${activeTemplate === t.id ? "opacity-100" : "opacity-30"}`}>{t.icon}</span>
                     <span className={`text-[8px] font-black uppercase tracking-widest ${activeTemplate === t.id ? "text-purple-400" : "text-white/10"}`}>Protocol active</span>
                  </div>
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${activeTemplate === t.id ? "text-white" : "text-white/40"}`}>{t.label}</div>
                    <div className="text-[9px] font-bold text-white/10 leading-tight mt-1 uppercase italic">{t.desc}</div>
                  </div>
                </button>
              ))}
           </div>

           <div className="mt-8 p-5 rounded-3xl bg-purple-500/5 border border-purple-500/10">
              <p className="text-[9px] font-bold text-purple-200/40 leading-relaxed uppercase italic text-center">
                All output is automatically optimized for maximal cross-chain engagement.
              </p>
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden relative">
           <AIChat />
        </div>
      </div>

      {/* Bottom Bar Styling */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
