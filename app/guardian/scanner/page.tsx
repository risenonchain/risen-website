"use client";
import React, { useState } from "react";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Info,
  Droplets,
  Lock,
  Eye,
  Zap,
  RefreshCw,
  BrainCircuit
} from "lucide-react";
import { scanContract, explainGuardianScan, GuardianContractScanResponse } from "@/lib/api";

export default function ContractScanner() {
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("bsc");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GuardianContractScanResponse | null>(null);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiVerdict, setAiVerdict] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.startsWith("0x")) {
      setError("Please enter a valid BSC contract address (starting with 0x)");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setAiVerdict("");

    try {
      const data = await scanContract(address, network);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to scan contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async () => {
    if (!result) return;
    setAiLoading(true);
    try {
      const data = await explainGuardianScan(result.id);
      setAiVerdict(data.explanation);
    } catch (err: any) {
      if (err.message.includes("exclusive") || err.message.includes("Upgrade")) {
        setAiVerdict("⚠️ ACCESS DENIED: AI Verdicts are exclusive to RISEN Prime members. Please upgrade your protocol level.");
      } else {
        setAiVerdict("Neural uplink interrupted. Please check metrics manually.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Contract Scanner</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Paste any BSC smart contract address to instantly analyze security risks, taxes, and potential honeypots.
        </p>

        <form onSubmit={handleScan} className="relative max-w-2xl mx-auto mt-8 group flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter contract address (0x...)"
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-slate-600 outline-none transition-all backdrop-blur-md"
            />
          </div>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="bg-slate-900/80 border border-slate-800 text-white rounded-2xl px-4 py-4 outline-none focus:border-blue-500 transition-all backdrop-blur-md appearance-none cursor-pointer font-bold text-sm uppercase tracking-widest"
          >
            <option value="bsc">BSC</option>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="base">Base</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="avalanche">Avalanche</option>
            <option value="solana">Solana</option>
          </select>
          <button
            type="submit"
            disabled={loading || !address}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : "Analyze"}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-4 font-medium">{error}</p>}
      </div>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Main Score Header */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm">
            <div className="relative">
              <svg className="w-40 h-40">
                <circle
                  cx="80" cy="80" r="70"
                  className="stroke-slate-800 fill-none"
                  strokeWidth="10"
                />
                <circle
                  cx="80" cy="80" r="70"
                  className={`${
                    (result.risk_score || 0) > 70 ? 'stroke-red-500' :
                    (result.risk_score || 0) > 30 ? 'stroke-amber-500' :
                    'stroke-emerald-500'
                  } fill-none`}
                  strokeWidth="10"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * (100 - (result.risk_score || 0))) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{100 - (result.risk_score || 0)}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Safety Score</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h2 className="text-2xl font-bold text-white truncate max-w-xs">{result.address}</h2>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                   (result.risk_score || 0) > 70 ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                   (result.risk_score || 0) > 30 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  { (result.risk_score || 0) > 70 ? 'High Risk' : (result.risk_score || 0) > 30 ? 'Medium Risk' : 'Safe' }
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <InfoItem label="Buy Tax" value={`${result.buy_tax?.toFixed(1)}%`} icon={<Zap size={14} />} />
                <InfoItem label="Sell Tax" value={`${result.sell_tax?.toFixed(1)}%`} icon={<Zap size={14} />} />
                <InfoItem label="Honeypot" value={result.is_honeypot ? "Detected" : "Clean"} icon={<Droplets size={14} />} highlight={result.is_honeypot} />
              </div>
            </div>
          </div>

          {/* Detailed Checks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityCheck
              title="Contract Source"
              status={result.is_open_source}
              desc={result.is_open_source ? "Source code is verified and open for audit." : "Unverified source code. High risk of hidden malicious logic."}
            />
            <SecurityCheck
              title="Proxy Check"
              status={!result.is_proxy}
              desc={result.is_proxy ? "Contract is a proxy. Implementation can be changed by owner." : "Not a proxy. Contract logic is immutable."}
            />
            <SecurityCheck
              title="Mint Function"
              status={!result.has_mint_function}
              desc={result.has_mint_function ? "Owner can mint new tokens, potentially diluting holders." : "No mint function detected. Fixed supply."}
            />
            <SecurityCheck
              title="Ownership"
              status={!!result.owner_address && result.owner_address !== '0x0000000000000000000000000000000000000000'}
              desc={result.owner_address === '0x0000000000000000000000000000000000000000' ? "Ownership is renounced. Total community control." : `Controlled by: ${result.owner_address?.slice(0, 10)}...`}
              neutral
            />
          </div>

          {/* AI Explanation Callout */}
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/40 group-hover:scale-110 transition-transform duration-500">
                <BrainCircuit className="text-white" size={32} />
              </div>
              <div className="text-center md:text-left space-y-4">
                <h3 className="text-xl font-bold text-white">Guardian AI Verdict</h3>
                {aiVerdict ? (
                  <p className="text-slate-200 text-sm max-w-xl leading-relaxed animate-in fade-in duration-700">
                    {aiVerdict}
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                      Consult the RISEN Neural Network for a detailed, plain-English breakdown of this contract's security posture.
                    </p>
                    <button
                      onClick={handleAskAI}
                      disabled={aiLoading}
                      className="bg-white text-blue-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-2 mx-auto md:mx-0 disabled:opacity-50"
                    >
                      {aiLoading ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                      {aiLoading ? "Consulting Neural Hub..." : "Execute AI Verdict"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -z-10" />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
          <FeaturePreview
            icon={<ShieldAlert className="text-red-400" />}
            title="Honeypot Detection"
            text="Real-time simulation to check if tokens can be sold."
          />
          <FeaturePreview
            icon={<Droplets className="text-blue-400" />}
            title="Liquidity Audit"
            text="Verify if liquidity is locked or if developers can rug."
          />
          <FeaturePreview
            icon={<Lock className="text-emerald-400" />}
            title="Ownership Analysis"
            text="Track who really controls the contract and its funds."
          />
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, icon, highlight }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
        {icon}
        {label}
      </div>
      <div className={`text-lg font-bold ${highlight ? 'text-red-400' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

function SecurityCheck({ title, status, desc, neutral }: any) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl flex gap-4 hover:bg-slate-900/60 transition-colors">
      <div className={`mt-1 h-fit p-1.5 rounded-full ${
        neutral ? 'bg-slate-500/10 text-slate-400' :
        status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
      }`}>
        {status ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-white text-sm">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FeaturePreview({ icon, title, text }: any) {
  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 space-y-4">
      <div className="p-3 bg-slate-900 rounded-xl w-fit">{icon}</div>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
    </div>
  );
}
