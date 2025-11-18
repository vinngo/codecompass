import DocumentationViewer from "@/components/dashboard/documentation/documentation";
import ChatBubble from "@/components/dashboard/chat/chat-bubble";
import ChatOverlay from "@/components/dashboard/chat/chat-overlay";
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
    <div className="flex flex-col h-screen overflow-hidden">
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
      {/* Documentation Viewer - Main content */}
      <div className="flex-1 overflow-hidden">
        <DocumentationViewer repoId={repo.id} />
      </div>

      {/* Chat Bubble - Floating input (shows when chat is minimized) */}
      <ChatBubble />

      {/* Chat Overlay - Independent layer (shows when chat is expanded) */}
      <ChatOverlay />
    </div>
  );
}
