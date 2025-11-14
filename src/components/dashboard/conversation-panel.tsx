"use client";

import { motion } from "motion/react";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import { useSidebar } from "./sidebar";
import { Conversation } from "@/app/types/supabase";

export default function ConversationPanel() {
  const { isExpanded: sideBarExpanded } = useSidebar();
  const { isExpanded: chatExpanded } = useChatUIStore();

  const mockConversations: Conversation[] = [
    {
      id: "1",
      created_at: new Date().toISOString(),
      user_id: "user-1",
      repo_id: "repo-1",
      title: "How to implement authentication?",
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      created_at: new Date().toISOString(),
      user_id: "user-1",
      repo_id: "repo-1",
      title: "Explain the database schema",
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      created_at: new Date().toISOString(),
      user_id: "user-1",
      repo_id: "repo-1",
      title: "How does routing work?",
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      created_at: new Date().toISOString(),
      user_id: "user-1",
      repo_id: "repo-1",
      title: "API endpoint documentation",
      updated_at: new Date().toISOString(),
    },
    {
      id: "5",
      created_at: new Date().toISOString(),
      user_id: "user-1",
      repo_id: "repo-1",
      title: "State management patterns",
      updated_at: new Date().toISOString(),
    },
    {
      id: "6",
      created_at: new Date().toISOString(),
      user_id: "user-1",
      repo_id: "repo-1",
      title: "Component architecture overview",
      updated_at: new Date().toISOString(),
    },
  ];

  const handleClick = (conversationId: string) => {
    const selectedConversation = mockConversations.find(
      (conversation) => conversation.id === conversationId,
    );
    useChatUIStore.setState({ conversation: selectedConversation });
  };

  if (!chatExpanded) return null;

  if (!sideBarExpanded) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden", transformOrigin: "top" }}
    >
      {sideBarExpanded && <div className="text-xs mb-2 px-2 ">Recents</div>}
      {mockConversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => handleClick(conversation.id)}
          className="flex items-center mb-0.5 px-2 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors w-full"
        >
          {sideBarExpanded && (
            <div className="text-xs">{conversation.title}</div>
          )}
        </div>
      ))}
    </motion.div>
  );
}
