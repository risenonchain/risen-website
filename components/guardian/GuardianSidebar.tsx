"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Search,
  LayoutDashboard,
  Bell,
  Eye,
  Settings,
  ShieldAlert,
  Menu,
  X,
  Wallet
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/guardian", icon: LayoutDashboard },
  { name: "Contract Scanner", href: "/guardian/scanner", icon: Search },
  { name: "Wallet Intelligence", href: "/guardian/wallet", icon: Wallet },
  { name: "Watch Center", href: "/guardian/watchlist", icon: Eye },
  { name: "Alert Center", href: "/guardian/alerts", icon: Bell },
];

export default function GuardianSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-900 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ShieldCheck className="text-blue-500" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight">RISEN <span className="text-blue-500 text-xs font-medium px-1.5 py-0.5 bg-blue-500/10 rounded-full ml-1">GUARDIAN</span></h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Security Layer</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"}
                  `}
                >
                  <item.icon size={18} className={isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Profile/Settings */}
          <div className="p-4 border-t border-slate-900">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white text-sm transition-all group"
            >
              <div className="p-1.5 bg-slate-900 group-hover:bg-blue-500/10 rounded-lg transition-colors">
                <ShieldAlert size={16} className="group-hover:text-blue-400" />
              </div>
              <span className="font-medium">Back to Website</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
