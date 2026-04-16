"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Dummy data for demonstration
const defaultStats = {
  totalPlayers: 1245,
  websiteVisitors: 8921,
  aiUsage: 312,
  chartData: [
    { name: "Mon", players: 200, visitors: 1200, ai: 40 },
    { name: "Tue", players: 300, visitors: 1500, ai: 55 },
    { name: "Wed", players: 250, visitors: 1300, ai: 60 },
    { name: "Thu", players: 400, visitors: 1800, ai: 80 },
    { name: "Fri", players: 95, visitors: 900, ai: 30 },
    { name: "Sat", players: 0, visitors: 0, ai: 0 },
    { name: "Sun", players: 0, visitors: 0, ai: 0 },
  ],
};

export default function DashboardStats() {
  const [stats, setStats] = useState(defaultStats);

  // In production, fetch stats from backend here
  useEffect(() => {
    // fetch stats and setStats
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stat Cards */}
      <div className="rounded-2xl bg-[#07111d] border border-cyan-400/20 p-6 flex flex-col items-center shadow-md">
        <span className="text-3xl font-extrabold text-cyan-300 mb-1">{stats.totalPlayers}</span>
        <span className="text-white/80 font-semibold">Current Players</span>
      </div>
      <div className="rounded-2xl bg-[#07111d] border border-yellow-400/20 p-6 flex flex-col items-center shadow-md">
        <span className="text-3xl font-extrabold text-yellow-300 mb-1">{stats.websiteVisitors}</span>
        <span className="text-white/80 font-semibold">Website Visitors</span>
      </div>
      <div className="rounded-2xl bg-[#07111d] border border-purple-400/20 p-6 flex flex-col items-center shadow-md">
        <span className="text-3xl font-extrabold text-purple-300 mb-1">{stats.aiUsage}</span>
        <span className="text-white/80 font-semibold">AI Usage</span>
      </div>
      {/* Chart (spans all columns on mobile) */}
      <div className="col-span-1 md:col-span-3 bg-[#101828] rounded-2xl border border-white/10 p-6 mt-2 shadow-md w-full">
        <h3 className="text-lg font-bold text-white/80 mb-4">Weekly Engagement</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats.chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#23304a" />
            <XAxis dataKey="name" stroke="#b9e0ff" fontSize={12} />
            <YAxis stroke="#b9e0ff" fontSize={12} />
            <Tooltip contentStyle={{ background: '#07111d', border: '1px solid #23304a', color: '#fff' }} />
            <Bar dataKey="players" fill="#22d3ee" radius={[6, 6, 0, 0]} name="Players" />
            <Bar dataKey="visitors" fill="#fde68a" radius={[6, 6, 0, 0]} name="Visitors" />
            <Bar dataKey="ai" fill="#c084fc" radius={[6, 6, 0, 0]} name="AI Usage" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
