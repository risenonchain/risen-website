"use client";
import React, { useState } from "react";
import {
  Zap,
  Trash2,
  ChevronRight,
  Wallet,
  Info,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Search
} from "lucide-react";
import Link from "next/link";

const MOCK_DUST = [
  { name: "Pepe AI", symbol: "PAI", balance: "12,400.22", value: "$0.04", icon: "🐸" },
  { name: "Inu Moon", symbol: "INM", balance: "0.00004", value: "$0.001", icon: "🐕" },
  { name: "Safu Rug", symbol: "SRUG", balance: "1,000,000", value: "$0.00", icon: "🧹" },
];

export default function DustSweeper() {
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

  return (
    <main className="min-h-screen bg-[#02070d] text-white selection:bg-amber-400/30 font-sans relative overflow-hidden pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-400/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-risen-primary/5 blur-[120px] rounded-full -z-10" />

      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
        <Link href="/store" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-400/50 transition-all">
             <span className="text-white/40 group-hover:text-white">←</span>
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors italic">App Store</span>
        </Link>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-widest italic">Sweeper_Protocol_v1.0</div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-12 text-center">
         <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-8 font-black">
            <Trash2 size={12} className="fill-amber-400" /> Wallet Optimization
         </div>
         <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-6">
            Dust <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Sweeper</span>
         </h1>
         <p className="text-white/40 text-sm font-bold leading-relaxed uppercase tracking-tight max-w-lg mx-auto mb-16">
            Convert small, unusable token balances into $RSN or native liquidity. Reclaim your wallet’s efficiency with sub-atomic precision.
         </p>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Wallet Info */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-[#030913] border border-white/5 rounded-[32px] p-6 text-left">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Wallet size={18} className="text-white/40" />
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Wallet</div>
                        <div className="text-xs font-black text-white italic">0x...7A42</div>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Est. Recoverable Value</div>
                     <div className="text-3xl font-black text-amber-400 italic tracking-tighter">$142.88</div>
                  </div>
               </div>

               <button
                  onClick={startScan}
                  disabled={scanning}
                  className="w-full py-5 rounded-2xl bg-amber-400 text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
               >
                  {scanning ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
                  {scanning ? "Scanning Neural Nodes..." : "Refresh Dust Data"}
               </button>
            </div>

            {/* Right: List */}
            <div className="lg:col-span-2">
               <div className="bg-[#030913] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Detected Fragments</h3>
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Select All</span>
                  </div>

                  <div className="space-y-4">
                     {MOCK_DUST.map((token, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-amber-400/30 transition-all">
                           <div className="flex items-center gap-4">
                              <span className="text-2xl">{token.icon}</span>
                              <div className="text-left">
                                 <div className="text-sm font-black uppercase italic text-white">{token.name}</div>
                                 <div className="text-[10px] font-bold text-white/20 uppercase">{token.balance} {token.symbol}</div>
                              </div>
                           </div>
                           <div className="text-right flex items-center gap-6">
                              <div className="text-xs font-black text-amber-400/80">{token.value}</div>
                              <div className="h-5 w-5 rounded-md border-2 border-white/10 group-hover:border-amber-400/40" />
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/5">
                     <button className="w-full py-5 rounded-[28px] bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] hover:bg-amber-400 hover:text-white transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                        Sweep to $RSN
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
