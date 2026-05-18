"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";
import { BarChart3, Download, RefreshCcw, Users, Gamepad2, ShieldAlert } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setRegistering] = useState(false);
  const [seasonName, setSeasonName] = useState("");

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/analytics/summary`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (res.ok) setStats(await res.json());
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleExport = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/analytics/export`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `risen_users_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      alert("Export failed");
    }
  };

  const handleResetSeason = async () => {
    if (!seasonName) return alert("Please enter a season name");
    if (!confirm("CRITICAL ACTION: This will clear the current leaderboard for all players. Continue?")) return;

    try {
      setRegistering(true);
      const res = await fetch(`${BASE_URL}/admin/seasons/reset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}`
        },
        body: JSON.stringify({ name: seasonName })
      });
      if (res.ok) {
        alert("Season Reset Successful. Leaderboard is now fresh.");
        setSeasonName("");
        fetchStats();
      }
    } catch (e) {
      alert("Reset failed");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Neural Analytics</h1>
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500/20 transition-all"
        >
            <Download className="w-4 h-4" />
            Export CSV Report
        </button>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Entities" value={stats?.total_users ?? 0} icon={Users} color="text-risen-primary" />
        <StatCard label="Neural Cycles" value={stats?.total_sessions ?? 0} icon={Gamepad2} color="text-amber-400" />
        <StatCard label="Prime Protocols" value={stats?.premium_users ?? 0} icon={ShieldAlert} color="text-purple-400" />
        <StatCard label="Vaulted Points" value={stats?.total_points_in_vaults?.toLocaleString() ?? 0} icon={BarChart3} color="text-emerald-400" />
      </div>

      {/* Season Control */}
      <div className="rounded-[40px] border border-white/5 bg-[#101828] p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <RefreshCcw className="w-32 h-32 rotate-12" />
        </div>

        <div className="relative z-10">
            <h2 className="text-xl font-black uppercase italic text-amber-400 mb-2">Manual Season Initialization</h2>
            <p className="text-white/40 text-sm font-bold uppercase max-w-2xl mb-8 leading-relaxed">
                Starting a new season will archive the current leaderboard. Players will retain their total points and profiles, but the active rankings will reset to zero.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
                <input
                    value={seasonName}
                    onChange={e => setSeasonName(e.target.value)}
                    placeholder="ENTER NEW SEASON NAME (e.g. JUNE_2026_GENESIS)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-black uppercase outline-none focus:border-amber-400/50"
                />
                <button
                    disabled={resetting}
                    onClick={handleResetSeason}
                    className="px-10 py-5 bg-amber-400 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                    {resetting ? "INITIALIZING..." : "START NEW SEASON"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="rounded-3xl border border-white/5 bg-[#101828] p-8 shadow-inner relative overflow-hidden group">
            <div className={`absolute -bottom-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <Icon className="w-16 h-16" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">{label}</div>
            <div className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</div>
        </div>
    );
}
