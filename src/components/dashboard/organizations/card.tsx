"use client";

import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { OrganizationWithRole } from "@/app/types/supabase";
import { useRouter } from "next/navigation";

type OrganizationButtonProps = {
  organization: OrganizationWithRole;
};

export function OrganizationButton({ organization }: OrganizationButtonProps) {
  const role = organization.role || "member";

  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="bg-background h-auto min-h-21 justify-start p-4 w-full"
      onClick={() => router.push(`/dashboard/org/${organization.id}`)}
    >
      <div className="flex flex-row gap-4 text-sm w-full overflow-hidden">
        {/* Surround in a circular container */}
        <div className="rounded-full bg-black p-2.5 flex-shrink-0">
          <Building2 className="text-primary-foreground" />
        </div>
        <div className="flex flex-col justify-start items-start min-w-0 flex-1">
          <span className="font-semibold truncate">{organization.name}</span>
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {role ? "Owner" : "Member"}{" "}
            <span className="text-md">&middot;</span> 1 project
          </span>
        </div>
      </div>
    </Button>
  );
}
