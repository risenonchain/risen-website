import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import FinalCTA from "../sections/FinalCTA";
import UtilityLayer from "../sections/UtilityLayer";
import TrustLayer from "../sections/TrustLayer";
import CapitalEngine from "../sections/CapitalEngine";
import Structure from "../sections/Structure";
import Image from "next/image";
import logo from "../public/logo.png";

export default function Home() {
  return (
    <>
      <main className="relative min-h-screen text-white overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/bg.png"
            className="w-full h-full object-cover"
            alt="RISEN Background"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020B1A]/70 via-[#020B1A]/60 to-[#020B1A]/85"></div>

        {/* Floating Stars */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="star" style={{ top: "20%", left: "30%" }}></div>
          <div className="star" style={{ top: "40%", left: "70%" }}></div>
          <div className="star" style={{ top: "60%", left: "50%" }}></div>
          <div className="star" style={{ top: "80%", left: "20%" }}></div>
        </div>

        {/* Wind Atmosphere */}
        <div className="wind-layer"></div>
        <div className="shimmer-layer"></div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Engineered for Strength.
              <br />
              <span className="text-risen-primary">Built to Rise.</span>
            </h1>

            <p className="mt-8 text-gray-200 text-lg max-w-xl">
              RISEN ($RSN) is a structured digital asset designed for disciplined growth,
              automated capital flow, and long-term market resilience.
            </p>

            <div className="mt-12 flex gap-6 flex-wrap">
              <button className="px-10 py-4 bg-risen-primary text-white font-bold rounded-xl shadow-glow hover:scale-105 transition-all duration-300">
                Launch on DewMoonex
              </button>

              <button className="px-10 py-4 border border-risen-primary text-risen-primary rounded-xl hover:bg-risen-primary hover:text-black transition-all duration-300">
                Access RISEN Bot
              </button>
            </div>
          </div>

          {/* RIGHT SIDE LOGO */}
          <div className="relative flex justify-center">
            <div className="absolute w-[500px] h-[500px] bg-risen-primary opacity-15 blur-[180px] rounded-full"></div>

            <Image
              src={logo}
              alt="RISEN Logo"
              className="w-80 relative z-10 drop-shadow-[0_0_40px_rgba(46,219,255,0.6)]"
              priority
            />
          </div>

        </div>

      </main>

      <Structure />
      <CapitalEngine />
      <TrustLayer />
      <UtilityLayer />
      <FinalCTA />
      <Footer />
      <Navbar />
    </>
  );
}