"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShieldCheck,
  LayoutGrid,
  Zap,
  ChevronRight,
  Sparkles
} from "lucide-react";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { RISEN_BUY_LINK, RISEN_IS_CONTRACT_LIVE } from "@/lib/risenConfig";

const NAV_LINKS = [
  { name: "Structure", href: "/#structure" },
  { name: "Engine", href: "/#capital" },
  { name: "Trust", href: "/#trust" },
  { name: "Utility", href: "/#utility" },
  { name: "Roadmap", href: "/roadmap" },
];

export default function PremiumNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show on App pages (Guardian, Bridge, etc.) which have their own nav
  const isAppPage = pathname.startsWith("/guardian") ||
                    pathname.startsWith("/bridge") ||
                    pathname.startsWith("/sweeper") ||
                    pathname.startsWith("/rush") ||
                    pathname.startsWith("/ai") ||
                    pathname.startsWith("/atlas") ||
                    pathname.startsWith("/admin");

  if (isAppPage) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? "py-3" : "py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-[24px] transition-all duration-500 border ${
          isScrolled
            ? "bg-[#020B1A]/80 border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-transparent"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-risen-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image src="/logo.png" alt="RISEN" width={36} height={36} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-white">
              RISEN
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-5 right-5 h-px bg-risen-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/store"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-risen-primary/40 hover:bg-risen-primary/10 transition-all group"
            >
              <LayoutGrid size={14} className="text-risen-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">{isScrolled ? "Store" : "App Store"}</span>
            </Link>

            {RISEN_IS_CONTRACT_LIVE && (
                <a
                    href={RISEN_BUY_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group px-8 py-2.5 rounded-xl bg-risen-primary text-white font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(46,219,255,0.3)] hover:shadow-[0_0_50px_rgba(46,219,255,0.6)] hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-fast" />
                    <span className="relative z-10 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        Buy $RSN
                    </span>
                </a>
            )}

            <div className="hidden md:block h-10 w-px bg-white/10 mx-2" />

            <div className="hidden md:block">
                <LanguageSwitcher />
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mx-6 mt-4 p-8 rounded-[32px] bg-[#04101a] border border-white/10 backdrop-blur-3xl shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-black uppercase italic text-white/60 hover:text-risen-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/5" />
              <div className="grid grid-cols-2 gap-4">
                 <Link
                  href="/store"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/5"
                 >
                    <LayoutGrid className="text-risen-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">App Store</span>
                 </Link>
                 <Link
                  href="/guardian"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/5"
                 >
                    <ShieldCheck className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Guardian</span>
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
