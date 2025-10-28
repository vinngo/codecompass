"use client";

import { usePathname, useParams } from "next/navigation";
import { Sidebar, SidebarItem } from "@/components/dashboard/sidebar";
import {
  FolderCode,
  Building2,
  Home,
  Users,
  Settings,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  // Access dynamic route parameters
  const id = params.id as string | undefined;

  // Determine the current context based on pathname patterns
  const currentContext = useMemo(() => {
    if (pathname.startsWith("/dashboard/org/") && id) {
      return { type: "organization", id };
    }
    if (pathname.startsWith("/dashboard/repo/") && id) {
      return { type: "repository", id };
    }
    return { type: "default", id: null };
  }, [pathname, id]);

  // Render different sidebar items based on context
  const renderContextualItems = () => {
    switch (currentContext.type) {
      case "organization":
        return (
          <>
            <SidebarItem
              icon={<FolderCode className="h-5 w-5" />}
              label="Repositories"
              action={() => router.push(`/dashboard/org/${currentContext.id}`)}
            />
            <SidebarItem
              icon={<Users className="h-5 w-5" />}
              label="Team"
              action={() =>
                router.push(`/dashboard/org/${currentContext.id}/team`)
              }
            />
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              action={() =>
                router.push(`/dashboard/org/${currentContext.id}/settings`)
              }
            />
          </>
        );

      case "repository":
        return (
          <>
            <SidebarItem
              icon={<FileText className="h-5 w-5" />}
              label="Documentation"
              action={() => router.push(`/dashboard/repo/${currentContext.id}`)}
            />
            <SidebarItem
              icon={<MessageSquare className="h-5 w-5" />}
              label="Chat"
              action={() =>
                router.push(`/dashboard/repo/${currentContext.id}/chat`)
              }
            />
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              action={() =>
                router.push(`/dashboard/repo/${currentContext.id}/settings`)
              }
            />
          </>
        );

      default:
        return (
          <>
            <SidebarItem
              icon={<Building2 className="h-5 w-5" />}
              label="Organizations"
              action={() => router.push("/dashboard/organizations")}
            />
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              action={() => router.push("/dashboard/organizations")}
            />
          </>
        );
    }
  };

  return <Sidebar>{renderContextualItems()}</Sidebar>;
}
