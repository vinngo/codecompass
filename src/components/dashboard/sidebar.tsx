"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Home, Settings, User } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { createClient } from "@/utils/supabase/client";

export function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const { conversations, setConversations } = useChatStore();
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase.from("conversations").select("*");
      console.log("fetched data: ", data);
      console.log("fetched error: ", error);
      if (!error && data) setConversations(data);
      if (error) console.error(error);
    };
    fetchConversations();
  }, [supabase, setConversations]);

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ width: isHovered ? 200 : 60 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="h-screen bg-background border-r border-border flex flex-col items-start overflow-hidden"
    >
      <div className="flex flex-col gap-4 mt-4 w-full">
        {conversations.map((convo) => (
          <SidebarItem
            key={convo.id}
            label={convo.title}
            showLabel={isHovered}
            convoId={convo.id}
          />
        ))}
      </div>
    </motion.aside>
  );
}

function SidebarItem({
  label,
  showLabel,
  convoId,
}: {
  label: string;
  showLabel: boolean;
  convoId: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors w-full">
      {showLabel && (
        <span className="text-sm text-foreground truncate">{label}</span>
      )}
    </div>
  );
}
