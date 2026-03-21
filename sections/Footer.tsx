"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#000814] py-20 px-6 text-gray-400">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="text-white text-xl font-bold">RISEN</div>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              {t("footer.brandDescription")}
            </p>
          </div>

          {/* Documentation */}
          <div>
            <div className="text-white font-semibold mb-4">
              {t("footer.documentationTitle")}
            </div>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/litepaper"
                  className="hover:text-white transition"
                >
                  {t("footer.links.litepaper")}
                </a>
              </li>

              <li>
                <a
                  href="/whitepaper"
                  className="hover:text-white transition"
                >
                  {t("footer.links.whitepaper")}
                </a>
              </li>

              <li>
                <a
                  href="/whitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  {t("footer.links.downloadWhitepaper")}
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/risenonchain/risen-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  {t("footer.links.githubDocs")}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="text-white font-semibold mb-4">
              {t("footer.connectTitle")}
            </div>

            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://t.me/Risencommunity1"
                  className="hover:text-white transition"
                >
                  {t("footer.social.telegram")}
                </a>
              </li>

              <li>
                <a
                  href="https://x.com/risenonchain?s=11"
                  className="hover:text-white transition"
                >
                  {t("footer.social.x")}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition"
                >
                  {t("footer.social.bnb")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-gray-800 pt-8 text-xs text-gray-600 text-center">
          © {new Date().getFullYear()} RISEN. {t("footer.rights")}
          <br />
          {t("footer.disclaimer")}
        </div>
      </div>
    </footer>
  );
}