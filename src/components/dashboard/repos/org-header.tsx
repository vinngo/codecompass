"use client";

import { useQuery } from "@tanstack/react-query";
import { Organization } from "@/app/types/supabase";
import { getOrgById } from "@/lib/services/orgService";

type OrgHeaderProps = {
  orgId: string;
};

export default function OrgHeader({ orgId }: OrgHeaderProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: async () => {
      const result = await getOrgById(orgId);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data as Organization;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div className="text-2xl text-foreground">{data?.name}</div>;
}
