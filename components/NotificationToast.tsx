"use client";

import { useEffect, useState } from "react";

interface Props {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  onClose: () => void;
}

export default function NotificationToast({ message, type = "info", onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    info: "border-risen-primary/30 bg-[#07111d] text-white",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    warning: "border-amber-400/30 bg-amber-400/10 text-amber-400",
    error: "border-red-500/30 bg-red-500/10 text-red-400",
  };

  return (
    <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-3xl border backdrop-blur-3xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-500 flex items-center gap-4 ${colors[type]}`}>
        <div className="h-2 w-2 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]" />
        <span className="text-[10px] font-black uppercase tracking-widest italic">{message}</span>
        <button onClick={onClose} className="ml-4 opacity-40 hover:opacity-100 transition-opacity">✕</button>
    </div>
  );
}
