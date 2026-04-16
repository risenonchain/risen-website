"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import {
  fetchRedemptionRequests,
  updateRedemptionRequestStatus,
  blockPlayer,
  unblockPlayer,
  RedemptionRequest,
} from "@/lib/admin";

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("risen_admin_token");
    if (!token) return;
    setLoading(true);
    fetchRedemptionRequests(token)
      .then(setRedemptions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: number, action: "approved" | "rejected" | "block" | "unblock") => {
    const token = localStorage.getItem("risen_admin_token");
    if (!token) return;
    setActionLoading(id);
    setError(null);
    try {
      if (action === "approved" || action === "rejected") {
        await updateRedemptionRequestStatus(id, action, token);
        setToast({ type: "success", message: `Request ${action}` });
      } else if (action === "block") {
        await blockPlayer(id, token);
        setToast({ type: "success", message: "Player blocked" });
      } else if (action === "unblock") {
        await unblockPlayer(id, token);
        setToast({ type: "success", message: "Player unblocked" });
      }
      // Refresh list
      const updated = await fetchRedemptionRequests(token);
      setRedemptions(updated);
    } catch (e: any) {
      setError(e.message || "Action failed");
      setToast({ type: "error", message: e.message || "Action failed" });
    } finally {
      setActionLoading(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-extrabold mb-6 text-risen-primary">Redemption Requests</h1>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl font-semibold shadow-lg ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}
      <div className="rounded-3xl bg-[#101828] border border-white/10 p-8 shadow-xl">
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400 mb-2">{error}</div>
        ) : redemptions.length === 0 ? (
          <div className="text-white/60">No redemption requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-white/70">
                  <th className="text-left px-2">User</th>
                  <th className="text-left px-2">Wallet</th>
                  <th className="text-left px-2">Points</th>
                  <th className="text-left px-2">RSN Tokens</th>
                  <th className="text-left px-2">Status</th>
                  <th className="text-left px-2">Requested</th>
                  <th className="text-left px-2">Reviewed</th>
                  <th className="text-left px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((r) => {
                  let statusColor = "";
                  if (r.status === "approved") statusColor = "text-green-400 bg-green-900/30 border-green-400/20";
                  else if (r.status === "rejected") statusColor = "text-red-400 bg-red-900/30 border-red-400/20";
                  else statusColor = "text-yellow-300 bg-yellow-900/20 border-yellow-400/10";
                  return (
                    <tr key={r.id} className="border-t border-white/10">
                      <td className="py-2 px-2 font-semibold text-white">{r.username}</td>
                      <td className="py-2 px-2 text-white/80 break-all flex items-center gap-2">
                        <span>{r.wallet_address}</span>
                        <button
                          className="p-1 rounded hover:bg-white/10 focus:outline-none"
                          title="Copy wallet address"
                          onClick={() => {
                            navigator.clipboard.writeText(r.wallet_address);
                            setToast({ type: "success", message: "Wallet address copied!" });
                          }}
                        >
                          <Copy className="w-4 h-4 text-cyan-300" />
                        </button>
                      </td>
                      <td className="py-2 px-2 text-white/90">{r.points_requested}</td>
                      <td className="py-2 px-2 text-cyan-300 font-semibold">{(r.points_requested / 10000).toFixed(2)} RSN</td>
                      <td className="py-2 px-2">
                        <span className={`inline-block rounded-full border px-3 py-1 font-semibold text-xs uppercase tracking-wider ${statusColor}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 whitespace-nowrap text-white/70">{r.created_at ? new Date(r.created_at).toLocaleString() : "-"}</td>
                      <td className="py-2 px-2 whitespace-nowrap text-white/70">{r.reviewed_at ? new Date(r.reviewed_at).toLocaleString() : "-"}</td>
                      <td className="py-2 px-2 space-x-2">
                        {r.status === "pending" && (
                          <>
                            <button
                              className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                              onClick={() => handleAction(r.id, "approved")}
                              disabled={actionLoading === r.id}
                            >
                              Approve
                            </button>
                            <button
                              className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleAction(r.id, "rejected")}
                              disabled={actionLoading === r.id}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className="px-2 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 ml-2"
                          onClick={() => handleAction(r.id, "block")}
                          disabled={actionLoading === r.id}
                        >
                          Block Player
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 ml-2"
                          onClick={() => handleAction(r.id, "unblock")}
                          disabled={actionLoading === r.id}
                        >
                          Unblock Player
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
