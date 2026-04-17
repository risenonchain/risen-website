"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SimpleBackToSiteLayout from "@/components/SimpleBackToSiteLayout";

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

  return <SimpleBackToSiteLayout>{children}</SimpleBackToSiteLayout>;
}
