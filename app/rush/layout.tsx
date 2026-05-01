import "../globals.css";
import SimpleBackToSiteLayout from "@/components/SimpleBackToSiteLayout";
import Script from "next/script";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="beforeInteractive"
      />
      <SimpleBackToSiteLayout>{children}</SimpleBackToSiteLayout>
    </>
  );
}
