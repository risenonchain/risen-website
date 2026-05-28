"use client";
import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  History,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  User
} from "lucide-react";
import Link from "next/link";
import {
    fetchGuardianAlerts,
    GuardianAlertResponse,
    fetchCurrentRushUser,
    MeResponse,
    fetchGuardianStats,
    GuardianStatsResponse
} from "@/lib/api";

export default function GuardianDashboard() {
  const [alerts, setAlerts] = useState<GuardianAlertResponse[]>([]);
  const [stats, setStats] = useState<GuardianStatsResponse | null>(null);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [alertsData, userData, statsData] = await Promise.all([
            fetchGuardianAlerts(),
            fetchCurrentRushUser(),
            fetchGuardianStats().catch(() => null)
        ]);
        setAlerts(alertsData.slice(0, 5));
        setUser(userData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Security Overview
              {user && <span className="text-blue-500/50 text-sm font-medium border-l border-slate-800 pl-3">Node: {user.username}</span>}
          </h1>
          <p className="text-slate-500 mt-1">Real-time intelligence for your blockchain assets.</p>
        </div>
        <Link
          href="/guardian/scanner"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
        >
          Scan New Contract
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Safety"
          value={stats?.safety_score || "98%"}
          subtitle="System wide score"
          icon={<ShieldCheck className="text-emerald-400" />}
          trend="+0.2%"
        />
        <StatCard
          title="Monitored Assets"
          value={stats?.monitored_assets.toString() || "0"}
          subtitle="Contracts & Wallets"
          icon={<Activity className="text-blue-400" />}
        />
        <StatCard
          title="Active Alerts"
          value={stats?.active_alerts.toString() || "0"}
          subtitle="Pending review"
          icon={<AlertTriangle className="text-amber-400" />}
        />
        <StatCard
          title="Total Scans"
          value={stats?.total_scans.toString() || "0"}
          subtitle="Community total"
          icon={<History className="text-slate-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Security Risk Feed</h2>
              <Link href="/guardian/alerts" className="text-blue-400 text-sm hover:underline">View All</Link>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : alerts.length > 0 ? (
                <div className="divide-y divide-slate-800/50">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-lg ${
                          alert.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                          alert.severity === 'high' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          <AlertTriangle size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-white">{alert.title}</h3>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                              {new Date(alert.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                            {alert.message}
                          </p>
                          {alert.related_address && (
                            <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-slate-500 bg-slate-950/50 px-2 py-1 rounded w-fit">
                              {alert.related_address}
                              <ExternalLink size={10} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  No security threats detected in your network.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <section className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Upgrade to Prime</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Unlock real-time monitoring, priority alerts, and AI-powered risk explanations.
              </p>
              <button className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
                Learn More
              </button>
            </div>
            <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
          </section>

          <section className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <QuickAction label="Scan Contract" href="/guardian/scanner" />
              <QuickAction label="Wallet Audit" href="/guardian/wallet" />
              <QuickAction label="Check Alerts" href="/guardian/alerts" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, trend }: any) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-700/50 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-slate-950 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-[10px] text-slate-600 uppercase tracking-widest">{subtitle}</span>
      </div>
    </div>
  );
}

function QuickAction({ label, href }: { label: string; href?: string; }) {
  const content = (
    <>
      {label}
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-transparent hover:border-slate-700 flex items-center justify-between group">
        {content}
      </Link>
    );
  }

  return (
    <button className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-transparent hover:border-slate-700 flex items-center justify-between group">
      {content}
    </button>
  );
}
