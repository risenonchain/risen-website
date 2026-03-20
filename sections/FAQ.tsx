"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function FAQ() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  const faqData = useMemo(
    () => [
      {
        q: t("faq.items.0.q"),
        a: t("faq.items.0.a"),
      },
      {
        q: t("faq.items.1.q"),
        a: t("faq.items.1.a"),
      },
      {
        q: t("faq.items.2.q"),
        a: t("faq.items.2.a"),
      },
      {
        q: t("faq.items.3.q"),
        a: t("faq.items.3.a"),
      },
      {
        q: t("faq.items.4.q"),
        a: t("faq.items.4.a"),
      },
      {
        q: t("faq.items.5.q"),
        a: t("faq.items.5.a"),
      },
      {
        q: t("faq.items.6.q"),
        a: t("faq.items.6.a"),
      },
      {
        q: t("faq.items.7.q"),
        a: t("faq.items.7.a"),
      },
      {
        q: t("faq.items.8.q"),
        a: t("faq.items.8.a"),
      },
    ],
    [t]
  );

  return (
    <section
      id="faq"
      className="relative max-w-6xl mx-auto px-6 py-24 text-white"
    >
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t("faq.title")}
        </h2>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          {t("faq.subtitle")}
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqData.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-risen-primary/40 transition"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-6 py-5 flex items-center justify-between"
            >
              <span className="font-semibold text-white">{item.q}</span>

              <span className="text-risen-primary text-xl">
                {open === i ? "−" : "+"}
              </span>
            </button>

            <div
              className={`px-6 pb-6 text-gray-300 leading-relaxed text-sm whitespace-pre-line transition-all duration-300 ${
                open === i ? "block" : "hidden"
              }`}
            >
              {item.a}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Motto */}
      <div className="text-center mt-16 text-sm text-gray-400 tracking-wide">
        <p className="font-semibold text-white">$RSN</p>
        {t("faq.motto")}
      </div>
    </section>
  );
}