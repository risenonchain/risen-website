"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AIPage() {
  const [active, setActive] = useState(false);
  const [input, setInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("risen_ai_token")) {
      router.replace("/ai/login");
    }
  }, [router]);

  const openAI = (message?: string) => {
    if (message) {
      window.dispatchEvent(
        new CustomEvent("ai-preset", { detail: message })
      );
    }
    window.dispatchEvent(new Event("open-ai"));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    openAI(input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#010913] text-white relative overflow-hidden flex flex-col items-center justify-center px-4 font-sans">

      {/* 🌌 DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,219,255,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#2EDBFF_1px,transparent_1px),linear-gradient(90deg,#2EDBFF_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* GLOWING ORBS */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-risen-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">
                Cognitive Core
            </h1>
            <p className="text-risen-primary font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">
                Neural Network Access Protocol V2.1
            </p>
        </div>

        {/* GRID SYSTEM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <OrbCard
              title="Market Insight"
              desc="Deep-dive into smart money movements and token metrics."
              icon="📈"
              onClick={() => openAI("Analyze the current crypto market like smart money. Focus on mid-cap opportunities.")}
            />
            <OrbCard
              title="Learn Crypto"
              desc="Interactive syllabus from blockchain basics to DeFi protocols."
              icon="📚"
              onClick={() => openAI("I want to learn crypto. Start with a simplified overview of liquidity pools.")}
            />
          </div>

          {/* CENTER ORB */}
          <div className="flex flex-col items-center justify-center order-first md:order-none">
            <AnimatePresence mode="wait">
                {!active ? (
                  <motion.div
                    key="inactive"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    onClick={() => setActive(true)}
                    className="relative group cursor-pointer"
                  >
                    <div className="absolute inset-0 rounded-full blur-3xl bg-risen-primary/30 group-hover:bg-risen-primary/50 transition-colors animate-pulse" />
                    <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-white/5 bg-[#030913] flex flex-col items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(46,219,255,0.2)]">
                        {/* Rotating ring */}
                        <div className="absolute inset-0 border-[1px] border-dashed border-risen-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-4 border-[1px] border-dashed border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                        <span className="text-sm font-black tracking-[0.4em] uppercase text-white/40 group-hover:text-white transition-colors">Initialize</span>
                        <span className="text-4xl mt-2 group-hover:scale-125 transition-transform">🧠</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                  >
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                        <div className="w-full relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-risen-primary to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition" />
                            <div className="relative bg-[#020B1A] border border-white/10 rounded-2xl p-2 flex items-center">
                                <input
                                    autoFocus
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Execute cognitive query..."
                                    className="flex-1 bg-transparent px-4 py-3 outline-none text-sm placeholder:text-white/20 font-medium"
                                />
                                <button
                                    type="submit"
                                    className="bg-risen-primary text-black h-10 w-10 rounded-xl flex items-center justify-center hover:scale-105 transition active:scale-95"
                                >
                                    <span className="text-xl">➔</span>
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setActive(false)}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition"
                        >
                            Reset Interface
                        </button>
                    </form>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <OrbCard
              title="Generate Avatar"
              desc="Algorithmic creation of high-fidelity futuristic personas."
              icon="👤"
              onClick={() => openAI("Generate a futuristic RISEN-themed crypto avatar. Dark navy and cyan palette.")}
            />
            <OrbCard
              title="Create Content"
              desc="Viral social architecture for the Risen ecosystem."
              icon="✍️"
              onClick={() => openAI("Write 3 viral tweets about the RISEN AI Cognitive Core launch. Use hashtags #RisenOnChain #RISENAI.")}
            />
          </div>

        </div>

        {/* FOOTER INFO */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
            <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">All Nodes Operational</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em]">
                RISEN_CORE_SYS_01001
            </div>
            <div className="flex gap-4">
                <span className="text-[10px] font-black">LATENCY: 24MS</span>
                <span className="text-[10px] font-black">SYNC: 100%</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

/* 🔥 ENHANCED CARD */
function OrbCard({
  title,
  desc,
  icon,
  onClick,
}: {
  title: string;
  desc: string;
  icon: string;
  onClick: () => void;
}) {
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
        <h3 className="text-sm font-black uppercase tracking-widest text-risen-primary mb-2 italic">
            {title}
        </h3>
        <p className="text-[11px] font-medium text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
            {desc}
        </p>
      </div>
      <div className="mt-4 flex justify-end">
         <span className="text-[10px] font-black uppercase tracking-widest text-white/10 group-hover:text-risen-primary transition-colors">Access Loop ➔</span>
      </div>
    </motion.div>
  );
}
