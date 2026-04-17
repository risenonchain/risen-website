"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SimpleBackToSiteLayout from "@/components/SimpleBackToSiteLayout";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth guard: redirect to login if not authenticated

  }, [router]);

  if (loading) {
    return (
      <div style={{ color: "#2EDBFF", textAlign: "center", marginTop: 80 }}>
        Checking authentication...
      </div>
    );
  }

  // allow login page to render freely
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) {
    return <>{children}</>;
  }

  // protect only admin dashboard pages
  if (!authChecked) {
    return null;
  }

  return <SimpleBackToSiteLayout>{children}</SimpleBackToSiteLayout>;
}


