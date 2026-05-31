import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const runtime = "edge";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-mist">
      <AdminSidebar />
      <div className="pl-64">
        <div className="p-8 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
