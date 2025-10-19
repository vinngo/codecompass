import { DashboardNavbar } from "@/components/dashboard/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
