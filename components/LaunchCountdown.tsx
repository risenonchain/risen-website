"use client";

import { useEffect, useMemo, useState } from "react";

export default function LaunchCountdown() {
  const launchDate = useMemo(
    () => new Date("2026-03-21T00:00:00Z").getTime(),
    []
  );

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      setTimeLeft(Math.max(0, launchDate - Date.now()));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [launchDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="flex flex-wrap gap-4 text-center text-white">
      {[
        { value: days, label: "Days" },
        { value: hours, label: "Hours" },
        { value: minutes, label: "Minutes" },
        { value: seconds, label: "Seconds" },
      ].map((item) => (
        <div key={item.label} className="min-w-[52px]">
          <p className="text-2xl font-bold tabular-nums">
            {String(item.value).padStart(2, "0")}
          </p>
          <p className="text-xs text-white/60">{item.label}</p>
        </div>
      ))}
    </div>
  );
}