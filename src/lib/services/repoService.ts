"use server";

import { createClient } from "@/utils/supabase/server";
import {
  Repo,
  Documentation,
  DocPage,
  Conversation,
  ConversationMessage,
} from "@/app/types/supabase";
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

// ============================================================================
// Repository Management Services
// ============================================================================

export async function getRepoWithStatus(
  repoId: string,
): Promise<ActionResult<Repo>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: repo, error } = await client
    .from("repositories")
    .select("*")
    .eq("id", repoId)
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  if (!repo) {
    return { success: false, error: "Repository not found" };
  }

  return { success: true, data: repo as Repo };
}

export async function updateRepoSettings(
  repoId: string,
  settings: { name?: string },
): Promise<ActionResult<Repo>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: repo, error } = await client
    .from("repositories")
    .update(settings)
    .eq("id", repoId)
    .select()
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: repo as Repo };
}

export async function deleteRepo(repoId: string): Promise<ActionResult<void>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { error } = await client.from("repositories").delete().eq("id", repoId);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}

export async function triggerReindex(
  repoId: string,
): Promise<ActionResult<void>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  // Update the index_status to 'pending' to trigger reindexing
  const { error } = await client
    .from("repositories")
    .update({ index_status: "pending" })
    .eq("id", repoId);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  // TODO: Trigger actual indexing job/webhook/queue here
  // This could be an API call to your indexing service

  return { success: true, data: undefined };
}

// ============================================================================
// Documentation Services
// ============================================================================

export async function getDocumentation(
  repoId: string,
): Promise<ActionResult<Documentation>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: documentation, error } = await client
    .from("documentation")
    .select("*")
    .eq("repo_id", repoId)
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  if (!documentation) {
    return { success: false, error: "Documentation not found" };
  }

  return { success: true, data: documentation as Documentation };
}

export async function getDocPages(
  repoId: string,
): Promise<ActionResult<DocPage[]>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  // First get the documentation ID for this repo
  const { data: documentation, error: docError } = await client
    .from("documentation")
    .select("id")
    .eq("repo_id", repoId)
    .single();

  if (docError || !documentation) {
    console.error(docError);
    return { success: false, error: "Documentation not found" };
  }

  const { data: pages, error } = await client
    .from("doc_pages")
    .select("*")
    .eq("documentation_id", documentation.id)
    .order("order_index", { ascending: true });

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: (pages ?? []) as DocPage[] };
}

export async function getDocPageById(
  pageId: string,
): Promise<ActionResult<DocPage>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: page, error } = await client
    .from("doc_pages")
    .select("*")
    .eq("id", pageId)
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  if (!page) {
    return { success: false, error: "Page not found" };
  }

  return { success: true, data: page as DocPage };
}

export async function getDocPagesHierarchical(
  repoId: string,
): Promise<ActionResult<DocPage[]>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  // First get the documentation ID for this repo
  const { data: documentation, error: docError } = await client
    .from("documentation")
    .select("id")
    .eq("repo_id", repoId)
    .single();

  if (docError || !documentation) {
    console.error(docError);
    return { success: false, error: "Documentation not found" };
  }

  const { data: pages, error } = await client
    .from("doc_pages")
    .select("*")
    .eq("documentation_id", documentation.id)
    .order("order_index", { ascending: true });

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  // Pages are already sorted by order_index
  // The parent_page_id field maintains the hierarchy
  // Frontend can use this to render the tree structure
  return { success: true, data: (pages ?? []) as DocPage[] };
}

// ============================================================================
// Conversation Services
// ============================================================================

export async function getConversations(
  repoId: string,
  limit: number = 20,
): Promise<ActionResult<Conversation[]>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: conversations, error } = await client
    .from("conversations")
    .select("*")
    .eq("repo_id", repoId)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: (conversations ?? []) as Conversation[] };
}

export async function getConversationById(
  conversationId: string,
): Promise<ActionResult<Conversation>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: conversation, error } = await client
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  if (!conversation) {
    return { success: false, error: "Conversation not found" };
  }

  return { success: true, data: conversation as Conversation };
}

export async function createConversation(
  repoId: string,
  title?: string,
): Promise<ActionResult<Conversation>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: conversation, error } = await client
    .from("conversations")
    .insert({
      repo_id: repoId,
      user_id: user.id,
      title: title || "New Conversation",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: conversation as Conversation };
}

export async function deleteConversation(
  conversationId: string,
): Promise<ActionResult<void>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { error } = await client
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}

export async function renameConversation(
  conversationId: string,
  newTitle: string,
): Promise<ActionResult<Conversation>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: conversation, error } = await client
    .from("conversations")
    .update({ title: newTitle })
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: conversation as Conversation };
}

// ============================================================================
// Message Services
// ============================================================================

export async function getConversationMessages(
  conversationId: string,
): Promise<ActionResult<ConversationMessage[]>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: messages, error } = await client
    .from("conversation_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: (messages ?? []) as ConversationMessage[] };
}

export async function createMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
): Promise<ActionResult<ConversationMessage>> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated!" };
  }

  const { data: message, error } = await client
    .from("conversation_messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  // Update the conversation's updated_at timestamp
  await client
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return { success: true, data: message as ConversationMessage };
}
