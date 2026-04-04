"use client";

export default function AIPage() {
  const triggerAI = (message: string) => {
    window.dispatchEvent(
      new CustomEvent("ai-preset", { detail: message })
    );

    window.dispatchEvent(new Event("open-ai"));
  };

  return (
    <div className="min-h-screen bg-[#010913] text-white px-6 pt-28 pb-10 relative overflow-hidden">

      {/* 🔥 Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(0,120,255,0.08),transparent_40%)]" />

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12 relative z-10">
        <h1 className="text-3xl font-bold tracking-tight">
          RISEN AI
        </h1>
        <p className="text-gray-400 mt-2">
          Intelligence Layer for Web3 & DeFi
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 relative z-10">

        <FeatureCard
          title="Market Insight"
          description="Analyze crypto market like smart money"
          onClick={() =>
            triggerAI("Give me a smart money analysis of the current crypto market")
          }
        />

        <FeatureCard
          title="Generate Avatar"
          description="Create futuristic crypto identity"
          onClick={() =>
            triggerAI("Generate a futuristic crypto avatar")
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
          title="RISEN Knowledge"
          description="Understand the ecosystem deeply"
          onClick={() =>
            triggerAI("Explain RISEN ecosystem clearly")
          }
        />

        <FeatureCard
          title="Learn Crypto"
          description="Structured learning from basics to advanced"
          onClick={() =>
            triggerAI("Teach me crypto from beginner to advanced in a structured way")
          }
        />

        <FeatureCard
          title="Meme Generator"
          description="Create crypto memes with edge"
          onClick={() =>
            triggerAI("Generate a crypto meme idea about the current market")
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
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="
        group relative p-5 rounded-2xl cursor-pointer
        border border-white/10
        bg-[#06111f]/70 backdrop-blur-md

        transition-all duration-300
        hover:scale-[1.03]
        hover:border-cyan-400/40
      "
    >
      {/* Glow effect */}
      <div className="
        absolute inset-0 rounded-2xl opacity-0
        group-hover:opacity-100
        transition duration-500
        bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent
      " />

      {/* Animated border glow */}
      <div className="
        absolute inset-0 rounded-2xl
        opacity-0 group-hover:opacity-100
        blur-xl
        bg-cyan-500/10
      " />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-semibold tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
