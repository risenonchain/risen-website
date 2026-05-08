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
    label: "Viral Thread Architecture",
    icon: "🐦",
    desc: "10-part viral narrative engineered for high engagement.",
    prompt: "Write a viral 10-tweet thread about the future of on-chain intelligence and the RISEN ecosystem. Use high-impact hooks, minimalist formatting, and strategic hashtags."
  },
  {
    id: "lite",
    label: "Litepaper Abstract",
    icon: "📄",
    desc: "Structured project executive summary for investors.",
    prompt: "Write a high-level executive summary for a new DeFi protocol within the RISEN ecosystem. Focus on the value proposition, tokenomics, and competitive edge."
  },
  {
    id: "video",
    label: "Cinematic Script",
    icon: "🎥",
    desc: "Short-form script with visual cues and sound design.",
    prompt: "Draft a 60-second cinematic script for a RISEN promotional video. Focus on architectural themes, cyberpunk aesthetics, and a powerful call to action."
  },
  {
    id: "social",
    label: "LinkedIn Authority",
    icon: "💼",
    desc: "Thought-leadership article for professional nodes.",
    prompt: "Write a professional LinkedIn post about the intersection of AI and Blockchain. Position the author as an expert in the RISEN ecosystem. Focus on long-term vision."
  },
  {
    id: "discord",
    label: "Community Hub Update",
    icon: "💬",
    desc: "High-energy announcement for Discord/Telegram.",
    prompt: "Draft a high-energy community announcement for a major RISEN milestone. Use emojis, clear headings, and a strong sense of momentum."
  },
  {
    id: "blog",
    label: "Medium Deep Dive",
    icon: "✍️",
    desc: "Long-form technical exposition for enthusiasts.",
    prompt: "Outline a 1500-word Medium article exploring the RISEN Cognitive Layer's technical specs and its role in the future of web3 AI."
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
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#020812]/90 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
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
           <div className="h-10 w-10 rounded-xl border border-purple-500/20 bg-purple-500/5 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(168,85,247,0.1)]">✍️</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Templates Grid - Left side */}
        <div className="hidden xl:flex w-[340px] flex-col p-6 bg-[#01060f] border-r border-white/5">
           <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mb-8 px-2 italic">Narrative Templates</div>

           <div className="space-y-4 flex-1 overflow-y-auto custom-scroll pr-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className={`w-full p-5 rounded-[28px] border transition-all text-left flex flex-col gap-3 group relative overflow-hidden ${
                    activeTemplate === t.id
                    ? "bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.05)]"
                    : "bg-white/5 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                     <span className={`text-2xl transition-transform duration-500 group-hover:scale-110 ${activeTemplate === t.id ? "opacity-100 grayscale-0" : "opacity-30 grayscale"}`}>{t.icon}</span>
                     <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${activeTemplate === t.id ? "text-purple-400" : "text-white/5"}`}>Sector {TEMPLATES.indexOf(t) + 1}</span>
                  </div>
                  <div className="relative z-10">
                    <div className={`text-[11px] font-black uppercase tracking-widest leading-tight ${activeTemplate === t.id ? "text-white" : "text-white/40 group-hover:text-white/60"}`}>{t.label}</div>
                    <div className="text-[9px] font-bold text-white/10 leading-relaxed mt-2 uppercase italic group-hover:text-white/20 transition-colors">{t.desc}</div>
                  </div>

                  {activeTemplate === t.id && (
                    <motion.div layoutId="template-glow" className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                  )}
                </button>
              ))}
           </div>

           <div className="mt-8 p-6 rounded-[32px] bg-purple-500/5 border border-purple-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
              <p className="text-[9px] font-black text-purple-200/40 leading-relaxed uppercase italic text-center relative z-10">
                AI narratives are algorithmically calibrated for cross-chain virality and architectural impact.
              </p>
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden relative">
           <AIChat />
        </div>
      </div>

      {/* Bottom Bar Styling */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
