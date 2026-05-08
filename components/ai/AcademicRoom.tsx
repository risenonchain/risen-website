"use client";

import { motion } from "framer-motion";
import AIChat from "./AIChat";
import { useState } from "react";

interface Props {
  onBack: () => void;
}

const SYLLABUS = [
  { id: "intro", title: "Blockchain Foundations", icon: "💎", prompt: "Explain the fundamental architecture of a blockchain. Focus on consensus and immutability." },
  { id: "defi", title: "DeFi Protocols 101", icon: "⚖️", prompt: "Break down how Automated Market Makers (AMMs) work compared to order book exchanges." },
  { id: "smart", title: "Smart Contract Logic", icon: "📜", prompt: "Explain the lifecycle of a smart contract deployment and how it interacts with the EVM." },
  { id: "risen", title: "RISEN Ecosystem", icon: "⚡", prompt: "What makes the RISEN protocol unique in the current on-chain landscape? Detail the roadmap." },
  { id: "security", title: "Security & Auditing", icon: "🛡️", prompt: "What are the top 5 security vulnerabilities in Solidity and how can they be mitigated?" },
];

export default function AcademicRoom({ onBack }: Props) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const selectTopic = (topic: any) => {
    setActiveTopic(topic.id);
    window.dispatchEvent(new CustomEvent("ai-preset", { detail: topic.prompt }));
  };

  return (
    <div className="h-screen w-full flex bg-[#01070e] relative overflow-hidden font-sans">
      {/* Visual Flair */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(251,191,36,0.03),transparent_50%)] pointer-events-none" />

      {/* Sidebar - Syllabus */}
      <div className="hidden lg:flex w-80 h-full border-r border-white/5 bg-[#020912]/80 backdrop-blur-xl flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(251,191,36,0.1)]">🏛️</div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">Library</h2>
            <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Syllabus v1.0</div>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto custom-scroll pr-2">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mb-6 px-2">Core Modules</div>
          {SYLLABUS.map((item) => (
            <button
              key={item.id}
              onClick={() => selectTopic(item)}
              className={`w-full p-4 rounded-2xl border transition-all text-left group flex items-center gap-4 ${
                activeTopic === item.id
                ? "bg-amber-400/10 border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.05)]"
                : "bg-white/5 border-white/5 hover:border-white/10"
              }`}
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${activeTopic === item.id ? "grayscale-0" : "grayscale opacity-40"}`}>{item.icon}</span>
              <div className="flex-1">
                <div className={`text-[10px] font-black uppercase tracking-widest leading-tight ${activeTopic === item.id ? "text-white" : "text-white/40"}`}>{item.title}</div>
                <div className="text-[8px] font-bold text-white/10 uppercase tracking-tighter mt-1 italic">Initialize Module</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-5 rounded-3xl bg-amber-400/5 border border-amber-400/10">
           <p className="text-[9px] font-bold text-amber-200/50 leading-relaxed uppercase italic">
             This sector utilizes specialized educational weights for deep architectural learning.
           </p>
        </div>
      </div>

      {/* Main Study Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#020912]/60 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <span className="text-white/40">✕</span>
            </button>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">Academic Room</h2>
              <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Deep Logic Protocol Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Knowledge Node</div>
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Library Sector 7</div>
             </div>
             <div className="h-10 w-10 rounded-xl border border-amber-400/20 bg-amber-400/5 flex items-center justify-center text-lg">🏛️</div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <AIChat />
        </div>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
