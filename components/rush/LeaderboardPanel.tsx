type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  level: number;
};

type Props = {
  entries: LeaderboardEntry[];
};

export default function LeaderboardPanel({ entries }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm uppercase tracking-[0.25em] text-white/55">
        Rush Leaderboard
      </div>

      <div className="mt-4 space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#07111d] px-4 py-4 text-sm text-white/65">
            No leaderboard entries yet.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={`${entry.rank}-${entry.username}`}
              className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-[#07111d] px-4 py-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-sm font-semibold text-amber-200">
                #{entry.rank}
              </div>

              <div>
                <div className="text-sm font-semibold text-white">
                  {entry.username}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Level {entry.level}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  {entry.score.toLocaleString()}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                  points
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}