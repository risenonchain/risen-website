import React, { useEffect, useState } from "react";

interface Registration {
  id: number;
  user_id: number;
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

  useEffect(() => {
    async function fetchRegistrations() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/league/events/${leagueId}/registrations`);
        if (!res.ok) throw new Error("Failed to fetch registrations");
        const data = await res.json();
        setRegistrations(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchRegistrations();
  }, [leagueId]);

  async function handleApprove(registrationId: number) {
    try {
      const res = await fetch(`/api/league/events/${leagueId}/registrations/${registrationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to approve registration");
      const updated = await res.json();
      setRegistrations((prev) => prev.map(r => r.id === registrationId ? { ...r, status: "approved" } : r));
    } catch (err: any) {
      alert(err.message || "Unknown error");
    }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Registrations</h3>
      {loading && <div className="text-white/60">Loading registrations...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <table className="min-w-full bg-[#07111d] rounded-xl shadow-lg mt-4">
        <thead>
          <tr className="text-amber-400 text-xs uppercase">
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Registered At</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg.id}>
              <td className="px-4 py-2 text-center">User {reg.user_id}</td>
              <td className="px-4 py-2 text-center font-bold">
                {reg.status === "approved" ? <span className="text-green-400">Approved</span> : reg.status === "pending" ? <span className="text-yellow-400">Pending</span> : <span className="text-red-400">Rejected</span>}
              </td>
              <td className="px-4 py-2 text-center">{new Date(reg.registered_at).toLocaleString()}</td>
              <td className="px-4 py-2 text-center">
                {reg.status === "pending" && (
                  <button
                    className="bg-green-500 text-white font-bold px-4 py-1 rounded hover:bg-green-400 transition"
                    onClick={() => handleApprove(reg.id)}
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
