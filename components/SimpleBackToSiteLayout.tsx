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
      <div style={{ padding: "0.75rem 2rem", background: "#010913", borderBottom: "1px solid rgba(46, 219, 255, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ color: "rgba(255, 255, 255, 0.4)", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", cursor: "pointer", fontStyle: "italic", display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={handleBack}>
          <span style={{ fontSize: 14 }}>←</span> Back to Terminal
        </a>
        <div style={{ color: "#2EDBFF", fontWeight: 900, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4em" }}>RISEN Neural Network</div>
      </div>
      {children}
    </div>
  );
}
