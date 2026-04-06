"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GameCanvas from "@/components/rush/GameCanvas";
import GameHUD from "@/components/rush/GameHUD";
import GameOverModal from "@/components/rush/GameOverModal";
import RewardMeter from "@/components/rush/RewardMeter";
import StartModal from "@/components/rush/StartModal";
import {
  clearRushAuth,
  fetchCurrentRushUser,
  fetchRushWallet,
  finishRushSession,
  hasRushToken,
  MeResponse,
  startRushSession,
  WalletResponse,
} from "@/lib/api";

type FinishData = {
  finalScore: number;
  durationSeconds: number;
  levelReached: number;
  livesRemaining: number;
};

export default function RushPage() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);

  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  const [showStartModal, setShowStartModal] = useState(true);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const [startError, setStartError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [trialsRemaining, setTrialsRemaining] = useState(3);
  const [dailyTrialsRemaining, setDailyTrialsRemaining] = useState(3);
  const [vaultTrialsRemaining, setVaultTrialsRemaining] = useState(0);

  const [liveScore, setLiveScore] = useState(0);
  const [liveLives, setLiveLives] = useState(3);
  const [liveLevel, setLiveLevel] = useState(1);
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState(0);
  const [liveComboMultiplier, setLiveComboMultiplier] = useState(1);
  const [liveMultiplierActive, setLiveMultiplierActive] = useState(false);

  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);
  const [finalElapsedSeconds, setFinalElapsedSeconds] = useState(0);

  const loadWallet = useCallback(async () => {
    try {
      setWalletError(null);
      const result = await fetchRushWallet();
      setWallet(result);
      setVaultTrialsRemaining(result.vault_trials ?? 0);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load wallet";
      setWalletError(message);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (!hasRushToken()) {
        router.replace("/rush/login");
        return;
      }

      try {
        const me = await fetchCurrentRushUser();
        setCurrentUser(me);
        localStorage.setItem("risen_rush_username", me.username);
        await loadWallet();
      } catch {
        clearRushAuth();
        router.replace("/rush/login");
        return;
      } finally {
        setIsCheckingAuth(false);
      }
    };

    bootstrap();
  }, [loadWallet, router]);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{
        score: number;
        lives: number;
        level: number;
        elapsedSeconds: number;
        comboMultiplier: number;
        multiplierActive: boolean;
      }>;

      setLiveScore(customEvent.detail.score);
      setLiveLives(customEvent.detail.lives);
      setLiveLevel(customEvent.detail.level);
      setLiveElapsedSeconds(customEvent.detail.elapsedSeconds);
      setLiveComboMultiplier(customEvent.detail.comboMultiplier);
      setLiveMultiplierActive(customEvent.detail.multiplierActive);
    };

    window.addEventListener("risen-rush-update", handler as EventListener);

    return () => {
      window.removeEventListener("risen-rush-update", handler as EventListener);
    };
  }, []);

  const handleStart = async () => {
    try {
      setIsStarting(true);
      setStartError(null);
      setSubmitError(null);

      const result = await startRushSession();

      setSessionId(result.session_id);
      setTrialsRemaining(result.trials_remaining);
      setDailyTrialsRemaining(result.daily_trials_remaining ?? 0);
      setVaultTrialsRemaining(result.vault_trials_remaining ?? 0);

      setLiveScore(0);
      setLiveLives(result.starting_lives);
      setLiveLevel(1);
      setLiveElapsedSeconds(0);
      setLiveComboMultiplier(1);
      setLiveMultiplierActive(false);

      setShowStartModal(false);
      setShowGameOverModal(false);
      setIsPlaying(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start game";
      setStartError(message);
    } finally {
      setIsStarting(false);
    }
  };

  const handleGameOver = useCallback(
    async (data: FinishData) => {
      setIsPlaying(false);
      setShowGameOverModal(true);

      setFinalScore(data.finalScore);
      setFinalLevel(data.levelReached);
      setFinalElapsedSeconds(data.durationSeconds);

      if (!sessionId) return;

      try {
        setIsSubmitting(true);
        setSubmitError(null);

        await finishRushSession({
          session_id: sessionId,
          final_score: data.finalScore,
          duration_seconds: data.durationSeconds,
          level_reached: data.levelReached,
          lives_remaining: data.livesRemaining,
        });

        await loadWallet();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to save session";
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadWallet, sessionId]
  );

  const handlePlayAgain = () => {
    setShowGameOverModal(false);
    setShowStartModal(true);
    setSessionId(null);
    setStartError(null);
  };

  const handleLogout = () => {
    clearRushAuth();
    router.push("/rush/login");
  };

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#02070d] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70">
          Loading RISEN Rush...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#02070d] text-white">
      <section className="relative overflow-hidden px-3 py-4 sm:px-6 sm:py-8 md:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_18%)]" />

        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[10px] sm:px-4 sm:py-2 sm:text-xs uppercase tracking-[0.32em] text-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.9)]" />
                RISEN Rush Live
              </div>

              <h1 className="mt-3 text-2xl font-bold sm:text-4xl md:text-5xl">
                RISEN Rush
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/72 sm:mt-4 sm:text-base sm:leading-7">
                Catch falling $RSN, survive destructive drops, push through rising
                levels, and build points toward future launch conversion.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 sm:px-4 sm:py-3 sm:text-sm">
                Signed in as{" "}
                <span className="font-semibold text-white">
                  {currentUser?.username || "Player"}
                </span>
              </div>

              <Link
                href="/rush/profile"
                className="rounded-2xl border border-risen-primary/25 bg-risen-primary/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-risen-primary/20 sm:px-4 sm:py-3 sm:text-sm"
              >
                Profile
              </Link>

              <Link
                href="/rush/leaderboard"
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4 sm:py-3 sm:text-sm"
              >
                Leaderboard
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4 sm:py-3 sm:text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mb-4 grid gap-3 sm:mb-6 md:grid-cols-3">
            <TopStatCard label="Daily Trials Left" value={dailyTrialsRemaining} />
            <TopStatCard label="Vault Trials" value={vaultTrialsRemaining} />
            <TopStatCard label="Total Playable" value={trialsRemaining} />
          </div>

          <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="relative">
              <GameHUD
                score={liveScore}
                lives={liveLives}
                level={liveLevel}
                elapsedSeconds={liveElapsedSeconds}
                comboMultiplier={liveComboMultiplier}
                multiplierActive={liveMultiplierActive}
                trialsRemaining={trialsRemaining}
              />

              <div className="relative mt-3 sm:mt-4">
                <GameCanvas isPlaying={isPlaying} onGameOver={handleGameOver} />

                <StartModal
                  isOpen={showStartModal}
                  onStart={handleStart}
                  isLoading={isStarting}
                  error={startError}
                />

                <GameOverModal
                  isOpen={showGameOverModal}
                  score={finalScore}
                  level={finalLevel}
                  elapsedSeconds={finalElapsedSeconds}
                  walletPoints={wallet?.available_points ?? null}
                  onPlayAgain={handlePlayAgain}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                />
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <RewardMeter availablePoints={wallet?.available_points ?? 0} />

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/55">
                  Quick Actions
                </div>

                <div className="mt-4 grid gap-3">
                  <Link
                    href="/rush/profile"
                    className="rounded-2xl border border-risen-primary/25 bg-risen-primary/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-risen-primary/20"
                  >
                    Open Profile
                  </Link>

                  <Link
                    href="/rush/leaderboard"
                    className="rounded-2xl border border-white/10 bg-[#07111d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View Leaderboards
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/55">
                  Game Rules
                </div>

                <div className="mt-4 space-y-3 text-sm text-white/75">
                  <RuleItem title="Catch to score">
                    Normal RSN gives 5 points. Golden RSN gives 20 points.
                  </RuleItem>

                  <RuleItem title="Survive longer">
                    Level increases every 30 seconds while you still have lives.
                  </RuleItem>

                  <RuleItem title="Use multipliers">
                    Multiplier pickups grant 2x scoring for 5 seconds.
                  </RuleItem>

                  <RuleItem title="Avoid bad drops">
                    Crash orbs, heavy drops, and glitch blocks reduce score and lives.
                  </RuleItem>

                  <RuleItem title="Referral rewards">
                    Referral bonuses are stored as vault trials.
                  </RuleItem>

                  <RuleItem title="Claim threshold">
                    Minimum future redemption threshold is 100,000 points.
                  </RuleItem>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/55">
                  Wallet Snapshot
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <WalletStat
                    label="Available Points"
                    value={wallet?.available_points ?? 0}
                  />
                  <WalletStat
                    label="Vault Trials"
                    value={wallet?.vault_trials ?? 0}
                  />
                </div>

                {walletError ? (
                  <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {walletError}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function WalletStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111d] px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-white">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function TopStatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-white">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function RuleItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111d] px-4 py-3">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs leading-6 text-white/65">{children}</div>
    </div>
  );
}
