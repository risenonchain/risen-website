
"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  BadgeDollarSign,
  Newspaper,
  Calendar,
  ScrollText
} from "lucide-react";
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
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Redemptions", icon: BadgeDollarSign, href: "/admin/redemptions" },
  { label: "News", icon: Newspaper, href: "/admin/news" },
  { label: "Modal Management", icon: Calendar, href: "/admin/modals" },
  { label: "Audit Logs", icon: ScrollText, href: "/admin/audit" },
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

  return null;
}
