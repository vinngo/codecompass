"use client";

import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export function OrganizationButton() {
  return (
    <Button variant="outline" className="bg-background h-21 justify-start">
      <div className="flex flex-row gap-3 text-sm px-2">
        {/*Surround in a circular container */}
        <div className="rounded-full bg-black p-2.5">
          <Building2 />
        </div>
        <div className="flex flex-col justify-start items-start">
          <span className="font-semibold">Organization</span>
          <span className="text-muted-foreground text-xs">
            Github <span className="text-md">&middot;</span> 1 project
          </span>
        </div>
      </div>
    </Button>
  );
}
