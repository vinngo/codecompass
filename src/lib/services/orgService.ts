"use server";

import { createClient } from "@/utils/supabase/server";
import {
  Organization,
  OrganizationWithRole,
  OrganizationMember,
} from "@/app/types/supabase";
import { ActionResult } from "@/app/types/action";

export async function getOrgs(): Promise<ActionResult<OrganizationWithRole[]>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not found" };
  }

  // Query from user_organizations table to properly filter by user_id
  const { data: userOrgs, error: organizationsError } = await supabase
    .from("user_organizations")
    .select("role,joined_at,organizations(id,name,created_at)")
    .eq("user_id", user.id);

  if (organizationsError) {
    return { success: false, error: organizationsError.message };
  }

  // Transform the data to match OrganizationWithRole structure
  const organizations: OrganizationWithRole[] = (userOrgs ?? []).map((uo) => {
    const org = uo.organizations as Organization | Organization[];
    // Handle case where organizations might be an array (shouldn't happen with proper FK)
    const orgData = Array.isArray(org) ? org[0] : org;

    return {
      id: orgData.id,
      name: orgData.name,
      created_at: orgData.created_at,
      role: uo.role,
      joined_at: uo.joined_at,
    };
  });

  return {
    success: true,
    data: organizations,
  };
}

export async function getOrgById(
  orgId: string,
): Promise<ActionResult<Organization>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const { data: organization, error } = await supabase
    .from("organizations")
    .select("id,name,created_at")
    .eq("id", orgId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!organization) {
    return { success: false, error: "Organization not found" };
  }

  return { success: true, data: organization };
}

export async function getOrgMembers(
  orgId: string,
): Promise<ActionResult<OrganizationMember[]>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  // Verify user has access to this organization
  const { data: userOrg, error: accessError } = await supabase
    .from("user_organizations")
    .select("organization_id")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (accessError || !userOrg) {
    return { success: false, error: "Access denied to this organization" };
  }

  // Fetch all members of the organization with their user details
  // Join with users table to get email addresses
  const { data: members, error: membersError } = await supabase
    .from("user_organizations")
    .select("user_id, organization_id, role, joined_at, users(email)")
    .eq("organization_id", orgId)
    .order("joined_at", { ascending: true });

  if (membersError) {
    return { success: false, error: membersError.message };
  }

  if (!members || members.length === 0) {
    return { success: true, data: [] };
  }

  // Transform the joined data to match OrganizationMember type
  const membersWithEmails: OrganizationMember[] = members.map((m) => {
    // Handle the users field which could be an object or array due to the join
    const userData = m.users as { email: string } | { email: string }[] | null;
    const email = Array.isArray(userData)
      ? userData[0]?.email || "Unknown"
      : userData?.email || "Unknown";

    return {
      user_id: m.user_id,
      organization_id: m.organization_id,
      role: m.role as "owner" | "member",
      joined_at: m.joined_at,
      user_email: email,
    };
  });

  return { success: true, data: membersWithEmails };
}

export async function createOrg(
  formData: FormData,
): Promise<ActionResult<Organization>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    return { success: false, error: "Organization name is required" };
  }

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .insert({
      name: name.trim(),
    })
    .select()
    .single();

  if (organizationError) {
    return { success: false, error: organizationError.message };
  }

  const { error: userOrganizationError } = await supabase
    .from("user_organizations")
    .insert({
      user_id: user.id,
      organization_id: organization.id,
      role: "owner",
    })
    .select()
    .single();

  if (userOrganizationError) {
    return { success: false, error: userOrganizationError.message };
  }

  return { success: true, data: organization };
}
