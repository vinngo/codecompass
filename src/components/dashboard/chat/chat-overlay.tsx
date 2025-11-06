"use client";

import React from "react";
import { ArrowLeft } from "@geist-ui/icons";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import { Button } from "@/components/ui/button";
import ChatInterface from "./chat-interface";

export default function ChatOverlay() {
  const { isExpanded, minimize } = useChatUIStore();

  if (!isExpanded) return null;

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      {/* Header with close button */}
      <div className="flex justify-left py-2 px-2 border-b border-border flex-shrink-0">
        <Button variant="ghost" onClick={minimize} aria-label="Close chat">
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
      </div>

      {/* Chat interface */}
      <div className="flex-1 overflow-hidden px-2">
        <ChatInterface />
      </div>
    </div>
  );
}
