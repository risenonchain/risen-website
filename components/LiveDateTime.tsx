"use client";

import { useEffect, useState } from "react";

export default function LiveDateTime() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-NG", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Lagos",
    });

    const updateTime = () => {
      const formatted = formatter.format(new Date()).replace(",", " ·");
      setNow(`${formatted} WAT`);
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000 * 30);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 pr-3 border-r border-white/10">
      <span className="inline-block w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)] animate-pulse" />
      <div className="leading-tight">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">
          Live
        </div>
        <div className="text-sm font-semibold text-white tabular-nums">
          {now || "Loading..."}
        </div>
      </div>
    </div>
  );
}