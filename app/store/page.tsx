"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Footer from "@/sections/Footer";

const APPS = [
  {
    id: "rush",
    name: "RISEN Rush",
    category: "Game • Play-to-Earn",
    description: "The official high-octane catch game of the RISEN ecosystem. Collect $RSN, avoid hazards, and climb the leaderboard for rewards.",
    icon: "🎮",
    status: "deployed",
    featured: true,
    link: "/rush",
    installable: true,
    apkLink: "/apps/risen-rush.apk",
  },
  {
    id: "atlas",
    name: "RISEN Atlas",
    category: "Intelligence • Market Analyst",
    description: "Your intelligent pocket market analyst. Real-time data, neural insights, and algorithmic trading signals at your fingertips.",
    icon: "🧭",
    status: "deployed",
    link: "#",
    installable: true,
    apkLink: "/apps/risen-atlas.apk",
  },
  {
    id: "ai-engine",
    name: "RISEN AI",
    category: "Intelligence • LLM",
    description: "A specialized intelligence layer for on-chain analysis, market sentiment, and ecosystem guidance. Powered by custom RISEN models.",
    icon: "🧠",
    status: "deployed",
    link: "/ai",
    installable: false,
  },
  {
    id: "infra-bot",
    name: "Infrastructure Bot",
    category: "Utility • Telegram",
    description: "The neural command center for the RISEN ecosystem. Manage your assets, track market data, and interact with the protocol via Telegram.",
    icon: "🤖",
    status: "maintenance",
    link: "https://t.me/RisenInfrastructureBot",
    installable: false,
  },
  {
    id: "bridge",
    name: "Neural Bridge",
    category: "Defi • Cross-chain",
    description: "Seamlessly migrate liquidity between meme tokens and major networks with optimized tax logic and routing.",
    icon: "🌉",
    status: "development",
    link: "#",
    installable: false,
  },
  {
    id: "sweeper",
    name: "Dust Sweeper",
    category: "Utility • Wallet",
    description: "Automated cleanup protocol that converts small, unused token balances into $RSN or native liquidity.",
    icon: "🧹",
    status: "development",
    link: "#",
    installable: false,
  },
  {
    id: "guardian",
    name: "RISEN Guardian",
    category: "Security • Audit",
    description: "Real-time contract monitoring and fraud detection system for the RISEN community.",
    icon: "🛡️",
    status: "development",
    link: "#",
    installable: false,
  }
];

