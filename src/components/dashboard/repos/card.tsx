"use client";

import { Button } from "@/components/ui/button";
import { FolderCode } from "lucide-react";
import { Repo } from "@/app/types/supabase";

type RepoButtonProps = {
  repo: Repo;
};

export function RepoButton({ repo }: RepoButtonProps) {
  const type = repo.provider;
  const index_status = repo.index_status;

  return (
    <Button
      variant="outline"
      className="bg-background h-auto min-h-21 justify-start p-4 w-full"
    >
      <div className="flex flex-row gap-4 text-sm w-full overflow-hidden">
        {/* Surround in a circular container */}
        <div className="rounded-full bg-black p-2.5 flex-shrink-0">
          <FolderCode className="text-primary-foreground" />
        </div>
        <div className="flex flex-col justify-start items-start min-w-0 flex-1">
          <span className="font-semibold truncate">{repo.name}</span>
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {type} <span className="text-md">&middot;</span>{" "}
            {repo ? index_status : "not indexed"}
          </span>
        </div>
      </div>
    </Button>
  );
}
