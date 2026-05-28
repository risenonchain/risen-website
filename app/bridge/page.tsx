"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasRushToken } from "@/lib/api";
import {
  Zap,
  ArrowRightLeft,
  ChevronDown,
  Wallet,
  Info,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

const NETWORKS = [
  { id: "eth", name: "Ethereum", icon: "💎", chainId: 1 },
  { id: "bsc", name: "BSC", icon: "🔶", chainId: 56 },
  { id: "polygon", name: "Polygon", icon: "🟣", chainId: 137 },
  { id: "base", name: "Base", icon: "🔵", chainId: 8453 },
];

export default function NeuralBridge() {
  const [fromNet, setFromNet] = useState(NETWORKS[1]); // BSC
  const [toNet, setToNet] = useState(NETWORKS[0]); // ETH
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("rush_token")) {
      router.replace("/bridge/login");
    }
  }, [router]);

  const swapNetworks = () => {
    const temp = fromNet;
    setFromNet(toNet);
    setToNet(temp);
  };

  return (
    <main className="min-h-screen bg-[#02070d] text-white selection:bg-blue-500/30 font-sans relative overflow-hidden pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -z-10" />

      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
        <Link href="/store" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-all">
             <ChevronLeft size={16} className="text-white/40 group-hover:text-white" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors italic">Back to App Store</span>
        </Link>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest italic">Neural_Bridge_v1.0</div>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-6 pt-12 text-center">
         <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-blue-400 mb-8 font-black">
            <Zap size={12} className="fill-blue-400" /> Cross-Chain Migration
         </div>
         <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-6">
            Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Bridge</span>
         </h1>
         <p className="text-white/40 text-sm font-bold leading-relaxed uppercase tracking-tight max-w-lg mx-auto mb-16">
            Seamlessly migrate liquidity across the neural network. Optimized tax logic, sub-second routing, and absolute security.
         </p>

         {/* Bridge UI */}
         <div className="bg-[#030913] border border-white/5 rounded-[40px] p-8 shadow-2xl relative">
            <div className="space-y-4">
               {/* From */}
               <div className="bg-white/5 border border-white/5 rounded-3xl p-6 text-left group hover:border-white/10 transition-all">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Source Network</span>
                     <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Balance: 0.00</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5 cursor-pointer hover:bg-black/60 transition-all">
                        <span className="text-xl">{fromNet.icon}</span>
                        <span className="font-black uppercase italic text-sm">{fromNet.name}</span>
                        <ChevronDown size={14} className="text-white/20" />
                     </div>
                     <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent text-right text-3xl font-black text-white placeholder:text-white/5 outline-none flex-1 min-w-0"
                     />
                  </div>
               </div>

               {/* Swap Button */}
               <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={swapNetworks}
                    className="h-12 w-12 rounded-2xl bg-blue-600 border-4 border-[#030913] flex items-center justify-center hover:scale-110 transition-transform active:rotate-180 duration-500"
                  >
                     <ArrowRightLeft size={20} className="text-white" />
                  </button>
               </div>

               {/* To */}
               <div className="bg-white/5 border border-white/5 rounded-3xl p-6 text-left group hover:border-white/10 transition-all">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Destination Network</span>
                     <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Est. Received</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5 cursor-pointer hover:bg-black/60 transition-all">
                        <span className="text-xl">{toNet.icon}</span>
                        <span className="font-black uppercase italic text-sm">{toNet.name}</span>
                        <ChevronDown size={14} className="text-white/20" />
                     </div>
                     <div className="text-3xl font-black text-white/20">{amount || "0.00"}</div>
                  </div>
               </div>
            </div>

            {/* Stats */}
            <div className="mt-8 px-2 space-y-3">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/20">Protocol Fee</span>
                  <span className="text-blue-400">0.001 ETH</span>
               </div>
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/20">Security Layer</span>
                  <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck size={10} /> Active</span>
               </div>
            </div>

            {/* Action */}
            <button className="w-full mt-8 py-5 rounded-[28px] bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
               Initialize Migration
            </button>
         </div>

         <div className="mt-12 flex items-center justify-center gap-8 opacity-20 grayscale">
            <div className="flex flex-col items-center gap-1">
               <span className="text-xs font-black">SECURITY_L1</span>
               <div className="h-1 w-8 bg-white/20 rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-1">
               <span className="text-xs font-black">ROUTING_X</span>
               <div className="h-1 w-8 bg-white/20 rounded-full" />
            </div>
         </div>
      </section>
    </main>
  );
}
