"use server";

import { createClient } from "@/utils/supabase/server";
import { Repo } from "@/app/types/supabase";
import { ActionResult } from "@/app/types/action";

export async function getReposByOrganizationId(
  organizationId: string,
): Promise<ActionResult<Repo[]>> {
  const client = await createClient();

  const user = client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data, error } = await client
    .from("repositories")
    .select("*")
    .eq("organization_id", organizationId);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: (data ?? []) as Repo[] };
}

export async function createRepoViaGithub(
  formData: FormData,
  orgId: string,
): Promise<ActionResult<Repo | undefined>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const name = formData.get("name") as string;
  const provider = formData.get("type") as string;
  const url = formData.get("github-url") as string;

  const { data: repo, error: repoError } = await client
    .from("repositories")
    .insert({
      name,
      provider,
      repo_url: url,
      organization_id: orgId,
      indexed_by: user.id,
      index_status: "not indexed",
    })
    .select()
    .single();

  if (repoError) {
    return { success: false, error: repoError.message };
  }

  return { success: true, data: repo as Repo };
}
