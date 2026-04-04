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
      const customEvent = event as CustomEvent<any>;

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
      <section className="px-4 py-4 flex justify-between items-center">
        <div>
          Signed in as{" "}
          <span className="font-semibold text-white">
            {currentUser?.username || "Player"}
          </span>
        </div>

        <div className="flex gap-3">
          <Link href="/rush/profile">Profile</Link>
          <Link href="/rush/leaderboard">Leaderboard</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </section>

      <GameHUD
        score={liveScore}
        lives={liveLives}
        level={liveLevel}
        elapsedSeconds={liveElapsedSeconds}
        comboMultiplier={liveComboMultiplier}
        multiplierActive={liveMultiplierActive}
        trialsRemaining={trialsRemaining}
      />

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

      {walletError && (
        <div className="p-4 text-red-400 text-sm">{walletError}</div>
      )}

      <RewardMeter availablePoints={wallet?.available_points ?? 0} />
    </main>
  );
}
