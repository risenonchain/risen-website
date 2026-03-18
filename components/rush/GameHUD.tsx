type Props = {
  score: number;
  lives: number;
  level: number;
  elapsedSeconds: number;
  comboMultiplier: number;
  multiplierActive: boolean;
  trialsRemaining: number;
};

export default function GameHUD({
  score,
  lives,
  level,
  elapsedSeconds,
  comboMultiplier,
  multiplierActive,
  trialsRemaining,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
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