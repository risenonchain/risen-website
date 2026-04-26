"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import ClientNavbarWrapper from "@/components/ClientNavbarWrapper";
import { LanguageProvider } from "@/context/LanguageContext";
import AIButton from "@/components/ai/AIButton";
import AIDrawer from "@/components/ai/AIDrawer";
import Head from "next/head";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isRush = pathname.startsWith("/rush");
  const isAI = pathname.startsWith("/ai");

  const showMainUI = !isAdmin && !isRush && !isAI;

  return (
    <html lang="en">
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5182951866830006"
          crossOrigin="anonymous"
        ></script>
      </Head>
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