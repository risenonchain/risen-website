"use client";
import React, { useEffect, useState } from "react";
import {
  Eye,
  Plus,
  Search,
  Trash2,
  ShieldCheck,
  Wallet,
  FileCode,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Activity
} from "lucide-react";
import { fetchGuardianWatchlist, addToGuardianWatchlist, GuardianWatchlistResponse } from "@/lib/api";

export default function WatchCenter() {
  const [watchlist, setWatchlist] = useState<GuardianWatchlistResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<"contract" | "wallet">("contract");

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const data = await fetchGuardianWatchlist();
      setWatchlist(data);
    } catch (err) {
      console.error("Failed to load watchlist", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.startsWith("0x")) return;

    try {
      await addToGuardianWatchlist({
        target_address: newAddress,
        target_type: newType,
        label: newLabel || undefined
      });
      setNewAddress("");
      setNewLabel("");
      setIsAdding(false);
      loadWatchlist();
    } catch (err) {
      alert("Failed to add to watchlist");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Watch Center</h1>
          <p className="text-slate-500 mt-1">Monitor high-value contracts and suspicious wallets.</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="bg-white text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
        >
          <Plus size={18} />
          Add Target
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Address</label>
              <input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Label</label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Whale Wallet"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-all"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse" />)
        ) : watchlist.length > 0 ? (
          watchlist.map((item) => (
            <div key={item.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 group hover:border-slate-700 transition-all relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-slate-950 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {item.target_type === 'wallet' ? <Wallet className="text-blue-400" size={24} /> : <FileCode className="text-amber-400" size={24} />}
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
                   <button className="text-slate-600 hover:text-white transition-colors">
                     <MoreVertical size={18} />
                   </button>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="font-bold text-white text-lg leading-tight">{item.label || "Unnamed Target"}</h3>
                <p className="text-xs text-slate-500 font-mono break-all">{item.target_address}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-4">
                   <div className="text-center">
                     <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Events</div>
                     <div className="text-sm font-bold text-white">0</div>
                   </div>
                   <div className="text-center">
                     <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Status</div>
                     <Activity size={12} className="text-emerald-400 mx-auto mt-0.5" />
                   </div>
                </div>
                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 xl:col-span-3 py-24 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="p-6 bg-slate-900 rounded-full border border-slate-800 text-slate-700">
              <Eye size={48} />
            </div>
            <div className="max-w-sm">
              <h3 className="text-white font-bold text-xl">Watch Center is Empty</h3>
              <p className="text-slate-500 mt-2">Start monitoring contracts or wallets to receive real-time security updates.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
