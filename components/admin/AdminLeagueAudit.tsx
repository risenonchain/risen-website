import React, { useEffect, useState } from "react";

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
        const res = await fetch(`/api/league/events/${leagueId}/admin-audit`);
        if (!res.ok) {
          let detail = "Unknown error";
          try {
            const data = await res.json();
            detail = data.detail || detail;
          } catch {
            const text = await res.text();
            detail = text.slice(0, 200);
          }
          throw new Error(detail);
        }
        const data = await res.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [leagueId]);

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Admin Audit Log</h3>
      {loading && <div className="text-white/60">Loading audit log...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <table className="min-w-full bg-[#07111d] rounded-xl shadow-lg mt-4">
        <thead>
          <tr className="text-amber-400 text-xs uppercase">
            <th className="px-4 py-2">Admin</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Details</th>
            <th className="px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-4 py-2 text-center">Admin {log.admin_id}</td>
              <td className="px-4 py-2 text-center">{log.action}</td>
              <td className="px-4 py-2 text-center">{log.details}</td>
              <td className="px-4 py-2 text-center">{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
