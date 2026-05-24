"use client";
import React, { useState } from "react";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Wallet,
  Zap,
  RefreshCw,
  History,
  Activity,
  UserX
} from "lucide-react";
import { analyzeWallet } from "@/lib/api";

export default function WalletScanner() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.startsWith("0x")) {
      setError("Please enter a valid wallet address (0x...)");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeWallet(address);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4 text-blue-500">
            <Wallet size={24} />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Wallet Intelligence</h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
          Unmask suspicious wallet behavior. Detect blacklists, honeypot connections, and malicious transaction history.
        </p>

        <form onSubmit={handleScan} className="relative max-w-2xl mx-auto mt-8 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          </div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address (0x...)"
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-14 pr-32 text-white placeholder:text-slate-600 outline-none transition-all backdrop-blur-md"
          />
          <button
            type="submit"
            disabled={loading || !address}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : "Analyze"}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-4 font-medium">{error}</p>}
      </div>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Reputation Header */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm">
            <div className={`p-8 rounded-full border-4 ${result.is_malicious ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                {result.is_malicious ? <UserX size={48} /> : <ShieldCheck size={48} />}
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold text-white truncate max-w-xs">{result.address}</h2>
                <p className="text-slate-500 text-xs font-mono mt-1 uppercase tracking-widest">Wallet Reputation Scan</p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                    result.is_malicious ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                }`}>
                    {result.is_malicious ? 'Flagged Malicious' : 'Clean Reputation'}
                </div>
                <div className="px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    Score: {result.risk_score}/100
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
                icon={<Activity size={18} />}
                title="Blacklist Check"
                value={result.details?.is_blacklisted === "1" ? "DETECTED" : "CLEAN"}
                desc="Presence in global malicious address databases."
                danger={result.details?.is_blacklisted === "1"}
            />
            <MetricCard
                icon={<Zap size={18} />}
                title="Honeypot Affinity"
                value={result.details?.is_honeypot_related === "1" ? "LINKED" : "NONE"}
                desc="Historical interaction with malicious smart contracts."
                danger={result.details?.is_honeypot_related === "1"}
            />
            <MetricCard
                icon={<History size={18} />}
                title="Contract Deployer"
                value={result.details?.is_contract === "1" ? "YES" : "NO"}
                desc="Whether this address has deployed smart contracts."
                neutral
            />
            <MetricCard
                icon={<ShieldAlert size={18} />}
                title="Security Alert"
                value={result.is_malicious ? "CRITICAL" : "STABLE"}
                desc="Real-time threat level assessment by Guardian."
                danger={result.is_malicious}
            />
          </div>
        </div>
      )}

      {/* Info Footnote */}
      <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 text-center">
        <p className="text-[10px] text-blue-500/60 font-black uppercase tracking-[0.3em] italic">
            Intelligence synthesized via GoPlus Security & RISEN Proprietary Logic.
        </p>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, desc, danger, neutral }: any) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4 hover:bg-slate-900/60 transition-colors">
       <div className="flex items-center justify-between">
          <div className="p-2 bg-slate-950 rounded-lg text-slate-500">{icon}</div>
          <span className={`text-xs font-black uppercase tracking-widest ${
              neutral ? 'text-slate-500' :
              danger ? 'text-red-400' : 'text-emerald-400'
          }`}>{value}</span>
       </div>
       <div className="space-y-1">
          <h4 className="font-bold text-white text-sm">{title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
