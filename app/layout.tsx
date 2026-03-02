import "./globals.css";
import Navbar from "../sections/Navbar";

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
        <Navbar />
        {children}
      </body>
    </html>
  );
}