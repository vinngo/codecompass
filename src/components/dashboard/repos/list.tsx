"use client";

import { useQuery } from "@tanstack/react-query";
import { Repo } from "@/app/types/supabase";
import { getReposByOrganizationId } from "@/lib/services/repoService";
import { RepoButton } from "./card";

type RepoListProps = {
  organizationId: string;
};

export function RepoList({ organizationId }: RepoListProps) {
  const { data, isLoading, error } = useQuery<Repo[]>({
    queryKey: ["repos"],
    queryFn: async () => {
      const result = await getReposByOrganizationId(organizationId);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data as Repo[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-destructive"> Error: {error.message} </div>;
  }

  if (!data || data.length === 0) {
    return <div>No repositories found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data.map((repo) => (
        <RepoButton key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
