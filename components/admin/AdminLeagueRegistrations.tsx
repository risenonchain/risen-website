import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";

interface Registration {
  id: number;
  user_id: number;
  username?: string;
  status: string;
  registered_at: string;
}

interface Props {
  leagueId: number;
}

export default function AdminLeagueRegistrations({ leagueId }: Props) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRegistrations() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/league/events/${leagueId}/registrations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch registrations");
      const data = await res.json();
      setRegistrations(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRegistrations();
  }, [leagueId]);

  async function handleApprove(registrationId: number) {
    try {
      const res = await fetch(`${BASE_URL}/league/events/${leagueId}/registrations/${registrationId}/approve`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}`
        },
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to approve registration");
      setRegistrations((prev) => prev.map(r => r.id === registrationId ? { ...r, status: "approved" } : r));
    } catch (err: any) {
      alert(err.message || "Unknown error");
    }
  }

  return (
    <div className="bg-[#07111d] p-6 rounded-3xl border border-white/5">
      <h3 className="text-lg font-black text-white uppercase tracking-widest italic mb-6">League Registrations</h3>

      {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
            <thead>
            <tr className="text-white/40 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="px-4 py-3">Neural Identity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registration Node</th>
                <th className="px-4 py-3 text-right">Action</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 text-white font-black uppercase tracking-tighter">{reg.username || `Entity_${reg.user_id}`}</td>
                <td className="px-4 py-4">
                    {reg.status === "approved" ? (
                        <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest italic bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Approved</span>
                    ) : reg.status === "pending" ? (
                        <span className="text-yellow-400 text-[9px] font-black uppercase tracking-widest italic bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">Pending Sync</span>
                    ) : (
                        <span className="text-red-400 text-[9px] font-black uppercase tracking-widest italic bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">Rejected</span>
                    )}
                </td>
                <td className="px-4 py-4 text-white/40 text-[10px] font-bold">{new Date(reg.registered_at).toLocaleString()}</td>
                <td className="px-4 py-4 text-right">
                    {reg.status === "pending" && (
                        <button
                            className="bg-emerald-500 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg hover:bg-emerald-400 transition-all active:scale-95"
                            onClick={() => handleApprove(reg.id)}
                        >
                            Approve Access
                        </button>
                    )}
                </td>
                </tr>
            ))}
            {registrations.length === 0 && !loading && (
                <tr>
                    <td colSpan={4} className="py-10 text-center text-white/20 text-xs font-black uppercase tracking-widest">No Registrations Detected</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
