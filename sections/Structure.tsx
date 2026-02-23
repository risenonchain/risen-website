export default function Structure() {
  return (
    <section
      id="structure"
      className="relative bg-risen-bg py-32 px-6 text-white overflow-hidden"
    >
      
      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2EDBFF 1px, transparent 1px),
            linear-gradient(to bottom, #2EDBFF 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          The RISEN Structure
        </h2>

        <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
          A disciplined token model designed to reinforce liquidity,
          support development, and sustain long-term participation.
        </p>
      </div>

      {/* Card Grid */}
      <div className="relative mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">

        {/* Card 1 */}
        <div className="p-8 bg-risen-navy/80 backdrop-blur-md rounded-2xl border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_30px_rgba(46,219,255,0.25)] hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-5xl font-extrabold text-risen-primary tracking-tight">
            3%
          </h3>
          <p className="mt-4 text-gray-300">
            Buy Tax – reinforcing liquidity and ecosystem growth.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-8 bg-risen-navy/80 backdrop-blur-md rounded-2xl border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_30px_rgba(46,219,255,0.25)] hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-5xl font-extrabold text-risen-primary tracking-tight">
            3%
          </h3>
          <p className="mt-4 text-gray-300">
            Sell Tax – maintaining structural balance and sustainability.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-8 bg-risen-navy/80 backdrop-blur-md rounded-2xl border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_30px_rgba(46,219,255,0.25)] hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-4xl font-bold text-risen-primary">
            Multi-Sig
          </h3>
          <p className="mt-4 text-gray-300">
            Treasury secured by multi-signature governance.
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-8 bg-risen-navy/80 backdrop-blur-md rounded-2xl border border-risen-primary/20 hover:border-risen-primary hover:shadow-[0_0_30px_rgba(46,219,255,0.25)] hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-3xl font-bold text-risen-primary">
            Renounced
          </h3>
          <p className="mt-4 text-gray-300">
            Contract ownership renounced to eliminate rug risk.
          </p>
        </div>

      </div>

      {/* Capital Flow Preview (Engineered Version) */}
      <div className="relative mt-24 max-w-4xl mx-auto">

        <div className="text-center text-gray-400 text-sm mb-8 uppercase tracking-widest">
          Tax Allocation Preview
        </div>

        <div className="w-full h-4 bg-risen-navy rounded-full overflow-hidden border border-risen-primary/20">
          <div className="flex h-full">
            <div className="w-[40%] bg-risen-primary"></div>
            <div className="w-[30%] bg-blue-400"></div>
            <div className="w-[20%] bg-cyan-300"></div>
            <div className="w-[10%] bg-gray-400"></div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-4">
          <span>40% Marketing</span>
          <span>30% Liquidity</span>
          <span>20% Development</span>
          <span>10% Operations</span>
        </div>

      </div>

      {/* Section Divider Light */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-risen-primary/10 to-transparent pointer-events-none" />

    </section>
  );
}