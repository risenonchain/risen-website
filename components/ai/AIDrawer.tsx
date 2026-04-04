"use client";

import { useEffect, useState } from "react";
import AIChat from "./AIChat";

export default function AIDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-ai", openHandler);

    return () => {
      window.removeEventListener("open-ai", openHandler);
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px]
        bg-[#02070d] border-l border-white/10
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="text-sm font-semibold text-white">
            RISEN AI
          </div>

          <button
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* Chat */}
        <div className="h-[calc(100%-60px)] p-3">
          <AIChat />
        </div>
      </div>
    </>
  );
}
