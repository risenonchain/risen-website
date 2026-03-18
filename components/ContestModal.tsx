"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "risen_contest_modal_hidden_until";

export default function ContestModal() {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const hiddenUntil = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (hiddenUntil && Number(hiddenUntil) > now) return;

    const showTimer = setTimeout(() => {
      setOpen(true);
      setSecondsLeft(10);
    }, 1800);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!open || paused) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          closeFor24Hours();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, paused]);

  const closeFor24Hours = () => {
    const next = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, String(next));
    setOpen(false);
    setPaused(false);
    setSecondsLeft(10);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#010913]/72 backdrop-blur-md px-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-risen-primary/20 bg-[#06111f]/92 shadow-[0_0_60px_rgba(46,219,255,0.15)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-risen-primary/12 blur-[90px] rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,219,255,0.08)_0%,rgba(6,17,31,0)_60%)]" />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-risen-primary/20 bg-risen-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-risen-primary">
                Campaign Alert
              </div>

              <h2 className="mt-4 text-2xl sm:text-4xl font-bold tracking-tight text-white">
                $700 RISEN Thread Contest
              </h2>

              <p className="mt-3 text-white/70 leading-relaxed max-w-xl">
                Three weeks of narrative building before launch. Strongest RISEN
                threads get rewarded, recognized, and pushed into the spotlight.
              </p>
            </div>

            <button
              type="button"
              onClick={closeFor24Hours}
              className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/75 hover:text-white hover:bg-white/10 transition"
              aria-label="Close contest modal"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Rewards Pool
              </p>
              <p className="mt-2 text-lg font-semibold text-white">$700 Total</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Contest Ends
              </p>
              <p className="mt-2 text-lg font-semibold text-white">April 5</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Winners
              </p>
              <p className="mt-2 text-lg font-semibold text-white">April 10</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Auto close
              </p>
              <p className="text-sm font-semibold text-risen-primary">
                {secondsLeft}s
              </p>
            </div>

            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-risen-primary transition-all duration-1000"
                style={{ width: `${(secondsLeft / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://x.com/i/status/2033199061076005114"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-risen-primary px-5 py-3 font-semibold text-white shadow-[0_0_35px_rgba(46,219,255,0.35)] hover:shadow-[0_0_45px_rgba(46,219,255,0.5)] transition-all duration-300"
            >
              View Contest
              <span>↗</span>
            </a>

            <button
              type="button"
              onClick={() => setPaused((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/85 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              {paused ? "Resume Timer" : "Pause Timer"}
            </button>

            <button
              type="button"
              onClick={closeFor24Hours}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/85 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}