"use client";

import { useState } from "react";

export default function AIPage() {
  const [active, setActive] = useState(false);
  const [input, setInput] = useState("");

  const openAI = (message?: string) => {
    if (message) {
      window.dispatchEvent(
        new CustomEvent("ai-preset", { detail: message })
      );
    }

    window.dispatchEvent(new Event("open-ai"));
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    openAI(input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#010913] text-white relative overflow-hidden">

      {/* 🌌 BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,219,255,0.08),transparent_60%)]" />

      {/* GRID LINES */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#0ff_1px,transparent_1px),linear-gradient(90deg,#0ff_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* MAIN */}
      <div className="relative z-10 flex items-center justify-center h-screen">

        {/* LEFT CARDS */}
        <div className="absolute left-10 space-y-6 hidden md:block">
          <SideCard
            title="Market Insight"
            onClick={() =>
              openAI("Analyze the current crypto market like smart money")
            }
          />
          <SideCard
            title="Learn Crypto"
            onClick={() =>
              openAI("Teach me crypto from beginner to advanced")
            }
          />
        </div>

        {/* RIGHT CARDS */}
        <div className="absolute right-10 space-y-6 hidden md:block">
          <SideCard
            title="Generate Avatar"
            onClick={() =>
              openAI("Generate a futuristic crypto avatar and return image only")
            }
          />
          <SideCard
            title="Create Content"
            onClick={() =>
              openAI("Write a viral tweet about RISEN AI")
            }
          />
        </div>

        {/* CENTER ORB */}
        <div className="flex flex-col items-center">

          {/* 🔥 ORB */}
          {!active && (
            <div
              onClick={() => setActive(true)}
              className="relative w-40 h-40 rounded-full cursor-pointer
              flex items-center justify-center
              bg-gradient-to-br from-cyan-400 to-risen-primary
              shadow-[0_0_80px_rgba(46,219,255,0.8)]
              animate-pulse hover:scale-110 transition duration-300"
            >
              <div className="absolute inset-0 rounded-full blur-2xl bg-cyan-400 opacity-40 animate-ping" />
              <span className="text-sm font-semibold tracking-wide">
                ENTER
              </span>
            </div>
          )}

          {/* 🔥 PORTAL INPUT */}
          {active && (
            <div className="flex flex-col items-center gap-4">

              <div
                className="w-[320px] px-4 py-3 rounded-xl
                bg-[#020B1A] border border-risen-primary/30
                shadow-[0_0_40px_rgba(46,219,255,0.3)]
                animate-fadeIn"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask RISEN..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-risen-primary
                text-sm hover:scale-105 transition"
              >
                Engage
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SideCard({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="px-5 py-3 rounded-xl bg-[#06111f]
      border border-risen-primary/20 cursor-pointer
      hover:border-risen-primary/40 hover:scale-105
      transition shadow-[0_0_20px_rgba(46,219,255,0.1)]"
    >
      <p className="text-xs font-semibold">{title}</p>
    </div>
  );
}
