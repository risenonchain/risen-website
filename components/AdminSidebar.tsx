import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  LayoutDashboard,
  BadgeDollarSign,
  Newspaper,
  Calendar,
  ScrollText
} from "lucide-react";

const SIDEBAR_LINKS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Redemptions", icon: BadgeDollarSign, href: "/admin/redemptions" },
  { label: "News", icon: Newspaper, href: "/admin/news" },
  { label: "Modal Management", icon: Calendar, href: "/admin/modals" },
  { label: "Audit Logs", icon: ScrollText, href: "/admin/audit" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("risen_admin_token");
    router.replace("/admin/login");
  }, [router]);

  return (
    <aside className="min-h-screen w-64 bg-[#101828] border-r border-white/10 flex flex-col py-8 px-4">
      <div className="mb-10 text-center">
        <span className="text-2xl font-extrabold text-cyan-300 tracking-tight">RISEN Admin</span>
      </div>
      <nav className="flex flex-col gap-2 mb-8">
        {SIDEBAR_LINKS.map(({ label, icon: Icon, href }) => (
          <button
            key={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors ${pathname === href ? "bg-cyan-900 text-cyan-300" : "text-white/80 hover:bg-cyan-950"}`}
            onClick={() => router.push(href)}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>
      <button
        className="mt-auto px-4 py-3 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800 transition-colors"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
}
