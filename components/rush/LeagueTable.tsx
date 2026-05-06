"use client";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";

interface Standing {
  id: number;
  user_id: number;
  username: string;
  matches_played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  goals_for: number;
  goals_against: number;
}

type Props = { leagueId: number };

export default function LeagueTable({ leagueId }: Props) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStandings() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_URL}/league/events/${leagueId}/standings`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("rush_token")}` }
        });
        if (!res.ok) throw new Error("Failed to fetch standings");
        const data = await res.json();
        setStandings(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, [leagueId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/5 border-t-amber-400" />
      <div className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Standings...</div>
    </div>
  );

  if (error) return (
      <div className="mt-8 p-6 rounded-3xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest text-center">
          Neural Connection Error: {error}
      </div>
  );

  return (
    <div className="mt-4 pb-10">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-[30px] border border-white/5 bg-[#030913] shadow-2xl">
        <table className="min-w-full">
          <thead>
            <tr className="text-amber-400 text-[9px] font-black uppercase tracking-[0.3em] bg-white/5">
              <th className="px-6 py-4 text-center w-16">#</th>
              <th className="px-6 py-4 text-left">Identity Matrix</th>
              <th className="px-4 py-4 text-center">MP</th>
              <th className="px-4 py-4 text-center">W</th>
              <th className="px-4 py-4 text-center">D</th>
              <th className="px-4 py-4 text-center">L</th>
              <th className="px-6 py-4 text-center">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((row, idx) => (
              <tr key={row.id} className={`transition-colors hover:bg-white/5 ${idx === 0 ? "bg-amber-400/5" : ""}`}>
                <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-black italic ${idx < 3 ? "text-amber-400" : "text-white/20"}`}>
                        {String(idx + 1).padStart(2, '0')}
                    </span>
                </td>
                <td className="px-6 py-4 text-left">
                    <div className="text-sm font-black text-white uppercase tracking-tighter italic">{row.username || `Entity_${row.user_id}`}</div>
                    <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-0.5">Verified Node</div>
                </td>
                <td className="px-4 py-4 text-center text-white/60 font-bold">{row.matches_played}</td>
                <td className="px-4 py-4 text-center text-emerald-400/80 font-bold">{row.wins}</td>
                <td className="px-4 py-4 text-center text-white/40 font-bold">{row.draws}</td>
                <td className="px-4 py-4 text-center text-red-400/60 font-bold">{row.losses}</td>
                <td className="px-6 py-4 text-center">
                    <span className="text-base font-black text-amber-400 italic drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">{row.points}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {standings.map((row, idx) => (
          <div key={row.id} className={`p-5 rounded-3xl border border-white/5 bg-[#030913] relative overflow-hidden ${idx === 0 ? "border-amber-400/30 ring-1 ring-amber-400/20" : ""}`}>
            {idx === 0 && <div className="absolute top-0 right-0 bg-amber-400 text-black text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-tighter">Leader</div>}
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <span className={`text-xl font-black italic ${idx < 3 ? "text-amber-400" : "text-white/10"}`}>{idx + 1}</span>
                  <div>
                    <div className="text-sm font-black text-white uppercase italic">{row.username || `Entity_${row.user_id}`}</div>
                    <div className="text-[8px] text-white/20 uppercase font-black tracking-widest">Active Participant</div>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[8px] text-white/30 uppercase font-black mb-1">Total Pts</div>
                  <div className="text-xl font-black text-amber-400 italic leading-none">{row.points}</div>
               </div>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/5 text-center">
               <div><div className="text-[7px] text-white/20 uppercase mb-1">Played</div><div className="text-[10px] font-bold text-white/60">{row.matches_played}</div></div>
               <div><div className="text-[7px] text-white/20 uppercase mb-1">Wins</div><div className="text-[10px] font-bold text-emerald-400">{row.wins}</div></div>
               <div><div className="text-[7px] text-white/20 uppercase mb-1">Draws</div><div className="text-[10px] font-bold text-white/40">{row.draws}</div></div>
               <div><div className="text-[7px] text-white/20 uppercase mb-1">Losses</div><div className="text-[10px] font-bold text-red-400/60">{row.losses}</div></div>
            </div>
          </div>
        ))}
      </div>

      {standings.length === 0 && (
          <div className="px-6 py-20 text-center rounded-[30px] border border-dashed border-white/10">
              <div className="text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">No Ranking Data Synchronized</div>
          </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 text-[8px] font-black uppercase tracking-[0.2em] text-white/20 italic bg-white/5 py-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-amber-400" /> WIN: 3 PTS</div>
          <div className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-white/20" /> DRAW: 1 PT</div>
          <div className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-red-500/40" /> LOSS: 0 PTS</div>
      </div>
    </div>
  );
}
