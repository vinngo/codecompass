import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { getReposByOrganizationId } from "@/lib/services/repoService";
import { Repo } from "@/app/types/supabase";
import { redirect } from "next/navigation";
import { RepoList } from "@/components/dashboard/repos/list";
import OrgHeader from "@/components/dashboard/repos/org-header";
import { NavbarContextSetter } from "@/components/dashboard/navbar-context-setter";

export default async function OrgPage({
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

  await queryClient.prefetchQuery({
    queryKey: ["repositories", id],
    queryFn: async () => {
      const result = await getReposByOrganizationId(id);
      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data as Repo[];
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavbarContextSetter
        breadcrumbs={[
          { label: "Organizations", href: "/dashboard/organizations" },
          { label: orgDetails?.name || "Organization" },
        ]}
      />
      <div className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <OrgHeader orgName={orgDetails?.name || "Organization"} />
          <Button variant="default" size="sm">
            <Link href={`/dashboard/new/${id}`}>
              <div className="flex items-center gap-1">
                <Plus />
                <span>New repository</span>
              </div>
            </Link>
          </Button>
        </div>
        <RepoList organizationId={org.organization_id} />
      </div>
    </HydrationBoundary>
  );
}
