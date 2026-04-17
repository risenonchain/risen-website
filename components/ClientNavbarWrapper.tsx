"use client";
import Navbar from "../sections/Navbar";
import { usePathname } from "next/navigation";

export default function ClientNavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/rush") || pathname.startsWith("/ai") || pathname.startsWith("/admin");
  if (hideNavbar) return null;
  return <Navbar />;
}
