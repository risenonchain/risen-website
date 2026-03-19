type Props = {
  score: number;
  lives: number;
  level: number;
  elapsedSeconds: number;
  comboMultiplier: number;
  multiplierActive: boolean;
  trialsRemaining: number;
  isPaused: boolean;
  onTogglePause: () => void;
  canPause?: boolean;
};

export default function GameHUD({
  score,
  lives,
  level,
  elapsedSeconds,
  comboMultiplier,
  multiplierActive,
  trialsRemaining,
  isPaused,
  onTogglePause,
  canPause = true,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        <StatCard label="Score" value={score.toLocaleString()} />
        <StatCard label="Lives" value={String(lives)} />
        <StatCard label="Level" value={String(level)} />
        <StatCard label="Time" value={`${elapsedSeconds}s`} />
        <StatCard label="Combo" value={`${comboMultiplier.toFixed(1)}x`} />
        <StatCard
          label="Trials Left"
          value={String(trialsRemaining)}
          highlight={multiplierActive}
        />
        <StatCard
          label="Status"
          value={isPaused ? "Paused" : "Live"}
          highlight={isPaused}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.18em] text-white/45">
          Press P or tap the button to {isPaused ? "resume" : "pause"}
        </div>

        <button
          type="button"
          onClick={onTogglePause}
          disabled={!canPause}
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl border px-4 py-3 backdrop-blur-md shadow-sm " +
        (highlight
          ? "border-amber-400/50 bg-amber-400/10"
          : "border-white/10 bg-white/5")
      }
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}