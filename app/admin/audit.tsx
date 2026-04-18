"use client";

import { useEffect, useState } from "react";
import { fetchAuditLogs, AuditLog } from "@/lib/admin";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("risen_admin_token");
    if (!token) return;
    setLoading(true);
    fetchAuditLogs(token)
      .then(setLogs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-extrabold mb-6 text-cyan-300">Audit Logs</h1>
      <div className="rounded-3xl bg-[#101828] border border-white/10 p-8 shadow-xl">
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400 mb-2">{error}</div>
        ) : logs.length === 0 ? (
          <div className="text-white/60">No audit logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-white/70">
                  <th className="text-left px-2">Timestamp</th>
                  <th className="text-left px-2">Admin</th>
                  <th className="text-left px-2">Action</th>
                  <th className="text-left px-2">Target User</th>
                  <th className="text-left px-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-white/10">
                    <td className="py-2 px-2 text-white/80 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-2 text-white font-semibold">{log.actor}</td>
                    <td className="py-2 px-2 text-cyan-300">{log.action}</td>
                    <td className="py-2 px-2 text-white/80">{log.target_user || "-"}</td>
                    <td className="py-2 px-2 text-white/60">{log.details || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
