"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const AcademicRoom = dynamic(() => import("@/components/ai/AcademicRoom"), { ssr: false });
const MarketWarRoom = dynamic(() => import("@/components/ai/MarketWarRoom"), { ssr: false });
const AvatarForge = dynamic(() => import("@/components/ai/AvatarForge"), { ssr: false });
const ContentStudio = dynamic(() => import("@/components/ai/ContentStudio"), { ssr: false });
const NeuralHub = dynamic(() => import("@/components/ai/NeuralHub"), { ssr: false });

type Room = "lobby" | "academic" | "market" | "forge" | "studio" | "hub";

export default function AIPage() {
  const [room, setRoom] = useState<Room>("lobby");
  const [input, setInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("risen_ai_token")) {
      router.replace("/ai/login");
    }
  }, [router]);

  const enterRoom = (target: Room, initialPrompt?: string) => {
    setRoom(target);
    if (initialPrompt) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("ai-preset", { detail: initialPrompt }));
      }, 500);
    }
  };

  const handleLobbySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    enterRoom("hub", input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#010913] text-white relative overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {room === "lobby" ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 relative"
          >
            {/* 🌌 DYNAMIC BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,219,255,0.12),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#2EDBFF_1px,transparent_1px),linear-gradient(90deg,#2EDBFF_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            {/* GLOWING ORBS */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-risen-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />

            <div className="relative z-10 w-full max-w-5xl">
              <div className="text-center mb-12">
                  <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">
                      Cognitive Core
                  </h1>
                  <p className="text-risen-primary font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">
                      Neural Network Access Protocol V2.1
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="space-y-6">
                  <OrbCard
                    title="Market Insight"
                    desc="Deep-dive into smart money movements and token metrics."
                    icon="🛰️"
                    onClick={() => enterRoom("market")}
                  />
                  <OrbCard
                    title="Learn Crypto"
                    desc="Interactive syllabus from blockchain basics to DeFi protocols."
                    icon="🏛️"
                    onClick={() => enterRoom("academic")}
                  />
                </div>

                <div className="flex flex-col items-center justify-center order-first md:order-none">
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-full blur-3xl bg-risen-primary/30 group-hover:bg-risen-primary/50 transition-colors animate-pulse" />
                        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-white/5 bg-[#030913] flex flex-col items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(46,219,255,0.2)]">
                            <div className="absolute inset-0 border-[1px] border-dashed border-risen-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="absolute inset-4 border-[1px] border-dashed border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            <span className="text-4xl">🧠</span>
                        </div>
                    </div>
                    <form onSubmit={handleLobbySubmit} className="mt-10 w-full relative group max-w-sm">
                        <div className="absolute -inset-1 bg-gradient-to-r from-risen-primary to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition" />
                        <div className="relative bg-[#020B1A] border border-white/10 rounded-2xl p-2 flex items-center">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Execute cognitive query..."
                                className="flex-1 bg-transparent px-4 py-3 outline-none text-sm placeholder:text-white/40 font-medium"
                            />
                            <button type="submit" className="bg-risen-primary text-black h-10 w-10 rounded-xl flex items-center justify-center hover:scale-105 transition">➔</button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                  <OrbCard
                    title="Generate Avatar"
                    desc="Algorithmic creation of high-fidelity futuristic personas."
                    icon="💎"
                    onClick={() => enterRoom("forge")}
                  />
                  <OrbCard
                    title="Create Content"
                    desc="Viral social architecture for the Risen ecosystem."
                    icon="🎭"
                    onClick={() => enterRoom("studio")}
                  />
                </div>
              </div>

              <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
                  <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest italic">All Nodes Operational</span>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.5em]">RISEN_CORE_SYS_01001</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={room}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full"
          >
            {room === "academic" && <AcademicRoom onBack={() => setRoom("lobby")} />}
            {room === "market" && <MarketWarRoom onBack={() => setRoom("lobby")} />}
            {room === "forge" && <AvatarForge onBack={() => setRoom("lobby")} />}
            {room === "studio" && <ContentStudio onBack={() => setRoom("lobby")} />}
            {room === "hub" && <NeuralHub onBack={() => setRoom("lobby")} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrbCard({ title, desc, icon, onClick }: { title: string; desc: string; icon: string; onClick: () => void; }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-6 rounded-3xl border border-white/5 bg-[#030913]/60 hover:bg-[#07111d] hover:border-risen-primary/30 cursor-pointer transition-all duration-300 group relative overflow-hidden backdrop-blur-xl"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        <div className="text-2xl transform rotate-12 group-hover:rotate-0 transition-transform">{icon}</div>
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-black uppercase tracking-widest text-risen-primary mb-2 italic">{title}</h3>
        <p className="text-[11px] font-medium text-white/70 leading-relaxed group-hover:text-white transition-colors">{desc}</p>
      </div>
      <div className="mt-4 flex justify-end">
         <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-risen-primary transition-colors">Access Loop ➔</span>
      </div>
    </motion.div>
  );
}
