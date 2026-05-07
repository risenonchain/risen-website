import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";

interface Fixture {
  id: number;
  round: number;
  player1_id: number;
  player2_id: number;
  player1_username: string;
  player2_username: string;
  scheduled_at: string | null;
  result_submitted: boolean;
}

interface Props {
  leagueId: number;
}

export default function AdminLeagueFixtures({ leagueId }: Props) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchFixtures() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/league/events/${leagueId}/fixtures`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch fixtures");
      const data = await res.json();
      setFixtures(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFixtures();
  }, [leagueId]);

  const [generating, setGenerating] = useState(false);

  async function handleGenerateFixtures() {
    if (!confirm("This will overwrite/add new fixtures. Continue?")) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/league/events/${leagueId}/fixtures/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}`
        },
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to generate fixtures");
      await fetchFixtures();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="bg-[#07111d] p-6 rounded-3xl border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white uppercase tracking-widest italic">League Fixtures</h3>
        <button
            className="bg-amber-400 text-black font-black px-6 py-2 rounded-xl shadow-lg hover:bg-amber-300 transition-all active:scale-95 text-xs uppercase tracking-widest"
            onClick={handleGenerateFixtures}
            disabled={generating}
        >
            {generating ? "Generating Matrix..." : "Auto-Generate Fixtures"}
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
            <thead>
            <tr className="text-white/40 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="px-4 py-3">Round</th>
                <th className="px-4 py-3">Neural Entity 1</th>
                <th className="px-4 py-3">Neural Entity 2</th>
                <th className="px-4 py-3">Sync Schedule</th>
                <th className="px-4 py-3">Protocol Status</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {fixtures.map((fix) => (
                <tr key={fix.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 text-white font-black italic">R{fix.round}</td>
                <td className="px-4 py-4 text-amber-400 text-sm font-black uppercase tracking-tighter">{fix.player1_username}</td>
                <td className="px-4 py-4 text-amber-400 text-sm font-black uppercase tracking-tighter">{fix.player2_username}</td>
                <td className="px-4 py-4 text-white/40 text-[10px] font-bold">{fix.scheduled_at ? new Date(fix.scheduled_at).toLocaleString() : "TBD"}</td>
                <td className="px-4 py-4">
                    {fix.result_submitted ? (
                        <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest italic bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Completed</span>
                    ) : (
                        <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest italic bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">Pending Sync</span>
                    )}
                </td>
                </tr>
            ))}
            {fixtures.length === 0 && !loading && (
                <tr>
                    <td colSpan={5} className="py-10 text-center text-white/20 text-xs font-black uppercase tracking-widest">No Fixtures Synchronized</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
