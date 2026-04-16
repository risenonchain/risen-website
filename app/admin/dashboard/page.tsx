"use client";
import { BadgeDollarSign, Calendar, ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();
  return (
    <div className="rounded-3xl bg-[#101828] border border-white/10 p-6 md:p-10 min-h-[60vh] shadow-xl flex flex-col items-center justify-center w-full">
      <h1 className="text-3xl font-extrabold mb-4 text-cyan-300 text-center">Welcome to the RISEN Admin Dashboard</h1>
      <p className="text-white/70 mb-8 text-center max-w-xl">
        Use the sidebar to manage redemptions, modals, and audit logs. This dashboard is designed for secure, efficient platform administration.
      </p>
      <div className="flex gap-6 mt-4 flex-wrap w-full justify-center max-md:flex-col max-md:gap-4 max-md:items-center">
        <button
          className="rounded-2xl bg-[#07111d] border border-risen-primary/20 p-6 min-w-[220px] flex flex-col items-center w-full max-w-xs transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onClick={() => router.push("/admin/redemptions")}
          tabIndex={0}
        >
          <BadgeDollarSign className="w-9 h-9 mb-2 text-cyan-300" />
          <span className="font-bold text-lg mb-1">Redemptions</span>
          <span className="text-white/60 text-sm">Approve or reject player redemption requests.</span>
        </button>
        <button
          className="rounded-2xl bg-[#07111d] border border-yellow-400/20 p-6 min-w-[220px] flex flex-col items-center w-full max-w-xs transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={() => router.push("/admin/modals")}
          tabIndex={0}
        >
          <Calendar className="w-9 h-9 mb-2 text-yellow-300" />
          <span className="font-bold text-lg mb-1">Modal Management</span>
          <span className="text-white/60 text-sm">Schedule contests, announcements, and more.</span>
        </button>
        <button
          className="rounded-2xl bg-[#07111d] border border-purple-400/20 p-6 min-w-[220px] flex flex-col items-center w-full max-w-xs transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onClick={() => router.push("/admin/audit")}
          tabIndex={0}
        >
          <ScrollText className="w-9 h-9 mb-2 text-purple-300" />
          <span className="font-bold text-lg mb-1">Audit Logs</span>
          <span className="text-white/60 text-sm">Review all admin actions for security and compliance.</span>
        </button>
      </div>
    </div>
  );
}
