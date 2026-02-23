export default function TrustLayer() {
  return (
    <section
      id="trust"
      className="relative bg-[#020B1A] py-32 px-6 text-white overflow-hidden"
    >

      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-risen-primary/5 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-3xl md:text-4xl font-bold">
          Trust Architecture
        </h2>

        <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
          Built with structural safeguards to prioritize transparency,
          governance, and long-term ecosystem integrity.
        </p>

      </div>

      <div className="relative mt-20 max-w-6xl mx-auto">

        {/* Core Safeguards Label */}
        <div className="text-left text-risen-primary uppercase text-xs tracking-widest mb-6">
          Core Safeguards
        </div>

        {/* Core Safeguards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/40 shadow-[0_0_20px_rgba(46,219,255,0.15)]">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              Multi-Signature Treasury
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              Treasury secured via multi-sig governance to eliminate unilateral control.
            </p>
          </div>

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/40 shadow-[0_0_20px_rgba(46,219,255,0.15)]">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              Renounced Contract
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              Contract ownership permanently renounced to prevent rug risk.
            </p>
          </div>

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/40 shadow-[0_0_20px_rgba(46,219,255,0.15)]">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              Automated Tax Logic
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              3% buy and sell tax automatically distributed via smart contract.
            </p>
          </div>

        </div>

        {/* Infrastructure Label */}
        <div className="mt-16 text-left text-risen-primary uppercase text-xs tracking-widest mb-6">
          Infrastructure & Transparency
        </div>

        {/* Infrastructure Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary transition-all duration-300">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              BNB Chain Deployment
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              Deployed on BNB Chain for efficiency, scalability, and ecosystem reach.
            </p>
          </div>

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary transition-all duration-300">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              Launchpad Integration
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              Initial launch via DewMoonex launchpad ecosystem.
            </p>
          </div>

          <div className="p-8 bg-risen-navy/60 backdrop-blur-md rounded-xl border border-risen-primary/20 hover:border-risen-primary transition-all duration-300">
            <h3 className="text-lg font-bold tracking-wide text-risen-primary">
              Future Audit Roadmap
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              Independent contract audit planned to reinforce transparency.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}