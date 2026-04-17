"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import SimpleBackToSiteLayout from "@/components/SimpleBackToSiteLayout";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  // Auto-logout after 60 seconds of inactivity
  useEffect(() => {
    if (isLoginPage) return;
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (typeof window !== "undefined" && localStorage.getItem("risen_admin_token")) {
          localStorage.removeItem("risen_admin_token");
          router.replace("/admin/login");
        }
      }, 60000); // 60 seconds
    };
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [router, isLoginPage]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("risen_admin_token");

        if (!token && !isLoginPage) {
          router.replace("/admin/login");
        } else {
          setAuthChecked(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [router, isLoginPage]);

  if (loading) {
    return (
      <div style={{ color: "#2EDBFF", textAlign: "center", marginTop: 80 }}>
        Checking authentication...
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authChecked) {
    return null;
  }

  // Sidebar layout for all admin pages except login
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, background: "#0a101a" }}>
        <SimpleBackToSiteLayout>{children}</SimpleBackToSiteLayout>
      </div>
    </div>
  );
}
