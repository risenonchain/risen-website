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
    <div className="min-h-screen bg-[#010913] text-white relative overflow-hidden flex items-center justify-center px-4">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,219,255,0.08),transparent_60%)]" />

      {/* GRID */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#0ff_1px,transparent_1px),linear-gradient(90deg,#0ff_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* SYSTEM CONTAINER */}
      <div className="relative z-10 w-full max-w-4xl">

        {/* GRID SYSTEM */}
        <div className="grid grid-cols-2 gap-6 items-center">

          {/* TOP LEFT */}
          <OrbCard
            title="Market Insight"
            onClick={() =>
              openAI("Analyze the current crypto market like smart money")
            }
          />

          {/* TOP RIGHT */}
          <OrbCard
            title="Generate Avatar"
            onClick={() =>
              openAI("Generate a futuristic crypto avatar and return image only")
            }
          />

          {/* CENTER ORB */}
          <div className="col-span-2 flex justify-center py-6">

            {!active ? (
              <div
                onClick={() => setActive(true)}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full cursor-pointer
                flex items-center justify-center
                bg-gradient-to-br from-cyan-400 to-risen-primary
                shadow-[0_0_60px_rgba(46,219,255,0.8)]
                animate-pulse hover:scale-110 transition duration-300"
              >
                <div className="absolute inset-0 rounded-full blur-2xl bg-cyan-400 opacity-40 animate-ping" />
                <span className="text-sm font-semibold tracking-wide">
                  ENTER
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full max-w-sm">

                <div
                  className="w-full px-4 py-3 rounded-xl
                  bg-[#020B1A] border border-risen-primary/30
                  shadow-[0_0_40px_rgba(46,219,255,0.3)]"
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

          {/* BOTTOM LEFT */}
          <OrbCard
            title="Learn Crypto"
            onClick={() =>
              openAI("Teach me crypto from beginner to advanced")
            }
          />

          {/* BOTTOM RIGHT */}
          <OrbCard
            title="Create Content"
            onClick={() =>
              openAI("Write a viral tweet about RISEN AI")
            }
          />

        </div>
      </div>
    </div>
  );
}

/* 🔥 CARD */
function OrbCard({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="text-center px-4 py-3 rounded-xl
      border border-risen-primary/20 bg-[#06111f]
      cursor-pointer transition-all duration-300
      hover:border-risen-primary/40 hover:scale-105
      shadow-[0_0_20px_rgba(46,219,255,0.1)]
      text-xs md:text-sm"
    >
      {title}
    </div>
  );
}
