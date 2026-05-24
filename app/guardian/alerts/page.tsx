"use client";
import React, { useEffect, useState } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Filter,
  ShieldAlert
} from "lucide-react";
import { fetchGuardianAlerts, markGuardianAlertRead, GuardianAlertResponse } from "@/lib/api";

export default function AlertCenter() {
  const [alerts, setAlerts] = useState<GuardianAlertResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await fetchGuardianAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await markGuardianAlertRead(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      console.error("Failed to mark alert as read", err);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === "unread") return !a.is_read;
    if (filter === "critical") return a.severity === "critical" || a.severity === "high";
    return true;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Alert Center</h1>
          <p className="text-slate-500 mt-1">Manage your security notifications and threat history.</p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
          <FilterButton active={filter === "unread"} onClick={() => setFilter("unread")}>Unread</FilterButton>
          <FilterButton active={filter === "critical"} onClick={() => setFilter("critical")}>Critical</FilterButton>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Scanning network for alerts...</p>
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div className="divide-y divide-slate-800/50">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-6 transition-all duration-300 ${!alert.is_read ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : 'hover:bg-slate-800/30'}`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className={`mt-1 p-3 h-fit rounded-xl ${
                    alert.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                    alert.severity === 'high' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {alert.severity === 'critical' ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-white text-lg">{alert.title}</h3>
                        {!alert.is_read && (
                          <span className="bg-blue-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(alert.created_at).toLocaleDateString()} at {new Date(alert.created_at).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                      {alert.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      {alert.related_address && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 group cursor-pointer hover:border-slate-700 transition-colors">
                          <span className="font-mono">{alert.related_address}</span>
                          <ExternalLink size={12} className="group-hover:text-blue-400" />
                        </div>
                      )}

                      {!alert.is_read && (
                        <button
                          onClick={() => handleMarkRead(alert.id)}
                          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-400/10 transition-all"
                        >
                          <CheckCircle2 size={14} />
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-24 text-center space-y-4">
            <div className="inline-flex p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-700">
              <Bell size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-bold text-lg">Your signal is clear</h3>
              <p className="text-slate-500 text-sm">No security alerts matched your current filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
        active
          ? "bg-slate-800 text-white shadow-sm"
          : "text-slate-500 hover:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
