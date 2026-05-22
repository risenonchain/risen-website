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
    <div className="flex flex-col h-full text-center">
      {/* Dynamic Header */}
      <div className="shrink-0 px-6 pt-2 pb-6 border-b border-white/5 bg-gradient-to-b from-black/20 to-transparent">
          <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                  <h3 className="text-xl font-black uppercase tracking-tighter italic text-white leading-none">
                    Neural League
                  </h3>
                  <p className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest mt-1">Season 01: Genesis</p>
              </div>
              <div className="h-12 w-12 bg-[#030913] rounded-2xl flex items-center justify-center border border-amber-400/20 shadow-lg shadow-amber-400/5">
                <span className="text-2xl">🏆</span>
              </div>
          </div>

          {activeLeagueId ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/5 border border-amber-400/10 w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,1)]" />
                  <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Protocol Active</span>
              </div>
          ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Arena Lockdown</span>
              </div>
          )}
      </div>

      {!isPremium ? (
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
            <div className="py-12 px-6 rounded-[45px] bg-[#030913] border border-amber-400/20 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.05),transparent_40%)]" />
                <div className="relative z-10">
                    <div className="text-amber-400 text-4xl mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">👑</div>
                    <h3 className="text-2xl font-black text-white uppercase italic mb-3 tracking-tighter leading-tight">Prime Protocol Required</h3>
                    <p className="text-[11px] text-white/40 leading-relaxed font-bold uppercase mb-10 max-w-[240px] mx-auto">
                        Access to the Neural League is restricted to Elite Entities. Upgrade to unlock algorithmic rewards.
                    </p>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('risen-rush-go-premium'))}
                        className="w-full bg-amber-400 text-black font-black py-5 rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:scale-[1.02] transition-all uppercase text-[10px] tracking-[0.2em]"
                    >
                        UPGRADE TO PRIME ELITE
                    </button>
                </div>
            </div>
        </div>
      ) : !activeLeagueId && !loadingLeague ? (
        <div className="flex-1 flex flex-col justify-center px-6 py-24">
            <div className="py-20 rounded-[45px] border border-white/5 bg-[#030913]/50 text-center backdrop-blur-sm">
                <div className="text-white/5 text-6xl mb-6 grayscale opacity-10">🏆</div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white/20 mb-2 italic">
                    Arena Lockdown
                </h3>
                <p className="text-[10px] text-white/10 leading-relaxed font-black uppercase italic max-w-[200px] mx-auto">
                    Awaiting initialization protocol for the next lifecycle.
                </p>
            </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Tab Strip */}
          <div className="shrink-0 bg-black/20 border-b border-white/5">
              <div className="flex overflow-x-auto no-scrollbar px-4">
                {TABS.map((t) => {
                  if (t.primeOnly && !isPremium) return null;
                  const active = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      disabled={leagueStatus === "none"}
                      className={`relative flex-none px-6 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${
                          active ? "text-amber-400" : "text-white/30 hover:text-white/60 disabled:opacity-10"
                      }`}
                      onClick={() => setTab(t.key)}
                    >
                      {t.label}
                      {active && (
                          <div className="absolute bottom-0 left-4 right-4 h-1 bg-amber-400 rounded-t-full shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                      )}
                    </button>
                  );
                })}
              </div>
          </div>

          {/* Registration Overlay if not registered */}
          {leagueStatus === "none" && (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="max-w-[280px] space-y-8">
                      <div className="space-y-2">
                        <h4 className="text-lg font-black text-white uppercase italic italic tracking-tight">Registry Open</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed">Join the global survival tournament and compete for the prime prize pool.</p>
                      </div>
                      <button
                        className="w-full bg-amber-400 text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:bg-amber-300 transition-all disabled:opacity-50 uppercase text-[11px] tracking-[0.2em]"
                        onClick={handleRegister}
                        disabled={registering}
                      >
                        {registering ? "STABILIZING LINK..." : "REGISTER FOR LEAGUE"}
                      </button>
                  </div>
              </div>
          )}

          {/* Main Content Area */}
          {leagueStatus !== "none" && (
            <div className="flex-1 overflow-y-auto custom-scroll px-4 pt-6 pb-20">
                {leagueStatus === "registered" && tab === "standings" && (
                    <div className="py-12 px-6 rounded-[35px] border border-white/5 bg-white/5 text-center">
                        <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h4 className="text-emerald-400 font-black uppercase text-xs mb-2 italic">Node Fully Synchronized</h4>
                        <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed max-w-[200px] mx-auto">
                            The engine is generating your group stage brackets. Standby for deployment.
                        </p>
                    </div>
                )}

                {tab === "standings" && leagueStatus !== "registered" && <LeagueTable leagueId={leagueId} />}
                {tab === "fixtures" && <LeagueFixtures leagueId={leagueId} />}
                {tab === "p2p" && <LeagueChallenges leagueId={leagueId} />}
                {tab === "topScores" && <LeagueTopScores leagueId={leagueId} />}
                {tab === "deepestRunners" && <LeagueDeepestRunners leagueId={leagueId} />}
                {tab === "live" && <LeagueLiveBroadcast leagueId={leagueId} />}
            </div>
          )}
        </div>
      )}

      {/* Persistent Back Button at Bottom */}
      <div className="shrink-0 p-6 bg-gradient-to-t from-black/40 to-transparent border-t border-white/5">
        <button
          onClick={onHome}
          className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          Return to Lobby
        </button>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
