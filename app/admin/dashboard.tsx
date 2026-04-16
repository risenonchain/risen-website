
"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  fetchRedemptionRequests,
  updateRedemptionRequestStatus,
  blockPlayer,
  unblockPlayer,
  fetchAuditLogs,
  RedemptionRequest,
  AuditLog,
} from "@/lib/admin";

const SIDEBAR_LINKS = [
  { label: "Dashboard", icon: "🏠", href: "/admin" },
  { label: "Redemptions", icon: "💸", href: "/admin/redemptions" },
  { label: "News", icon: "📰", href: "/admin/news" },
  { label: "Modal Management", icon: "🗓️", href: "/admin/modals" },
  { label: "Audit Logs", icon: "📜", href: "/admin/audit" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sidebar navigation handler
  const handleNav = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen flex bg-[#020B1A] text-white">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col gap-2 bg-[#07111d] border-r border-white/10 py-8 px-4 fixed h-full z-20">
        <div className="flex items-center gap-3 mb-8 pl-2">
          <Image src="/logo.png" alt="RISEN Logo" width={36} height={36} />
          <span className="text-xl font-extrabold tracking-tight text-risen-primary">RISEN Admin</span>
        </div>
        <nav className="flex flex-col gap-1">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base transition border border-transparent hover:bg-risen-primary/10 hover:text-risen-primary ${isActive ? "bg-risen-primary/20 text-risen-primary border-risen-primary/40" : ""}`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto pt-8 pl-2 text-xs text-white/40">RISEN Platform Admin</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        {/* Routed content will appear here via Next.js routing */}
      </main>
    </div>
  );
}
