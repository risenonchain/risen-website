import type { RefObject } from "react";

type Props = {
  isOpen: boolean;
  onStart: () => void;
  isLoading: boolean;
  error: string | null;
  turnstileRef?: RefObject<HTMLDivElement | null>;
  turnstileEnabled?: boolean;
};

export default function StartModal({
  isOpen,
  onStart,
  isLoading,
  error,
  turnstileRef,
  turnstileEnabled = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#02050b]/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#07111d]/95 p-8 shadow-2xl">
        <div className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
          Mini Game
        </div>

        <h2 className="mt-3 text-3xl font-bold text-white">RISEN Rush</h2>

        <p className="mt-4 leading-7 text-white/75">
          Catch falling $RSN, avoid destructive drops, survive as long as you can,
          and climb levels every 30 seconds while your lives hold.
        </p>

        <div className="mt-6 grid gap-3 text-sm text-white/80">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            Normal RSN = 5 points
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            Golden RSN = 20 points
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            Red Crash Orb, Heavy Drop, and Glitch Block reduce both score and lives
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            You get 3 trials per day
          </div>
        </div>

        {turnstileEnabled && turnstileRef ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <div className="mb-3 text-xs uppercase tracking-[0.22em] text-white/50">
              Verification Required
            </div>
            <div ref={turnstileRef} className="min-h-[70px]" />
          </div>
        ) : null}

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button
          onClick={onStart}
          disabled={isLoading}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:scale-[1.01] disabled:opacity-60"
        >
          {isLoading ? "Starting..." : "Start Rush"}
        </button>
      </div>
    </div>
  );
}