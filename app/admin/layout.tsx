import AdminDashboard from "./dashboard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboard>{children}</AdminDashboard>;
}
