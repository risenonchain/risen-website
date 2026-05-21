"use client";

import { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "@/lib/api";
import {
  BarChart3,
  Download,
  RefreshCcw,
  Users,
  Gamepad2,
  ShieldAlert,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [seasonName, setSeasonName] = useState("");
  const [announcementMsg, setAnnouncementMsg] = useState("");

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("desc");
  const [premiumFilter, setPremiumFilter] = useState<string>("all");

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/analytics/summary`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (res.ok) setStats(await res.json());
    } catch (e) {} finally { setLoading(false); }
  };

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      let url = `${BASE_URL}/admin/analytics/users?sort_by=${sortBy}&order=${order}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (premiumFilter !== "all") url += `&is_premium=${premiumFilter === "premium"}`;

      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error("Failed to fetch users", e);
    } finally {
      setUsersLoading(false);
    }
  }, [search, sortBy, order, premiumFilter]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [fetchUsers]);

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
        a.download = `risen_report_${new Date().toISOString().split('T')[0]}.csv`;
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
    if (!confirm("CRITICAL ACTION: This will ARCHIVE the current leaderboard and start a FRESH season. Players keep their points, but rankings reset to zero. Continue?")) return;

    try {
      setResetting(true);
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
      setResetting(false);
    }
  };

  const handleHardReset = async () => {
    if (!confirm("☢️ NUCLEAR OPTION: This will PERMANENTLY DELETE all global game sessions and RESET all user best scores to zero. This cannot be undone. Are you absolutely sure?")) return;
    if (!confirm("FINAL CONFIRMATION: Wipe all non-league scores and reset user records? This will NOT affect point balances.")) return;

    setResetting(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/leaderboard/hard-reset`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("risen_admin_token")}` }
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Hard reset failed");
      alert("System Wiped Clean. Leaderboard is now empty.");
      fetchStats();
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Unknown error");
    } finally {
      setResetting(false);
    }
  };

  const handlePushAnnouncement = async () => {
    if (!announcementMsg) return alert("Please enter a message");

    setResetting(true);
    try {
      const res = await fetch(`${BASE_URL}/announcements/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}`
        },
        body: JSON.stringify({ message: announcementMsg })
      });
      if (res.ok) {
        alert("Announcement pushed to lobby.");
        setAnnouncementMsg("");
      }
    } catch (e) {
      alert("Push failed");
    } finally {
      setResetting(false);
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Neural Reports Portal</h1>
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        >
            <Download className="w-4 h-4" />
            Global CSV Export
        </button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Entities" value={stats?.total_users ?? 0} icon={Users} color="text-risen-primary" />
        <StatCard label="Neural Cycles" value={stats?.total_sessions ?? 0} icon={Gamepad2} color="text-amber-400" />
        <StatCard label="Prime Protocols" value={stats?.premium_users ?? 0} icon={ShieldAlert} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Vaulted Points" value={stats?.total_points_in_vaults?.toLocaleString() ?? 0} icon={BarChart3} color="text-emerald-400" />
        <StatCard label="Entities Today" value={stats?.users_today ?? 0} icon={Users} color="text-cyan-400" />
        <StatCard label="Cycles Today" value={stats?.sessions_today ?? 0} icon={RefreshCcw} color="text-rose-400" />
        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-8 shadow-inner relative overflow-hidden group">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/40 mb-2">Active Season</div>
            <div className={`text-xl font-black italic tracking-tighter text-amber-400 truncate`}>{stats?.active_season?.name ?? "None"}</div>
            <div className="text-[8px] text-white/20 font-bold uppercase mt-1">Since {stats?.active_season?.start_at ? new Date(stats.active_season.start_at).toLocaleDateString() : 'N/A'}</div>
        </div>
      </div>

      {/* Advanced Data Table Section */}
      <div className="rounded-[40px] border border-white/5 bg-[#101828] p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div>
                <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">Entity Database</h2>
                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mt-1 italic">Real-time spooling & sorting</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="SEARCH USERNAME OR EMAIL..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-black uppercase text-white outline-none focus:border-risen-primary/50 transition-all"
                    />
                </div>

                <select
                    value={premiumFilter}
                    onChange={e => setPremiumFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-[10px] font-black uppercase text-white outline-none cursor-pointer hover:bg-white/10"
                >
                    <option value="all">ALL NODES</option>
                    <option value="premium">PRIME ONLY</option>
                    <option value="regular">BASIC ONLY</option>
                </select>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                        <th className="px-4 py-6 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("id")}>
                            <div className="flex items-center gap-2">UID <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="px-4 py-6">ENTITY</th>
                        <th className="px-4 py-6 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("is_premium")}>
                            <div className="flex items-center gap-2">PROTOCOL <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="px-4 py-6 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("available_points")}>
                            <div className="flex items-center gap-2">VAULT BAL <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="px-4 py-6 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("best_score")}>
                            <div className="flex items-center gap-2">HIGHEST <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="px-4 py-6 text-right">JOINED</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {usersLoading ? (
                        <tr>
                            <td colSpan={6} className="py-20 text-center">
                                <RefreshCcw className="w-10 h-10 text-risen-primary animate-spin mx-auto mb-4" />
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Accessing Core Database...</div>
                            </td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-20 text-center text-white/20 text-xs font-black uppercase tracking-widest">No Entities Matched Query</td>
                        </tr>
                    ) : (
                        users.map((u) => (
                            <tr key={u.id} className="group hover:bg-white/5 transition-colors">
                                <td className="px-4 py-6 text-[10px] font-black text-white/40">#{u.id}</td>
                                <td className="px-4 py-6">
                                    <div className="text-sm font-black text-white uppercase italic tracking-tighter">{u.username}</div>
                                    <div className="text-[9px] font-bold text-white/30">{u.email}</div>
                                </td>
                                <td className="px-4 py-6">
                                    {u.is_premium ? (
                                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-black uppercase tracking-widest italic">
                                            <ShieldAlert className="w-3 h-3" /> PRIME
                                        </div>
                                    ) : (
                                        <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">BASIC_NODE</div>
                                    )}
                                </td>
                                <td className="px-4 py-6">
                                    <div className="text-sm font-black text-emerald-400 italic tracking-tighter">{u.available_points.toLocaleString()}</div>
                                    <div className="text-[8px] text-white/20 font-bold uppercase">Points</div>
                                </td>
                                <td className="px-4 py-6">
                                    <div className="text-sm font-black text-amber-400 italic tracking-tighter">{u.best_score.toLocaleString()}</div>
                                    <div className="text-[8px] text-white/20 font-bold uppercase">Level {u.best_level}</div>
                                </td>
                                <td className="px-4 py-6 text-right">
                                    <div className="text-[10px] font-black text-white uppercase italic">
                                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "???"}
                                    </div>
                                    {u.is_today && (
                                        <div className="text-[7px] text-risen-primary font-black uppercase tracking-widest mt-1 animate-pulse">New Cycle</div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Season Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Announcement Matrix */}
        <div className="rounded-[40px] border border-white/5 bg-[#101828] p-10 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
                <h2 className="text-xl font-black uppercase italic text-risen-primary mb-2">Push Lobby Announcement</h2>
                <p className="text-white/40 text-sm font-bold uppercase mb-8 leading-relaxed">
                    Active announcements appear in the game lobby marquee. Pushing a new one archives the previous.
                </p>

                <div className="flex flex-col gap-4">
                    <textarea
                        value={announcementMsg}
                        onChange={e => setAnnouncementMsg(e.target.value)}
                        placeholder="ENTER MESSAGE (e.g. NEW TOURNAMENT STARTING SOON!)"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-black uppercase outline-none focus:border-risen-primary/50 min-h-[100px]"
                    />
                    <button
                        disabled={resetting}
                        onClick={handlePushAnnouncement}
                        className="px-10 py-5 bg-risen-primary text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {resetting ? "SYNCHRONIZING..." : "PUSH TO LOBBY"}
                    </button>
                </div>
            </div>
        </div>

        {/* Season Matrix */}
        <div className="rounded-[40px] border border-white/5 bg-[#101828] p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <RefreshCcw className="w-32 h-32 rotate-12 text-risen-primary" />
            </div>

            <div className="relative z-10">
                <h2 className="text-xl font-black uppercase italic text-amber-400 mb-2">Protocol Reset Matrix</h2>
                <p className="text-white/40 text-sm font-bold uppercase mb-8 leading-relaxed">
                    Archive current leaderboard. Points are RETAINED, but rankings reset to zero.
                </p>

                <div className="flex flex-col gap-4">
                    <input
                        value={seasonName}
                        onChange={e => setSeasonName(e.target.value)}
                        placeholder="ENTER NEW SEASON NAME"
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

                <div className="mt-8 pt-8 border-t border-white/5">
                    <button
                        onClick={handleHardReset}
                        disabled={resetting}
                        className="flex items-center gap-2 text-red-500/50 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors group"
                    >
                        <span className="h-2 w-2 rounded-full bg-red-500 group-hover:animate-ping" />
                        Nuclear Reset: Wipe Leaderboard & Records (SAFE: Keeps Wallets)
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="rounded-3xl border border-white/5 bg-[#101828] p-8 shadow-inner relative overflow-hidden group hover:border-white/10 transition-all">
            <div className={`absolute -bottom-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <Icon className="w-16 h-16" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">{label}</div>
            <div className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</div>
        </div>
    );
}
