export type GitProvider =
  | "github"
  | "gitlab"
  | "bitbucket"
  | "gitlab-self-hosted";

export interface ProviderConfig {
  name: string;
  urlPattern: RegExp;
  authUrl: string;
  tokenUrl: string;
  scope: string;
  clientIdEnvVar: string;
  clientSecretEnvVar: string;
  iconComponent?: string; // For UI
}

export const GIT_PROVIDERS: Record<GitProvider, ProviderConfig> = {
  github: {
    name: "GitHub",
    urlPattern: /^https?:\/\/(www\.)?github\.com\/([^\/]+)\/([^\/]+)/i,
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scope: "repo",
    clientIdEnvVar: "NEXT_PUBLIC_GITHUB_CLIENT_ID",
    clientSecretEnvVar: "GITHUB_CLIENT_SECRET",
  },
  gitlab: {
    name: "GitLab",
    urlPattern: /^https?:\/\/(www\.)?gitlab\.com\/([^\/]+)\/([^\/]+)/i,
    authUrl: "https://gitlab.com/oauth/authorize",
    tokenUrl: "https://gitlab.com/oauth/token",
    scope: "read_repository write_repository",
    clientIdEnvVar: "NEXT_PUBLIC_GITLAB_CLIENT_ID",
    clientSecretEnvVar: "GITLAB_CLIENT_SECRET",
  },
  bitbucket: {
    name: "Bitbucket",
    urlPattern: /^https?:\/\/(www\.)?bitbucket\.org\/([^\/]+)\/([^\/]+)/i,
    authUrl: "https://bitbucket.org/site/oauth2/authorize",
    tokenUrl: "https://bitbucket.org/site/oauth2/access_token",
    scope: "repository:read",
    clientIdEnvVar: "NEXT_PUBLIC_BITBUCKET_CLIENT_ID",
    clientSecretEnvVar: "BITBUCKET_CLIENT_SECRET",
  },
  "gitlab-self-hosted": {
    name: "GitLab (Self-Hosted)",
    urlPattern: /^https?:\/\/([^\/]+)\/([^\/]+)\/([^\/]+)/i, // Generic pattern
    authUrl: "{instance_url}/oauth/authorize", // Placeholder
    tokenUrl: "{instance_url}/oauth/token",
    scope: "read_repository write_repository",
    clientIdEnvVar: "NEXT_PUBLIC_GITLAB_SELF_HOSTED_CLIENT_ID",
    clientSecretEnvVar: "GITLAB_SELF_HOSTED_CLIENT_SECRET",
  },
};

/**
 * Detect which Git provider a URL belongs to
 */
export function detectProvider(repoUrl: string): GitProvider | null {
  // Check known providers first
  if (GIT_PROVIDERS.github.urlPattern.test(repoUrl)) return "github";
  if (GIT_PROVIDERS.gitlab.urlPattern.test(repoUrl)) return "gitlab";
  if (GIT_PROVIDERS.bitbucket.urlPattern.test(repoUrl)) return "bitbucket";

  // Check for self-hosted GitLab (look for /api/v4 or common GitLab patterns)
  // This is a heuristic and may need refinement
  if (/^https?:\/\/[^\/]+\/[^\/]+\/[^\/]+/.test(repoUrl)) {
    return "gitlab-self-hosted";
  }

  return null;
}

/**
 * Extract repo owner and name from URL
 */
export function parseRepoUrl(repoUrl: string): {
  owner: string;
  repo: string;
  provider: GitProvider | null;
  instanceUrl?: string;
} | null {
  const provider = detectProvider(repoUrl);
  if (!provider) return null;

  const config = GIT_PROVIDERS[provider];
  const match = repoUrl.match(config.urlPattern);

  if (!match) return null;

  // For self-hosted, extract instance URL
  const instanceUrl = provider === "gitlab-self-hosted" ? match[1] : undefined;

  return {
    provider,
    owner: match[2],
    repo: match[3].replace(/\.git$/, ""), // Remove .git suffix if present
    instanceUrl,
  };
}
