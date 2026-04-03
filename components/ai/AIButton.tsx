"use client";

import { useEffect, useState } from "react";

export default function AIButton() {
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (trigger) {
      window.dispatchEvent(new Event("open-ai"));
      setTrigger(false); // prevent repeated firing
    }
  }, [trigger]);

  return (
    <button
      onClick={() => setTrigger(true)}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* glow */}
      <div className="absolute inset-0 rounded-full bg-risen-primary blur-xl opacity-60 group-hover:opacity-90 transition" />

      {/* core */}
      <div
        className="relative w-14 h-14 rounded-full 
        bg-gradient-to-br from-risen-primary to-cyan-400
        flex items-center justify-center
        text-white font-bold shadow-[0_0_30px_rgba(46,219,255,0.6)]
        animate-pulse"
      >
        AI
      </div>
    </button>
  );
}