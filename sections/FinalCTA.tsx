"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#010913] py-32 px-6 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-[300px] bg-risen-primary/10 blur-[160px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center relative">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          {t("finalCta.titleLine1")}
          <br />
          <span className="text-risen-primary">{t("finalCta.titleLine2")}</span>
        </h2>

        <p className="mt-8 text-gray-300 max-w-2xl mx-auto">
          {t("finalCta.subtitle")}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          
          {/* PRIMARY BUTTON → DEW */}
          <a
            href="https://flap.sh/launch"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-risen-primary text-white font-bold rounded-xl shadow-[0_0_30px_rgba(46,219,255,0.4)] hover:scale-105 transition-all duration-300"
          >
            {t("finalCta.primaryButton")}
          </a>

          {/* SECONDARY BUTTON → TELEGRAM BOT */}
          <a
            href="https://t.me/RisenInfrastructureBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 border border-risen-primary text-risen-primary rounded-xl hover:bg-risen-primary hover:text-black transition-all duration-300"
          >
            {t("finalCta.secondaryButton")}
          </a>

        </div>

        {/* Contract Placeholder */}
        <div className="mt-16 text-sm text-gray-500">
          {t("finalCta.contractLabel")}{" "}
          <span className="text-gray-400">{t("finalCta.contractValue")}</span>
        </div>
      </div>
    </section>
  );
}