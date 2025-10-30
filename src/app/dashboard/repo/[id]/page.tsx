import ChatInterface from "@/components/dashboard/chat/chat-interface";
import { NavbarContextSetter } from "@/components/dashboard/navbar-context-setter";
import { getRepoWithStatus } from "@/lib/services/repoService";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch repository details
  const repoResult = await getRepoWithStatus(id);

  if (!repoResult.success) {
    console.error("Repository not found:", repoResult.error);
    redirect("/dashboard/organizations");
  }

  const repo = repoResult.data;

  // Fetch organization details for breadcrumbs
  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", repo.organization_id)
    .single();

  return (
    <div>
      <NavbarContextSetter
        breadcrumbs={[
          { label: "Organizations", href: "/dashboard/organizations" },
          {
            label: org?.name || "Organization",
            href: `/dashboard/org/${repo.organization_id}`,
          },
          { label: repo.name },
        ]}
      />
      {/*Docs Page*/}
      <ChatInterface />
    </div>
  );
}
