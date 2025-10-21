import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { QueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function OrgPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
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

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl text-foreground">Organization</h1>
        <Button variant="default" size="sm">
          <Link href={`/dashboard/new/${id}`}>
            <div className="flex items-center gap-1">
              <Plus />
              <span>New repository</span>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
