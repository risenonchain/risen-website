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

      {/* Social & Action Buttons */}
      <div className="mt-12 flex gap-6 flex-wrap items-center">

        {/* Telegram Button */}
        <a
          href="https://t.me/Risencommunity1"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-8 py-4 rounded-xl 
                     bg-risen-navy/70 backdrop-blur-md
                     border border-risen-primary/30
                     hover:border-risen-primary
                     hover:shadow-[0_0_25px_rgba(46,219,255,0.4)]
                     transition-all duration-300"
        >
          {/* Telegram SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-risen-primary group-hover:scale-110 transition"
          >
            <path d="M22 2L2 11l6 2 2 6 4-5 5 3 3-15z"/>
          </svg>

          <span className="text-white font-medium tracking-wide">
            Join Telegram
          </span>
        </a>

        {/* X Button */}
        <a
          href="https://x.com/risenonchain?s=11"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-8 py-4 rounded-xl 
                     bg-risen-navy/70 backdrop-blur-md
                     border border-risen-primary/30
                     hover:border-risen-primary
                     hover:shadow-[0_0_25px_rgba(46,219,255,0.4)]
                     transition-all duration-300"
        >
          {/* X SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-risen-primary group-hover:scale-110 transition"
          >
            <path d="M18.244 2H21l-6.5 7.4L22 22h-6.7l-5.2-6.9L4.5 22H2l7-8L2 2h6.8l4.7 6.3L18.2 2z"/>
          </svg>

          <span className="text-white font-medium tracking-wide">
            Follow on X
          </span>
        </a>

        {/* Access Bot Button */}
        <button className="px-10 py-4 border border-risen-primary text-risen-primary rounded-xl hover:bg-risen-primary hover:text-black transition-all duration-300">
          Access RISEN Bot
        </button>

      </div>

    </section>
  );
}