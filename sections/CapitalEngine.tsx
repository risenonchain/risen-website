"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CapitalEngine() {
  const { t } = useLanguage();

  return (
    <section
      id="engine"
      className="relative scroll-mt-32 bg-[#010913] py-24 md:py-28 px-6 text-white overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          {t("capitalEngine.title")}
        </h2>

        <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
          {t("capitalEngine.subtitle")}
        </p>
      </div>

      {/* Ambient Glow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-40 w-[600px] h-[200px] bg-risen-primary opacity-5 blur-[120px] pointer-events-none"></div>

      {/* Energy Bridge */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[55%] w-[500px] h-[150px] bg-gradient-to-b from-risen-primary/10 to-transparent blur-[100px] pointer-events-none"></div>

      {/* Engine Flow */}
      <div className="relative mt-20 max-w-5xl mx-auto grid md:grid-cols-5 gap-6 items-center text-center">
        <div className="p-6 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_30px_rgba(46,219,255,0.25)] hover:-translate-y-2 transition-all duration-300">
          {t("capitalEngine.flow.transaction")}
        </div>

        {/* Strengthened Flow Connector */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-[3px] bg-risen-primary/40 rounded-full relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-8 bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.8)] animate-flow"></div>
          </div>
        </div>

        {/* Active Middle Node */}
        <div className="p-6 bg-risen-navy/70 rounded-xl border border-risen-primary shadow-[0_0_25px_rgba(46,219,255,0.25)]">
          {t("capitalEngine.flow.tax")}
        </div>

        {/* Strengthened Flow Connector */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-[4px] bg-risen-primary/40 rounded-full relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-12 bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,1)] animate-flow"></div>
          </div>
        </div>

        <div className="p-6 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_30px_rgba(46,219,255,0.25)] hover:-translate-y-2 transition-all duration-300">
          {t("capitalEngine.flow.allocation")}
        </div>
      </div>

      {/* Downward Energy Connector */}
      <div className="relative mt-10 mb-10 h-[2px] bg-risen-primary/20 overflow-hidden max-w-3xl mx-auto">
        <div className="absolute left-0 top-0 h-full w-10 bg-risen-primary animate-flow"></div>
      </div>

      {/* Outcome Grid */}
      <div className="relative max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_30px_rgba(46,219,255,0.25)] hover:-translate-y-2 transition-all duration-300">
          {t("capitalEngine.outcomes.liquidity")}
        </div>

        <div className="p-6 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_30px_rgba(46,219,255,0.25)] hover:-translate-y-2 transition-all duration-300">
          {t("capitalEngine.outcomes.development")}
        </div>

        <div className="p-6 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_30px_rgba(46,219,255,0.25)] hover:-translate-y-2 transition-all duration-300">
          {t("capitalEngine.outcomes.expansion")}
        </div>
      </div>

      {/* Thesis */}
      <div className="mt-16 text-center text-risen-primary text-xl font-bold tracking-wide">
        {t("capitalEngine.thesis")}
      </div>
    </section>
  );
}