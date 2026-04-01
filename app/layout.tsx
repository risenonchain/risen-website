import "./globals.css";
import Navbar from "../sections/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import AIButton from "@/components/ai/AIButton";
import AIDrawer from "@/components/ai/AIDrawer";

export const metadata = {
  title: "RISEN",
  description: "Structured digital asset built for durability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Navbar />

          {/* 🔥 AI GLOBAL LAYER */}
          <AIButton />
          <AIDrawer />

          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}