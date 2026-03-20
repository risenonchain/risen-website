"use client";

import { useEffect, useMemo, useState } from "react";
import DocumentEngine from "@/components/DocumentEngine";
import { useLanguage } from "@/context/LanguageContext";

const uiText = {
  en: {
    back: "← Back to Homepage",
    title: "RISEN Litepaper",
    loading: "Loading litepaper..."
  },
  fr: {
    back: "← Retour à l’accueil",
    title: "Litepaper RISEN",
    loading: "Chargement du litepaper..."
  },
  es: {
    back: "← Volver al inicio",
    title: "Litepaper de RISEN",
    loading: "Cargando litepaper..."
  },
  zh: {
    back: "← 返回首页",
    title: "RISEN Litepaper",
    loading: "正在加载 Litepaper..."
  }
} as const;

export default function LitepaperViewer() {
  const { locale } = useLanguage();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const text = useMemo(() => {
    return uiText[locale] ?? uiText.en;
  }, [locale]);

  useEffect(() => {
    let isMounted = true;

    const loadLitepaper = async () => {
      setIsLoading(true);

      const localizedPath = `/docs/litepaper.${locale}.md`;
      const fallbackPath = "/docs/litepaper.en.md";

      try {
        const localizedRes = await fetch(localizedPath, { cache: "no-store" });

        if (localizedRes.ok) {
          const localizedText = await localizedRes.text();
          if (isMounted) {
            setContent(localizedText);
            setIsLoading(false);
          }
          return;
        }

        throw new Error("Localized litepaper not found");
      } catch {
        try {
          const fallbackRes = await fetch(fallbackPath, { cache: "no-store" });
          const fallbackText = await fallbackRes.text();

          if (isMounted) {
            setContent(fallbackText);
            setIsLoading(false);
          }
        } catch {
          if (isMounted) {
            setContent("# RISEN Litepaper\n\nUnable to load litepaper content.");
            setIsLoading(false);
          }
        }
      }
    };

    loadLitepaper();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return (
    <div className="relative min-h-screen bg-[#010913] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,219,255,0.12),transparent_60%)] pointer-events-none" />

      <div className="fixed top-0 left-0 right-0 w-full bg-[#010913]/90 backdrop-blur-xl border-b border-risen-primary/20 z-50">
        <div className="w-full max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <a
            href="/"
            className="text-risen-primary font-semibold hover:opacity-80 transition"
          >
            {text.back}
          </a>

          <span className="text-white font-bold tracking-wide">
            RISEN
          </span>
        </div>
      </div>

      <div className="px-6 pt-36 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center text-white/75">
              {text.loading}
            </div>
          ) : (
            <DocumentEngine
              title={text.title}
              content={content}
              pdfLink="/litepaper.pdf"
              githubLink="https://github.com/risenonchain/risen-website/blob/main/public/docs/litepaper.en.md"
            />
          )}
        </div>
      </div>
    </div>
  );
}