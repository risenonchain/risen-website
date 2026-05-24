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
  { id: "dao", title: "DAO Architecture", icon: "🏛️", prompt: "How do decentralized autonomous organizations (DAOs) manage governance and treasury operations on-chain?" },
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
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Sidebar - Syllabus */}
      <div className="hidden lg:flex w-80 h-full border-r border-white/5 bg-[#020912]/90 backdrop-blur-3xl flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10 group">
          <div className="h-11 w-11 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl shadow-[0_0_30px_rgba(251,191,36,0.1)] transition-transform group-hover:scale-110">🏛️</div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-amber-400">Library</h2>
            <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1 italic">Knowledge Hub V3</div>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto custom-scroll pr-2">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-6 px-2 flex items-center gap-2">
            <div className="h-px w-4 bg-white/20" /> Modules
          </div>
          {SYLLABUS.map((item) => (
            <button
              key={item.id}
              onClick={() => selectTopic(item)}
              className={`w-full p-4 rounded-[24px] border transition-all duration-500 text-left group flex items-center gap-4 relative overflow-hidden ${
                activeTopic === item.id
                ? "bg-amber-400/10 border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.08)]"
                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <span className={`text-xl transition-all duration-500 group-hover:rotate-6 ${activeTopic === item.id ? "grayscale-0 scale-110" : "grayscale opacity-40"}`}>{item.icon}</span>
              <div className="flex-1 relative z-10">
                <div className={`text-[10px] font-black uppercase tracking-widest leading-tight ${activeTopic === item.id ? "text-white" : "text-white/60 group-hover:text-white"}`}>{item.title}</div>
                <div className={`text-[8px] font-bold uppercase tracking-tighter mt-1 italic ${activeTopic === item.id ? "text-amber-400/80" : "text-white/10"}`}>
                   {activeTopic === item.id ? "Protocol Synchronized" : "Initialize Link"}
                </div>
              </div>
              {activeTopic === item.id && (
                <motion.div layoutId="topic-glow" className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-transparent pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-[35px] bg-amber-400/5 border border-amber-400/10 relative group">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
           <p className="text-[9px] font-black text-amber-200/40 leading-relaxed uppercase italic text-center">
             Library weights calibrated for elite educational output. Decryption protocols active.
           </p>
        </div>
      </div>

      {/* Main Study Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-[#020912]/80 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="h-11 w-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90 group"
            >
              <span className="text-white/40 group-hover:text-white transition-colors">✕</span>
            </button>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-3 italic">
                 <span className="text-amber-400">🏛️</span> Academic Core
              </h2>
              <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">Deep Logic Sector 07</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">Active Node</div>
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] italic">Elite_Scholar_v2</div>
             </div>
             <div className="h-12 w-12 rounded-[20px] border-2 border-amber-400/30 bg-amber-400/5 flex items-center justify-center text-xl shadow-[0_0_30px_rgba(251,191,36,0.1)]">📜</div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />
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
