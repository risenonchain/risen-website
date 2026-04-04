"use client";

export default function AIButton() {
  const handleClick = () => {
    // 👉 Navigate to AI page instead of opening drawer
    window.location.href = "/ai";
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* 🔥 glow */}
      <div className="absolute inset-0 rounded-full bg-risen-primary blur-xl opacity-60 group-hover:opacity-90 transition duration-300" />

      {/* 🔥 core */}
      <div
        className="relative w-14 h-14 rounded-full 
        bg-gradient-to-br from-risen-primary to-cyan-400
        flex items-center justify-center
        text-white font-bold shadow-[0_0_30px_rgba(46,219,255,0.6)]
        transition duration-300
        group-hover:scale-110
      "
      >
        AI
      </div>
    </button>
  );
}
