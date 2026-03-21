"use client";

import { useMemo, useState } from "react";
import FAQ from "../sections/FAQ";
import Footer from "../sections/Footer";
import FinalCTA from "../sections/FinalCTA";
import UtilityLayer from "../sections/UtilityLayer";
import TrustLayer from "../sections/TrustLayer";
import CapitalEngine from "../sections/CapitalEngine";
import Structure from "../sections/Structure";
import ContestModal from "../components/ContestModal";
import Image from "next/image";
import logo from "../public/logo.png";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  /**
   * TOMORROW:
   * Replace "" with the real contract address.
   */
  const contractAddress = "";

  const isContractLive = contractAddress.trim().startsWith("0x");

  const chip =
    "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm " +
    "bg-white/5 border border-white/10 backdrop-blur-md text-white/85 " +
    "hover:text-white hover:border-risen-primary/30 hover:bg-white/10 transition";

  const microCard =
    "relative rounded-2xl p-4 sm:p-5 bg-white/5 border border-white/10 backdrop-blur-md " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03)] " +
    "hover:border-risen-primary/25 hover:bg-white/10 transition-all duration-300";

  const socialBtn =
    "inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 " +
    "hover:border-risen-primary/40 hover:bg-white/10 backdrop-blur-md transition-all duration-300";

  const socialIconWrap =
    "inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 " +
    "text-risen-primary shadow-[0_0_18px_rgba(46,219,255,0.14)]";

  const botBtn =
    "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-risen-primary text-white " +
    "shadow-[0_0_30px_rgba(46,219,255,0.45)] hover:shadow-[0_0_40px_rgba(46,219,255,0.55)] transition-all duration-300";

  const rsnParticles = [
    { left: "16%", top: "62%", delay: "0s", dur: "5.2s", size: "text-[10px]" },
    { left: "26%", top: "78%", delay: "0.8s", dur: "5.8s", size: "text-[11px]" },
    { left: "38%", top: "58%", delay: "1.4s", dur: "5.0s", size: "text-[10px]" },
    { left: "60%", top: "66%", delay: "2.1s", dur: "5.9s", size: "text-[12px]" },
    { left: "72%", top: "76%", delay: "2.7s", dur: "5.4s", size: "text-[10px]" },
    { left: "84%", top: "60%", delay: "3.1s", dur: "6.2s", size: "text-[11px]" },
    { left: "50%", top: "86%", delay: "3.6s", dur: "6.0s", size: "text-[10px]" }
  ] as const;

  const tickerItems = useMemo(
    () =>
      [
        t("ticker.item1"),
        t("ticker.item2"),
        t("ticker.item3"),
        t("ticker.item4"),
        t("ticker.item5"),
        t("ticker.item6"),
        t("ticker.item7"),
        t("ticker.item8"),
        t("ticker.item9"),
        t("ticker.item10"),
        t("ticker.item11"),
        t("ticker.item12"),
        t("ticker.item13"),
        t("ticker.item14"),
      ].sort(() => Math.random() - 0.5),
    [t]
  );

  const displayedAddress = isContractLive
    ? contractAddress
    : t("ca.placeholder");

  const handleCopy = async () => {
    if (!isContractLive) return;

    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <ContestModal />

      <main className="relative min-h-screen text-white overflow-hidden pb-16">
        <div className="absolute inset-0 -z-30">
          <Image
            src="/bg.png"
            alt="RISEN Background"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#020B1A]/70 via-[#020B1A]/60 to-[#020B1A]/85" />

        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-[0.06] bg-[url('/noise.png')] bg-repeat"
          aria-hidden="true"
        />

        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="star" style={{ top: "20%", left: "30%" }}></div>
          <div className="star" style={{ top: "40%", left: "70%" }}></div>
          <div className="star" style={{ top: "60%", left: "50%" }}></div>
          <div className="star" style={{ top: "80%", left: "20%" }}></div>
        </div>

        <div className="wind-layer"></div>
        <div className="shimmer-layer"></div>

        <section id="home" className="relative">
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-risen-primary/10 blur-[140px] rounded-full" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,219,255,0.08)_0%,rgba(2,11,26,0)_55%)]" />
          </div>

          <div className="relative max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-24 pb-12 md:pb-18">
            <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-10 items-center">
              <div className="relative z-10 md:-ml-4 lg:-ml-8">
                <h1 className="font-extrabold tracking-tight leading-[0.96]">
                  <span className="block text-[2.9rem] sm:text-6xl md:text-7xl lg:text-[4.8rem]">
                    {t("home.heroTitleLine1")}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                      {t("home.heroTitleLine1Accent")}
                    </span>
                  </span>
                  <span className="block mt-1 sm:mt-2 text-[2.9rem] sm:text-6xl md:text-7xl lg:text-[4.8rem]">
                    <span className="text-risen-primary drop-shadow-[0_0_28px_rgba(46,219,255,0.45)]">
                      {t("home.heroTitleLine2")}
                    </span>
                  </span>
                </h1>

                <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
                  {t("home.heroSubtitle")}
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <a href="/roadmap" className={chip}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-risen-primary shadow-[0_0_10px_rgba(46,219,255,0.9)]" />
                    {t("home.chipRoadmap")} <span className="opacity-70">↗</span>
                  </a>

                  <span className={chip}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/50" />
                    {t("home.chipVision")}
                  </span>

                  <span className={chip}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/50" />
                    {t("home.chipValues")}
                  </span>

                  <a href="/litepaper" className={chip}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/50" />
                    {t("home.chipLitepaper")} <span className="opacity-70">↗</span>
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="https://t.me/Risencommunity1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialBtn}
                  >
                    <span className={socialIconWrap}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M21.426 2.574a1.457 1.457 0 0 0-1.487-.248L2.61 9.14a1.45 1.45 0 0 0 .084 2.71l4.32 1.43 1.67 5.356a1.451 1.451 0 0 0 2.53.483l2.41-2.93 4.727 3.466a1.452 1.452 0 0 0 2.282-.886L21.98 4.01a1.45 1.45 0 0 0-.553-1.436ZM8.2 12.65l8.628-5.445-6.95 6.868-.269 2.887L8.2 12.65Z" />
                      </svg>
                    </span>
                    <span className="font-medium text-white">{t("home.telegram")}</span>
                  </a>

                  <a
                    href="https://x.com/risenonchain?s=11"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialBtn}
                  >
                    <span className={socialIconWrap}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.472l8.6-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153Zm-1.294 19.49h2.04L6.486 3.25H4.298l13.31 17.393Z" />
                      </svg>
                    </span>
                    <span className="font-medium text-white">{t("home.x")}</span>
                  </a>

                  <a
                    href="https://whatsapp.com/channel/0029Vb7TZeLHQbS6PE5GXh45"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialBtn}
                  >
                    <span className={socialIconWrap}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.52 3.48A11.88 11.88 0 0 0 12.06 0C5.51 0 .18 5.32.18 11.87c0 2.09.54 4.13 1.56 5.94L0 24l6.37-1.67a11.86 11.86 0 0 0 5.69 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.14-3.43-8.42ZM12.07 21.7h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.78.99 1.01-3.68-.23-.38A9.78 9.78 0 0 1 2.26 11.88C2.26 6.47 6.66 2.07 12.07 2.07c2.62 0 5.07 1.02 6.92 2.87a9.73 9.73 0 0 1 2.87 6.93c0 5.4-4.4 9.8-9.79 9.8Zm5.37-7.34c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.14-1.2-.44-2.29-1.39-.84-.75-1.41-1.67-1.57-1.96-.17-.29-.02-.45.12-.59.12-.12.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-.96 2.43.05 1.43 1.03 2.81 1.17 3 .14.19 2.02 3.08 4.89 4.31.68.29 1.21.46 1.62.59.68.22 1.31.19 1.81.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33Z" />
                      </svg>
                    </span>
                    <span className="font-medium text-white">{t("home.whatsapp")}</span>
                  </a>

                  <a
                    href="https://instagram.com/risenonchain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialBtn}
                  >
                    <span className={socialIconWrap}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5a3.85 3.85 0 0 0 3.85 3.85h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5a3.85 3.85 0 0 0-3.85-3.85h-8.5Zm8.95 1.43a1.17 1.17 0 1 1 0 2.34 1.17 1.17 0 0 1 0-2.34ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.15 5.15 0 0 1 12 6.85Zm0 1.9A3.25 3.25 0 1 0 15.25 12 3.25 3.25 0 0 0 12 8.75Z" />
                      </svg>
                    </span>
                    <span className="font-medium text-white">{t("home.instagram")}</span>
                  </a>

                  <a
                    href="https://www.tiktok.com/@risenonchain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialBtn}
                  >
                    <span className={socialIconWrap}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.75h-3.17v12.27a2.72 2.72 0 1 1-2.72-2.72c.3 0 .59.05.86.14V8.41c-.28-.04-.57-.07-.86-.07A5.89 5.89 0 1 0 15.82 14V8.73a8 8 0 0 0 4.68 1.5V6.69h-.91Z" />
                      </svg>
                    </span>
                    <span className="font-medium text-white">{t("home.tiktok")}</span>
                  </a>

                  <a href="mailto:team@risenonchain.net" className={socialBtn}>
                    <span className={socialIconWrap}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                        <path d="M3 7l9 6 9-6" />
                      </svg>
                    </span>
                    <span className="font-medium text-white">{t("home.email")}</span>
                  </a>

                  <a
                    href="https://t.me/RisenInfrastructureBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={botBtn}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a3 3 0 0 1 3 3v1h1a4 4 0 0 1 4 4v5a7 7 0 0 1-6 6.92V24h-4v-2.08A7 7 0 0 1 4 15v-5a4 4 0 0 1 4-4h1V5a3 3 0 0 1 3-3Zm-2 4h4V5a2 2 0 1 0-4 0v1Zm-2 2a2 2 0 0 0-2 2v5a5 5 0 0 0 10 0v-5a2 2 0 0 0-2-2H8Zm1.5 4.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                    </svg>
                    {t("home.accessBot")}
                  </a>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className={microCard}>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-risen-primary/15 border border-risen-primary/20">
                        <span className="w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
                      </span>
                      <p className="font-semibold tracking-wide">{t("home.cardStructureTitle")}</p>
                    </div>
                    <p className="mt-3 text-sm text-white/75 leading-relaxed">
                      {t("home.cardStructureBody")}
                    </p>
                  </div>

                  <div className={microCard}>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-white/60" />
                      </span>
                      <p className="font-semibold tracking-wide">{t("home.cardEngineTitle")}</p>
                    </div>
                    <p className="mt-3 text-sm text-white/75 leading-relaxed">
                      {t("home.cardEngineBody")}
                    </p>
                  </div>

                  <div className={microCard}>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-white/60" />
                      </span>
                      <p className="font-semibold tracking-wide">{t("home.cardTrustTitle")}</p>
                    </div>
                    <p className="mt-3 text-sm text-white/75 leading-relaxed">
                      {t("home.cardTrustBody")}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative flex flex-col items-center md:items-end mt-2 md:mt-0">
                {/* CA CARD */}
                <div className="relative z-20 mb-8 max-w-[520px] w-full mx-auto md:mx-0 md:ml-auto">
                  <div className="absolute -inset-3 bg-risen-primary/10 blur-2xl rounded-[28px] pointer-events-none" />
                  <div className="relative rounded-[28px] border border-risen-primary/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] backdrop-blur-xl shadow-[0_0_40px_rgba(46,219,255,0.16)] overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,219,255,0.12),transparent_40%)] pointer-events-none" />

                    <div className="px-5 sm:px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-risen-primary shadow-[0_0_14px_rgba(46,219,255,0.95)] animate-pulse" />
                          <p className="text-sm sm:text-base font-semibold text-white">
                            {t("ca.title")}
                          </p>
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-white/60">
                          {t("ca.network")}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-risen-primary/30 bg-risen-primary/10 px-3 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-risen-primary">
                        <span className="inline-block w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_10px_rgba(46,219,255,0.9)]" />
                        {isContractLive ? t("ca.statusLive") : t("ca.statusPending")}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="rounded-2xl border border-white/10 bg-[#07111f]/90 px-4 py-4 sm:px-5 sm:py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <div className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                          {t("ca.label")}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <code className="flex-1 break-all text-sm sm:text-base font-medium text-white">
                            {displayedAddress}
                          </code>

                          <button
                            type="button"
                            onClick={handleCopy}
                            disabled={!isContractLive}
                            className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                              isContractLive
                                ? "bg-risen-primary text-white shadow-[0_0_24px_rgba(46,219,255,0.32)] hover:scale-[1.02]"
                                : "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
                            }`}
                          >
                            {isContractLive
                              ? copied
                                ? t("ca.copied")
                                : t("ca.copy")
                              : t("ca.pendingButton")}
                          </button>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-white/70 leading-relaxed">
                        {t("ca.helper")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* LOGO + $RSN ANIMATION GROUP */}
                <div className="relative z-10 w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] md:w-[430px] md:h-[430px] flex items-center justify-center">
                  <div className="absolute -inset-10 bg-risen-primary/10 blur-[160px] rounded-full" />
                  <div className="absolute -inset-16 rounded-full bg-risen-primary/10 blur-[60px] pulseGlow" />
                  <div className="absolute -inset-24 rounded-full bg-risen-primary/8 blur-[110px]" />
                  <div className="absolute -inset-32 rounded-full bg-white/5 blur-[140px]" />

                  {rsnParticles.map((p, i) => (
                    <span
                      key={`rsn-${i}`}
                      className={`absolute ${p.size} font-semibold tracking-wide text-white/60 rsnRise pointer-events-none`}
                      style={{
                        left: p.left,
                        top: p.top,
                        transform: "translateX(-50%)",
                        textShadow: "0 0 22px rgba(46,219,255,0.42)",
                        animationDuration: p.dur,
                        animationDelay: p.delay,
                      }}
                    >
                      $RSN
                    </span>
                  ))}

                  <Image
                    src={logo}
                    alt="RISEN Logo"
                    className="w-40 sm:w-52 md:w-64 lg:w-72 relative drop-shadow-[0_0_70px_rgba(46,219,255,0.80)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-2 text-white/60 text-xs tracking-widest uppercase">
            <span className="inline-block w-6 h-px bg-white/30" />
            {t("home.scroll")}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 opacity-70">
              <path d="M12 16.5l-7-7 1.4-1.4L12 13.7l5.6-5.6L19 9.5l-7 7z" />
            </svg>
            <span className="inline-block w-6 h-px bg-white/30" />
          </div>
        </section>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020B1A] to-transparent pointer-events-none"></div>
      </main>

      <Structure />
      <CapitalEngine />
      <TrustLayer />
      <UtilityLayer />
      <FAQ />
      <FinalCTA />
      <Footer />

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#010913]/78 backdrop-blur-xl overflow-hidden">
        <div className="relative flex items-center">
          <div className="shrink-0 px-4 sm:px-6 py-3 border-r border-white/10 flex items-center gap-2 text-white font-semibold uppercase tracking-widest text-[11px] sm:text-sm bg-[#04101a]/90">
            <span className="inline-block w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
            {t("ticker.liveUpdates")}
          </div>

          <a
            href="/rush"
            className="shrink-0 hidden sm:inline-flex items-center gap-2 px-4 py-3 border-r border-white/10 text-[11px] sm:text-sm font-semibold uppercase tracking-widest text-white bg-[linear-gradient(180deg,rgba(46,219,255,0.16),rgba(46,219,255,0.05))] hover:bg-[linear-gradient(180deg,rgba(46,219,255,0.22),rgba(46,219,255,0.08))] transition-all duration-300 shadow-[0_0_18px_rgba(46,219,255,0.18)]"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)] animate-pulse" />
            {t("ticker.playRush")}
          </a>

          <div className="relative flex-1 overflow-hidden py-3">
            <div className="ticker-track whitespace-nowrap text-white/85 font-medium text-[11px] sm:text-sm">
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center">
                  <span className="mx-4 text-risen-primary">●</span>
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}