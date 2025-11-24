"use server";

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
