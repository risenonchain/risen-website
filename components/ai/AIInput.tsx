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
    <div className="mt-3 flex gap-2 items-center">

      {/* 📎 Upload */}
      <label className="cursor-pointer px-3 py-2 rounded-xl bg-[#06111f] border border-risen-primary/20 text-xs">
        📎
        <input type="file" hidden onChange={handleFile} />
      </label>

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask RISEN AI..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
        className="flex-1 px-4 py-3 rounded-xl bg-[#020B1A] text-white text-sm
        border border-risen-primary/20 outline-none"
      />

      {/* Send */}
      <button
        onClick={handleSend}
        className="px-4 py-3 rounded-xl bg-risen-primary text-white text-sm"
      >
        Send
      </button>
    </div>
  );
}
