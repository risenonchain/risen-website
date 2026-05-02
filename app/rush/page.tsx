"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameCanvas from "@/components/rush/GameCanvas";
import GameOverModal from "@/components/rush/GameOverModal";
import RewardMeter from "@/components/rush/RewardMeter";
import LeaderboardPanel from "@/components/rush/LeaderboardPanel";
import { initializeAdMob, showRewardedAd } from "@/lib/admob";
import { rushAudio } from "@/lib/rushAudio";
import {
  claimAdReward,
  clearRushAuth,
  fetchCurrentRushUser,
  fetchRushProfileStats,
  fetchRushWallet,
  finishRushSession,
  hasRushToken,
  MeResponse,
  ProfileStatsResponse,
  startRushSession,
  WalletResponse,
  fetchRushLeaderboard,
  fetchRushTopLevelLeaderboard,
  LeaderboardEntry,
  updateRushProfile,
  changeRushPassword,
  fetchRushReferralInfo,
  fetchMyRedemptionRequests,
  createRedemptionRequest,
  ReferralInfoResponse,
  RedemptionRequestResponse
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
  const [profileStats, setProfileStats] = useState<ProfileStatsResponse | null>(null);
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  const [activePanel, setActivePanel] = useState<"info" | "settings" | "contest" | "profile" | "ranks" | null>(null);
  const [rankTab, setRankTab] = useState<"score" | "level">("score");

  const [scoreLeaderboard, setScoreLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [levelLeaderboard, setLevelLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);

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

  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("risen_rush_sound_enabled");
      setSoundEnabled(saved === null ? true : saved === "true");
    }
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("risen_rush_sound_enabled", String(next));
      rushAudio.setEnabled(next);
    }
  }, [soundEnabled]);

  const loadWallet = useCallback(async () => {
    try {
      setWalletError(null);
      const result = await fetchRushWallet();
      setWallet(result);

      if (!isPlaying) {
        setVaultTrialsRemaining(profileStats?.is_premium ? 999 : (result.vault_trials ?? 0));
      }
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Failed to load wallet");
    }
  }, [isPlaying, profileStats?.is_premium]);

  const loadLeaderboards = useCallback(async () => {
    try {
      setIsLeaderboardLoading(true);
      const [scores, levels] = await Promise.all([
         fetchRushLeaderboard(),
         fetchRushTopLevelLeaderboard()
      ]);
      setScoreLeaderboard(scores);
      setLevelLeaderboard(levels);
    } catch (err) {
      console.error("Leaderboard sync error", err);
    } finally {
      setIsLeaderboardLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activePanel === 'ranks') loadLeaderboards();
  }, [activePanel, loadLeaderboards]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!hasRushToken()) {
        router.replace("/rush/login");
        return;
      }

      if (typeof window !== "undefined" && (window as any).Capacitor) {
        initializeAdMob();
      }

      try {
        const [me, stats] = await Promise.all([
          fetchCurrentRushUser(),
          fetchRushProfileStats(),
        ]);
        setCurrentUser(me);
        setProfileStats(stats);
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

      if (!profileStats?.is_premium && trialsRemaining <= 0) {
        setStartError("No trials remaining. Watch an ad to get back in the game!");
        setIsStarting(false);
        return;
      }

      rushAudio.stopBGM();
      const result = await startRushSession();
      setSessionId(result.session_id);

      if (profileStats?.is_premium) {
        setTrialsRemaining(999);
      } else {
        setTrialsRemaining(result.trials_remaining);
        setDailyTrialsRemaining(result.daily_trials_remaining ?? 0);
        setVaultTrialsRemaining(result.vault_trials_remaining ?? 0);
      }

      setLiveScore(0);
      setLiveLives(result.starting_lives);
      setLiveLevel(1);
      setLiveElapsedSeconds(0);
      setLiveComboMultiplier(1);
      setLiveMultiplierActive(false);

      setShowGameOverModal(false);
      setIsPlaying(true);
      setActivePanel(null);
    } catch (error) {
      setStartError(error instanceof Error ? error.message : "Unable to start game");
    } finally {
      setIsStarting(false);
    }
  };

  const handleGameOver = useCallback(
    async (data: FinishData) => {
      setShowGameOverModal(true);
      rushAudio.playGameOver();
      setTimeout(() => rushAudio.startBGM(), 1500);

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

        const [newMe, newStats, newWallet] = await Promise.all([
           fetchCurrentRushUser(),
           fetchRushProfileStats(),
           fetchRushWallet()
        ]);

        setCurrentUser(newMe);
        setProfileStats(newStats);
        setWallet(newWallet);
        setVaultTrialsRemaining(newWallet.vault_trials ?? 0);

        try {
           const info = await startRushSession();
           if (newStats.is_premium) {
             setTrialsRemaining(999);
           } else {
             setTrialsRemaining(info.trials_remaining);
             setDailyTrialsRemaining(info.daily_trials_remaining ?? 0);
           }
        } catch {
           setTrialsRemaining(newStats.is_premium ? 999 : 0);
        }

      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Failed to save session");
      } finally {
        setIsSubmitting(false);
      }
    },
    [sessionId]
  );

  const handlePlayAgain = () => {
    setShowGameOverModal(false);
    setSessionId(null);
    setStartError(null);
    handleStart();
  };

  const handleHome = () => {
    setShowGameOverModal(false);
    setIsPlaying(false);
    setSessionId(null);
    setStartError(null);
  };

  const handleWatchAd = async () => {
    if (typeof window === "undefined" || !(window as any).Capacitor) {
      setStartError("Ads are only available in the mobile app.");
      return;
    }

    try {
      setIsAdLoading(true);
      setStartError(null);

      const reward = await showRewardedAd();
      if (reward) {
        try {
          await claimAdReward();
          await loadWallet();
          setTrialsRemaining(prev => prev + 1);
          setVaultTrialsRemaining(prev => prev + 1);
          setStartError(null);
        } catch {
          setStartError("Ad finished, but reward sync failed.");
        }
      }
    } catch {
      setStartError("Failed to load rewarded ad.");
    } finally {
      setIsAdLoading(false);
    }
  };

  const handleLogout = () => {
    clearRushAuth();
    router.push("/rush/login");
  };

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#02070d] text-white font-sans">
        <div className="relative flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/5 border-t-risen-primary shadow-[0_0_20px_rgba(46,219,255,0.2)]" />
          <div className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 animate-pulse">Establishing Logic...</div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-[#02070d] text-white flex flex-col items-center overflow-x-hidden ${isPlaying ? "fixed inset-0 z-[100]" : "w-full"}`}>

      <GameOverModal
        isOpen={showGameOverModal}
        score={finalScore}
        level={finalLevel}
        elapsedSeconds={finalElapsedSeconds}
        walletPoints={wallet?.available_points ?? null}
        onPlayAgain={handlePlayAgain}
        onHome={handleHome}
        isSubmitting={isSubmitting}
        submitError={submitError}
        isPremium={profileStats?.is_premium}
        onGoPremium={() => { setShowGameOverModal(false); setIsPlaying(false); setActivePanel('profile'); }}
      />

      {isPlaying ? (
        <section className="h-full w-full p-0 flex flex-col relative">
           <div className="flex-1 w-full flex flex-col">
              <div className="flex-1 flex flex-col h-full">
                <div className="flex-1 h-full flex flex-col w-full">
                  <GameCanvas
                    isPlaying={isPlaying}
                    isPremium={profileStats?.is_premium}
                    onGameOver={handleGameOver}
                  />
                </div>
              </div>
           </div>
        </section>
      ) : (
        <LobbyView
          user={currentUser}
          stats={profileStats}
          dailyTrials={dailyTrialsRemaining}
          vaultTrials={vaultTrialsRemaining}
          totalTrials={trialsRemaining}
          isPremium={profileStats?.is_premium}
          onStart={handleStart}
          isStarting={isStarting}
          startError={startError}
          onWatchAd={handleWatchAd}
          isAdLoading={isAdLoading}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          rankTab={rankTab}
          setRankTab={setRankTab}
          scoreLeaderboard={scoreLeaderboard}
          levelLeaderboard={levelLeaderboard}
          isLeaderboardLoading={isLeaderboardLoading}
          onRefreshLeaderboard={loadLeaderboards}
          walletPoints={wallet?.available_points ?? 0}
          onLogout={handleLogout}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onReloadAll={async () => {
             const [me, s] = await Promise.all([fetchCurrentRushUser(), fetchRushProfileStats()]);
             setCurrentUser(me); setProfileStats(s);
          }}
        />
      )}
    </main>
  );
}

