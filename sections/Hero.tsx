export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      
      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-risen-primary opacity-20 blur-[120px] rounded-full"></div>

      {/* Logo */}
      <img
        src="/logo.png"
        alt="RISEN Logo"
        className="w-56 md:w-72 mb-8 drop-shadow-[0_0_30px_rgba(46,219,255,0.6)]"
      />

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-wide text-white">
        RISEN
      </h1>

      {/* Tagline */}
      <p className="mt-6 max-w-xl text-gray-300 text-lg">
        Structured digital asset built for durability,
        disciplined growth, and long-term belief.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex gap-6">
        <button className="px-8 py-3 bg-risen-primary text-black font-semibold rounded-lg hover:scale-105 transition-all shadow-glow">
          Launch on DewMoonex
        </button>

        <button className="px-8 py-3 border border-risen-primary text-risen-primary rounded-lg hover:bg-risen-primary hover:text-black transition-all">
          Open Telegram Bot
        </button>
      </div>
    </section>
  );
}