"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import logo from "../public/logo.png";

const sections = [
  { id: "home", label: "Home" },
  { id: "structure", label: "Structure" },
  { id: "engine", label: "Engine" },
  { id: "trust", label: "Trust" },
  { id: "utility", label: "Utility" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const launchDate = useMemo(
    () => new Date("2026-03-21T00:00:00Z").getTime(),
    []
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(section.id);
        },
        {
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0.08,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    setMenuOpen(false);
  };

  const navItemClass = (id?: string) =>
    `relative text-sm font-semibold transition-all duration-300 pb-1 ${
      id && active === id
        ? "text-white [text-shadow:0_0_10px_rgba(46,219,255,0.9),0_0_20px_rgba(46,219,255,0.55)]"
        : "text-gray-400 hover:text-white"
    }`;

  const mobileLinkClass =
    "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-white/85 hover:text-white hover:bg-white/5 transition";

  const pillBase =
    "rounded-2xl border border-risen-primary/20 bg-[#06111f]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(46,219,255,0.10)]";

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#010913]/72 backdrop-blur-md border-b border-risen-primary/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <Image
              src={logo}
              alt="RISEN Logo"
              className={`transition-all duration-500 ${
                scrolled ? "w-9" : "w-11 sm:w-12"
              }`}
              priority
            />
            <span className="text-white font-semibold tracking-wide text-sm sm:text-base">
              RISEN
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8 px-6 py-2 rounded-full bg-[#020B1A]/80 backdrop-blur-md border border-risen-primary/20 shadow-[0_0_25px_rgba(46,219,255,0.08)]">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className={navItemClass(s.id)}
              >
                {s.label}
                {active === s.id && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-[#2EDBFF]
                    shadow-[0_0_12px_rgba(46,219,255,0.85),0_0_24px_rgba(46,219,255,0.45)]"
                  />
                )}
              </button>
            ))}

            <a
              href="/litepaper"
              className="text-sm font-semibold text-gray-400 hover:text-white transition"
            >
              Litepaper
            </a>
          </div>

          {/* Desktop launch pill */}
          <div
            className={`hidden md:flex items-center gap-4 px-4 py-2 ${pillBase} shrink-0`}
          >
            <div className="flex items-center gap-2 pr-3 border-r border-white/10">
              <span className="inline-block w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
              <div className="leading-tight">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Launch
                </div>
                <div className="text-sm font-semibold text-white">
                  Mar 21, 2026
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {[
                { value: days, label: "D" },
                { value: hours, label: "H" },
                { value: minutes, label: "M" },
                { value: seconds, label: "S" },
              ].map((item) => (
                <div key={item.label} className="text-center min-w-[32px]">
                  <div className="text-sm font-bold text-white tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-white/45 uppercase">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <div className={`px-3 py-2 ${pillBase}`}>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
                <span className="text-[11px] font-semibold text-white tabular-nums">
                  {days}d {hours}h
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`inline-flex items-center justify-center w-11 h-11 ${pillBase}`}
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 w-5 bg-white transition ${
                    menuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-white transition ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-white transition ${
                    menuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Tablet nav row */}
        <div className="hidden md:flex lg:hidden mt-3 justify-center">
          <div className="flex items-center gap-6 px-5 py-2 rounded-full bg-[#020B1A]/80 backdrop-blur-md border border-risen-primary/20 shadow-[0_0_25px_rgba(46,219,255,0.08)]">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className={navItemClass(s.id)}
              >
                {s.label}
                {active === s.id && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-[#2EDBFF]
                    shadow-[0_0_12px_rgba(46,219,255,0.85),0_0_24px_rgba(46,219,255,0.45)]"
                  />
                )}
              </button>
            ))}

            <a
              href="/litepaper"
              className="text-sm font-semibold text-gray-400 hover:text-white transition"
            >
              Litepaper
            </a>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-risen-primary/20 bg-[#06111f]/92 backdrop-blur-xl shadow-[0_0_30px_rgba(46,219,255,0.10)] p-3">
            <div className="grid gap-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={mobileLinkClass}
                >
                  {s.label}
                </button>
              ))}

              <a href="/litepaper" className={mobileLinkClass}>
                Litepaper
              </a>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Launch
              </div>
              <div className="mt-1 text-sm font-semibold text-white">
                Mar 21, 2026
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                {[
                  { value: days, label: "Days" },
                  { value: hours, label: "Hours" },
                  { value: minutes, label: "Min" },
                  { value: seconds, label: "Sec" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-white/5 border border-white/10 py-2">
                    <div className="text-sm font-bold text-white tabular-nums">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-white/45 uppercase">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}