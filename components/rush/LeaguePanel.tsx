"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LeagueTable = dynamic(() => import("./LeagueTable"), { ssr: false });
const LeagueFixtures = dynamic(() => import("./LeagueFixtures"), { ssr: false });
const LeagueTopScores = dynamic(() => import("./LeagueTopScores"), { ssr: false });
const LeagueDeepestRunners = dynamic(() => import("./LeagueDeepestRunners"), { ssr: false });

type Props = {
  isPremium?: boolean;
  leagueId?: number;
};

const TABS = [
  { key: "standings", label: "Standings" },
  { key: "fixtures", label: "Fixtures" },
  { key: "topScores", label: "Top Scores" },
  { key: "deepestRunners", label: "Deepest Runners" },
];

type LeagueStatus = "none" | "registered" | "disqualified" | "eliminated";

export default function LeaguePanel({ isPremium = false, leagueId: propLeagueId }: Props) {
  const [tab, setTab] = useState("standings");
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [leagueStatus, setLeagueStatus] = useState<LeagueStatus>("none");

  // Use prop or fallback to 1
  const leagueId = propLeagueId || 1;

  // Registration handler
  const handleRegister = async () => {
    setRegistering(true);
    setError("");
    try {
      const res = await fetch(`/api/league/events/${leagueId}/register`, { method: "POST" });
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
        <span className="text-6xl -rotate-12">\u0016\u000f</span>
        <div className="absolute -top-2 -right-2 h-8 w-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-[#07111d] animate-bounce">
          <span className="text-[10px] font-black text-black">!</span>
        </div>
      </div>

      <h3 className="text-2xl font-black uppercase tracking-tight italic mb-3 text-white">
        Neural League: S1
      </h3>

      <p className="text-sm text-white/40 px-8 mb-6 leading-relaxed font-bold">
        Deployment in <span className="text-amber-400">28 Cycles</span>.{" "}
        {isPremium ? (
          <span className="text-amber-400">Prime users auto-qualify for the RSN100,000 algorithmic prize pool.</span>
        ) : (
          "Upgrade to Prime to qualify for the RSN100,000 prize pool."
        )}
      </p>

      {/* Registration & Status */}
      {leagueStatus === "none" && (
        <button
          className="bg-amber-400 text-black font-black px-8 py-3 rounded-2xl shadow-lg hover:bg-amber-300 transition mb-8 disabled:opacity-50"
          onClick={handleRegister}
          disabled={registering}
        >
          {registering ? "Registering..." : "Register for League"}
        </button>
      )}
      {leagueStatus === "registered" && (
        <div className="mb-8 text-green-400 font-bold">You are registered for this league!</div>
      )}
      {leagueStatus === "disqualified" && (
        <div className="mb-8 text-red-400 font-bold">You have been disqualified from this league.</div>
      )}
      {leagueStatus === "eliminated" && (
        <div className="mb-8 text-yellow-400 font-bold">You have been eliminated from this league.</div>
      )}
      {error && <div className="mb-8 text-red-400 font-bold">{error}</div>}

      {/* Tabs Navigation */}
      <div className="flex justify-center gap-4 mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition border-2 ${tab === t.key ? "bg-amber-400 text-black border-amber-400" : "bg-[#030913] text-white/60 border-white/10 hover:bg-amber-400/10 hover:text-amber-400"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tab === "standings" && <LeagueTable leagueId={leagueId} />}
        {tab === "fixtures" && <LeagueFixtures leagueId={leagueId} />}
        {tab === "topScores" && <LeagueTopScores leagueId={leagueId} />}
        {tab === "deepestRunners" && <LeagueDeepestRunners leagueId={leagueId} />}
      </div>
    </div>
  );
}
