import { DashboardNavbar } from "@/components/dashboard/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar, SidebarItem } from "@/components/dashboard/sidebar";
import { FolderCode } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar />

      <div className="flex flex-1">
        <Sidebar>
          <SidebarItem
            icon={<FolderCode className="mr-2 h-6 w-6" />}
            label="Projects"
          />
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
