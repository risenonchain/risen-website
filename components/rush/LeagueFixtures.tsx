"use client";
import React, { useEffect, useState } from "react";
import { fetchCurrentRushUser, MeResponse, BASE_URL } from "@/lib/api";

interface Fixture {
  id: number;
  match_id: number | null;
  round: number;
  player1_id: number;
  player2_id: number;
  player1_username: string;
  player2_username: string;
  scheduled_at: string | null;
  result_submitted: boolean;
  stage: string;
  group_name: string | null;
}

type Props = { leagueId: number };

export default function LeagueFixtures({ leagueId }: Props) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError("");
      try {
        const [me, res] = await Promise.all([
          fetchCurrentRushUser(),
          fetch(`${BASE_URL}/league/events/${leagueId}/fixtures`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("rush_token")}` }
          })
        ]);
        setCurrentUser(me);
        if (!res.ok) throw new Error("Failed to fetch fixtures");
        const data = await res.json();
        setFixtures(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [leagueId]);

  const handlePlay = async (fixtureId: number, matchId: number | null) => {
    if (!matchId) {
        alert("No match record found for this fixture. Contact Admin.");
        return;
    }
    // Trigger game start with league match id
    window.dispatchEvent(new CustomEvent("risen-rush-start-league", { detail: { matchId: matchId } }));
  };

  if (loading) return <div className="text-center text-white/60">Loading fixtures...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  const grouped = fixtures.reduce((acc: any, fix) => {
    const key = fix.group_name ? `Group ${fix.group_name}` : fix.stage.toUpperCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(fix);
    return acc;
  }, {});

  return (
    <div className="mt-4 pb-20 space-y-12">
      {Object.keys(grouped).map((groupKey) => (
        <div key={groupKey} className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-black text-amber-400 uppercase italic tracking-widest">{groupKey}</h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-400/20 to-transparent" />
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-hidden rounded-[30px] border border-white/5 bg-[#030913] shadow-2xl">
            <table className="min-w-full">
              <thead>
                <tr className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] bg-white/5">
                  <th className="px-6 py-4 text-left">Protocol</th>
                  <th className="px-6 py-4 text-center">Neural Player 1</th>
                  <th className="px-4 py-4 text-center w-20">VS</th>
                  <th className="px-6 py-4 text-center">Neural Player 2</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {grouped[groupKey].map((fix: Fixture) => {
                  const isPlayer1 = currentUser?.id === String(fix.player1_id);
                  const isPlayer2 = currentUser?.id === String(fix.player2_id);
                  const isParticipant = isPlayer1 || isPlayer2;

                  return (
                    <tr key={fix.id} className={`transition-colors ${isParticipant ? "bg-amber-400/5" : "hover:bg-white/5"}`}>
                      <td className="px-6 py-5 text-left">
                          <div className="text-xs font-black text-white italic">R{fix.round}</div>
                          <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">Sync Cycle</div>
                      </td>
                      <td className={`px-6 py-5 text-center text-sm font-black uppercase tracking-tighter ${isPlayer1 ? "text-amber-400" : "text-white/80"}`}>
                          {fix.player1_username}
                          {isPlayer1 && <span className="block text-[8px] text-amber-400/60 mt-1 tracking-widest italic">(You)</span>}
                      </td>
                      <td className="px-4 py-5 text-center">
                          <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                              <span className="text-[9px] font-black text-white/20">VS</span>
                          </div>
                      </td>
                      <td className={`px-6 py-5 text-center text-sm font-black uppercase tracking-tighter ${isPlayer2 ? "text-amber-400" : "text-white/80"}`}>
                          {fix.player2_username}
                          {isPlayer2 && <span className="block text-[8px] text-amber-400/60 mt-1 tracking-widest italic">(You)</span>}
                      </td>
                      <td className="px-6 py-5 text-right">
                         {fix.result_submitted ? (
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest italic">
                              <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                              Done
                           </div>
                         ) : isParticipant ? (
                           <button
                             onClick={() => handlePlay(fix.id, fix.match_id)}
                             className="bg-amber-400 text-black text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-amber-300"
                           >
                             Play
                           </button>
                         ) : (
                           <div className="text-[9px] text-white/10 font-black uppercase tracking-widest italic">Wait</div>
                         )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {grouped[groupKey].map((fix: Fixture) => {
              const isPlayer1 = currentUser?.id === String(fix.player1_id);
              const isPlayer2 = currentUser?.id === String(fix.player2_id);
              const isParticipant = isPlayer1 || isPlayer2;

              return (
                <div key={fix.id} className={`p-6 rounded-[35px] border border-white/5 bg-[#030913] relative overflow-hidden ${isParticipant ? "border-amber-400/20 ring-1 ring-amber-400/10 bg-amber-400/5" : ""}`}>
                   <div className="flex justify-between items-center mb-6">
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/40">Cycle R{fix.round}</div>
                      {fix.result_submitted ? (
                        <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400 italic">Sync Complete</div>
                      ) : (
                        <div className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Live Loop</div>
                      )}
                   </div>

                   <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 text-center">
                         <div className={`text-sm font-black uppercase tracking-tighter italic leading-tight ${isPlayer1 ? "text-amber-400 underline decoration-amber-400/30 underline-offset-4" : "text-white"}`}>{fix.player1_username}</div>
                         <div className="text-[7px] text-white/20 uppercase font-black mt-2 tracking-widest">Node_Alpha</div>
                      </div>

                      <div className="flex flex-col items-center">
                         <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative z-10">
                            <span className="text-[9px] font-black text-white/30 italic">VS</span>
                         </div>
                         <div className="h-10 w-[1px] bg-gradient-to-b from-white/10 to-transparent -mt-1" />
                      </div>

                      <div className="flex-1 text-center">
                         <div className={`text-sm font-black uppercase tracking-tighter italic leading-tight ${isPlayer2 ? "text-amber-400 underline decoration-amber-400/30 underline-offset-4" : "text-white"}`}>{fix.player2_username}</div>
                         <div className="text-[7px] text-white/20 uppercase font-black mt-2 tracking-widest">Node_Beta</div>
                      </div>
                   </div>

                   {!fix.result_submitted && isParticipant && (
                     <button
                       onClick={() => handlePlay(fix.id, fix.match_id)}
                       className="w-full mt-6 bg-amber-400 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all"
                     >
                       Initialize Neural Match
                     </button>
                   )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {fixtures.length === 0 && (
          <div className="px-6 py-20 text-center rounded-[30px] border border-dashed border-white/10">
              <div className="text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">No Active Fixtures Synchronized</div>
          </div>
      )}
    </div>
  );
}
