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
