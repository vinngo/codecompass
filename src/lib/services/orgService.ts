"use server";

import { createClient } from "@/utils/supabase/server";
import { Organization, OrganizationWithRole } from "@/app/types/supabase";
import { ActionResult } from "@/app/types/action";

export async function getOrgs(): Promise<ActionResult<OrganizationWithRole[]>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const { data: organizations, error: organizationsError } = await supabase
    .from("organizations")
    .select("id,name,created_at,user_organizations(role,joined_at)")
    .eq("user_organizations.user_id", user.id);

  if (organizationsError) {
    return { success: false, error: organizationsError.message };
  }

  return {
    success: true,
    data: (organizations ?? []) as OrganizationWithRole[],
  };
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
