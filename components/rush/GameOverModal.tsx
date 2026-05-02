"use client";

type Props = {
  isOpen: boolean;
  score: number;
  level: number;
  elapsedSeconds: number;
  walletPoints: number | null;
  onPlayAgain: () => void;
  onHome?: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  isPremium?: boolean;
  onGoPremium?: () => void;
};

export default function GameOverModal({
  isOpen,
  score,
  level,
  elapsedSeconds,
  walletPoints,
  onPlayAgain,
  onHome,
  isSubmitting,
  submitError,
  isPremium = false,
  onGoPremium,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#02050b]/90 backdrop-blur-md p-6">
      <div className="w-full max-w-lg rounded-[45px] border border-white/10 bg-[#07111d]/95 p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-[modalPop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">

        {!isPremium && (
          <div className="mb-8 rounded-3xl border border-amber-400/30 bg-amber-400/5 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3">
               <span className="text-[10px] font-black text-amber-400/40 uppercase tracking-widest">Sponsored</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Risen Prime Elite</h3>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Unlock <span className="text-amber-400 font-bold">Unlimited Trials</span>,
                <span className="text-amber-400 font-bold"> 1.1x Points</span>, and enter the
                <span className="text-amber-400 font-bold"> Global League</span>.
              </p>
              <button
                onClick={onGoPremium}
                className="mt-5 w-full rounded-2xl bg-amber-400 py-3 text-xs font-black text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-transform active:scale-95"
              >
                UPGRADE FOR $1
              </button>
            </div>
          </div>
        )}

        <div className="text-[11px] uppercase tracking-[0.4em] text-red-400 font-black mb-2 italic">
          Session Terminated
        </div>

        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-8">Game Over</h2>

        <div className="grid grid-cols-2 gap-4">
          <InfoCard label="Final Score" value={score.toLocaleString()} />
          <InfoCard label="Level Reached" value={String(level)} />
          <InfoCard label="Time Survived" value={`${elapsedSeconds}s`} />
          <InfoCard
            label="Vault Points"
            value={walletPoints !== null ? walletPoints.toLocaleString() : "--"}
          />
        </div>

        {submitError ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {submitError}
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-2 gap-4">
          <button
            onClick={onPlayAgain}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 font-black text-black uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Syncing..." : "Play Again"}
          </button>

          <button
            onClick={onHome}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-black text-white uppercase tracking-widest text-xs transition-all active:scale-95 hover:bg-white/10"
          >
            Lobby
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes modalPop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-[#030913] p-5 shadow-inner">
      <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold mb-1">
        {label}
      </div>
      <div className="text-xl font-black text-white italic tracking-tighter">{value}</div>
    </div>
  );
}
