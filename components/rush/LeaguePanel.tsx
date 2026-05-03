"use client";

type Props = {
  isPremium?: boolean;
};

export default function LeaguePanel({ isPremium = false }: Props) {
  return (
    <div className="text-center py-10">
      {/* Immersive League Icon */}
      <div className="h-28 w-28 bg-[#030913] rounded-[40px] rotate-12 flex items-center justify-center mx-auto mb-10 border border-amber-400/20 shadow-[0_0_50px_rgba(251,191,36,0.1)] relative">
        <span className="text-6xl -rotate-12">⚔️</span>
        <div className="absolute -top-2 -right-2 h-8 w-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-[#07111d] animate-bounce">
          <span className="text-[10px] font-black text-black">!</span>
        </div>
      </div>

      <h3 className="text-2xl font-black uppercase tracking-tight italic mb-3 text-white">
        Neural League: S1
      </h3>

      <p className="text-sm text-white/40 px-8 mb-12 leading-relaxed font-bold">
        Deployment in <span className="text-amber-400">28 Cycles</span>.{" "}
        {isPremium ? (
          <span className="text-amber-400">Prime users auto-qualify for the RSN100,000 algorithmic prize pool.</span>
        ) : (
          "Upgrade to Prime to qualify for the RSN100,000 prize pool."
        )}
      </p>

      {/* Progress / Status Node */}
      <div className="bg-[#030913] rounded-[35px] p-8 border border-white/5 shadow-inner relative overflow-hidden group">
        <div className="absolute inset-0 bg-amber-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <div className="text-[9px] uppercase tracking-[0.5em] text-amber-400 font-black mb-3">
          Sync Status
        </div>
        <div className="text-sm font-black uppercase tracking-widest text-white/70 italic animate-pulse">
          Algorithmic Initialization...
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5">
        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.8em]">
          League_Node_Active
        </p>
      </div>
    </div>
  );
}
