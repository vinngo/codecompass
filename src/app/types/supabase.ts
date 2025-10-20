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
