"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SimpleBackToSiteLayout from "@/components/SimpleBackToSiteLayout";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
  }, [router]);

  if (!authChecked) {
    // Prevent rendering until auth is checked
    return null;
  }

  return <SimpleBackToSiteLayout>{children}</SimpleBackToSiteLayout>;
}
