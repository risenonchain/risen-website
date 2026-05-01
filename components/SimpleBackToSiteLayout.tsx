"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SimpleBackToSiteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Capacitor) {
      setIsCapacitor(true);
    }
  }, []);

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && localStorage.getItem("risen_admin_token")) {
      localStorage.removeItem("risen_admin_token");
      router.replace("/admin/login");
    } else {
      router.push("/");
    }
  }, [router]);

  if (isCapacitor) {
    return <>{children}</>;
  }

  return (
    <div>
      <div style={{ padding: "1rem", background: "#010913", textAlign: "center" }}>
        <a href="/" style={{ color: "#2EDBFF", fontWeight: 600, fontSize: 16, cursor: "pointer" }} onClick={handleBack}>
          Back to Main Site
        </a>
      </div>
      {children}
    </div>
  );
}
