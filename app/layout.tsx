import "./globals.css";
import Navbar from "../sections/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";

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
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}