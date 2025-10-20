"use client";

import { useQuery } from "@tanstack/react-query";
import { OrganizationWithRole } from "@/app/types/supabase";
import { OrganizationButton } from "./card";
import { createClient } from "@/utils/supabase/client";

export function OrganizationList() {
  const { data: organizations = [], isLoading } = useQuery<
    OrganizationWithRole[]
  >({
    queryKey: ["organizations"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      const { data: organizations, error: organizationsError } = await supabase
        .from("organizations")
        .select("id,name,created_at,user_organizations(role,joined_at)")
        .eq("user_organizations.user_id", user.id);

      if (organizationsError) {
        console.error("Error fetching organizations:", organizationsError);
        return [];
      }

      return (organizations ?? []) as OrganizationWithRole[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {organizations?.map((organization) => (
        <OrganizationButton key={organization.id} organization={organization} />
      ))}
    </div>
  );
}
