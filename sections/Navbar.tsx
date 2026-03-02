"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import WalletModal from "./WalletModal";
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
  const [walletOpen, setWalletOpen] = useState(false);
  const [active, setActive] = useState<string>("home"); // default helps initial highlight

  // Scroll background effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section observer
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  const navItemClass = (id?: string) =>
    `relative text-sm font-semibold transition-all duration-300 pb-1 ${
      id && active === id
        ? "text-white [text-shadow:0_0_10px_rgba(46,219,255,0.9),0_0_20px_rgba(46,219,255,0.55)]"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#010913]/80 backdrop-blur-md border-b border-risen-primary/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="RISEN Logo"
              className={`transition-all duration-500 ${scrolled ? "w-10" : "w-14"}`}
              priority
            />
            <span className="text-white font-semibold tracking-wide hidden sm:block">
              RISEN
            </span>
          </div>

          {/* Glowing Nav Capsule */}
          <div className="hidden md:flex items-center gap-8 px-6 py-2 rounded-full bg-[#020B1A]/80 backdrop-blur-md border border-risen-primary/20 shadow-[0_0_25px_rgba(46,219,255,0.08)]">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className={navItemClass(s.id)}
              >
                {s.label}

                {/* Visible underline INSIDE the button (no negative offsets) */}
                {active === s.id && (
                  <span
                    className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-[#2EDBFF]
                               shadow-[0_0_12px_rgba(46,219,255,0.85),0_0_24px_rgba(46,219,255,0.45)]"
                  />
                )}
              </button>
            ))}

            <a href="/litepaper" className="text-sm font-semibold text-gray-400 hover:text-white transition">
              Litepaper
            </a>
          </div>

          {/* Connect Wallet Button */}
          <button
            onClick={() => setWalletOpen(true)}
            className="relative px-6 py-2 rounded-full font-semibold text-white bg-risen-primary transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(46,219,255,0.4)] overflow-hidden"
          >
            Connect Wallet
          </button>
        </div>
      </div>

      <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} />
    </>
  );
}