export default function AppStorePage() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen text-white bg-[#02070d] font-sans">
      {/* Background flair */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-risen-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Header */}
      <nav className="relative z-50 w-full px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:border-risen-primary/50 group-hover:bg-risen-primary/10">
            <svg className="w-5 h-5 text-white/60 group-hover:text-risen-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-sm font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors italic">Back to Terminal</span>
        </Link>

        <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
                <span className="text-[10px] font-black uppercase tracking-widest text-risen-primary">V2.0_Store_Active</span>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-risen-primary/20 bg-risen-primary/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-risen-primary mb-8 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,1)]" />
                Neural Repository
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-6">
                RISEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-risen-primary to-blue-400">App Store</span>
            </h1>
            <p className="max-w-2xl text-white/40 text-base md:text-lg font-bold leading-relaxed uppercase tracking-tight">
                Access the full suite of RISEN protocols and tools. From high-stakes gaming to advanced AI analysis, the ecosystem is built to rise.
            </p>
        </div>
      </section>

      {/* App Grid */}
      <section className="relative px-6 pb-20 max-w-7xl mx-auto">
        <div className="mb-12 flex items-center gap-4">
            <h2 className="text-xl font-black uppercase tracking-[0.4em] text-white italic">Neural Protocols</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {APPS.map((app) => (
                <div
                    key={app.id}
                    className={`group relative rounded-[40px] border border-white/5 bg-[#030913] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-risen-primary/30 hover:shadow-[0_20px_80px_rgba(46,219,255,0.08)] ${app.status === 'development' ? 'opacity-60 grayscale-[0.5]' : ''} ${app.featured ? 'md:col-span-2 lg:col-span-1 border-risen-primary/20 bg-gradient-to-br from-[#030913] to-[#07111d]' : ''}`}
                >
                    {/* Status Badge */}
                    <div className="absolute top-8 right-8 flex gap-2">
                        {app.featured && (
                            <span className="px-3 py-1 rounded-full bg-risen-primary/10 border border-risen-primary/30 text-risen-primary text-[9px] font-black uppercase tracking-widest italic shadow-[0_0_15px_rgba(46,219,255,0.2)]">Featured</span>
                        )}
                        {app.status === 'deployed' ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest italic">Live</span>
                        ) : app.status === 'maintenance' ? (
                            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest italic">Maintenance</span>
                        ) : (
                            <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[9px] font-black uppercase tracking-widest italic">In Build</span>
                        )}
                    </div>

                    {/* App Icon */}
                    <div className="h-16 w-16 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner mb-6 transition-all duration-500 group-hover:bg-risen-primary/20 group-hover:border-risen-primary/30 group-hover:scale-110">
                        {app.icon}
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-8">
                        <div className="text-[10px] font-black text-risen-primary uppercase tracking-[0.2em]">{app.category}</div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{app.name}</h3>
                        <p className="text-[13px] text-white/40 leading-relaxed font-bold uppercase">{app.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href={app.link}
                            target={app.link.startsWith('http') ? '_blank' : '_self'}
                            className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${app.status === 'deployed' ? 'bg-white text-black hover:bg-risen-primary hover:text-white' : 'bg-white/5 text-white/20 cursor-not-allowed pointer-events-none'}`}
                        >
                            {app.status === 'deployed' ? 'Open Protocol' : app.status === 'maintenance' ? 'System Offline' : 'Syncing Data...'}
                            {app.status === 'deployed' && <span className="text-base">→</span>}
                        </Link>

                        {app.installable && app.status === 'deployed' && (
                            <a
                                href={app.apkLink}
                                download
                                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.523 15.3414C17.0609 15.3414 16.6853 15.717 16.6853 16.1791V18.6922H7.31466V16.1791C7.31466 15.717 6.93906 15.3414 6.47696 15.3414C6.01485 15.3414 5.63926 15.717 5.63926 16.1791V19.5303C5.63926 20.2185 6.20235 20.7745 6.89046 20.7745H17.1095C17.7976 20.7745 18.3607 20.2185 18.3607 19.5303V16.1791C18.3607 15.717 17.9851 15.3414 17.523 15.3414Z"/><path d="M11.1619 15.0118C11.3859 15.2358 11.6929 15.3414 12 15.3414C12.3071 15.3414 12.6141 15.2358 12.8381 15.0118L15.9084 11.9415C16.3564 11.5175 16.3564 10.8358 15.9084 10.4118C15.4604 9.9878 14.7787 9.9878 14.3547 10.4358L12.8381 12.0118V4.00414C12.8381 3.44304 12.3951 3.00004 11.834 3.00004C11.2729 3.00004 10.8299 3.44304 10.8299 4.00414V12.0118L9.31326 10.4358C8.88926 9.9878 8.20756 9.9878 7.75956 10.4118C7.31156 10.8358 7.31156 11.5175 7.75956 11.9415L11.1619 15.0118Z"/></svg>
                                Download APK
                            </a>
                        )}
                    </div>

                    {/* Decor */}
                    <div className="absolute -z-10 bottom-0 right-0 h-40 w-40 bg-risen-primary/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
            ))}
        </div>
      </section>

      {/* Development Notice */}
      <section className="relative px-6 pb-40 max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-[50px] bg-white/5 border border-white/10 backdrop-blur-3xl">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Core Ecosystem Development</div>
              <h2 className="text-3xl font-black uppercase italic text-white mb-6">Building the Neural Future</h2>
              <p className="text-white/40 text-sm font-bold leading-relaxed uppercase mb-8">
                  The RISEN App Store is a living repository. Our engineering team is constantly deploying new protocols to expand the utility of the $RSN token. Stay tuned for upcoming updates.
              </p>
              <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white italic tracking-tighter">03</span>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Live Apps</span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white italic tracking-tighter">03</span>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">In Sync</span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white italic tracking-tighter">24/7</span>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Ops Active</span>
                  </div>
              </div>
          </div>
      </section>

      <Footer />
    </main>
  );
}
