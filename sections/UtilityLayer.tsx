export default function UtilityLayer() {
  return (
    <section
      id="utility"
      className="relative bg-[#010913] py-32 px-6 text-white overflow-hidden"
    >   
      {/* Subtle background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-risen-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT TEXT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Utility Through Secure Telegram Infrastructure
          </h2>

          <p className="mt-6 text-gray-300">
            RISEN’s core utility is delivered through a dedicated Telegram Bot,
            designed to provide controlled access, structured participation,
            and ecosystem interaction without compromising contract security.
          </p>

          <div className="mt-10 space-y-6">

            <div>
              <h3 className="text-risen-primary font-semibold">
                Controlled Access
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                Bot-based utility minimizes contract surface exposure
                while enabling structured participation.
              </p>
            </div>

            <div>
              <h3 className="text-risen-primary font-semibold">
                Automated Logic
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                Smart contract tax logic integrates seamlessly
                with Telegram-based ecosystem functions.
              </p>
            </div>

            <div>
              <h3 className="text-risen-primary font-semibold">
                Security-First Design
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                Separation of utility and contract execution
                enhances structural resilience.
              </p>
            </div>

          </div>

          {/* Stronger CTA */}
          <div className="mt-12">
            <button className="px-8 py-4 bg-risen-primary text-white font-bold rounded-xl shadow-[0_0_25px_rgba(46,219,255,0.4)] hover:scale-105 transition-all duration-300">
              Access RISEN Bot
            </button>
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
                Telegram Utility Node
              </div>
              <div className="text-gray-400 text-sm mt-3">
                Secure • Automated • Structured
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