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
  useEffect(() => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("risen_admin_token");
        if (!token) {
          router.replace("/admin/login");
        } else {
          setAuthChecked(true);
        }
      }
    } catch (err) {
      setError("Failed to check authentication");
    } finally {
      setLoading(false);
    }
  }, [router]);


