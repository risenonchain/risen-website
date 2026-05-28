"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Activity,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  LayoutDashboard,
  BrainCircuit,
  Target
} from "lucide-react";
import { RISEN_CONTRACT_ADDRESS } from "@/lib/risenConfig";
import logo from "../../public/logo.png";

const STREAM_DATA = [
  "ANALYZING_LIQUIDITY_NODES...",
  "DETECTING_WHALE_MIGRATION...",
  "SOCIAL_SENTIMENT_PEAK...",
  "NEURAL_PATTERN_RECOGNITION...",
  "CROSS_CHAIN_FLOW_OPTIMIZED...",
];

export default function AtlasPage() {
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [streamIndex, setStreamIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveMarket() {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${RISEN_CONTRACT_ADDRESS}`);
        if (!res.ok) return;
        const data = await res.json();
        const bestPair = data.pairs?.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
        if (isMounted && bestPair) {
          setMarketData(bestPair);
          setLoading(false);
        }
      } catch (e) {
        console.error("Dexscreener Sync Error:", e);
      }
    }

    fetchLiveMarket();
    const interval = setInterval(fetchLiveMarket, 30000);
    const streamInterval = setInterval(() => {
      setStreamIndex((prev) => (prev + 1) % STREAM_DATA.length);
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(streamInterval);
    };
  }, []);

  const formatCurrency = (val: any) => {
    const num = Number(val);
    if (!num) return "--";
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <main className="min-h-screen bg-[#01070d] text-white selection:bg-risen-primary/30 font-sans relative overflow-hidden pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-risen-primary/5 blur-[140px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none" />

      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
        <Link href="/store" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-risen-primary/50 transition-all">
             <ChevronLeft size={16} className="text-white/40 group-hover:text-white" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors italic">Back to App Store</span>
        </Link>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 rounded-xl bg-risen-primary/10 border border-risen-primary/20 text-risen-primary text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
             <Activity size={12} className="animate-pulse" /> ATLAS_v2.0_ACTIVE
           </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-risen-primary/20 bg-risen-primary/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-risen-primary mb-8 font-black">
               <Globe size={12} /> GLOBAL SURVEILLANCE MATRIX
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-6">
               RISEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-risen-primary to-blue-400">ATLAS</span>
            </h1>
            <p className="text-white/40 text-sm font-bold leading-relaxed uppercase tracking-tight max-w-lg mb-8">
               The unified intelligence hub for the RISEN ecosystem. Real-time neural analysis, algorithmic signals, and deep-market surveillance in one terminal.
            </p>

            <div className="flex flex-wrap gap-4">
               <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Status</div>
                  <div className="text-sm font-black text-emerald-400 uppercase italic">Uplink Operational</div>
               </div>
               <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Neural Feed</div>
                  <div className="text-sm font-black text-risen-primary uppercase italic">{STREAM_DATA[streamIndex]}</div>
               </div>
            </div>
          </div>

          <div className="relative">
             <div className="absolute -inset-4 bg-risen-primary/10 blur-3xl rounded-full animate-pulse" />
             <div className="relative rounded-[40px] border border-white/10 bg-[#030913]/80 p-8 backdrop-blur-2xl shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black italic uppercase tracking-tight">Market Pulse</h3>
                   <div className="h-2 w-2 rounded-full bg-risen-primary animate-ping" />
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Price</div>
                      <div className="text-2xl font-black text-white">{marketData?.priceUsd ? `$${Number(marketData.priceUsd).toFixed(8)}` : "--"}</div>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">24h Volume</div>
                         <div className="text-lg font-black text-white">{formatCurrency(marketData?.volume?.h24)}</div>
                      </div>
                      <div className="space-y-1">
                         <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Liquidity</div>
                         <div className="text-lg font-black text-white">{formatCurrency(marketData?.liquidity?.usd)}</div>
                      </div>
                   </div>
                   <div className={`p-4 rounded-2xl border ${marketData?.priceChange?.h24 >= 0 ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-red-500/20 bg-red-500/5 text-red-400'} flex items-center justify-between`}>
                      <span className="text-[10px] font-black uppercase tracking-widest">24h Performance</span>
                      <span className="text-lg font-black">{marketData?.priceChange?.h24 ?? 0}%</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
         <div className="grid md:grid-cols-3 gap-8">
            <AtlasCard
               icon={<BrainCircuit className="text-risen-primary" />}
               title="Neural Insights"
               desc="Advanced LLM-driven analysis of on-chain behavior and community sentiment."
            />
            <AtlasCard
               icon={<Target className="text-blue-400" />}
               title="Algorithmic Signals"
               desc="Real-time alerts for volume spikes, liquidity shifts, and architectural anomalies."
            />
            <AtlasCard
               icon={<Shield className="text-purple-400" />}
               title="Global Surveillance"
               desc="Whale monitoring and deep liquidity tracking across all integrated nodes."
            />
         </div>
      </section>

      {/* Terminal View */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
         <div className="rounded-[40px] border border-white/10 bg-black/40 overflow-hidden backdrop-blur-xl">
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                     <div className="h-3 w-3 rounded-full bg-red-500/50" />
                     <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                     <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Neural_Uplink_Terminal_v2.0.4</span>
               </div>
               <div className="text-[10px] font-black text-risen-primary uppercase tracking-widest">SYS: STANDBY</div>
            </div>
            <div className="p-8 font-mono text-xs space-y-2 text-white/40">
               <div className="text-risen-primary/60">[SYSTEM] Initializing Atlas Core...</div>
               <div>[SYSTEM] Connecting to Dexscreener API... <span className="text-emerald-500">DONE</span></div>
               <div>[SYSTEM] Syncing Neural Nodes... <span className="text-emerald-500">100%</span></div>
               <div>[NEURAL] Pattern recognized at liquidity cluster 0x...4e2</div>
               <div className="animate-pulse">[NEURAL] {STREAM_DATA[streamIndex]}</div>
               <div className="pt-4 text-white/60">Welcome to Atlas. The network is listening.</div>
            </div>
         </div>
      </section>
    </main>
  );
}

function AtlasCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string; }) {
  return (
    <div className="p-8 rounded-[35px] border border-white/5 bg-[#030913] hover:border-risen-primary/30 transition-all group">
       <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <h3 className="text-xl font-black italic uppercase tracking-tight mb-3 text-white">{title}</h3>
       <p className="text-xs font-bold text-white/40 leading-relaxed uppercase">{desc}</p>
    </div>
  );
}
