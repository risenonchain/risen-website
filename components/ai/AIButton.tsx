"use client";

import { useState } from "react";

export default function AIButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 
        w-14 h-14 rounded-full bg-risen-primary 
        text-white font-bold shadow-lg"
      >
        AI
      </button>

      {/* simple global event */}
      {open && window.dispatchEvent(new Event("open-ai"))}
    </>
  );
}