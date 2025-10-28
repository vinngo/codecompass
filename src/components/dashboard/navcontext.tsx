"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

// Map route patterns to display names
const routeDisplayNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/organizations": "Organizations",
  "/dashboard/repositories": "Repositories",
  "/dashboard/documentation": "Documentation",
  "/dashboard/chat": "Chat",
  "/dashboard/new": "New Organization",
};

export function NavContext() {
  const pathname = usePathname();

  const contextText = useMemo(() => {
    // Check for exact matches first
    if (routeDisplayNames[pathname]) {
      return routeDisplayNames[pathname];
    }

    // Handle dynamic routes
    if (pathname.startsWith("/dashboard/org/")) {
      return "Organization";
    }
    if (pathname.startsWith("/dashboard/repo/")) {
      return "Repository";
    }
    if (pathname.startsWith("/dashboard/new/")) {
      return "New Repository";
    }

    // Default fallback
    return "Dashboard";
  }, [pathname]);

  return (
    <span className="font-semibold text-foreground text-sm">{contextText}</span>
  );
}
