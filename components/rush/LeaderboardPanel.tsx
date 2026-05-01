import { LeaderboardEntry } from "@/lib/api";

type Props = {
  entries: LeaderboardEntry[];
  userEntry?: LeaderboardEntry | null;
  currentUsername?: string | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  title?: string;
  subtitle?: string;
  mode?: "score" | "level";
};

export default function LeaderboardPanel({
  entries,
  userEntry = null,
  currentUsername = null,
  loading = false,
  error = null,
  onRetry,
  title = "Top Players",
  subtitle = "Rush Leaderboard",
  mode = "score",
}: Props) {
  const normalizedCurrentUsername = (currentUsername || "").trim().toLowerCase();
  const metricLabel = mode === "level" ? "level" : "points";

  const isUserInTop = entries.some(
    (e) => e.username.trim().toLowerCase() === normalizedCurrentUsername
  );

  const renderEntry = (entry: LeaderboardEntry, isLast = false) => {
    const isCurrentUser =
      entry.username.trim().toLowerCase() === normalizedCurrentUsername;

    const primaryValue =
      mode === "level" ? entry.level.toLocaleString() : entry.score.toLocaleString();

    const secondaryLine =
      mode === "level"
        ? `Score ${entry.score.toLocaleString()}${isCurrentUser ? " • You" : ""}`
        : `Level ${entry.level}${isCurrentUser ? " • You" : ""}`;

    return (
      <div
        key={`${mode}-${entry.rank}-${entry.username}-${isLast ? "sticky" : "list"}`}
        className={[
          "grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl border px-4 py-3 transition",
          isCurrentUser
            ? "border-amber-400/30 bg-amber-400/10"
            : "border-white/10 bg-[#07111d]",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
            entry.rank > 0 && entry.rank <= 3
              ? "border border-amber-400/30 bg-amber-400/10 text-amber-200"
              : "border border-white/15 bg-white/5 text-white/85",
          ].join(" ")}
        >
          #{entry.rank > 0 ? entry.rank : "?"}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 truncate text-sm font-semibold text-white">
            {entry.username}
            {entry.is_premium && (
              <span className="shrink-0 inline-flex items-center rounded-md bg-risen-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-risen-primary border border-risen-primary/30 shadow-[0_0_10px_rgba(46,219,255,0.2)]">
                Prime
              </span>
            )}
          </div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/45">
            {secondaryLine}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-white">{primaryValue}</div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/45">
            {metricLabel}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm uppercase tracking-[0.25em] text-white/55">
            {subtitle}
          </div>
          <div className="mt-1 text-lg font-semibold text-white">{title}</div>
        </div>

        {onRetry ? (
          <button
            onClick={onRetry}
            className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-400/15"
          >
            Refresh
          </button>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-[#07111d] px-4 py-3"
            >
              <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-12 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-white/75">
            <div className="font-medium text-white">Failed to load leaderboard.</div>
            <div className="mt-1 text-white/60">{error}</div>
            {onRetry ? (
              <button
                onClick={onRetry}
                className="mt-3 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
              >
                Try again
              </button>
            ) : null}
          </div>
        ) : (
          <>
            {entries.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#07111d] px-4 py-4 text-sm text-white/65">
                No leaderboard entries yet.
              </div>
            ) : (
              entries.map((entry) => renderEntry(entry))
            )}

            {!isUserInTop && userEntry && (
              <>
                <div className="flex items-center justify-center py-1">
                  <div className="h-px flex-1 bg-white/5" />
                  <div className="px-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                    Your Position
                  </div>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                {renderEntry(userEntry, true)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
