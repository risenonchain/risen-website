import "./globals.css";

"use client";
import { usePathname } from "next/navigation";
import ClientNavbarWrapper from "@/components/ClientNavbarWrapper";
import { LanguageProvider } from "@/context/LanguageContext";
import AIButton from "@/components/ai/AIButton";
import AIDrawer from "@/components/ai/AIDrawer";

export const metadata = {
  title: "RISEN",
  description: "Structured digital asset built for durability.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isRush = pathname.startsWith("/rush");
  const isAI = pathname.startsWith("/ai");

  const showMainUI = !isAdmin && !isRush && !isAI;

  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {/* ONLY MAIN SITE */}
          {showMainUI && <ClientNavbarWrapper />}
          {showMainUI && <AIButton />}
          {showMainUI && <AIDrawer />}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}