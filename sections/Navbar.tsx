"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import WalletModal from "./WalletModal";
import logo from "../public/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              className={`transition-all duration-500 ${
                scrolled ? "w-10" : "w-14"
              }`}
              priority
            />
            <span className="text-white font-semibold tracking-wide hidden sm:block">
              RISEN
            </span>
          </div>

          {/* Glowing Nav Capsule */}
          <div className="hidden md:flex items-center gap-8 px-6 py-2 rounded-full bg-risen-navy/60 backdrop-blur-md border border-risen-primary/20 shadow-[0_0_25px_rgba(46,219,255,0.08)]">

            <a href="#structure" className="text-sm text-gray-300 hover:text-white transition">
              Structure
            </a>

            <a href="#engine" className="text-sm text-gray-300 hover:text-white transition">
              Engine
            </a>

            <a href="#trust" className="text-sm text-gray-300 hover:text-white transition">
              Trust
            </a>

            <a href="#utility" className="text-sm text-gray-300 hover:text-white transition">
              Utility
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

      {/* Wallet Modal Mount */}
      <WalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
      />
    </>
  );
}