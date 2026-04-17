import "../globals.css";
import SimpleBackToSiteLayout from "@/components/SimpleBackToSiteLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SimpleBackToSiteLayout>{children}</SimpleBackToSiteLayout>;
}
