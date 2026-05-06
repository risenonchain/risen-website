"use client";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";

interface DeepestRunner {
  id: number;
  user_id: number;
  username: string;
  level_reached: number;
  match_id: number;
}

type Props = { leagueId: number };

export default function LeagueDeepestRunners({ leagueId }: Props) {
  const [runners, setRunners] = useState<DeepestRunner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRunners() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_URL}/league/events/${leagueId}/deepest-runners`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("rush_token")}` }
        });
        if (!res.ok) throw new Error("Failed to fetch deepest runners");
        const data = await res.json();
        setRunners(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchRunners();
  }, [leagueId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/5 border-t-amber-400" />
      <div className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Deep Runners...</div>
    </div>
  );

  if (error) return (
      <div className="mt-8 p-6 rounded-3xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest text-center">
          Connection Interrupted: {error}
      </div>
  );

  return (
    <div className="mt-4 pb-10">
      {/* Desktop View */}
      <div className="hidden md:block overflow-hidden rounded-[30px] border border-white/5 bg-[#030913] shadow-2xl">
        <table className="min-w-full">
          <thead>
            <tr className="text-amber-400 text-[9px] font-black uppercase tracking-[0.3em] bg-white/5">
              <th className="px-6 py-4 text-center w-16">#</th>
              <th className="px-6 py-4 text-left">Neural Identity</th>
              <th className="px-6 py-4 text-right">Max Depth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {runners.map((row, idx) => (
              <tr key={row.id} className={`transition-colors hover:bg-white/5 ${idx === 0 ? "bg-amber-400/5" : ""}`}>
                <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-black italic ${idx < 3 ? "text-amber-400" : "text-white/20"}`}>
                        {String(idx + 1).padStart(2, '0')}
                    </span>
                </td>
                <td className="px-6 py-4 text-left">
                    <div className="text-sm font-black text-white uppercase tracking-tighter italic">{row.username || `Entity_${row.user_id}`}</div>
                    <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-0.5">Match_Node_{row.match_id}</div>
                </td>
                <td className="px-6 py-4 text-right">
                    <span className="text-base font-black text-amber-400 italic tracking-tighter drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                      LVL {row.level_reached}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {runners.map((row, idx) => (
          <div key={row.id} className="flex items-center justify-between p-5 rounded-3xl border border-white/5 bg-[#030913]">
             <div className="flex items-center gap-4">
                <span className={`text-xl font-black italic ${idx < 3 ? "text-amber-400" : "text-white/10"}`}>{idx + 1}</span>
                <div>
                   <div className="text-sm font-black text-white uppercase italic">{row.username || `Entity_${row.user_id}`}</div>
                   <div className="text-[7px] text-white/20 uppercase font-black tracking-widest mt-1 italic">Match_Record_{row.match_id}</div>
                </div>
             </div>
             <div className="text-right">
                <div className="text-lg font-black text-amber-400 italic leading-none">LVL {row.level_reached}</div>
                <div className="text-[7px] text-white/20 uppercase font-black mt-1 tracking-widest">Neural Depth</div>
             </div>
          </div>
        ))}
      </div>

      {runners.length === 0 && (
          <div className="px-6 py-20 text-center rounded-[30px] border border-dashed border-white/10">
              <div className="text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">No Depth Records Synchronized</div>
          </div>
      )}
    </div>
  );
}
