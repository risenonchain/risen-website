type Props = {
  isOpen: boolean;
  score: number;
  level: number;
  elapsedSeconds: number;
  walletPoints: number | null;
  onPlayAgain: () => void;
  isSubmitting: boolean;
  submitError: string | null;
};

export default function GameOverModal({
  isOpen,
  score,
  level,
  elapsedSeconds,
  walletPoints,
  onPlayAgain,
  isSubmitting,
  submitError,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#02050b]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#07111d]/95 p-8 shadow-2xl">
        <div className="text-sm uppercase tracking-[0.3em] text-red-300/80">
          Session Complete
        </div>

        <h2 className="mt-3 text-3xl font-bold text-white">Game Over</h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <InfoCard label="Final Score" value={score.toLocaleString()} />
          <InfoCard label="Level Reached" value={String(level)} />
          <InfoCard label="Time Survived" value={`${elapsedSeconds}s`} />
          <InfoCard
            label="Wallet Points"
            value={walletPoints !== null ? walletPoints.toLocaleString() : "--"}
          />
        </div>

        {submitError ? (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {submitError}
          </div>
        ) : null}

        <button
          onClick={onPlayAgain}
          disabled={isSubmitting}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-[1.01] disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Play Again"}
        </button>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}