"use client";

import React from "react";
import { ArrowLeft, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";

interface MessageBubbleProps {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
}

export default function MessageBubble({ text, sender }: MessageBubbleProps) {
  const { minimize } = useChatUIStore();

  if (sender === "user") {
    return (
      <div className="mb-8 flex flex-row gap-6 px-5">
        <div className="text-gray-700 dark:text-gray-300 tracking-wide text-2xl leading-relaxed">
          {text}
        </div>

        <Button variant="ghost" onClick={minimize} aria-label="Close chat">
          <ArrowLeft className="h-5 w-5" />
          Back to documentation
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="mt-6">
        <div className="bg-elevated rounded-lg border border-gray-800 p-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {text}
            </p>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
            <button className="p-2 hover:bg-gray-800 rounded-md transition-colors">
              <Copy size={16} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-md transition-colors">
              <Share2 size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
