import React, { useState } from "react";
import dynamic from "next/dynamic";

const AdminLeagueEvents = dynamic(() => import("./AdminLeagueEvents"), { ssr: false });
const AdminLeagueRegistrations = dynamic(() => import("./AdminLeagueRegistrations"), { ssr: false });
const AdminLeagueFixtures = dynamic(() => import("./AdminLeagueFixtures"), { ssr: false });
const AdminLeagueAudit = dynamic(() => import("./AdminLeagueAudit"), { ssr: false });

const TABS = [
  { key: "events", label: "League Events" },
  { key: "registrations", label: "Registrations" },
  { key: "fixtures", label: "Fixtures" },
  { key: "audit", label: "Audit Log" },
  { key: "admin", label: "Admin Controls" },
];

interface AdminLeaguePanelProps {
  leagueId: number;
}

export default function AdminLeaguePanel({ leagueId }: AdminLeaguePanelProps) {
  const [tab, setTab] = useState("events");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");

  async function handleProgressGroup() {
    setAdminLoading(true);
    setAdminMsg("");
    try {
      const res = await fetch(`/api/league/events/${leagueId}/group/progress`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to progress group stage");
      setAdminMsg("Group stage progressed. Winners advanced.");
    } catch (err: any) {
      setAdminMsg(err.message || "Unknown error");
    } finally {
      setAdminLoading(false);
    }
  }

  async function handleGenerateFinals() {
    setAdminLoading(true);
    setAdminMsg("");
    try {
      const res = await fetch(`/api/league/events/${leagueId}/finals/generate`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to generate finals");
      setAdminMsg("Finals fixtures generated.");
    } catch (err: any) {
      setAdminMsg(err.message || "Unknown error");
    } finally {
      setAdminLoading(false);
    }
  }

  // Disqualify/Eliminate participant (admin quick action)
  async function handleParticipantStatus(userId: number, status: "disqualify" | "eliminate") {
    setAdminLoading(true);
    setAdminMsg("");
    try {
      const res = await fetch(`/api/league/events/${leagueId}/participants/${userId}/${status}`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).detail || `Failed to ${status} participant`);
      setAdminMsg(`Participant ${status}d.`);
    } catch (err: any) {
      setAdminMsg(err.message || "Unknown error");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div className="p-8 bg-[#030913] rounded-2xl shadow-xl">
      <h2 className="text-2xl font-black text-white mb-6">League Management</h2>
      <div className="flex gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest transition border-2 ${tab === t.key ? "bg-amber-400 text-black border-amber-400" : "bg-[#030913] text-white/60 border-white/10 hover:bg-amber-400/10 hover:text-amber-400"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <label className="text-white/60 mr-2">League ID:</label>
        <input
          type="number"
          value={leagueId}
          onChange={e => setLeagueId(Number(e.target.value))}
          className="w-20 px-2 py-1 rounded bg-[#07111d] text-white border border-amber-400/30"
        />
      </div>
      <div className="min-h-[300px]">
        {tab === "events" && <AdminLeagueEvents leagueId={leagueId} />}
        {tab === "registrations" && <AdminLeagueRegistrations leagueId={leagueId} />}
        {tab === "fixtures" && <AdminLeagueFixtures leagueId={leagueId} />}
        {tab === "audit" && <AdminLeagueAudit leagueId={leagueId} />}
        {tab === "admin" && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Admin Controls</h3>
            <button
              className="mb-4 bg-amber-400 text-black font-black px-6 py-2 rounded-xl shadow hover:bg-amber-300 transition mr-4"
              onClick={handleProgressGroup}
              disabled={adminLoading}
            >
              Progress Group Stage
            </button>
            <button
              className="mb-4 bg-amber-400 text-black font-black px-6 py-2 rounded-xl shadow hover:bg-amber-300 transition"
              onClick={handleGenerateFinals}
              disabled={adminLoading}
            >
              Generate Finals
            </button>
            <div className="mt-6">
              <h4 className="text-white/80 font-bold mb-2">Disqualify/Eliminate Participant</h4>
              <input
                type="number"
                placeholder="User ID"
                id="admin-user-id"
                className="w-32 px-2 py-1 rounded bg-[#07111d] text-white border border-amber-400/30 mr-2"
              />
              <button
                className="bg-red-500 text-white font-bold px-4 py-1 rounded hover:bg-red-400 transition mr-2"
                onClick={() => {
                  const userId = Number((document.getElementById("admin-user-id") as HTMLInputElement)?.value);
                  if (userId) handleParticipantStatus(userId, "disqualify");
                }}
                disabled={adminLoading}
              >
                Disqualify
              </button>
              <button
                className="bg-yellow-500 text-white font-bold px-4 py-1 rounded hover:bg-yellow-400 transition"
                onClick={() => {
                  const userId = Number((document.getElementById("admin-user-id") as HTMLInputElement)?.value);
                  if (userId) handleParticipantStatus(userId, "eliminate");
                }}
                disabled={adminLoading}
              >
                Eliminate
              </button>
            </div>
            {adminMsg && <div className="mt-4 text-white font-bold">{adminMsg}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
