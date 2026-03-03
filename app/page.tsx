import Footer from "../sections/Footer";
import FinalCTA from "../sections/FinalCTA";
import UtilityLayer from "../sections/UtilityLayer";
import TrustLayer from "../sections/TrustLayer";
import CapitalEngine from "../sections/CapitalEngine";
import Structure from "../sections/Structure";
import Image from "next/image";
import logo from "../public/logo.png";

export default function Home() {
  const glassBtn =
    "group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl " +
    "bg-white/5 backdrop-blur-md border border-white/10 " +
    "hover:border-risen-primary/40 hover:bg-white/10 " +
    "transition-all duration-300 " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03)]";

  const primaryBtn =
    "inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-semibold " +
    "bg-risen-primary text-white hover:opacity-95 transition-all duration-300 " +
    "shadow-[0_0_40px_rgba(46,219,255,0.45)] " +
    "hover:shadow-[0_0_55px_rgba(46,219,255,0.6)]";

  const chip =
    "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm " +
    "bg-white/5 border border-white/10 backdrop-blur-md text-white/85 " +
    "hover:text-white hover:border-risen-primary/30 hover:bg-white/10 transition";

  const microCard =
    "relative rounded-2xl p-4 sm:p-5 bg-white/5 border border-white/10 backdrop-blur-md " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.03)] " +
    "hover:border-risen-primary/25 hover:bg-white/10 transition-all duration-300";

  // Premium floating $RSN — wider spread + higher rise
  const rsnParticles = [
    { left: "34%", delay: "0s", dur: "5.0s", size: "text-[10px]" },
    { left: "42%", delay: "0.8s", dur: "5.6s", size: "text-[11px]" },
    { left: "50%", delay: "1.4s", dur: "5.2s", size: "text-[10px]" },
    { left: "58%", delay: "2.1s", dur: "5.9s", size: "text-[12px]" },
    { left: "66%", delay: "2.7s", dur: "5.4s", size: "text-[10px]" },
    { left: "38%", delay: "3.1s", dur: "6.2s", size: "text-[11px]" },
    { left: "62%", delay: "3.6s", dur: "6.0s", size: "text-[10px]" },
  ] as const;

  return (
    <>
      <main className="relative min-h-screen text-white overflow-hidden pb-16">
        {/* Background Image */}
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

        {/* Dark Overlay */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#020B1A]/70 via-[#020B1A]/60 to-[#020B1A]/85" />

        {/* Noise Layer */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-[0.06] bg-[url('/noise.png')] bg-repeat"
          aria-hidden="true"
        />

        {/* Atmosphere */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="star" style={{ top: "20%", left: "30%" }}></div>
          <div className="star" style={{ top: "40%", left: "70%" }}></div>
          <div className="star" style={{ top: "60%", left: "50%" }}></div>
          <div className="star" style={{ top: "80%", left: "20%" }}></div>
        </div>

        <div className="wind-layer"></div>
        <div className="shimmer-layer"></div>

        {/* HERO */}
        <section id="home" className="relative">
          {/* vignette + glow */}
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-risen-primary/10 blur-[140px] rounded-full" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,219,255,0.08)_0%,rgba(2,11,26,0)_55%)]" />
          </div>

          {/* wider container + grid ratio */}
          <div className="relative max-w-[1320px] mx-auto px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-28 pb-14 md:pb-20 grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-10 items-center">
            {/* LEFT */}
            <div className="relative z-10 md:-ml-6 lg:-ml-10">
              <h1 className="font-extrabold tracking-tight leading-[1.02]">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[4.8rem]">
                  Engineered for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                    Strength.
                  </span>
                </span>
                <span className="block mt-2 text-5xl sm:text-6xl md:text-7xl lg:text-[4.8rem]">
                  <span className="text-risen-primary drop-shadow-[0_0_28px_rgba(46,219,255,0.45)]">
                    Built to Rise.
                  </span>
                </span>
              </h1>

              <p className="mt-6 text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
                RISEN ($RSN) is structured digital infrastructure engineered for
                disciplined growth, capital reinforcement, and long-term market
                resilience.
              </p>

              {/* PROOF CHIPS */}
              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className={chip}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-risen-primary shadow-[0_0_10px_rgba(46,219,255,0.9)]" />
                  BSC deployment planned
                </span>

                <span className={chip}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/50" />
                  Protocol Phases
                </span>

                <span className={chip}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/50" />
                  Infrastructure-grade
                </span>

                <a href="/litepaper" className={chip}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/50" />
                  Read Litepaper <span className="opacity-70">↗</span>
                </a>
              </div>

              {/* CTA Row */}
              <div className="mt-8 flex flex-row flex-nowrap gap-4 items-center overflow-x-auto md:overflow-visible whitespace-nowrap pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <a
                  href="https://t.me/Risencommunity1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${glassBtn} shrink-0`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-risen-primary group-hover:scale-110 transition"
                  >
                    <path d="M22 2L2 11l6 2 2 6 4-5 5 3 3-15z" />
                  </svg>
                  <span className="text-white font-medium tracking-wide">
                    Join Telegram
                  </span>
                </a>

                <a
                  href="https://x.com/risenonchain?s=11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${glassBtn} shrink-0`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-risen-primary group-hover:scale-110 transition"
                  >
                    <path d="M18.244 2H21l-6.5 7.4L22 22h-6.7l-5.2-6.9L4.5 22H2l7-8L2 2h6.8l4.7 6.3L18.2 2z" />
                  </svg>
                  <span className="text-white font-medium tracking-wide">
                    Follow on X
                  </span>
                </a>

                <a
                  href="https://t.me/RisenInfrastructureBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${primaryBtn} shrink-0`}
                >
                  Access RISEN Bot
                </a>
              </div>

              {/* MICRO FEATURE CARDS */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className={microCard}>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-risen-primary/15 border border-risen-primary/20">
                      <span className="w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
                    </span>
                    <p className="font-semibold tracking-wide">Structure</p>
                  </div>
                  <p className="mt-3 text-sm text-white/75 leading-relaxed">
                    Protocol architecture designed for disciplined growth and
                    durable market resilience.
                  </p>
                </div>

                <div className={microCard}>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-white/60" />
                    </span>
                    <p className="font-semibold tracking-wide">Engine</p>
                  </div>
                  <p className="mt-3 text-sm text-white/75 leading-relaxed">
                    Capital reinforcement logic and execution layers built for
                    stability under pressure.
                  </p>
                </div>

                <div className={microCard}>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-white/60" />
                    </span>
                    <p className="font-semibold tracking-wide">Trust</p>
                  </div>
                  <p className="mt-3 text-sm text-white/75 leading-relaxed">
                    Risk controls, transparent design intent, and upgrade
                    planning aligned to long-term integrity.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT (NO CIRCLE) — Logo + Premium Glow + Rising $RSN */}
            <div className="relative flex justify-center md:justify-end md:translate-x-6 lg:translate-x-10">
              {/* Big ambient glow behind */}
              <div className="absolute -inset-10 bg-risen-primary/10 blur-[160px] rounded-full" />

              {/* Rising $RSN (wider + higher) */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {rsnParticles.map((p, i) => (
                  <span
                    key={`rsn-${i}`}
                    className={`absolute ${p.size} font-semibold tracking-wide text-white/55 rsnRise`}
                    style={{
                      left: p.left,
                      bottom: "18%",
                      transform: "translateX(-50%)",
                      textShadow: "0 0 18px rgba(46,219,255,0.35)",
                      animationDuration: p.dur,
                      animationDelay: p.delay,
                    }}
                  >
                    $RSN
                  </span>
                ))}
              </div>

              {/* Logo block */}
              <div className="relative z-10 translate-y-6 sm:translate-y-8 md:translate-y-10">
                {/* Premium layered glow (3 layers) */}
                <div className="absolute -inset-16 rounded-full bg-risen-primary/10 blur-[60px] pulseGlow" />
                <div className="absolute -inset-24 rounded-full bg-risen-primary/8 blur-[110px]" />
                <div className="absolute -inset-32 rounded-full bg-white/5 blur-[140px]" />

                <Image
                  src={logo}
                  alt="RISEN Logo"
                  className="w-56 sm:w-64 md:w-72 relative drop-shadow-[0_0_70px_rgba(46,219,255,0.80)]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* scroll cue */}
          <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 items-center gap-2 text-white/60 text-xs tracking-widest uppercase">
            <span className="inline-block w-6 h-px bg-white/30" />
            Scroll
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M12 16.5l-7-7 1.4-1.4L12 13.7l5.6-5.6L19 9.5l-7 7z" />
            </svg>
            <span className="inline-block w-6 h-px bg-white/30" />
          </div>
        </section>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020B1A] to-transparent pointer-events-none"></div>
      </main>

      <Structure />
      <CapitalEngine />
      <TrustLayer />
      <UtilityLayer />
      <FinalCTA />
      <Footer />

      {/* LIVE PROTOCOL STATUS — Fixed Bottom Ticker */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#010913]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-widest">
            <span className="inline-block w-2 h-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
            Live Protocol Status
          </div>

          <div className="text-white/85 font-medium">
            Phase 2 — Dust Scanner Architecture Finalized
            <span className="mx-3 text-white/25">|</span>
            Smart Contract Layer — Design Pending
          </div>
        </div>
      </div>
    </>
  );
}