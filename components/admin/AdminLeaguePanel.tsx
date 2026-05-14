import React, { useState } from "react";
import dynamic from "next/dynamic";
import { BASE_URL } from "@/lib/api";

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

  async function handleInitializeGroup() {
    setAdminLoading(true);
    setAdminMsg("");
    try {
      const res = await fetch(`${BASE_URL}/league/events/${leagueId}/group/generate`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to initialize groups");
      setAdminMsg("Groups initialized and fixtures generated.");
    } catch (err: any) {
      setAdminMsg(err.message || "Unknown error");
    } finally {
      setAdminLoading(false);
    }
  }

  async function handleProgressKnockout() {
    setAdminLoading(true);
    setAdminMsg("");
    try {
      const res = await fetch(`${BASE_URL}/league/events/${leagueId}/knockout/generate`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to progress knockout stage");
      setAdminMsg("Next knockout round generated.");
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
      const res = await fetch(`${BASE_URL}/league/events/${leagueId}/participants/${userId}/${status}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (!res.ok) throw new Error((await res.json()).detail || `Failed to ${status} participant`);
      setAdminMsg(`Participant ${status}d.`);
    } catch (err: any) {
      setAdminMsg(err.message || "Unknown error");
    } finally {
      setAdminLoading(false);
    }
  }

  const [liveConfig, setLiveConfig] = useState({ is_live_visible: false, live_fee_usd: 30 });

  async function handleUpdateLiveConfig() {
    setAdminLoading(true);
    setAdminMsg("");
    try {
        const res = await fetch(`${BASE_URL}/league/events/${leagueId}/active`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}`
            },
            body: JSON.stringify(liveConfig)
        });
        if (!res.ok) throw new Error("Update failed");
        setAdminMsg("Live config updated.");
    } catch (e: any) {
        setAdminMsg(e.message);
    } finally {
        setAdminLoading(false);
    }
  }

  return (
    <div className="p-8 bg-[#030913] rounded-2xl shadow-xl">
      <h2 className="text-2xl font-black text-white mb-6 uppercase italic tracking-widest">League Management</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all border-2 ${tab === t.key ? "bg-amber-400 text-black border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "bg-[#030913] text-white/40 border-white/10 hover:border-amber-400/30 hover:text-amber-400"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Active League ID:</label>
        <input
          type="number"
          value={leagueId}
          readOnly
          className="w-20 px-3 py-1.5 rounded-xl bg-[#07111d] text-amber-400 font-black border border-amber-400/30 text-sm"
        />
      </div>

      <div className="min-h-[300px]">
        {tab === "events" && <AdminLeagueEvents leagueId={leagueId} />}
        {tab === "registrations" && <AdminLeagueRegistrations leagueId={leagueId} />}
        {tab === "fixtures" && <AdminLeagueFixtures leagueId={leagueId} />}
        {tab === "audit" && <AdminLeagueAudit leagueId={leagueId} />}
        {tab === "admin" && (
          <div className="space-y-10">
            {/* Stage Progress */}
            <div className="p-6 rounded-[30px] border border-white/5 bg-white/5">
                <h3 className="text-lg font-black text-white mb-6 uppercase italic tracking-widest">Sync Protocols</h3>
                <div className="flex gap-4">
                    <button
                        className="bg-amber-400 text-black font-black px-6 py-3 rounded-2xl shadow-lg hover:bg-amber-300 transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                        onClick={handleInitializeGroup}
                        disabled={adminLoading}
                    >
                        Initialize Group Stage
                    </button>
                    <button
                        className="bg-risen-primary text-black font-black px-6 py-3 rounded-2xl shadow-lg hover:bg-blue-400 transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                        onClick={handleProgressKnockout}
                        disabled={adminLoading}
                    >
                        Progress Next Round (Knockout)
                    </button>
                </div>
            </div>

            {/* Live Streaming Config */}
            <div className="p-6 rounded-[30px] border border-risen-primary/20 bg-risen-primary/5">
                <h3 className="text-lg font-black text-white mb-6 uppercase italic tracking-widest">Neural Live Broadcast</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Broadcast Enabled</span>
                            <button
                                onClick={() => setLiveConfig({...liveConfig, is_live_visible: !liveConfig.is_live_visible})}
                                className={`h-6 w-12 rounded-full relative transition-all ${liveConfig.is_live_visible ? 'bg-emerald-500' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${liveConfig.is_live_visible ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Access Fee (USD Cents)</span>
                            <input
                                type="number"
                                value={liveConfig.live_fee_usd}
                                onChange={e => setLiveConfig({...liveConfig, live_fee_usd: Number(e.target.value)})}
                                className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-right font-black text-amber-400"
                            />
                        </div>
                        <button
                            onClick={handleUpdateLiveConfig}
                            className="w-full py-4 rounded-2xl bg-risen-primary text-black font-black uppercase text-[10px] tracking-widest shadow-lg"
                        >
                            Sync Broadcast Protocol
                        </button>
                    </div>
                    <p className="text-white/30 text-[11px] font-bold uppercase leading-relaxed italic">
                        Enable this to allow users to watch live match finals. A Paystack gateway will be initialized for the specified fee. Broadcasts consume additional server compute.
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-[30px] border border-red-500/20 bg-red-500/5">
              <h3 className="text-lg font-black text-white mb-6 uppercase italic tracking-widest text-red-500">Security Protocols</h3>
              <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="ENTITY_ID"
                    id="admin-user-id"
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#030913] text-white border border-white/10 font-black uppercase text-xs outline-none focus:border-red-500/50"
                  />
                  <button
                    className="bg-red-500/10 text-red-500 border border-red-500/20 font-black px-6 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                    onClick={() => {
                      const userId = Number((document.getElementById("admin-user-id") as HTMLInputElement)?.value);
                      if (userId) handleParticipantStatus(userId, "disqualify");
                    }}
                    disabled={adminLoading}
                  >
                    Disqualify
                  </button>
                  <button
                    className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-black px-6 py-3 rounded-2xl hover:bg-yellow-500 hover:text-white transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                    onClick={() => {
                      const userId = Number((document.getElementById("admin-user-id") as HTMLInputElement)?.value);
                      if (userId) handleParticipantStatus(userId, "eliminate");
                    }}
                    disabled={adminLoading}
                  >
                    Eliminate
                  </button>
              </div>
            </div>
            {adminMsg && (
                <div className="fixed bottom-10 right-10 p-6 rounded-3xl bg-amber-400 text-black font-black uppercase text-xs tracking-widest shadow-2xl animate-bounce">
                    {adminMsg}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
