"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function TrustLayer() {
  const { t } = useLanguage();

  return (
    <section
      id="trust"
      className="relative scroll-mt-32 bg-[#020B1A] py-24 md:py-28 px-6 text-white overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-risen-primary/5 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          {t("trustLayer.title")}
        </h2>

        <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
          {t("trustLayer.subtitle")}
        </p>
      </div>

      <div className="relative mt-20 max-w-6xl mx-auto">
        {/* Core Safeguards Label */}
        <div className="text-left text-risen-primary uppercase text-xs tracking-widest mb-6">
          {t("trustLayer.coreSafeguardsLabel")}
        </div>

        {/* Core Safeguards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/40 shadow-[0_0_20px_rgba(46,219,255,0.15)]">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              {t("trustLayer.core.multiSigTitle")}
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              {t("trustLayer.core.multiSigBody")}
            </p>
          </div>

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/40 shadow-[0_0_20px_rgba(46,219,255,0.15)]">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              {t("trustLayer.core.renouncedTitle")}
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              {t("trustLayer.core.renouncedBody")}
            </p>
          </div>

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/40 shadow-[0_0_20px_rgba(46,219,255,0.15)]">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              {t("trustLayer.core.taxLogicTitle")}
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              {t("trustLayer.core.taxLogicBody")}
            </p>
          </div>
        </div>

        {/* Infrastructure Label */}
        <div className="mt-16 text-left text-risen-primary uppercase text-xs tracking-widest mb-6">
          {t("trustLayer.infrastructureLabel")}
        </div>

        {/* Infrastructure Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary transition-all duration-300">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              {t("trustLayer.infrastructure.bnbTitle")}
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              {t("trustLayer.infrastructure.bnbBody")}
            </p>
          </div>

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary transition-all duration-300">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              {t("trustLayer.infrastructure.launchpadTitle")}
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              {t("trustLayer.infrastructure.launchpadBody")}
            </p>
          </div>

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary transition-all duration-300">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              {t("trustLayer.infrastructure.auditTitle")}
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              {t("trustLayer.infrastructure.auditBody")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}