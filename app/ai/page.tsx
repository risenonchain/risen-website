"use client";

import AIChat from "@/components/ai/AIChat";

export default function AIPage() {
  const triggerAI = (message?: string) => {
    if (message) {
      window.dispatchEvent(
        new CustomEvent("ai-preset", { detail: message })
      );
    }

    window.dispatchEvent(new Event("open-ai"));
  };

  return (
    <div className="min-h-screen bg-[#010913] text-white px-6 pt-28 pb-16">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          RISEN AI
        </h1>
        <p className="text-gray-400 mt-3 text-sm">
          Intelligence Layer for Web3 & DeFi
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">

        {/* 🔥 PRIMARY — OPEN ENTRY */}
        <FeatureCard
          title="Enter Intelligence"
          description="Engage RISEN directly — ask anything, explore freely"
          highlight
          onClick={() => triggerAI()}
        />

        <FeatureCard
          title="Market Insight"
          description="Analyze crypto market like smart money"
          onClick={() =>
            triggerAI("Give me a smart money analysis of the current crypto market")
          }
        />

        {/* 🔵 TOOLS */}
        <FeatureCard
          title="Generate Avatar"
          description="Create futuristic crypto identity"
          onClick={() =>
            triggerAI("Generate a futuristic crypto avatar and return the image only")
          }
        />

        <FeatureCard
          title="Create Content"
          description="Generate viral Web3 posts"
          onClick={() =>
            triggerAI("Write a viral tweet about RISEN AI")
          }
        />

        <FeatureCard
          title="Meme Generator"
          description="Create crypto memes with edge"
          onClick={() =>
            triggerAI("Generate a sharp crypto meme idea about the current market")
          }
        />

        {/* 🟣 LEARNING */}
        <FeatureCard
          title="Learn Crypto"
          description="Structured learning from basics to advanced"
          onClick={() =>
            triggerAI("Teach me crypto from beginner to advanced in a structured way")
          }
        />

        <FeatureCard
          title="RISEN Knowledge"
          description="Understand the ecosystem deeply"
          onClick={() =>
            triggerAI("Explain RISEN ecosystem clearly and structurally")
          }
        />

      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  onClick,
  highlight = false,
}: {
  title: string;
  description: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl border cursor-pointer
      transition-all duration-300 group overflow-hidden

      ${
        highlight
          ? "border-risen-primary/40 bg-[#06111f]"
          : "border-risen-primary/20 bg-[#06111f]"
      }

      hover:bg-[#08182a]
      hover:scale-[1.02]
      `}
    >
      {/* 🔥 BREATHING GLOW */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500
        ${
          highlight
            ? "bg-risen-primary/10 blur-xl"
            : "bg-cyan-400/5 blur-xl"
        }`}
      />

      {/* CONTENT */}
      <div className="relative z-10">
        <h3
          className={`text-sm font-semibold mb-1
          ${highlight ? "text-risen-primary" : "text-white"}`}
        >
          {title}
        </h3>

        <p className="text-xs text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* 🔥 EDGE LIGHT */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-risen-primary/30 transition" />
    </div>
  );
}
