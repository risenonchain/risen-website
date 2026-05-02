"use client";

type Props = {
  isOpen: boolean;
  onStart: () => void;
  isLoading: boolean;
  error: string | null;
  trialsRemaining: number;
  onWatchAd: () => void;
  isAdLoading: boolean;
  isPremium?: boolean;
};

export default function StartModal({
  isOpen,
  onStart,
  isLoading,
  error,
  trialsRemaining,
  onWatchAd,
  isAdLoading,
  isPremium = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#02050b]/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#07111d]/95 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between">
          <div className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
            Mini Game
          </div>
          {isPremium && (
            <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              Prime Access
            </div>
          )}
        </div>

        <h2 className="mt-3 text-3xl font-bold text-white">RISEN Rush</h2>

        <p className="mt-4 leading-7 text-white/75">
          Catch falling $RSN, avoid destructive drops, survive as long as you can,
          and climb levels every 60 seconds while your lives hold.
        </p>

        <div className="mt-6 grid gap-3 text-sm text-white/80">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            Normal RSN = 5 points (1 RSN = 1,000 points)
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            Golden RSN = 20 points (1 RSN = 1,000 points)
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            Red Crash Orb, Heavy Drop, and Glitch Block reduce both score and lives
          </div>
          <div className={`rounded-2xl border ${isPremium ? "border-amber-400/30 bg-amber-400/5 text-amber-200" : "border-white/10 bg-white/5" } px-4 py-3`}>
            {isPremium ? "You have UNLIMITED PRIME TRIALS enabled." : "You get 3 free trials per day"}
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onStart}
            disabled={isLoading || (!isPremium && trialsRemaining <= 0)}
            className={`inline-flex items-center justify-center rounded-2xl ${isPremium ? "bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "bg-amber-400"} px-5 py-3 font-semibold text-black transition hover:scale-[1.01] disabled:opacity-40`}
          >
            {isLoading ? "Starting..." : (isPremium || trialsRemaining > 0) ? "Start Rush" : "No Trials Left"}
          </button>

          {!isPremium && trialsRemaining <= 0 && (
            <button
              onClick={onWatchAd}
              disabled={isAdLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-risen-primary/30 bg-risen-primary/10 px-5 py-3 font-semibold text-risen-primary transition hover:bg-risen-primary/20 disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              {isAdLoading ? "Loading Ad..." : "Watch Ad for +1 Trial"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
