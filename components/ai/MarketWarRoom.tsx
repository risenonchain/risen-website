"use client";

import { motion } from "framer-motion";
import AIChat from "./AIChat";
import { useState, useEffect } from "react";

interface Props {
  onBack: () => void;
}

const STREAM_DATA = [
  "SCANNING_ONCHAIN_WHALES...", "LIQUIDITY_DEPTH_CHECK...", "SOCIAL_SENTIMENT_SURGE...",
  "DERIVATIVES_OI_SHIFT...", "STABLECOIN_INFLOW_DETECTED...", "EXCHANGE_OUTFLOW_SPIKE..."
];

export default function MarketWarRoom({ onBack }: Props) {
  const [streamIndex, setStreamIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamIndex((prev) => (prev + 1) % STREAM_DATA.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-[#01050a] relative overflow-hidden font-sans">
      {/* Visual Flair */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.03),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

      {/* Header - Terminal Style */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-red-500/10 bg-[#020810]/90 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <span className="text-white/40">✕</span>
          </button>
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-2 italic">
               <span className="text-red-500">🛰️</span> Market War Room
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
                <div className="h-1 w-1 rounded-full bg-red-500 animate-ping" />
                <span className="text-[8px] font-black uppercase tracking-widest text-red-500/40 italic">Smart Money Surveillance Active</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Real-Time Intel</span>
              <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest animate-pulse">{STREAM_DATA[streamIndex]}</span>
           </div>
           <div className="h-10 w-40 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-center px-4">
              <div className="flex justify-between items-center">
                 <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Global Risk</span>
                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest italic">LOW</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[20%]" />
              </div>
           </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Stats Column (Terminal Feel) */}
        <div className="hidden xl:flex w-72 flex-col border-r border-white/5 p-6 bg-black/20 backdrop-blur-sm">
           <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mb-8 px-2 italic">Surveillance Nodes</div>

           <div className="space-y-6">
              <MarketStat label="Whale Tracking" value="ACTIVE" color="#ef4444" />
              <MarketStat label="DEX Volume" value="+14.2%" color="#10b981" />
              <MarketStat label="CEX Inflows" value="STABLE" color="#3b82f6" />
              <MarketStat label="OI Correlation" value="HIGH" color="#f59e0b" />
           </div>

           <div className="mt-auto p-5 rounded-3xl border border-red-500/10 bg-red-500/5">
              <div className="text-[8px] font-black text-red-500 mb-2 uppercase tracking-widest italic">Sector Alert</div>
              <p className="text-[9px] font-bold text-white/30 leading-relaxed uppercase italic">
                Cross-chain arbitrage protocols detecting unusual volatility in Layer 2 ecosystems. Proceed with architectural caution.
              </p>
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full relative">
           <div className="absolute top-0 right-0 p-4 z-10 pointer-events-none opacity-20">
              <div className="text-[8px] font-black text-white/30 uppercase tracking-[1em] transform rotate-90 origin-top-right mt-10">TERMINAL_LINK_V4</div>
           </div>
           <div className="flex-1 overflow-hidden">
              <AIChat />
           </div>
        </div>
      </div>

      {/* Bottom Bar Styling */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
    </div>
  );
}

function MarketStat({ label, value, color }: { label: string; value: string; color: string; }) {
  return (
    <div className="group cursor-default">
       <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 group-hover:text-white/40 transition-colors">{label}</div>
       <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[11px] font-black italic tracking-widest" style={{ color: color }}>{value}</span>
       </div>
    </div>
  );
}
