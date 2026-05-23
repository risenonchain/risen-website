"use client";
import React, { useEffect, useState } from "react";
import {
  fetchRushUsers,
  MeResponse,
  LeagueChallengeOut,
  fetchMyChallenges,
  sendLeagueChallenge,
  respondToChallenge
} from "@/lib/api";
import { Users, Send, Check, X, Clock, ChevronDown, AlertCircle } from "lucide-react";

type Props = { leagueId: number };

export default function LeagueChallenges({ leagueId }: Props) {
  const [players, setPlayers] = useState<MeResponse[]>([]);
  const [challenges, setChallenges] = useState<LeagueChallengeOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [showSendForm, setShowSendForm] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  async function init() {
    setLoading(true);
    setError("");
    try {
      const [pData, cData] = await Promise.all([
        fetchRushUsers(),
        fetchMyChallenges()
      ]);
      setPlayers(pData);
      setChallenges(cData);
    } catch (err: any) {
      console.error("P2P Sync Error:", err);
      setError(err.message || "Establishing Neural Link Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { init(); }, [leagueId]);

  const handlePlay = (challengeId: number) => {
    // Trigger P2P game start
    window.dispatchEvent(new CustomEvent("risen-rush-start-p2p", { detail: { challengeId } }));
  };

  async function handleSendChallenge(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlayerId || !scheduledTime) return;
    setSending(true);
    try {
        await sendLeagueChallenge({
            league_id: leagueId,
            challenged_id: Number(selectedPlayerId),
            scheduled_at: new Date(scheduledTime).toISOString()
        });
        setShowSendForm(false);
        init();
        alert("Challenge Pushed to Neural Network.");
    } catch (e: any) {
        alert(e.message);
    } finally {
        setSending(false);
    }
  }

  async function handleRespond(challengeId: number, action: "accept" | "reject") {
    try {
        await respondToChallenge(challengeId, action);
        init();
    } catch (e: any) {
        alert(e.message);
    }
  }

  if (loading) return <div className="py-10 text-white/20 text-[10px] font-black uppercase tracking-widest animate-pulse">Establishing Neural Link...</div>;

  return (
    <div className="space-y-10 pb-10">
      <div className="flex items-center justify-between px-2">
        <div className="text-left">
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest">P2P Protocols</h3>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1 italic">Direct Node Engagement</p>
        </div>
        <button
            onClick={() => setShowSendForm(!showSendForm)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${showSendForm ? 'bg-white/10 text-white' : 'bg-amber-400 text-black shadow-lg shadow-amber-400/10'} active:scale-95`}
        >
            {showSendForm ? <X className="w-3 h-3" /> : <Send className="w-3 h-3" />}
            {showSendForm ? "Cancel" : "Initialize"}
        </button>
      </div>

      {error && (
        <div className="mx-2 p-5 rounded-[30px] bg-red-500/5 border border-red-500/20 flex items-center gap-4 text-red-400 animate-in fade-in zoom-in duration-300">
           <AlertCircle className="w-5 h-5 shrink-0" />
           <div className="flex-1">
              <div className="text-[10px] font-black uppercase tracking-widest">Connection Error</div>
              <div className="text-[9px] font-bold opacity-70 mt-1">{error}</div>
           </div>
           <button onClick={init} className="text-[8px] font-black underline uppercase tracking-widest">Retry</button>
        </div>
      )}

      {showSendForm && (
        <form onSubmit={handleSendChallenge} className="mx-2 p-7 rounded-[35px] bg-[#030913] border border-amber-400/20 space-y-5 animate-in slide-in-from-top duration-500 shadow-2xl">
            <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase ml-2 tracking-[0.2em]">Select Opponent Node</label>
                <div className="relative">
                    <select
                        value={selectedPlayerId}
                        onChange={e => setSelectedPlayerId(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-[11px] font-black uppercase text-white outline-none focus:border-amber-400/50 transition-all appearance-none cursor-pointer"
                        required
                    >
                        <option value="" className="bg-[#07111d] text-white/40">{players.length === 0 ? "SCANNING NETWORK..." : "SELECT TARGET..."}</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id} className="bg-[#07111d] text-white">
                                {p.username} {p.is_premium ? '— PRIME' : ''}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                </div>
                {players.length === 0 && !error && (
                    <p className="text-[8px] font-black text-amber-400/40 uppercase ml-2 italic tracking-widest">Searching for available entities...</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase ml-2 tracking-[0.2em]">Temporal Schedule</label>
                <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] font-black text-white outline-none focus:border-amber-400/50 transition-all"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={sending || !selectedPlayerId}
                className="w-full py-5 bg-amber-400 text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-xl shadow-amber-400/10 active:scale-95 transition-all disabled:opacity-50"
            >
                {sending ? "TRANSMITTING..." : "COMMIT CHALLENGE"}
            </button>
        </form>
      )}

      {/* Accepted Challenges - Ready to Play */}
      {challenges.filter(c => c.status === 'accepted').length > 0 && (
        <div className="space-y-5 px-2">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Protocols
            </div>
            {challenges.filter(c => c.status === 'accepted').map(c => (
                <div key={c.id} className="p-6 rounded-[35px] bg-[#030913] border border-emerald-500/20 flex items-center justify-between group transition-all shadow-lg relative overflow-hidden">
                    <div className="text-left">
                        <div className="text-[12px] font-black text-white uppercase italic tracking-tighter">
                            {c.challenger_id === Number(localStorage.getItem("risen_rush_id")) ? c.challenged_username : c.challenger_username}
                        </div>
                        <div className="text-[8px] font-bold text-emerald-400/60 uppercase mt-1 tracking-widest italic">Node Link Verified</div>
                    </div>
                    <button
                        onClick={() => handlePlay(c.id)}
                        className="bg-emerald-500 text-white font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                    >
                        Deploy
                    </button>
                </div>
            ))}
        </div>
      )}

      {/* Pending Inbound */}
      <div className="space-y-5 px-2">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
            <Clock className="w-3.5 h-3.5 text-amber-400/50" /> Pending Inbound
        </div>

        {challenges.filter(c => c.status === 'pending' && c.challenged_id === Number(localStorage.getItem("risen_rush_id"))).length === 0 ? (
            <div className="py-12 border border-dashed border-white/5 rounded-[40px] text-center bg-white/[0.01]">
                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">No Inbound Requests</span>
            </div>
        ) : (
            challenges.filter(c => c.status === 'pending' && c.challenged_id === Number(localStorage.getItem("risen_rush_id"))).map(c => (
                <div key={c.id} className="p-6 rounded-[35px] bg-[#030913] border border-white/5 flex items-center justify-between group hover:border-amber-400/30 transition-all shadow-lg relative overflow-hidden">
                    <div className="text-left relative z-10">
                        <div className="text-[12px] font-black text-white uppercase italic tracking-tighter">{c.challenger_username}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="h-1 w-1 rounded-full bg-amber-400" />
                            <div className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest italic">
                                {new Date(c.scheduled_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <button
                            onClick={() => handleRespond(c.id, "accept")}
                            className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all active:scale-90 shadow-lg shadow-emerald-500/5"
                        >
                            <Check className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleRespond(c.id, "reject")}
                            className="h-11 w-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-lg shadow-red-500/5"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Outbound Syncs */}
      <div className="space-y-5 px-2">
          <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
              <Send className="w-3.5 h-3.5" /> Outbound Syncs
          </div>
          {challenges.filter(c => c.status === 'pending' && c.challenger_id === Number(localStorage.getItem("risen_rush_id"))).length === 0 ? (
              <div className="py-12 border border-dashed border-white/5 rounded-[40px] text-center bg-white/[0.01]">
                  <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">No Active Transmissions</span>
              </div>
          ) : (
              challenges.filter(c => c.status === 'pending' && c.challenger_id === Number(localStorage.getItem("risen_rush_id"))).map(c => (
                  <div key={c.id} className="p-6 rounded-[35px] bg-[#030913] border border-white/5 flex items-center justify-between opacity-60">
                      <div className="text-left">
                          <div className="text-[11px] font-black text-white uppercase italic">{c.challenged_username}</div>
                          <div className="text-[8px] font-bold text-white/20 uppercase mt-1">Pending Ack...</div>
                      </div>
                      <div className="text-[8px] font-black text-amber-400 uppercase tracking-widest italic">Awaiting Sync</div>
                  </div>
              ))
          )}
      </div>

      <div className="mx-4 p-6 rounded-[35px] bg-amber-400/5 border border-amber-400/10">
        <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Users className="w-3 h-3" /> P2P Rules
        </div>
        <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase italic">
            Challenges are only valid for 48 hours. Both nodes must accept the temporal schedule. Only Elite (Prime) entities can initialize P2P protocols. Matches are recorded under survival parameters.
        </p>
      </div>
    </div>
  );
}
