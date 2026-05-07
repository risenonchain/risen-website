import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";

interface AuditLog {
  id: number;
  admin_id: number;
  action: string;
  details: string;
  created_at: string;
}

interface Props {
  leagueId: number;
}

export default function AdminLeagueAudit({ leagueId }: Props) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError("");
      try {
        // Attempt with /audit first, then fallback to /admin-audit if needed
        const res = await fetch(`${BASE_URL}/league/events/${leagueId}/audit`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("risen_admin_token")}` }
        });
        if (!res.ok) {
            // Fallback for older backend versions
            const res2 = await fetch(`${BASE_URL}/league/events/${leagueId}/admin-audit`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("risen_admin_token")}` }
            });
            if (!res2.ok) throw new Error("Failed to fetch audit logs");
            const data = await res2.json();
            setLogs(data);
        } else {
            const data = await res.json();
            setLogs(data);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [leagueId]);

  return (
    <div className="bg-[#07111d] p-6 rounded-3xl border border-white/5">
      <h3 className="text-lg font-black text-white uppercase tracking-widest italic mb-6">Neural Audit Trail</h3>

      {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
            <thead>
            <tr className="text-white/40 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="px-4 py-3">Privileged Node</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Data String</th>
                <th className="px-4 py-3 text-right">Timestamp</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 text-white/60 text-[10px] font-black">SYS_ADMIN_{log.admin_id}</td>
                <td className="px-4 py-4">
                    <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest italic bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">{log.action}</span>
                </td>
                <td className="px-4 py-4 text-white/40 text-[10px] font-bold truncate max-w-xs">{log.details}</td>
                <td className="px-4 py-4 text-right text-white/20 text-[9px] font-bold">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
            ))}
            {logs.length === 0 && !loading && (
                <tr>
                    <td colSpan={4} className="py-10 text-center text-white/20 text-xs font-black uppercase tracking-widest">No Privileged Actions Logged</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
