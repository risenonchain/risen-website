import "./globals.css";
import Navbar from "../sections/Navbar";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import AIButton from "@/components/ai/AIButton";
import AIDrawer from "@/components/ai/AIDrawer";

export const metadata = {
  title: "RISEN",
  description: "Structured digital asset built for durability.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Only show Navbar on main site (not /rush, /ai, /admin)
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const hideNavbar = pathname.startsWith("/rush") || pathname.startsWith("/ai") || pathname.startsWith("/admin");
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {!hideNavbar && <Navbar />}
          {/* 🔥 AI GLOBAL LAYER */}
          <AIButton />
          <AIDrawer />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}