"use client";

import { motion } from "framer-motion";
import AIChat from "./AIChat";
import { useState, useEffect } from "react";
import { RISEN_CONTRACT_ADDRESS } from "@/lib/risenConfig";

interface Props {
  onBack: () => void;
}

const STREAM_DATA = [
  "SCANNING_ONCHAIN_WHALES...", "LIQUIDITY_DEPTH_CHECK...", "SOCIAL_SENTIMENT_SURGE...",
  "DERIVATIVES_OI_SHIFT...", "STABLECOIN_INFLOW_DETECTED...", "EXCHANGE_OUTFLOW_SPIKE...",
  "MEV_BOT_ACTIVITY_HIGH...", "GAS_PRICE_OPTIMIZATION_LINKED...", "CROSS_CHAIN_ARBITRAGE_FOUND..."
];

export default function MarketWarRoom({ onBack }: Props) {
  const [streamIndex, setStreamIndex] = useState(0);
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Live Data from Dexscreener
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
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamIndex((prev) => (prev + 1) % STREAM_DATA.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: any) => {
    const num = Number(val);
    if (!num) return "--";
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const volume24h = marketData?.volume?.h24 ? formatCurrency(marketData.volume.h24) : "--";
  const liquidity = marketData?.liquidity?.usd ? formatCurrency(marketData.liquidity.usd) : "--";
  const priceChange = marketData?.priceChange?.h24 ?? 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="h-screen w-full flex flex-col bg-[#01050a] relative overflow-hidden font-sans">
      {/* Visual Flair */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.03),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Scanning Laser Line */}
      <motion.div
        animate={{ top: ["-10%", "110%"] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="absolute left-0 w-full h-[2px] bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-0 pointer-events-none"
      />

      {/* Header - Terminal Style */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-red-500/20 bg-[#020810]/90 backdrop-blur-2xl z-20 relative">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="h-11 w-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group"
          >
            <span className="text-white/40 group-hover:text-white">✕</span>
          </button>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white flex items-center gap-3 italic">
               <span className="text-red-500 animate-pulse">🛰️</span> Market Surveillance Room
            </h2>
            <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-500/80 italic">Real-Time Smart Money Uplink Active</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Surveillance_Feed</span>
              <span className="text-[11px] font-black text-red-500 uppercase tracking-widest font-mono">{STREAM_DATA[streamIndex]}</span>
           </div>
           <div className="h-12 w-48 rounded-2xl bg-black/60 border border-red-500/20 flex flex-col justify-center px-5 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Sentiment</span>
                 <span className={`text-[10px] font-black uppercase tracking-widest italic ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? 'Bullish' : 'Bearish'}
                 </span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div
                    animate={{ width: isPositive ? ["40%", "75%", "60%"] : ["60%", "25%", "40%"] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className={`h-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isPositive ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'}`}
                 />
              </div>
           </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Stats Column (Terminal Feel) */}
        <div className="hidden xl:flex w-80 flex-col border-r border-white/10 p-8 bg-black/40 backdrop-blur-xl">
           <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-10 px-2 italic flex items-center gap-3">
              <div className="h-1 w-1 bg-red-500" /> Live_Market_Data
           </div>

           <div className="space-y-8">
              <MarketStat label="Volume (24h)" value={volume24h} color="#ef4444" />
              <MarketStat label="Liquidity (USD)" value={liquidity} color="#3b82f6" />
              <MarketStat label="Price Change (24h)" value={`${priceChange > 0 ? '+' : ''}${priceChange}%`} color={isPositive ? "#10b981" : "#ef4444"} />
              <MarketStat label="Pair Index" value={marketData?.dexId?.toUpperCase() || "--"} color="#f59e0b" />
              <MarketStat label="Uplink Sync" value={loading ? "SYNCING..." : "100%"} color="#8b5cf6" />
           </div>

           <div className="mt-auto p-6 rounded-[35px] border border-red-500/20 bg-red-500/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.1),transparent_70%)]" />
              <div className="text-[9px] font-black text-red-500 mb-3 uppercase tracking-widest italic relative z-10 flex items-center gap-2">
                 <span className="h-1 w-1 bg-red-500 rounded-full animate-ping" /> Strategic Alert
              </div>
              <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase italic relative z-10">
                {isPositive
                  ? "Ecosystem exhibiting sustained architectural strength. On-chain volume confirms high-fidelity engagement across key sectors."
                  : "Localized volatility detected in the neural matrix. Monitor liquidity nodes for potential re-entry optimization points."
                }
              </p>
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full relative">
           <div className="absolute top-0 right-0 p-6 z-10 pointer-events-none opacity-20 hidden lg:block">
              <div className="text-[9px] font-black text-white/30 uppercase tracking-[1.5em] transform rotate-90 origin-top-right mt-16 italic">TACTICAL_UPLINK_V4.2</div>
           </div>
           <div className="flex-1 overflow-hidden">
              <AIChat />
           </div>
        </div>
      </div>

      {/* Bottom Bar Styling */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
    </div>
  );
}

function MarketStat({ label, value, color }: { label: string; value: string; color: string; }) {
  return (
    <div className="group cursor-default transition-all duration-300 hover:translate-x-2">
       <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 group-hover:text-white/60 transition-colors flex items-center gap-2">
          <div className="h-px w-3 bg-white/20" /> {label}
       </div>
       <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: color }} />
          <span className="text-[13px] font-black italic tracking-widest uppercase" style={{ color: color }}>{value}</span>
       </div>
    </div>
  );
}
