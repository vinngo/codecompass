"use client";

import { Button } from "@/components/ui/button";
import { FolderCode } from "lucide-react";
import { Github } from "@geist-ui/icons";
import { Gitlab } from "@geist-ui/icons";
import { Repo } from "@/app/types/supabase";
import { useRouter } from "next/navigation";

type RepoButtonProps = {
  repo: Repo;
};

export function RepoButton({ repo }: RepoButtonProps) {
  const router = useRouter();
  const type = repo.provider;
  const index_status = repo.index_status;

  const handlePrefetch = () => {
    // Prefetch repo page route
    router.prefetch(`/dashboard/repo/${repo.id}`);
  };

  return (
    <Button
      variant="outline"
      className="bg-background h-auto min-h-21 justify-start p-4 w-full"
      onClick={() => router.push(`/dashboard/repo/${repo.id}`)}
      onMouseEnter={handlePrefetch}
    >
      <div className="flex flex-row gap-4 text-sm w-full overflow-hidden">
        {/* Surround in a circular container */}
        <div className="rounded-full dark:bg-black border-2 border-primary p-2.5 shrink-0">
          {type === "github" ? (
            <Github className="w-4 h-4" />
          ) : type === "gitlab" ? (
            <Gitlab className="w-4 h-4" />
          ) : (
            <FolderCode className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="flex flex-col justify-start items-start min-w-0 flex-1">
          <span className="font-semibold truncate">{repo.name}</span>
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {type} <span className="text-md">&middot;</span>{" "}
            {index_status || "not indexed"}
          </span>
        </div>
      </div>
    </Button>
  );
}
