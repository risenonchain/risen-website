"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import logo from "../public/logo.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LiveDateTime from "@/components/LiveDateTime";
import { useLanguage } from "@/context/LanguageContext";
import { RISEN_BUY_LINK, RISEN_IS_CONTRACT_LIVE } from "@/lib/risenConfig";

const sectionIds = ["home", "structure", "engine", "trust", "utility"] as const;

export default function Navbar() {
  const { t } = useLanguage();

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
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 92;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
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

  const rushLinkClass =
    "inline-flex items-center gap-2 rounded-full border border-risen-primary/35 " +
    "bg-[linear-gradient(180deg,rgba(46,219,255,0.16),rgba(46,219,255,0.05))] " +
    "px-4 py-2 text-sm font-semibold text-white transition-all duration-300 " +
    "shadow-[0_0_20px_rgba(46,219,255,0.22),inset_0_0_18px_rgba(46,219,255,0.05)] " +
    "hover:border-risen-primary/60 hover:shadow-[0_0_30px_rgba(46,219,255,0.35),inset_0_0_24px_rgba(46,219,255,0.10)] hover:-translate-y-[1px]";

  const rushDot =
    "inline-block w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95),0_0_22px_rgba(46,219,255,0.55)] animate-pulse";

  const buyLinkClass =
    "inline-flex items-center gap-2 rounded-full bg-risen-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-300 " +
    "shadow-[0_0_22px_rgba(46,219,255,0.28)] hover:shadow-[0_0_30px_rgba(46,219,255,0.36)] hover:-translate-y-[1px]";

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

          <div className="hidden lg:flex items-center gap-4 px-5 py-2 rounded-full bg-[#020B1A]/80 backdrop-blur-md border border-risen-primary/20 shadow-[0_0_25px_rgba(46,219,255,0.08)]">
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

            <a href="/rush" className={rushLinkClass}>
              <span className={rushDot} />
              {t("nav.rush")}
            </a>

            <a
              href="/litepaper"
              className="text-sm font-semibold text-gray-400 hover:text-white transition"
            >
              {t("nav.litepaper")}
            </a>

            <LanguageSwitcher />
          </div>

          <div
            className={`hidden md:flex items-center gap-4 px-4 py-2 ${pillBase} shrink-0`}
          >
            <LiveDateTime />

            {RISEN_IS_CONTRACT_LIVE && (
              <a
                href={RISEN_BUY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={buyLinkClass}
              >
                Buy $RSN
              </a>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2 shrink-0">
            <a
              href="/rush"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-risen-primary/30 bg-[#06111f]/85 text-white text-[11px] font-semibold tracking-wide shadow-[0_0_18px_rgba(46,219,255,0.22)]"
            >
              <span className={rushDot} />
              Rush
            </a>

            {RISEN_IS_CONTRACT_LIVE && (
              <a
                href={RISEN_BUY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 rounded-2xl bg-risen-primary text-white text-[11px] font-semibold tracking-wide shadow-[0_0_18px_rgba(46,219,255,0.22)]"
              >
                Buy
              </a>
            )}

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

        <div className="hidden md:flex lg:hidden mt-3 justify-center">
          <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-[#020B1A]/80 backdrop-blur-md border border-risen-primary/20 shadow-[0_0_25px_rgba(46,219,255,0.08)]">
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

            <a href="/rush" className={rushLinkClass}>
              <span className={rushDot} />
              {t("nav.rush")}
            </a>

            <a
              href="/litepaper"
              className="text-sm font-semibold text-gray-400 hover:text-white transition"
            >
              {t("nav.litepaper")}
            </a>

            <LanguageSwitcher />
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-risen-primary/20 bg-[#06111f]/92 backdrop-blur-xl shadow-[0_0_30px_rgba(46,219,255,0.10)] p-3">
            <div className="mb-3">
              <LanguageSwitcher className="w-full" />
            </div>

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

              <a href="/rush" className={mobileLinkClass}>
                {t("nav.rush")}
              </a>

              <a href="/litepaper" className={mobileLinkClass}>
                {t("nav.litepaper")}
              </a>

              {RISEN_IS_CONTRACT_LIVE && (
                <a
                  href={RISEN_BUY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={mobileLinkClass}
                >
                  Buy $RSN
                </a>
              )}
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Live
              </div>
              <div className="mt-1 text-sm font-semibold text-white">
                UTC+1
              </div>
              <div className="mt-3">
                <LiveDateTime />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}