import "../globals.css";
import SimpleBackToSiteLayout from "@/components/SimpleBackToSiteLayout";
import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5182951866830006"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <SimpleBackToSiteLayout>{children}</SimpleBackToSiteLayout>
    </>
  );
}
