
"use client";
import AdminLeaguePanel from "@/components/admin/AdminLeaguePanel";
import AdminLeagueFixtures from "@/components/admin/AdminLeagueFixtures";
import AdminLeagueRegistrations from "@/components/admin/AdminLeagueRegistrations";
import AdminLeagueEvents from "@/components/admin/AdminLeagueEvents";
import AdminLeagueAudit from "@/components/admin/AdminLeagueAudit";
import { useState } from "react";

export default function AdminLeaguePage() {
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(1);

  // You may want to fetch available leagues here and allow selection
  // For now, just show all panels for the selected league
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">League Management</h1>
      {/* League selection UI could go here */}
      <AdminLeaguePanel leagueId={selectedLeagueId} />
      <AdminLeagueFixtures leagueId={selectedLeagueId} />
      <AdminLeagueRegistrations leagueId={selectedLeagueId} />
      <AdminLeagueEvents leagueId={selectedLeagueId} />
      <AdminLeagueAudit leagueId={selectedLeagueId} />
    </div>
  );
}
