"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  BadgeDollarSign,
  Newspaper,
  Calendar,
  ScrollText
} from "lucide-react";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("risen_admin_token");
      if (!token) {
        router.replace("/admin/login");
      } else {
        setAuthChecked(true);
      }
    }
  }, [router, pathname]);

  const SIDEBAR_LINKS = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Redemptions", icon: BadgeDollarSign, href: "/admin/redemptions" },
    { label: "News", icon: Newspaper, href: "/admin/news" },
    { label: "Modal Management", icon: Calendar, href: "/admin/modals" },
    { label: "Audit Logs", icon: ScrollText, href: "/admin/audit" },
  ];

  const handleNav = (href: string) => {
    router.push(href);
  };

  useEffect(() => {
    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      setShowWarning(false);
      // Show warning after 50s, logout after 60s
      warningTimer.current = setTimeout(() => {
        setShowWarning(true);
      }, 50000);
      timer.current = setTimeout(() => {
        setShowWarning(false);
        router.replace("/admin/login");
      }, 60000);
    };
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [router]);

  if (!authChecked) {
    // Prevent rendering until auth is checked
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#020B1A] text-white">
      {/* Sidebar - always visible, responsive */}
      <aside className="w-64 flex flex-col gap-2 bg-[#07111d] border-r border-white/10 py-8 px-4 h-full z-20
        md:fixed md:h-full md:left-0 md:top-0 md:bottom-0
        max-md:w-full max-md:h-auto max-md:relative max-md:flex-row max-md:items-center max-md:justify-between max-md:py-2 max-md:px-2">
        <div className="flex items-center gap-3 mb-8 pl-2 max-md:mb-0 max-md:pl-0">
          <Image src="/logo.png" alt="RISEN Logo" width={36} height={36} />
          <span className="text-xl font-extrabold tracking-tight text-cyan-300">RISEN Admin</span>
        </div>
        <nav className="flex flex-col gap-1 max-md:flex-row max-md:gap-2 max-md:ml-4">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base transition border border-transparent hover:bg-risen-primary/10 hover:text-risen-primary ${isActive ? "bg-risen-primary/20 text-risen-primary border-risen-primary/40" : ""} max-md:px-2 max-md:py-2`}
              >
                <Icon className="w-5 h-5" />
                <span className="max-md:hidden">{link.label}</span>
              </button>
            );
          })}
        </nav>
        {/* Logout Button */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.localStorage.clear();
              window.sessionStorage.clear();
            }
            router.replace("/admin/login");
          }}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow max-md:mt-0 max-md:ml-auto max-md:px-2 max-md:py-2"
        >
          Logout
        </button>
        <div className="mt-auto pt-8 pl-2 text-xs text-white/40 max-md:hidden">RISEN Platform Admin</div>
      </aside>

      {/* Main Content - responsive margin for sidebar */}
      <main className="flex-1 p-10 md:ml-64 max-md:ml-0 max-md:p-2">
        {showWarning && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#101828] border border-yellow-400/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fadein relative">
              <div className="text-yellow-300 text-xl font-bold mb-2 text-center">Inactivity Warning</div>
              <div className="text-white/80 mb-4 text-center">You will be logged out in <span className="font-bold">10 seconds</span> due to inactivity.</div>
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded shadow w-full"
                onClick={() => setShowWarning(false)}
              >
                Stay Logged In
              </button>
            </div>
            <style jsx>{`
              .animate-fadein { animation: fadein 0.25s; }
              @keyframes fadein { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
            `}</style>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
