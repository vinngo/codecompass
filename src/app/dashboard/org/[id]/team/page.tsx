import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { getOrgMembers } from "@/lib/services/orgService";
import { OrganizationMember } from "@/app/types/supabase";
import { redirect } from "next/navigation";
import { MembersTable } from "@/components/dashboard/organizations/members-table";
import { NavbarContextSetter } from "@/components/dashboard/navbar-context-setter";
import { InviteMemberDialog } from "@/components/dashboard/organizations/invite-member-dialog";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const queryClient = new QueryClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify user has access to this organization
  const { data: org, error } = await supabase
    .from("user_organizations")
    .select("organization_id, role")
    .eq("organization_id", id)
    .eq("user_id", user.id)
    .single();

  if (!org || error) {
    console.error("Organization not found or access denied");
    redirect("/dashboard/organizations");
  }

  // Fetch organization details for navbar breadcrumbs
  const { data: orgDetails } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", id)
    .single();

  // Prefetch members data for React Query
  await queryClient.prefetchQuery({
    queryKey: ["members", id],
    queryFn: async () => {
      const result = await getOrgMembers(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data as OrganizationMember[];
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavbarContextSetter
        breadcrumbs={[
          { label: "Organizations", href: "/dashboard/organizations" },
          {
            label: orgDetails?.name || "Organization",
            href: `/dashboard/org/${id}`,
          },
          { label: "Team" },
        ]}
      />
      <div className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Team</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage members and their roles in this organization
            </p>
          </div>
          <InviteMemberDialog
            organizationId={id}
            organizationName={orgDetails?.name || "Organization"}
          >
            <Button variant="default" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </InviteMemberDialog>
        </div>

        {/* Members Table */}
        <MembersTable organizationId={id} />
      </div>
    </HydrationBoundary>
  );
}
