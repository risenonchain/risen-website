"use client";
import React, { useEffect, useState } from "react";
import { BASE_URL, fetchRushUsers, MeResponse, LeagueChallengeOut } from "@/lib/api";
import { Users, Send, Check, X, Clock } from "lucide-react";

type Props = { leagueId: number };

export default function LeagueChallenges({ leagueId }: Props) {
  const [players, setPlayers] = useState<MeResponse[]>([]);
  const [challenges, setChallenges] = useState<LeagueChallengeOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [showSendForm, setShowSendSendForm] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  async function init() {
    setLoading(true);
    setError("");
    try {
      const [pData, cRes] = await Promise.all([
        fetchRushUsers(),
        fetch(`${BASE_URL}/league/challenges/pending`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("rush_token")}` }
        })
      ]);
      setPlayers(pData);
      if (cRes.ok) setChallenges(await cRes.json());
    } catch (err: any) {
      setError(err.message || "Sync Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { init(); }, [leagueId]);

  async function handleSendChallenge(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlayerId || !scheduledTime) return;
    setSending(true);
    try {
        const res = await fetch(`${BASE_URL}/league/challenges/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("rush_token")}`
            },
            body: JSON.stringify({
                league_id: leagueId,
                challenged_id: Number(selectedPlayerId),
                scheduled_at: new Date(scheduledTime).toISOString()
            })
        });
        if (!res.ok) throw new Error("Failed to send protocol");
        setShowSendSendForm(false);
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
        const res = await fetch(`${BASE_URL}/league/challenges/${challengeId}/respond`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("rush_token")}`
            },
            body: JSON.stringify({ action })
        });
        if (res.ok) init();
    } catch (e) {}
  }

  if (loading) return <div className="py-10 text-white/20 text-[10px] font-black uppercase tracking-widest animate-pulse">Establishing Neural Link...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-sm font-black text-white uppercase italic tracking-widest">P2P Protocols</h3>
        <button
            onClick={() => setShowSendSendForm(!showSendForm)}
            className="flex items-center gap-2 bg-risen-primary text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
            <Send className="w-3 h-3" />
            Initialize Challenge
        </button>
      </div>

      {showSendForm && (
        <form onSubmit={handleSendChallenge} className="mx-4 p-6 rounded-3xl bg-[#030913] border border-risen-primary/20 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="space-y-1">
                <label className="text-[8px] font-black text-white/30 uppercase ml-2 tracking-widest">Target Node</label>
                <select
                    value={selectedPlayerId}
                    onChange={e => setSelectedPlayerId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-white outline-none focus:border-risen-primary/50"
                    required
                >
                    <option value="">SELECT PLAYER</option>
                    {players.map(p => (
                        <option key={p.id} value={p.id}>{p.username} {p.is_premium ? '(PRIME)' : ''}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-[8px] font-black text-white/30 uppercase ml-2 tracking-widest">Temporal Schedule</label>
                <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-black text-white outline-none focus:border-risen-primary/50"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-risen-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-lg"
            >
                {sending ? "SYNCING..." : "COMMIT PROTOCOL"}
            </button>
        </form>
      )}

      {/* Pending Inbound */}
      <div className="space-y-4 px-4">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
            <Clock className="w-3 h-3" /> Pending Inbound
        </div>

        {challenges.length === 0 ? (
            <div className="py-12 border border-dashed border-white/5 rounded-3xl text-center">
                <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">No Active Challenges Detected</span>
            </div>
        ) : (
            challenges.map(c => (
                <div key={c.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-amber-400/30 transition-all">
                    <div className="text-left">
                        <div className="text-[11px] font-black text-white uppercase italic tracking-tighter">{c.challenger_username}</div>
                        <div className="text-[8px] font-bold text-amber-400/60 uppercase mt-1 tracking-widest">
                            {new Date(c.scheduled_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleRespond(c.id, "accept")}
                            className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleRespond(c.id, "reject")}
                            className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
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
