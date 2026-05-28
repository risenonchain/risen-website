"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../public/logo.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LiveDateTime from "@/components/LiveDateTime";
import { useLanguage } from "@/context/LanguageContext";
import { RISEN_BUY_LINK, RISEN_IS_CONTRACT_LIVE } from "@/lib/risenConfig";

const sectionIds = ["home", "structure", "engine", "trust", "utility"] as const;

export default function Navbar() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const sections = useMemo(
    () => [
      { id: "home", label: t("nav.home") },
      { id: "structure", label: t("nav.structure") },
      { id: "engine", label: t("nav.engine") },
      { id: "trust", label: t("nav.trust") },
      { id: "utility", label: t("nav.utility") },
    ],
    [t]
  );

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(sectionId);
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
  }, [pathname]);

  const scrollTo = (id: string) => {
    if (pathname !== "/") {
      setMenuOpen(false);
      router.push(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    const offset = 92;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled
          ? "py-3 bg-[#010913]/80 backdrop-blur-2xl border-b border-risen-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
          : "py-6 bg-transparent"
      }`}
    >
      {/* Premium Animated Border */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-risen-primary/50 to-transparent animate-shimmer" />
      )}
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-risen-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src={logo}
              alt="RISEN"
              className={`relative transition-all duration-500 ${
                scrolled ? "w-9 h-9" : "w-12 h-12"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-[0.2em] text-lg uppercase italic leading-none">RISEN</span>
            <span className="text-[8px] font-black text-risen-primary uppercase tracking-[0.4em] mt-1 opacity-60">Neural Network</span>
          </div>
        </div>

        {/* Center Nav */}
        <div className="hidden lg:flex items-center gap-2 p-1.5 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-3xl shadow-inner">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 relative overflow-hidden group ${
                  active === s.id ? "text-white bg-white/10" : "text-white/40 hover:text-white"
                }`}
              >
                <span className="relative z-10">{s.label}</span>
                {active === s.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-risen-primary shadow-[0_0_10px_rgba(46,219,255,1)]" />
                )}
                <div className="absolute inset-0 bg-risen-primary/5 translate-y-full group-hover:translate-y-0 transition-transform" />
              </button>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
            <a
                href="/store"
                className="group relative px-6 py-3 rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:border-risen-primary/40 shadow-lg"
            >
                <div className="absolute inset-0 bg-risen-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-risen-primary shadow-[0_0_10px_rgba(46,219,255,1)] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">App Store</span>
                </div>
            </a>

            {RISEN_IS_CONTRACT_LIVE && (
                <a
                    href={RISEN_BUY_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 rounded-2xl bg-risen-primary text-white font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(46,219,255,0.3)] hover:shadow-[0_0_50px_rgba(46,219,255,0.6)] hover:scale-105 active:scale-95 transition-all relative overflow-hidden group/buy"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/buy:animate-shimmer-fast" />
                    <span className="relative z-10">Buy $RSN</span>
                </a>
            )}

            <div className="h-10 w-px bg-white/10 mx-2" />

            <LanguageSwitcher />
        </div>

        {/* Mobile Toggle */}
        <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90"
        >
            <div className={`h-0.5 w-5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`h-0.5 w-5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <div className={`h-0.5 w-5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-[#010913]/95 backdrop-blur-3xl border-b border-white/5 transition-all duration-500 overflow-hidden ${menuOpen ? "max-h-[90vh] opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.8)]" : "max-h-0 opacity-0"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,219,255,0.1),transparent_40%)] pointer-events-none" />
        <div className="relative p-8 space-y-4">
            {sections.map((s) => (
                <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className="w-full py-4 text-left text-2xl font-black uppercase italic tracking-tighter text-white/40 hover:text-risen-primary transition-colors border-b border-white/5"
                >
                    {s.label}
                </button>
            ))}
            <div className="pt-6 grid grid-cols-2 gap-4">
                <a href="/store" className="py-4 rounded-2xl bg-white/5 border border-white/10 text-center text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95">Store</a>
                <a href="/rush" className="py-4 rounded-2xl bg-risen-primary text-center text-[10px] font-black uppercase tracking-widest text-black shadow-lg transition-all active:scale-95">Play Rush</a>
            </div>
            <div className="pt-6 flex justify-between items-center">
                <LiveDateTime />
                <div className="scale-90 origin-right">
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
