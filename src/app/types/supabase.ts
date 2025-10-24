export type User = {
  id: string;
  created_at: string;
  email: string;
};

export type Organization = {
  id: string;
  created_at: string;
  name: string;
};

export type OrganizationWithRole = Organization & {
  user_organizations: {
    user_id: string;
    organization_id: string;
    role: string;
    joined_at: string;
  }[];
};

export type Repo = {
  id: string;
  created_at: string;
  indexed_by: string;
  organization_id: string;
  provider: string;
  repo_url: string | null;
  last_indexed_at: string | null;
  metadata: JSON | null;
  index_status: string | null;
  object_url: string | null;
  name: string;
};
