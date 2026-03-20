"use client";

import { useLanguage } from "@/context/LanguageContext";
import { localeOptions, Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  className?: string;
};

export default function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className={className}>
      <label className="sr-only" htmlFor="language-switcher">
        {t("nav.languageLabel")}
      </label>

      <select
        id="language-switcher"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="h-11 rounded-2xl border border-risen-primary/20 bg-[#06111f]/85 px-4 text-sm font-medium text-white outline-none backdrop-blur-xl shadow-[0_0_20px_rgba(46,219,255,0.10)] transition hover:border-risen-primary/40"
        aria-label={t("nav.languageLabel")}
      >
        {localeOptions.map((option) => (
          <option
            key={option.code}
            value={option.code}
            className="bg-[#06111f] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}