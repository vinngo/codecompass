"use client";

import { motion } from "motion/react";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import { useSidebar } from "./sidebar";
import { Conversation } from "@/app/types/supabase";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";

export default function ConversationPanel() {
  const { isExpanded: sideBarExpanded } = useSidebar();
  const { isExpanded: chatExpanded, conversation: selectedConversation } =
    useChatUIStore();

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
      {sideBarExpanded && (
        <>
          <div className="text-xs mb-2 px-2 text-muted-foreground">Recents</div>
          <Separator className="mb-2" />
        </>
      )}

      {mockConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">No conversations yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Start chatting to see your history
          </p>
        </div>
      ) : (
        mockConversations.map((conversation, index) => {
          const isSelected = selectedConversation?.id === conversation.id;

          return (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              onClick={() => handleClick(conversation.id)}
              className={`flex items-center mb-0.5 px-2 py-2 rounded-md cursor-pointer transition-colors w-full ${
                isSelected
                  ? "bg-accent/10 border-l-2 border-accent"
                  : "hover:bg-muted border-l-2 border-transparent"
              }`}
            >
              {sideBarExpanded && (
                <div
                  className={`text-xs truncate ${isSelected ? "text-accent font-medium" : ""}`}
                >
                  {conversation.title}
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
}
