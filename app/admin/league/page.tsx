
"use client";
import AdminLeaguePanel from "@/components/admin/AdminLeaguePanel";
import AdminLeagueFixtures from "@/components/admin/AdminLeagueFixtures";
import AdminLeagueRegistrations from "@/components/admin/AdminLeagueRegistrations";
import AdminLeagueEvents from "@/components/admin/AdminLeagueEvents";
import AdminLeagueAudit from "@/components/admin/AdminLeagueAudit";
import { useState } from "react";

export default function AdminLeaguePage() {
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(1);

  return (
    <div className="p-6 space-y-8 bg-[#02070d] min-h-screen text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">League Central</h1>

        <div className="flex items-center gap-4 bg-[#07111d] p-4 rounded-2xl border border-white/5 shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Target League ID:</span>
            <input
                type="number"
                value={selectedLeagueId}
                onChange={e => setSelectedLeagueId(Number(e.target.value))}
                className="w-20 bg-black/40 border border-amber-400/30 rounded-xl px-3 py-2 text-amber-400 font-black text-center focus:border-amber-400 outline-none transition-all"
            />
        </div>
      </div>

      <div className="grid gap-10">
        <AdminLeagueEvents leagueId={selectedLeagueId} />
        <AdminLeaguePanel leagueId={selectedLeagueId} />
      </div>
    </div>
  );
}
