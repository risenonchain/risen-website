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
      <label className="shrink-0 h-14 w-14 cursor-pointer rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg transition-all hover:bg-white/10 hover:border-white/20 active:scale-90 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="opacity-30 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 relative z-10">📎</span>
        <input type="file" hidden onChange={handleFile} />
      </label>

      {/* Cognitive Input */}
      <div className="flex-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-risen-primary/30 via-purple-500/30 to-risen-primary/30 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-all duration-1000 animate-pulse" />
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
            className="relative w-full h-14 px-6 rounded-2xl bg-[#07111d] text-white text-[11px] font-black uppercase tracking-[0.2em] border border-white/5 outline-none transition-all focus:border-risen-primary/50 focus:bg-[#081628] shadow-2xl placeholder:text-white/10 italic"
          />
          {/* Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-risen-primary/20 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700" />
      </div>

      {/* Execute Pulse */}
      <button
        onClick={handleSend}
        className="h-14 px-8 rounded-2xl bg-risen-primary text-black font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_0_30px_rgba(46,219,255,0.3)] hover:shadow-[0_0_40px_rgba(46,219,255,0.5)] hover:scale-[1.02] active:scale-90 transition-all flex items-center gap-3 italic overflow-hidden relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <span className="relative z-10">Execute</span>
        <span className="text-sm leading-none relative z-10">⚡</span>
      </button>
    </div>
  );
}
