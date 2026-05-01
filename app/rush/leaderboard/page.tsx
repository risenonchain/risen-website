"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LeaderboardPanel from "@/components/rush/LeaderboardPanel";
import {
  clearRushAuth,
  fetchCurrentRushUser,
  fetchRushProfileStats,
  fetchRushTopLevelLeaderboard,
  fetchRushTopScoreLeaderboard,
  hasRushToken,
  LeaderboardEntry,
  MeResponse,
  ProfileStatsResponse,
} from "@/lib/api";

export default function RushLeaderboardPage() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStatsResponse | null>(null);

  const [topScoreEntries, setTopScoreEntries] = useState<LeaderboardEntry[]>([]);
  const [topLevelEntries, setTopLevelEntries] = useState<LeaderboardEntry[]>([]);

  const [scoreLoading, setScoreLoading] = useState(true);
  const [levelLoading, setLevelLoading] = useState(true);

  const [scoreError, setScoreError] = useState<string | null>(null);
  const [levelError, setLevelError] = useState<string | null>(null);

  const loadTopScore = useCallback(async () => {
    try {
      setScoreLoading(true);
      setScoreError(null);
      const result = await fetchRushTopScoreLeaderboard();
      setTopScoreEntries(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load top score leaderboard";
      setScoreError(message);
    } finally {
      setScoreLoading(false);
    }
  }, []);

  const loadTopLevel = useCallback(async () => {
    try {
      setLevelLoading(true);
      setLevelError(null);
      const result = await fetchRushTopLevelLeaderboard();
      setTopLevelEntries(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load top level leaderboard";
      setLevelError(message);
    } finally {
      setLevelLoading(false);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (!hasRushToken()) {
        router.replace("/rush/login");
        return;
      }

      try {
        const [me, stats] = await Promise.all([
          fetchCurrentRushUser(),
          fetchRushProfileStats(),
        ]);

        setCurrentUser(me);
        setProfileStats(stats);
        localStorage.setItem("risen_rush_username", me.username);

        await Promise.all([loadTopScore(), loadTopLevel()]);
      } catch {
        clearRushAuth();
        router.replace("/rush/login");
        return;
      } finally {
        setIsCheckingAuth(false);
      }
    };

    bootstrap();
  }, [loadTopLevel, loadTopScore, router]);

  const handleLogout = () => {
    clearRushAuth();
    router.push("/rush/login");
  };

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#02070d] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70">
          Loading leaderboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#02070d] text-white">
      <section className="relative overflow-hidden px-4 py-5 sm:px-6 sm:py-8 md:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(46,219,255,0.14),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.10),transparent_18%)]" />

        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-risen-primary/20 bg-risen-primary/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-risen-primary">
                <span className="h-2 w-2 rounded-full bg-risen-primary shadow-[0_0_14px_rgba(46,219,255,0.9)]" />
                RISEN Rankings
              </div>

              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Leaderboards
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72 sm:text-base sm:leading-7">
                Track the strongest players by highest score and by deepest level reached.
                Both boards show the current top 20 performers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                Signed in as{" "}
                <span className="font-semibold text-white">
                  {currentUser?.username || "Player"}
                </span>
              </div>

              <Link
                href="/rush"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to Rush
              </Link>

              <Link
                href="/rush/profile"
                className="rounded-2xl border border-risen-primary/25 bg-risen-primary/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-risen-primary/20"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <LeaderboardPanel
              entries={topScoreEntries}
              userEntry={
                profileStats
                  ? {
                      rank: profileStats.score_rank || 0,
                      username: currentUser?.username || "",
                      score: profileStats.best_score || 0,
                      level: profileStats.best_level || 0,
                    }
                  : null
              }
              currentUsername={currentUser?.username}
              loading={scoreLoading}
              error={scoreError}
              onRetry={loadTopScore}
              title="Top Score"
              subtitle="Highest Points"
              mode="score"
            />

            <LeaderboardPanel
              entries={topLevelEntries}
              userEntry={
                profileStats
                  ? {
                      rank: profileStats.level_rank || 0,
                      username: currentUser?.username || "",
                      score: profileStats.best_score || 0,
                      level: profileStats.best_level || 0,
                    }
                  : null
              }
              currentUsername={currentUser?.username}
              loading={levelLoading}
              error={levelError}
              onRetry={loadTopLevel}
              title="Top Level"
              subtitle="Deepest Run"
              mode="level"
            />
          </div>
        </div>
      </section>
    </main>
  );
}