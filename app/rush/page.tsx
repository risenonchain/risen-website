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
  startRushSession,
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
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [wallet, setWallet] = useState<any>(null);
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
      const result = await fetchRushWallet();
      setWallet(result);
      setVaultTrialsRemaining(result.vault_trials ?? 0);
    } catch (error) {
      setWalletError("Failed to load wallet");
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
        await loadWallet();
      } catch {
        clearRushAuth();
        router.replace("/rush/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    bootstrap();
  }, [loadWallet, router]);

  useEffect(() => {
    const handler = (event: any) => {
      setLiveScore(event.detail.score);
      setLiveLives(event.detail.lives);
      setLiveLevel(event.detail.level);
      setLiveElapsedSeconds(event.detail.elapsedSeconds);
      setLiveComboMultiplier(event.detail.comboMultiplier);
      setLiveMultiplierActive(event.detail.multiplierActive);
    };

    window.addEventListener("risen-rush-update", handler);
    return () => window.removeEventListener("risen-rush-update", handler);
  }, []);

  const handleStart = async () => {
    try {
      setIsStarting(true);
      setStartError(null);

      const result = await startRushSession();

      setSessionId(result.session_id);
      setTrialsRemaining(result.trials_remaining);
      setVaultTrialsRemaining(result.vault_trials_remaining ?? 0);

      setShowStartModal(false);
      setIsPlaying(true);
    } catch (error: any) {
      setStartError(error.message || "Unable to start game");
    } finally {
      setIsStarting(false);
    }
  };

  const handleGameOver = async (data: FinishData) => {
    setIsPlaying(false);
    setShowGameOverModal(true);

    setFinalScore(data.finalScore);
    setFinalLevel(data.levelReached);
    setFinalElapsedSeconds(data.durationSeconds);

    if (!sessionId) return;

    try {
      await finishRushSession({
        session_id: sessionId,
        final_score: data.finalScore,
        duration_seconds: data.durationSeconds,
        level_reached: data.levelReached,
        lives_remaining: data.livesRemaining,
      });

      await loadWallet();
    } catch {
      setSubmitError("Failed to save session");
    }
  };

  if (isCheckingAuth) {
    return <div>Loading RISEN Rush...</div>;
  }

  return (
    <main className="min-h-screen bg-[#02070d] text-white">
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
        onPlayAgain={() => setShowStartModal(true)}
        isSubmitting={false}
        submitError={submitError}
      />

      <RewardMeter availablePoints={wallet?.available_points ?? 0} />
    </main>
  );
}
