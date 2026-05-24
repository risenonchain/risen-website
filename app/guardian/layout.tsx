"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import GuardianSidebar from "@/components/guardian/GuardianSidebar";
import { hasRushToken } from "@/lib/api";

export default function GuardianLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hasRushToken() && pathname !== "/guardian/login") {
      router.replace("/guardian/login");
    }
  }, [pathname, router]);

  const isLoginPage = pathname === "/guardian/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <GuardianSidebar />

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

        {/* Page Content */}
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
