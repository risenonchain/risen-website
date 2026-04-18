"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function SimpleBackToSiteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const handleBack = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && localStorage.getItem("risen_admin_token")) {
      localStorage.removeItem("risen_admin_token");
      router.replace("/admin/login");
    } else {
      router.push("/");
    }
  }, [router]);

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
