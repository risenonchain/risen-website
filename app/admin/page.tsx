"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRedemptionRequests, updateRedemptionRequestStatus, blockPlayer, unblockPlayer, fetchAuditLogs, RedemptionRequest, AuditLog } from "@/lib/admin";

export default function AdminDashboard() {

  const [authorized, setAuthorized] = useState(false);
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockLoading, setBlockLoading] = useState<number | null>(null);
  const [unblockLoading, setUnblockLoading] = useState<number | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showAudit, setShowAudit] = useState(false);
    // Fetch audit logs
    const handleShowAudit = async () => {
      const token = localStorage.getItem("risen_admin_token");
      if (!token) return;
      setShowAudit(true);
      setLoading(true);
      setError(null);
      try {
        const logs = await fetchAuditLogs(token);
        setAuditLogs(logs);
      } catch (e: any) {
        setError(e.message || "Failed to fetch audit logs");
      } finally {
        setLoading(false);
      }
    };

    const handleUnblockPlayer = async (userId: number) => {
      const token = localStorage.getItem("risen_admin_token");
      if (!token) return;
      setUnblockLoading(userId);
      setError(null);
      try {
        await unblockPlayer(userId, token);
        alert("Player unblocked successfully.");
      } catch (e: any) {
        setError(e.message || "Failed to unblock player");
      } finally {
        setUnblockLoading(null);
      }
    };
  const router = useRouter();
  const handleBlockPlayer = async (userId: number) => {
    const token = localStorage.getItem("risen_admin_token");
    if (!token) return;
    setBlockLoading(userId);
    setError(null);
    try {
      await blockPlayer(userId, token);
      // Optionally, you could refresh the list or mark the user as blocked in UI
      alert("Player blocked successfully.");
    } catch (e: any) {
      setError(e.message || "Failed to block player");
    } finally {
      setBlockLoading(null);
    }
  };

  // Auth check and fetch redemptions
  useEffect(() => {
    const token = localStorage.getItem("risen_admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setAuthorized(true);
    setLoading(true);
    fetchRedemptionRequests(token)
      .then(setRedemptions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleUpdateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("risen_admin_token");
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await updateRedemptionRequestStatus(id, status, token);
      setRedemptions((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status, reviewed_at: new Date().toISOString() } : r))
      );
    } catch (e: any) {
      setError(e.message || "Failed to update request");
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#0a101a] text-white flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold mb-6">RISEN Admin Dashboard</h1>
      <div className="bg-[#101828] p-8 rounded-2xl shadow-lg w-full max-w-3xl border border-white/10 space-y-8">
        <section className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0a101a] to-[#0e1624] p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Live Updates</h2>
          <p className="mb-2 text-white/70">Post and manage homepage banners, news, and live notifications.</p>
          <div className="rounded-xl bg-[#0a101a] border border-white/10 p-4 mb-2">(Coming soon)</div>
        </section>
        <section className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-[#0a101a] to-[#101828] p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Modal Management</h2>
          <p className="mb-2 text-white/70">Create and schedule modals (e.g., contests, announcements) for the site.</p>
          <div className="rounded-xl bg-[#0a101a] border border-white/10 p-4 mb-2">(Coming soon)</div>
        </section>
        <section className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-[#0a101a] to-[#101828] p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Redemption Requests</h2>
          <p className="mb-2 text-white/70">View and process RISEN Rush game redemption requests.</p>
          <div className="rounded-xl bg-[#0a101a] border border-white/10 p-4 mb-2">
            {loading && <div className="text-white/60">Loading...</div>}
            {error && <div className="text-red-400 mb-2">{error}</div>}
            {!loading && !error && redemptions.length === 0 && (
              <div className="text-white/60">No redemption requests found.</div>
            )}
            {!loading && !error && redemptions.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/70">
                    <th className="py-1 px-2 text-left">User</th>
                    <th className="py-1 px-2 text-left">Wallet</th>
                    <th className="py-1 px-2 text-left">Points</th>
                    <th className="py-1 px-2 text-left">Status</th>
                    <th className="py-1 px-2 text-left">Requested</th>
                    <th className="py-1 px-2 text-left">Reviewed</th>
                    <th className="py-1 px-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((r) => (
                    <tr key={r.id} className="border-t border-white/10">
                      <td className="py-1 px-2">{r.username}</td>
                      <td className="py-1 px-2">{r.wallet_address}</td>
                      <td className="py-1 px-2">{r.points_requested}</td>
                      <td className="py-1 px-2">{r.status}</td>
                      <td className="py-1 px-2">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="py-1 px-2">{r.reviewed_at ? new Date(r.reviewed_at).toLocaleString() : "-"}</td>
                      <td className="py-1 px-2 space-x-2">
                        {r.status === "pending" && (
                          <>
                            <button
                              className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                              onClick={() => handleUpdateStatus(r.id, "approved")}
                              disabled={loading}
                            >
                              Approve
                            </button>
                            <button
                              className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleUpdateStatus(r.id, "rejected")}
                              disabled={loading}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className="px-2 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 ml-2"
                          onClick={() => handleBlockPlayer(r.id)}
                          disabled={blockLoading === r.id}
                        >
                          {blockLoading === r.id ? "Blocking..." : "Block Player"}
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 ml-2"
                          onClick={() => handleUnblockPlayer(r.id)}
                          disabled={unblockLoading === r.id}
                        >
                          {unblockLoading === r.id ? "Unblocking..." : "Unblock Player"}
                        </button>
                                <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#0a101a] to-[#18102a] p-6 shadow-lg mt-8 w-full">
                                  <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-xl font-semibold">Audit Logs</h2>
                                    <button
                                      className="px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"
                                      onClick={handleShowAudit}
                                      disabled={loading}
                                    >
                                      {loading && showAudit ? "Loading..." : "Show Audit Logs"}
                                    </button>
                                  </div>
                                  {showAudit && (
                                    <div className="overflow-x-auto mt-2">
                                      {auditLogs.length === 0 && !loading && <div className="text-white/60">No audit logs found.</div>}
                                      {auditLogs.length > 0 && (
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="text-white/70">
                                              <th className="py-1 px-2 text-left">Action</th>
                                              <th className="py-1 px-2 text-left">Actor</th>
                                              <th className="py-1 px-2 text-left">Target</th>
                                              <th className="py-1 px-2 text-left">Details</th>
                                              <th className="py-1 px-2 text-left">Timestamp</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {auditLogs.map((log) => (
                                              <tr key={log.id} className="border-t border-white/10">
                                                <td className="py-1 px-2">{log.action}</td>
                                                <td className="py-1 px-2">{log.actor}</td>
                                                <td className="py-1 px-2">{log.target_user || "-"}</td>
                                                <td className="py-1 px-2">{log.details || "-"}</td>
                                                <td className="py-1 px-2">{new Date(log.timestamp).toLocaleString()}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      )}
                                    </div>
                                  )}
                                </section>
                        {r.status !== "pending" && <span className="text-white/50">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
        {/* Add more admin features here as needed */}
      </div>
    </div>
  );
}
