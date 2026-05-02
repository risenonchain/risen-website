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
  const metricLabel = mode === "level" ? "LVL" : "PTS";

  const isUserInTop = entries.some(
    (e) => e.username.trim().toLowerCase() === normalizedCurrentUsername
  );

  const renderEntry = (entry: LeaderboardEntry, isLast = false) => {
    const isCurrentUser = entry.username.trim().toLowerCase() === normalizedCurrentUsername;
    const isPrime = !!entry.is_premium;

    const primaryValue = mode === "level" ? entry.level.toLocaleString() : entry.score.toLocaleString();
    const secondaryLine = mode === "level"
      ? `Score ${entry.score.toLocaleString()}`
      : `Level ${entry.level}`;

    return (
      <div
        key={`${mode}-${entry.rank}-${entry.username}-${isLast ? "sticky" : "list"}`}
        className={[
          "grid grid-cols-[50px_1fr_auto] items-center gap-3 rounded-2xl border px-4 py-3 transition relative overflow-hidden",
          isCurrentUser
            ? "border-amber-400/40 bg-amber-400/10 shadow-[inset_0_0_20px_rgba(251,191,36,0.1)]"
            : "border-white/10 bg-[#07111d]",
          isPrime && !isCurrentUser ? "border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.05)]" : ""
        ].join(" ")}
      >
        {/* Prime Ticker Background Effect */}
        {isPrime && (
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-pulse" />
        )}

        <div
          className={[
            "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black",
            entry.rank === 1 ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]" :
            entry.rank === 2 ? "bg-slate-300 text-black" :
            entry.rank === 3 ? "bg-orange-400 text-black" :
            "border border-white/15 bg-white/5 text-white/60",
          ].join(" ")}
        >
          {entry.rank > 0 ? entry.rank : "?"}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className={[
               "text-sm font-black uppercase tracking-tight",
               isPrime ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "text-white/90"
            ].join(" ")}>
               {entry.username}
            </span>
            {isPrime && (
              <span className="flex items-center">
                 <div className="h-3 w-3 bg-amber-400 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,1)] animate-pulse">
                    <svg className="h-2 w-2 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6">
                       <polyline points="20 6 9 17 4 12" />
                    </svg>
                 </div>
              </span>
            )}
          </div>
          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
            {secondaryLine} {isCurrentUser && "• YOU"}
          </div>
        </div>

        <div className="text-right">
          <div className={[
             "text-sm font-black italic",
             isPrime ? "text-amber-300" : "text-white"
          ].join(" ")}>{primaryValue}</div>
          <div className="text-[8px] font-black uppercase tracking-widest text-white/20">
            {metricLabel}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            {subtitle}
          </div>
          <div className="text-base font-black text-white italic uppercase tracking-widest">{title}</div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="h-8 w-8 flex items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all active:scale-90"
          >
            <svg className={`h-4 w-4 text-white/60 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
               <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-14 w-full animate-pulse rounded-2xl bg-white/5 border border-white/5" />
          ))
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-center">
            <div className="text-xs text-red-300 font-bold uppercase tracking-widest">{error}</div>
          </div>
        ) : (
          <>
            {entries.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center">
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No Data Synced</span>
              </div>
            ) : (
              entries.map((entry) => renderEntry(entry))
            )}

            {!isUserInTop && userEntry && (
              <>
                <div className="flex items-center justify-center py-2">
                  <div className="h-px flex-1 bg-white/5" />
                  <div className="px-4 text-[8px] font-black uppercase tracking-[0.5em] text-white/10">
                    Your Index
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
