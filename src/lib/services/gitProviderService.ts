"use server";

import { createClient } from "@/utils/supabase/server";
import { ActionResult } from "@/app/types/action";
import { GitProviderToken, GitProvider } from "@/app/types/supabase";
import { githubApp } from "@/utils/github/app";

export async function verifyGithubRepoAccess(
  installation_id: string,
  owner: string,
  repo: string,
): Promise<boolean> {
  try {
    //convert installation_id to number
    const installationId = parseInt(installation_id, 10);
    const octokit = await githubApp.getInstallationOctokit(installationId);

    await octokit.request("GET /repos/{owner}/{repo}", {
      owner,
      repo,
    });

    return true;
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404) {
      return false;
    }
    throw error;
  }
}

export async function getProviderToken(
  provider: GitProvider,
): Promise<ActionResult<GitProviderToken | null>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: token, error } = await client
    .from("git_provider_tokens")
    .select("*")
    .eq("user_id", user.id)
    .eq("provider", provider)
    .single();

  if (error) {
    //no token found is not an error
    if (error.code === "PGRST116") {
      return { success: true, data: null };
    }
    console.error(`Error fetching ${provider} token:`, error);
    return { success: false, error: error.message };
  }

  return { success: true, data: token as GitProviderToken };
}

export async function storeProviderToken(
  provider: GitProvider,
  accessToken: string,
  scope?: string,
  instanceUrl?: string,
): Promise<ActionResult<GitProviderToken>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  // Upsert: insert if not exists, update if exists
  const { data: token, error } = await client
    .from("git_provider_tokens")
    .upsert({
      user_id: user.id,
      provider,
      access_token: accessToken,
      scope: scope || null,
      token_type: "bearer",
      instance_url: instanceUrl || null,
    })
    .select()
    .single();

  if (error) {
    console.error(`Error storing ${provider} token:`, error);
    return { success: false, error: error.message };
  }

  return { success: true, data: token as GitProviderToken };
}

/**
 * Delete user's token for a specific Git provider
 */
export async function deleteProviderToken(
  provider: GitProvider,
): Promise<ActionResult<void>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const { error } = await client
    .from("git_provider_tokens")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", provider);

  if (error) {
    console.error(`Error deleting ${provider} token:`, error);
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}
