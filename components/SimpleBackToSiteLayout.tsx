import Link from "next/link";

export default function SimpleBackToSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div style={{ padding: "1rem", background: "#010913", textAlign: "center" }}>
        <Link href="/" style={{ color: "#2EDBFF", fontWeight: 600, fontSize: 16 }}>
          ← Back to Main Site
        </Link>
      </div>
      {children}
    </div>
  );
}