function LobbyView({
  user,
  stats,
  dailyTrials,
  vaultTrials,
  totalTrials,
  isPremium,
  onStart,
  isStarting,
  startError,
  onWatchAd,
  isAdLoading,
  activePanel,
  setActivePanel,
  rankTab,
  setRankTab,
  scoreLeaderboard,
  levelLeaderboard,
  isLeaderboardLoading,
  onRefreshLeaderboard,
  walletPoints,
  onLogout,
  onReloadAll,
  soundEnabled,
  onToggleSound
}: any) {
  return (
    <div className="relative flex flex-col w-full min-h-screen pb-24 overflow-y-auto font-sans">
      <div className={`absolute inset-0 -z-10 ${isPremium ? "bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_30%)]" : "bg-[radial-gradient(circle_at_top_right,rgba(46,219,255,0.14),transparent_30%)]"}`} />

      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-[20px] border-2 ${isPremium ? "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]" : "border-white/10"} bg-[#030913] p-1`}>
               <div className="h-full w-full rounded-[15px] overflow-hidden bg-white/5 flex items-center justify-center">
                  {user?.avatar_url || user?.generated_avatar_url ? (
                     <img src={user?.avatar_url || user?.generated_avatar_url} className="h-full w-full object-cover" alt="X" />
                  ) : (
                     <span className="text-xl font-black text-white/20">{user?.username?.charAt(0).toUpperCase()}</span>
                  )}
               </div>
            </div>
            <div>
               <div className="flex items-center gap-2">
                 <span className="text-base font-black uppercase tracking-tight text-white">{user?.username || "Player"}</span>
                 {isPremium && <span className="bg-amber-400 text-[9px] font-black px-2 py-0.5 rounded-lg text-black uppercase tracking-widest shadow-[0_0_10px_rgba(251,191,36,0.3)]">Prime</span>}
               </div>
               <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">{isPremium ? "Elite Protocol Active" : "Standard Sync"}</div>
            </div>
         </div>

         <div className="rounded-[22px] border border-white/5 bg-[#030913] px-4 py-2 flex flex-col items-end shadow-inner border border-white/5">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-black">Vault Pts</span>
            <span className="text-base font-black text-amber-400 italic tracking-tighter">{walletPoints.toLocaleString()}</span>
         </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
         <div className="relative flex items-center justify-center">
            {/* Visual Flair */}
            <div className={`absolute h-80 w-80 border border-white/5 rounded-full animate-[spin_12s_linear_infinite]`} />
            <div className={`absolute h-72 w-72 border border-dashed ${isPremium ? "border-amber-400/20" : "border-risen-primary/20"} rounded-full animate-[spin_20s_linear_infinite_reverse]`} />

            <div className="relative">
               <div className={`absolute inset-[-20px] rounded-full animate-ping opacity-5 ${isPremium ? "bg-amber-400" : "bg-risen-primary"}`} style={{ animationDuration: '5s' }} />
               <div className={`absolute inset-[-50px] rounded-full animate-pulse opacity-10 ${isPremium ? "bg-amber-400 shadow-[0_0_100px_rgba(251,191,36,0.2)]" : "bg-risen-primary shadow-[0_0_100px_rgba(46,219,255,0.2)]"}`} />

               <button
                  onClick={onStart}
                  disabled={isStarting}
                  className={`relative h-60 w-60 rounded-full border-[10px] flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 z-10 overflow-hidden ${
                    isPremium
                    ? "bg-[#07111d] border-amber-400/30 shadow-[0_0_60px_rgba(251,191,36,0.4)]"
                    : "bg-[#07111d] border-risen-primary/30 shadow-[0_0_60px_rgba(46,219,255,0.4)]"
                  }`}
               >
                  {/* Glowing Core */}
                  <div className={`absolute inset-4 rounded-full blur-2xl opacity-20 ${isPremium ? "bg-amber-400" : "bg-risen-primary"}`} />

                  <span className="text-white font-black text-5xl tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{isStarting ? "SYNC" : "PLAY"}</span>
                  {!isStarting && <span className={`text-[10px] font-black uppercase tracking-[0.4em] mt-2 ${isPremium ? "text-amber-400/60" : "text-risen-primary/60"}`}>Initialize</span>}

                  {/* Scanning Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 animate-[scan_3s_ease-in-out_infinite]" />
               </button>
            </div>
         </div>

         {startError && (
           <div className="mt-14 mx-8 rounded-[35px] border border-red-500/20 bg-red-500/5 px-7 py-6 text-xs text-red-200/80 text-center max-w-sm backdrop-blur-3xl shadow-2xl animate-shake">
             <div className="font-black uppercase tracking-widest mb-1">System Alert</div>
             {startError}
             {!isPremium && totalTrials <= 0 && (
               <button
                 onClick={onWatchAd}
                 disabled={isAdLoading}
                 className="mt-5 w-full rounded-2xl bg-white/10 py-4 font-black hover:bg-white/20 transition-all uppercase tracking-[0.2em] text-[10px] border border-white/5"
               >
                 {isAdLoading ? "Loading Matrix..." : "Sync AD for +1 Try"}
               </button>
             )}
           </div>
         )}
      </div>

      {/* Trial Stats */}
      <div className="w-full max-w-7xl mx-auto px-6 mt-auto py-6">
         <div className="grid grid-cols-3 gap-4">
            <StatSmall label="Session" value={isPremium ? "∞" : dailyTrials} />
            <StatSmall label="Vault" value={isPremium ? "∞" : vaultTrials} />
            <StatSmall label="Status" value={isPremium ? "PRIME" : totalTrials} highlight={isPremium} />
         </div>
      </div>

      {/* Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-5 pb-10 pt-2 pointer-events-none">
         <div className="mx-auto max-w-md w-full pointer-events-auto h-20 rounded-[40px] border border-white/10 bg-[#07111d]/95 backdrop-blur-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.7)] flex items-center justify-around px-4">
            <NavIcon label="Log" icon="ℹ️" active={activePanel === 'info'} onClick={() => setActivePanel('info')} />
            <NavIcon label="League" icon="⚔️" active={activePanel === 'contest'} onClick={() => setActivePanel('contest')} />
            <div className="h-10 w-px bg-white/10 mx-1" />
            <NavIcon label="Identity" icon="👤" active={activePanel === 'profile'} onClick={() => setActivePanel('profile')} />
            <NavIcon label="Ranks" icon="🏆" active={activePanel === 'ranks'} onClick={() => setActivePanel('ranks')} />
            <NavIcon label="Sys" icon="⚙️" active={activePanel === 'settings'} onClick={() => setActivePanel('settings')} />
         </div>
      </div>

      {/* Info Panel */}
      <OverlayPanel isOpen={activePanel === 'info'} title="System Log" onClose={() => setActivePanel(null)}>
        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2 custom-scroll">
           <RewardMeter availablePoints={walletPoints} />
           <div className="rounded-[35px] border border-white/5 bg-[#030913] p-8 space-y-6 text-sm text-white/60">
              <div className="flex items-center gap-5">
                 <div className="h-10 w-10 rounded-2xl bg-amber-400/5 flex items-center justify-center text-amber-400 font-black border border-amber-400/10">01</div>
                 <span className="font-bold tracking-tight">Standard Catch = 5 Points</span>
              </div>
              <div className="flex items-center gap-5">
                 <div className="h-10 w-10 rounded-2xl bg-amber-400/5 flex items-center justify-center text-amber-400 font-black border border-amber-400/10">02</div>
                 <span className="font-bold tracking-tight">Golden Protocol = 20 Points</span>
              </div>
              <div className="flex items-center gap-5 text-red-500/80">
                 <div className="h-10 w-10 rounded-2xl bg-red-500/5 flex items-center justify-center font-black border border-red-500/10 italic">ERR</div>
                 <span className="font-black italic uppercase tracking-tighter">Avoid Crash/Heavy Drops</span>
              </div>
              <div className="pt-6 border-t border-white/5 text-[9px] font-black text-white/20 uppercase tracking-[0.5em] text-center">
                 Sync Limit: 100k PTS
              </div>
           </div>
        </div>
      </OverlayPanel>

      {/* Ranks Panel */}
      <OverlayPanel isOpen={activePanel === 'ranks'} title="Neural Leaderboard" onClose={() => setActivePanel(null)}>
         <div className="flex flex-col h-[70vh]">
            <div className="flex gap-2 mb-6 p-1 bg-[#030913] rounded-2xl border border-white/5">
               <button
                  onClick={() => setRankTab('score')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${rankTab === 'score' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30'}`}
               >Top Scores</button>
               <button
                  onClick={() => setRankTab('level')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${rankTab === 'level' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30'}`}
               >Deep Runners</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 custom-scroll">
               <LeaderboardPanel
                  entries={rankTab === 'score' ? scoreLeaderboard : levelLeaderboard}
                  currentUsername={user?.username}
                  loading={isLeaderboardLoading}
                  onRetry={onRefreshLeaderboard}
                  mode={rankTab}
                  title={rankTab === 'score' ? "Global Points" : "Depth Records"}
                  subtitle="Synced Real-Time"
               />
            </div>
         </div>
      </OverlayPanel>

      {/* Profile Panel (Matrix) */}
      <OverlayPanel isOpen={activePanel === 'profile'} title="Identity Matrix" onClose={() => setActivePanel(null)}>
         <div className="max-h-[75vh] overflow-y-auto pr-3 custom-scroll pb-10">
            <div className="space-y-8">
               {/* User Overview */}
               <div className="flex flex-col items-center">
                  <div className={`h-28 w-28 rounded-[35px] border-4 ${isPremium ? "border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]" : "border-white/10"} bg-[#030913] p-1.5 mb-5`}>
                     <div className="h-full w-full rounded-[28px] overflow-hidden bg-white/5 flex items-center justify-center">
                        {user?.avatar_url || user?.generated_avatar_url ? (
                           <img src={user?.avatar_url || user?.generated_avatar_url} className="h-full w-full object-cover" alt="X" />
                        ) : (
                           <span className="text-4xl font-black text-white/20">{user?.username?.charAt(0).toUpperCase()}</span>
                        )}
                     </div>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">{user?.username}</h3>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">{user?.email}</div>
                  <div className={`text-[9px] font-black px-4 py-1.5 rounded-full mt-4 uppercase tracking-[0.4em] ${isPremium ? "bg-amber-400 text-black shadow-lg" : "bg-white/5 text-white/40 border border-white/5"}`}>
                     {isPremium ? "Prime Protocol" : "Standard Sync"}
                  </div>
               </div>

               {/* Vital Stats */}
               <div className="grid grid-cols-2 gap-4">
                  <ProfileStat label="Best Points" value={stats?.best_score ?? 0} />
                  <ProfileStat label="Max Depth" value={stats?.best_level ?? 1} />
                  <ProfileStat label="Rank Index" value={stats?.score_rank ?? '-'} />
                  <ProfileStat label="Life Cycles" value={stats?.total_sessions ?? 0} />
               </div>

               {/* Wallet & Redemption */}
               <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2 px-2">Financial Nodes</div>
                  <div className="grid grid-cols-2 gap-3">
                     <ProfileStat label="Total Accrued" value={stats?.total_points_earned ?? 0} />
                     <ProfileStat label="Verified Claims" value={stats?.claimed_points ?? 0} />
                  </div>

                  <RedemptionModule stats={stats} isPremium={isPremium} onReload={onReloadAll} />
               </div>

               {/* Referral Node */}
               <ReferralModule stats={stats} />

               {/* AI Scorecard Node */}
               <ScorecardModule user={user} stats={stats} />

               {/* Settings Sub-Module */}
               <EditProfileModule user={user} stats={stats} onReload={onReloadAll} />

               {/* Security Node */}
               <SecurityModule />

               <div className="pt-10 flex flex-col items-center gap-3">
                  <button onClick={onLogout} className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.4em] hover:text-red-500 transition-colors">Terminate Identity</button>
                  <div className="text-[8px] font-black text-white/10 uppercase tracking-[0.8em]">ID_{user?.id?.slice(0,8)}</div>
               </div>
            </div>
         </div>
      </OverlayPanel>

      {/* Contest Panel */}
      <OverlayPanel isOpen={activePanel === 'contest'} title="Risen League" onClose={() => setActivePanel(null)}>
        <div className="text-center py-10">
           <div className="h-28 w-28 bg-[#030913] rounded-[40px] rotate-12 flex items-center justify-center mx-auto mb-10 border border-amber-400/20 shadow-[0_0_50px_rgba(251,191,36,0.1)] relative">
              <span className="text-6xl -rotate-12">⚔️</span>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-[#07111d] animate-bounce">
                 <span className="text-[10px] font-black text-black">!</span>
              </div>
           </div>
           <h3 className="text-2xl font-black uppercase tracking-tight italic mb-3 text-white">Neural League: S1</h3>
           <p className="text-sm text-white/40 px-8 mb-12 leading-relaxed font-bold">
              Deployment in <span className="text-amber-400">28 Cycles</span>. Prime users auto-qualify for the $1,000 algorithmic prize pool.
           </p>
           <div className="bg-[#030913] rounded-[35px] p-8 border border-white/5 shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-amber-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="text-[9px] uppercase tracking-[0.5em] text-amber-400 font-black mb-3">Sync Status</div>
              <div className="text-sm font-black uppercase tracking-widest text-white/70 italic animate-pulse">Algorithmic Initialization...</div>
           </div>
        </div>
      </OverlayPanel>

      {/* Config Panel */}
      <OverlayPanel isOpen={activePanel === 'settings'} title="System Config" onClose={() => setActivePanel(null)}>
        <div className="space-y-6">
           <div className="flex items-center justify-between p-7 rounded-[40px] bg-[#030913] border border-white/5 shadow-inner">
              <div>
                 <div className="text-xs font-black uppercase tracking-widest text-white/80">Audio Core</div>
                 <div className="text-[9px] font-bold text-white/20 mt-1 uppercase tracking-widest italic">Arcade Synthesizer</div>
              </div>
              <button
                onClick={onToggleSound}
                className={`h-7 w-14 rounded-full relative transition-all shadow-lg ${!soundEnabled ? 'bg-white/5' : 'bg-risen-primary'}`}
              >
                 <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all shadow-md ${!soundEnabled ? 'left-1' : 'left-8'}`} />
              </button>
           </div>

           <div className="p-7 rounded-[40px] bg-white/5 border border-white/5">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 px-2">Account Node</div>
              <div className="flex items-center justify-between">
                 <div className="text-sm font-black uppercase text-white/70 italic">Protocol V1</div>
                 <div className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-xl ${isPremium ? "bg-amber-400 text-black shadow-lg" : "bg-white/10 text-white/40"}`}>
                    {isPremium ? "PRIME ELITE" : "STANDARD"}
                 </div>
              </div>
           </div>

           <button
             onClick={onLogout}
             className="w-full py-6 rounded-[40px] bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-red-500/20 transition-all active:scale-95 shadow-lg"
           >
             Terminate Connection
           </button>

           <div className="text-center text-[9px] text-white/10 uppercase tracking-[0.8em] pt-8 font-black">
              RISEN_RUSH_SYS_1.1.2
           </div>
        </div>
      </OverlayPanel>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}

/* SUB-COMPONENTS */

function ProfileStat({ label, value }: any) {
  return (
    <div className="rounded-[28px] border border-white/5 bg-[#030913] p-5 shadow-inner">
       <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">{label}</div>
       <div className="text-lg font-black text-white italic tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</div>
    </div>
  );
}

function StatSmall({ label, value, highlight }: any) {
  return (
    <div className={`rounded-[30px] border ${highlight ? "border-amber-400/30 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.05)]" : "border-white/5 bg-[#030913]"} p-5 text-center backdrop-blur-3xl shadow-inner`}>
      <div className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-1.5 font-black italic">{label}</div>
      <div className={`text-base font-black uppercase tracking-tighter italic ${highlight ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "text-white/80"}`}>{value}</div>
    </div>
  );
}

function NavIcon({ label, icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90 ${active ? "scale-110" : "opacity-30 grayscale-[0.5]"}`}
    >
       <span className="text-2xl drop-shadow-lg">{icon}</span>
       <span className={`text-[9px] uppercase tracking-[0.2em] font-black ${active ? "text-white" : "text-white/40"}`}>{label}</span>
       {active && <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1 shadow-[0_0_12px_rgba(251,191,36,1)]" />}
    </button>
  );
}

function OverlayPanel({ isOpen, title, onClose, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[#07111d] rounded-[50px] border border-white/10 p-8 pt-6 shadow-2xl animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1.5 w-14 bg-white/10 rounded-full mx-auto mb-8 shadow-inner" />
        <div className="flex items-center justify-between mb-8 px-2">
           <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white italic drop-shadow-md">{title}</h2>
           <button onClick={onClose} className="h-11 w-11 rounded-2xl bg-white/5 flex items-center justify-center text-sm border border-white/10 transition-all hover:bg-white/10 active:scale-90">✕</button>
        </div>
        {children}
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* MODULES (Extracted logic for Profile) */

function RedemptionModule({ stats, isPremium, onReload }: any) {
  const [points, setPoints] = useState("");
  const [wallet, setWallet] = useState(stats?.wallet_address ?? "");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<RedemptionRequestResponse[]>([]);

  useEffect(() => {
     fetchMyRedemptionRequests().then(setHistory).catch(() => {});
  }, []);

  const handleClaim = async (e: any) => {
     e.preventDefault();
     try {
        setLoading(true);
        await createRedemptionRequest({ wallet_address: wallet, points_requested: Number(points) });
        alert("Claim Logged Successfully.");
        onReload();
     } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="p-6 rounded-[35px] border border-white/5 bg-[#030913] space-y-5 shadow-inner">
       <div className={`p-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 text-[10px] font-bold text-amber-200/80 leading-relaxed italic`}>
          MINIMUM SYNC: 100,000 PTS. {isPremium ? "PRIME UNLOCK: UNLIMITED CLAIMS." : "LIMIT: 1 CLAIM / MONTH."}
       </div>
       <form onSubmit={handleClaim} className="space-y-4">
          <input value={wallet} onChange={e => setWallet(e.target.value)} placeholder="BEP-20 WALLET" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black uppercase outline-none focus:border-amber-400/50" />
          <input value={points} onChange={e => setPoints(e.target.value)} placeholder="PTS TO CLAIM" type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black uppercase outline-none focus:border-amber-400/50" />
          <button disabled={loading} className="w-full py-4 rounded-2xl bg-amber-400 text-black font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 disabled:opacity-50">{loading ? "SYNCING..." : "INITIALIZE CLAIM"}</button>
       </form>

       {/* History Table */}
       <div className="pt-4 border-t border-white/5">
          <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3">Sync Logs</div>
          <div className="overflow-x-auto custom-scroll pb-2">
             <table className="w-full text-[9px] font-bold text-white/50 text-left border-separate border-spacing-y-1">
                <thead><tr><th className="px-2 pb-2">#</th><th className="px-2 pb-2">PTS</th><th className="px-2 pb-2">STATUS</th></tr></thead>
                <tbody>
                   {history.length > 0 ? history.map(h => (
                      <tr key={h.id} className="bg-white/5 rounded-lg"><td className="p-2 text-white">#{h.id.slice(0,4)}</td><td className="p-2">{Number(h.points_requested).toLocaleString()}</td><td className={`p-2 uppercase ${h.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`}>{h.status}</td></tr>
                   )) : <tr><td colSpan={3} className="p-4 text-center italic text-white/10">No History Synced</td></tr>}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}

function ReferralModule({ stats }: any) {
  const [info, setInfo] = useState<ReferralInfoResponse | null>(null);
  useEffect(() => { fetchRushReferralInfo().then(setInfo).catch(() => {}); }, []);

  return (
     <div className="p-7 rounded-[40px] border border-white/5 bg-[#030913] space-y-4 shadow-inner">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Network Expansion</div>
        <div className="grid grid-cols-2 gap-3">
           <ProfileStat label="Successful Nodes" value={info?.successful_referrals ?? 0} />
           <ProfileStat label="Reward Trials" value={info?.vault_trials ?? 0} />
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
           <div className="text-[8px] font-black text-white/20 uppercase mb-1">Neural Link</div>
           <div className="text-[10px] font-black text-amber-400 truncate italic">https://risenonchain.net/rush/register?ref={info?.referral_code}</div>
        </div>
        <button onClick={() => {
           navigator.clipboard.writeText(`https://risenonchain.net/rush/register?ref=${info?.referral_code}`);
           alert("Link Synced to Clipboard.");
        }} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] active:scale-95">Copy Neural Link</button>
     </div>
  );
}

function EditProfileModule({ user, stats, onReload }: any) {
   const [form, setForm] = useState({ username: user?.username ?? "", wallet: stats?.wallet_address ?? "", avatar: user?.avatar_url ?? "", ai_avatar: user?.generated_avatar_url ?? "" });
   const [loading, setLoading] = useState(false);

   const handleSave = async () => {
      try {
         setLoading(true);
         await updateRushProfile({ username: form.username, wallet_address: form.wallet, avatar_url: form.avatar, generated_avatar_url: form.ai_avatar });
         alert("Matrix Updated."); onReload();
      } catch (err: any) { alert(err.message); } finally { setLoading(false); }
   };

   return (
      <div className="p-7 rounded-[40px] border border-white/5 bg-[#030913] space-y-4 shadow-inner">
         <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Matrix Config</div>
         <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="NEW USERNAME" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase outline-none focus:border-risen-primary/50" />
         <input value={form.wallet} onChange={e => setForm({...form, wallet: e.target.value})} placeholder="WALLET ADDRESS" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase outline-none focus:border-risen-primary/50" />
         <input value={form.avatar} onChange={e => setForm({...form, avatar: e.target.value})} placeholder="EXTERNAL AVATAR URL" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase outline-none focus:border-risen-primary/50" />
         <button disabled={loading} onClick={handleSave} className="w-full py-4 rounded-2xl bg-risen-primary text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95">{loading ? "UPDATING..." : "COMMIT CHANGES"}</button>
      </div>
   );
}

function SecurityModule() {
   const [form, setForm] = useState({ old: "", next: "" });
   const [loading, setLoading] = useState(false);
   const handlePass = async () => {
      try {
         setLoading(true);
         await changeRushPassword({ current_password: form.old, new_password: form.next });
         alert("Access Key Changed."); setForm({ old: "", next: "" });
      } catch (err: any) { alert(err.message); } finally { setLoading(false); }
   };
   return (
      <div className="p-7 rounded-[40px] border border-white/5 bg-[#030913] space-y-4 shadow-inner">
         <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Security Node</div>
         <input type="password" value={form.old} onChange={e => setForm({...form, old: e.target.value})} placeholder="CURRENT KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase outline-none" />
         <input type="password" value={form.next} onChange={e => setForm({...form, next: e.target.value})} placeholder="NEW KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase outline-none" />
         <button disabled={loading} onClick={handlePass} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] active:scale-95 italic">Change Access Key</button>
      </div>
   );
}

function ScorecardModule({ user, stats }: any) {
   const [loading, setLoading] = useState(false);
   const [img, setImg] = useState<string | null>(null);

   const handleAI = async () => {
      try {
         setLoading(true);
         const res = await fetch(`${process.env.NEXT_PUBLIC_AI_API_URL}/ai/generate-scorecard`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user.username, score: stats.best_score, rank: stats.score_rank, avatar_path: user.avatar_url || "/images/default-avatar.png" })
         });
         const data = await res.json();
         if (data.image_url) setImg(data.image_url);
      } catch { alert("Neural Node Error."); } finally { setLoading(false); }
   };

   return (
      <div className="p-7 rounded-[40px] border border-white/5 bg-[#030913] space-y-5 shadow-inner">
         <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">RISEN AI Engine</div>
         <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase italic">Generate an algorithmic scorecard using your current best performance data.</p>
         {img && <img src={img} className="w-full rounded-2xl border border-white/10 mb-4" alt="AI" />}
         <button disabled={loading} onClick={handleAI} className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95">{loading ? "PROCESSING..." : "GENERATE SCORECARD"}</button>
      </div>
   );
}
