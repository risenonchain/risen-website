"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { BASE_URL, fetchCurrentRushUser } from "@/lib/api";

const LeagueTable = dynamic(() => import("./LeagueTable"), { ssr: false });
const LeagueFixtures = dynamic(() => import("./LeagueFixtures"), { ssr: false });
const LeagueTopScores = dynamic(() => import("./LeagueTopScores"), { ssr: false });
const LeagueDeepestRunners = dynamic(() => import("./LeagueDeepestRunners"), { ssr: false });
const LeagueLiveBroadcast = dynamic(() => import("./LeagueLiveBroadcast"), { ssr: false });
const LeagueChallenges = dynamic(() => import("./LeagueChallenges"), { ssr: false });

type Props = {
  isPremium?: boolean;
  leagueId?: number;
  onHome?: () => void;
};

const TABS = [
  { key: "standings", label: "Standings" },
  { key: "fixtures", label: "Fixtures" },
  { key: "p2p", label: "P2P Challenges", primeOnly: true },
  { key: "topScores", label: "Top Scores" },
  { key: "deepestRunners", label: "Deepest Runners" },
  { key: "live", label: "Live Broadcast" },
];

type LeagueStatus = "none" | "registered" | "disqualified" | "eliminated";

export default function LeaguePanel({ isPremium = false, leagueId: propLeagueId, onHome }: Props) {
  const [tab, setTab] = useState("standings");
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [leagueStatus, setLeagueStatus] = useState<LeagueStatus>("none");
  const [activeLeagueId, setActiveLeagueId] = useState<number | null>(propLeagueId || null);
  const [loadingLeague, setLoadingLeague] = useState(!propLeagueId);

  useEffect(() => {
    if (propLeagueId) return;
    async function fetchActiveLeague() {
      try {
        const res = await fetch(`${BASE_URL}/league/events`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("rush_token")}` }
        });
        const leagues = await res.json();
        const active = leagues.find((l: any) => l.is_active);
        if (active) {
            setActiveLeagueId(active.id);
            // Check status using the new endpoint
            const statusRes = await fetch(`${BASE_URL}/league/events/${active.id}/my-status`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("rush_token")}` }
            });
            if (statusRes.ok) {
                const data = await statusRes.json();
                setLeagueStatus(data.status);
            }
        }
      } catch (e) {
        console.error("Failed to fetch active league", e);
      } finally {
        setLoadingLeague(false);
      }
    }
    fetchActiveLeague();
  }, [propLeagueId]);

  // Removed redundant checkStatus effect


  const leagueId = activeLeagueId || 1;

  // Registration handler
  const handleRegister = async () => {
    setRegistering(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/league/events/${leagueId}/register`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("rush_token")}` }
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Registration failed");
      setLeagueStatus("registered");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="text-center py-10">
      {/* Immersive League Icon */}
      <div className="h-28 w-28 bg-[#030913] rounded-[40px] rotate-12 flex items-center justify-center mx-auto mb-10 border border-amber-400/20 shadow-[0_0_50px_rgba(251,191,36,0.1)] relative">
        <span className="text-6xl -rotate-12">🏆</span>
        {!activeLeagueId && !loadingLeague && (
            <div className="absolute inset-0 bg-black/60 rounded-[40px] flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-2xl">🔒</span>
            </div>
        )}
        <div className="absolute -top-2 -right-2 h-8 w-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-[#07111d] animate-bounce">
          <span className="text-[10px] font-black text-black">!</span>
        </div>
      </div>

      {!isPremium ? (
        <div className="px-6 py-12 mb-10 mx-4 rounded-[45px] bg-[#030913] border border-amber-400/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.05),transparent_40%)]" />
            <div className="relative z-10">
                <div className="text-amber-400 text-4xl mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">👑</div>
                <h3 className="text-2xl font-black text-white uppercase italic mb-3 tracking-tighter">Prime Protocol Required</h3>
                <p className="text-[11px] text-white/40 leading-relaxed font-bold uppercase mb-10 max-w-[280px] mx-auto">
                    Access to the Neural League is restricted to Elite Entities. Upgrade to Prime to unlock the prize pool and algorithmic rankings.
                </p>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('risen-rush-go-premium'))}
                    className="w-full bg-amber-400 text-black font-black py-5 rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:scale-[1.02] transition-all uppercase text-[10px] tracking-[0.2em]"
                >
                    UPGRADE TO PRIME ELITE
                </button>
            </div>
        </div>
      ) : !activeLeagueId && !loadingLeague ? (
        <div className="px-6 py-24 mx-4 rounded-[45px] border border-white/5 bg-[#030913]/50 text-center">
            <div className="text-white/5 text-5xl mb-6 grayscale opacity-20">🏆</div>
            <h3 className="text-xl font-black uppercase tracking-widest text-white/20 mb-2">
                Arena Lockdown
            </h3>
            <p className="text-[10px] text-white/10 leading-relaxed font-black uppercase italic">
                Awaiting Admin Initialization Protocol for the next lifecycle.
            </p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-2xl font-black uppercase tracking-tight italic mb-1 text-white">
              Neural League: S1
            </h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Registration Cycle Active</span>
            </div>
          </div>

          {/* Registration & Status */}
          <div className="px-6 mb-12">
              {leagueStatus === "none" && (
                <button
                  className="w-full bg-amber-400 text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:bg-amber-300 transition-all disabled:opacity-50 disabled:grayscale uppercase text-[10px] tracking-[0.2em]"
                  onClick={handleRegister}
                  disabled={registering}
                >
                  {registering ? "STABILIZING LINK..." : "REGISTER FOR LEAGUE"}
                </button>
              )}
              {leagueStatus === "registered" && (
                <div className="space-y-4">
                    <div className="py-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black uppercase text-[10px] tracking-[0.2em] italic flex items-center justify-center gap-3">
                       <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                       Node Registered: Standby for Fixtures
                    </div>
                    <p className="text-[9px] text-white/20 font-bold uppercase">The tournament structure is being generated by the engine.</p>
                </div>
              )}
          </div>

          {/* Tabs Navigation - Hide or Lockdown if no fixtures yet */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
            {TABS.map((t) => {
              if (t.primeOnly && !isPremium) return null;
              return (
                <button
                  key={t.key}
                  disabled={leagueStatus === "none"}
                  className={`px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border-2 ${
                      tab === t.key
                      ? "bg-amber-400 text-black border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                      : "bg-[#030913] text-white/40 border-white/5 hover:border-amber-400/30 hover:text-amber-400 disabled:opacity-20 disabled:grayscale"
                  }`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="max-h-[45vh] overflow-y-auto pr-2 custom-scroll pb-10">
            {leagueStatus === "none" ? (
                <div className="py-10 text-center opacity-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Registry to view data</span>
                </div>
            ) : (
                <>
                    {tab === "standings" && <LeagueTable leagueId={leagueId} />}
                    {tab === "fixtures" && <LeagueFixtures leagueId={leagueId} />}
                    {tab === "p2p" && <LeagueChallenges leagueId={leagueId} />}
                    {tab === "topScores" && <LeagueTopScores leagueId={leagueId} />}
                    {tab === "deepestRunners" && <LeagueDeepestRunners leagueId={leagueId} />}
                    {tab === "live" && <LeagueLiveBroadcast leagueId={leagueId} />}
                </>
            )}
          </div>
        </>
      )}

      {onHome && (
        <div className="mt-10 pb-6 px-6">
          <button
            onClick={onHome}
            className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black uppercase text-[10px] tracking-[0.4em] hover:bg-white/10 hover:text-white transition-all active:scale-95 shadow-lg"
          >
            ← Back to Lobby
          </button>
        </div>
      )}

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}
