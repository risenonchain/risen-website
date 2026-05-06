"use client";

import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
  onUpload: (file: File) => void;
};

export default function AIInput({ onSend, onUpload }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* 📎 Upload Node */}
      <label className="shrink-0 h-12 w-12 cursor-pointer rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 group">
        <span className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all">📎</span>
        <input type="file" hidden onChange={handleFile} />
      </label>

      {/* Cognitive Input */}
      <div className="flex-1 relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Initialize cognitive query..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="w-full h-12 px-5 rounded-2xl bg-[#07111d] text-white text-xs font-black uppercase tracking-widest border border-white/5 outline-none transition-all focus:border-risen-primary/40 focus:bg-[#0a1829] shadow-inner"
          />
          <div className="absolute inset-0 rounded-2xl border border-risen-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-sm" />
      </div>

      {/* Execute Pulse */}
      <button
        onClick={handleSend}
        className="h-12 px-6 rounded-2xl bg-risen-primary text-black font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
      >
        Execute
        <span className="text-base leading-none">⚡</span>
      </button>
    </div>
  );
}
