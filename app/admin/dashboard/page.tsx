import { BadgeDollarSign, Calendar, ScrollText } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="rounded-3xl bg-[#101828] border border-white/10 p-10 min-h-[60vh] shadow-xl flex flex-col items-center justify-center">
      <h1 className="text-3xl font-extrabold mb-4 text-cyan-300">Welcome to the RISEN Admin Dashboard</h1>
      <p className="text-white/70 mb-8 text-center max-w-xl">
        Use the sidebar to manage redemptions, modals, and audit logs. This dashboard is designed for secure, efficient platform administration.
      </p>
      <div className="flex gap-6 mt-4 flex-wrap max-md:flex-col max-md:gap-4 max-md:items-center">
        <div className="rounded-2xl bg-[#07111d] border border-risen-primary/20 p-6 min-w-[220px] flex flex-col items-center w-full max-w-xs">
          <BadgeDollarSign className="w-9 h-9 mb-2 text-cyan-300" />
          <span className="font-bold text-lg mb-1">Redemptions</span>
          <span className="text-white/60 text-sm">Approve or reject player redemption requests.</span>
        </div>
        <div className="rounded-2xl bg-[#07111d] border border-yellow-400/20 p-6 min-w-[220px] flex flex-col items-center w-full max-w-xs">
          <Calendar className="w-9 h-9 mb-2 text-yellow-300" />
          <span className="font-bold text-lg mb-1">Modal Management</span>
          <span className="text-white/60 text-sm">Schedule contests, announcements, and more.</span>
        </div>
        <div className="rounded-2xl bg-[#07111d] border border-purple-400/20 p-6 min-w-[220px] flex flex-col items-center w-full max-w-xs">
          <ScrollText className="w-9 h-9 mb-2 text-purple-300" />
          <span className="font-bold text-lg mb-1">Audit Logs</span>
          <span className="text-white/60 text-sm">Review all admin actions for security and compliance.</span>
        </div>
      </div>
    </div>
  );
}
