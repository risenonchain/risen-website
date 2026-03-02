export default function Footer() {
  return (
    <footer className="relative bg-[#000814] py-20 px-6 text-gray-400">

      <div className="max-w-6xl mx-auto">

        <div className="grid md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="text-white text-xl font-bold">
              RISEN
            </div>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              Structured digital asset engineered for disciplined growth,
              capital reinforcement, and long-term resilience.
            </p>
          </div>

          {/* Documentation */}
          <div>
            <div className="text-white font-semibold mb-4">
              Documentation
            </div>
            <ul className="space-y-3 text-sm">

              <li>
                <a
                  href="/litepaper"
                  className="hover:text-white transition"
                >
                  Litepaper
                </a>
              </li>

              <li>
                <a
                  href="/whitepaper"
                  className="hover:text-white transition"
                >
                  Whitepaper (Technical)
                </a>
              </li>

              <li>
                <a
                  href="/whitepaper.pdf"
                  target="_blank"
                  className="hover:text-white transition"
                >
                  Download Whitepaper PDF
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/Official-Able/risen/tree/main/docs"
                  target="_blank"
                  className="hover:text-white transition"
                >
                  View Documentation on GitHub
                </a>
              </li>

            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="text-white font-semibold mb-4">
              Connect
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://t.me/Risencommunity1" className="hover:text-white transition">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://x.com/risenonchain?s=11" className="hover:text-white transition">
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  BNB Chain
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-gray-800 pt-8 text-xs text-gray-600 text-center">
          © {new Date().getFullYear()} RISEN. All rights reserved.
          <br />
          This website is for informational purposes only and does not constitute financial advice.
        </div>

      </div>

    </footer>
  );
}