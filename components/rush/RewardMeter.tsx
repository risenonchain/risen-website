type Props = {
  availablePoints: number;
};

export default function RewardMeter({ availablePoints }: Props) {
  const threshold = 100000;
  const ratio = Math.min(availablePoints / threshold, 1);
  const estimatedRSN = availablePoints / 10000;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm uppercase tracking-[0.25em] text-white/55">
        Launch Conversion Meter
      </div>

      <div className="mt-4 text-2xl font-bold text-white">
        {availablePoints.toLocaleString()} points
      </div>

      <div className="mt-2 text-sm text-white/70">
        Estimated future value: {estimatedRSN.toFixed(2)} RSN
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-500"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      <div className="mt-3 text-sm text-white/65">
        Minimum claim threshold: 100,000 points
      </div>
    </div>
  );
}