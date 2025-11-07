"use client";

import React from "react";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import ChatInterface from "./chat-interface";

export default function ChatOverlay() {
  const { isExpanded } = useChatUIStore();

  if (!isExpanded) return null;

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      {/* Chat interface */}
      <div className="flex-1 overflow-hidden px-2">
        <ChatInterface />
      </div>
    </div>
  );
}
