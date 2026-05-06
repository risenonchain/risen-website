"use client";

import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";

interface Props {
  leagueId: number;
}

export default function LeagueLiveBroadcast({ leagueId }: Props) {
  const [leagueConfig, setLeagueConfig] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const init = async () => {
        try {
            const [lRes, aRes] = await Promise.all([
                fetch(`${BASE_URL}/league/events`),
                fetch(`${BASE_URL}/league/events/${leagueId}/check-live-access`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("rush_token")}` }
                })
            ]);
            const leagues = await lRes.json();
            setLeagueConfig(leagues.find((l: any) => l.id === leagueId));

            if (aRes.ok) {
                const access = await aRes.json();
                setHasAccess(access.has_access);
            }
        } catch (e) {} finally {
            setLoading(false);
        }
    };
    init();
  }, [leagueId]);

  const handlePayAccess = async () => {
    setPaying(true);
    try {
        const res = await fetch(`${BASE_URL}/payments/initialize`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("rush_token")}`
            },
            body: JSON.stringify({ product_id: "league_live_access", league_id: leagueId })
        });
        const data = await res.json();
        if (data.checkout_url) {
            window.location.href = data.checkout_url;
        }
    } catch (e) {
        alert("Payment Error");
    } finally {
        setPaying(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-white/20 uppercase tracking-widest text-[10px] font-black">Syncing Live Nodes...</div>;

  if (!leagueConfig?.is_live_visible) {
    return (
        <div className="py-20 flex flex-col items-center">
            <div className="h-20 w-20 rounded-[25px] border border-white/5 bg-[#030913] flex items-center justify-center mb-8 grayscale text-3xl shadow-inner">📡</div>
            <h3 className="text-xl font-black text-white/20 uppercase italic tracking-widest text-center">Broadcast Offline</h3>
            <p className="mt-4 text-white/10 text-[9px] font-black uppercase tracking-widest max-w-[250px] mx-auto text-center leading-relaxed">
                Neural live streaming is currently disabled for this lifecycle. Check back during the finals.
            </p>
        </div>
    );
  }

  if (!hasAccess) {
    return (
        <div className="py-10 px-4">
            <div className="max-w-md mx-auto p-8 sm:p-10 rounded-[45px] bg-[#030913] border border-white/10 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,219,255,0.1),transparent_40%)]" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-risen-primary/10 border border-risen-primary/20 text-risen-primary text-[8px] font-black uppercase tracking-[0.2em] mb-8">
                        <span className="h-1.5 w-1.5 rounded-full bg-risen-primary animate-pulse" />
                        Encrypted Stream
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Neural Live Access</h3>
                    <p className="text-white/40 text-[11px] font-bold uppercase leading-relaxed mb-10 max-w-[280px] mx-auto">
                        Watch the highest-performing neural entities compete in the finals in real-time. Secure your access node.
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <div className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center min-w-[140px]">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Node Fee</span>
                            <span className="text-2xl font-black text-amber-400 italic tracking-tighter">${(leagueConfig.live_fee_usd / 100).toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={handlePayAccess}
                        disabled={paying}
                        className="w-full py-5 rounded-2xl bg-risen-primary text-black font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_0_30px_rgba(46,219,255,0.3)] hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                    >
                        {paying ? "SYNCING GATEWAY..." : "UNLOCK STREAM ACCESS"}
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="py-10 px-4">
        {/* Placeholder for live content */}
        <div className="relative aspect-video max-w-4xl mx-auto rounded-[40px] overflow-hidden border-4 border-[#030913] shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-black">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#01060d]">
                <div className="h-12 w-12 border-4 border-white/5 border-t-risen-primary rounded-full animate-spin shadow-[0_0_20px_rgba(46,219,255,0.2)]" />
                <div className="mt-8 text-[9px] font-black uppercase tracking-[0.5em] text-white/10 animate-pulse">Establishing Neural Sync...</div>
            </div>
            {/* Top Overlay */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
                    <span className="text-white text-[8px] font-black uppercase tracking-widest">LIVE_S1</span>
                </div>
                <div className="text-white/20 font-black uppercase tracking-widest text-[8px] italic">Cycle_482.11</div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <div className="text-white font-black uppercase tracking-widest text-[10px] italic drop-shadow-lg">Neural Finals</div>
                <div className="text-risen-primary font-black uppercase tracking-widest text-[8px]">Active_Node_Beta_0.1</div>
            </div>
        </div>
    </div>
  );
}
