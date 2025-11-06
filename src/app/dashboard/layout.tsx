import { DashboardNavbar } from "@/components/dashboard/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardProvider } from "./dashboard-provider";
import { User } from "@/app/types/supabase";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  //protected route
  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardProvider initialUser={user as User}>
      <div className="min-h-screen flex flex-col bg-background">
        <DashboardNavbar />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
