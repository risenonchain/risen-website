"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function UtilityLayer() {
  const { t } = useLanguage();

  return (
    <section
      id="utility"
      className="relative scroll-mt-32 bg-[#010913] py-24 md:py-28 px-6 text-white overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Subtle background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-risen-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* LEFT TEXT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("utilityLayer.title")}
          </h2>

          <p className="mt-6 text-gray-300">
            {t("utilityLayer.subtitle")}
          </p>

          <div className="mt-10 space-y-6">
            <div>
              <h3 className="text-risen-primary font-semibold">
                {t("utilityLayer.features.controlledAccessTitle")}
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                {t("utilityLayer.features.controlledAccessBody")}
              </p>
            </div>

            <div>
              <h3 className="text-risen-primary font-semibold">
                {t("utilityLayer.features.automatedLogicTitle")}
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                {t("utilityLayer.features.automatedLogicBody")}
              </p>
            </div>

            <div>
              <h3 className="text-risen-primary font-semibold">
                {t("utilityLayer.features.securityFirstTitle")}
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                {t("utilityLayer.features.securityFirstBody")}
              </p>
            </div>
          </div>

          {/* CTA BUTTON */}
          <div className="mt-12">
            <a
              href="https://t.me/RisenInfrastructureBot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-risen-primary text-white font-bold rounded-xl shadow-[0_0_25px_rgba(46,219,255,0.4)] hover:scale-105 transition-all duration-300"
            >
              {t("utilityLayer.button")}
            </a>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative flex justify-center">
          {/* Top Integration Line */}
          <div className="absolute -top-6 w-20 h-[2px] bg-risen-primary/30"></div>

          {/* Live Utility Node */}
          <div className="relative w-[340px] h-[340px] rounded-2xl bg-risen-navy/60 border border-risen-primary/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_80px_rgba(46,219,255,0.15)] overflow-hidden">
            {/* Subtle pulse */}
            <div className="absolute w-[220px] h-[220px] bg-risen-primary/10 rounded-full blur-[60px] animate-pulse"></div>

            {/* Animated border ring */}
            <div className="absolute inset-0 rounded-2xl border border-risen-primary/20 animate-pulse"></div>

            <div className="relative text-center">
              <div className="text-risen-primary text-lg font-semibold">
                {t("utilityLayer.visual.title")}
              </div>
              <div className="text-gray-400 text-sm mt-3">
                {t("utilityLayer.visual.subtitle")}
              </div>
            </div>
          </div>

          {/* Bottom Integration Line */}
          <div className="absolute -bottom-6 w-20 h-[2px] bg-risen-primary/30"></div>
        </div>
      </div>
    </section>
  );
}