"use client";

import AIChat from "@/components/ai/AIChat";

export default function AIPage() {
  const triggerAI = (message: string) => {
    window.dispatchEvent(
      new CustomEvent("ai-preset", { detail: message })
    );
  };

  return (
    <div className="min-h-screen bg-[#010913] text-white px-6 pt-28 pb-10">
      
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold">RISEN AI</h1>
        <p className="text-gray-400 mt-2">
          Your intelligence layer for Web3 & DeFi
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        
        {/* CHAT */}
        <div className="h-[600px] rounded-2xl border border-risen-primary/20 bg-[#020B1A]/80 p-4">
          <AIChat />
        </div>

        {/* FEATURES */}
        <div className="grid gap-4">

          <FeatureCard
            title="Market Insight"
            onClick={() =>
              triggerAI("Give me a smart money analysis of the current crypto market")
            }
          />

          <FeatureCard
            title="Generate Avatar"
            onClick={() =>
              triggerAI("Generate a futuristic crypto avatar")
            }
          />

          <FeatureCard
            title="Create Content"
            onClick={() =>
              triggerAI("Write a viral tweet about RISEN AI")
            }
          />

          <FeatureCard
            title="RISEN Knowledge"
            onClick={() =>
              triggerAI("Explain RISEN ecosystem clearly")
            }
          />

        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl border border-risen-primary/20 bg-[#06111f]
      hover:bg-[#08182a] transition cursor-pointer
      hover:scale-[1.02]"
    >
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
  );
}