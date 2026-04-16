import dynamic from "next/dynamic";
const NewsTable = dynamic(() => import("./NewsTable"), { ssr: false });

export default function AdminNewsPage() {
  return <NewsTable />;
}
