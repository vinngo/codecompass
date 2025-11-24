"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import AnswerPanel from "./answer-panel";
import ChatEmptyState from "./chat-empty-state";
import ModelSelector, { AVAILABLE_MODELS } from "./model-selector";
import { useQuery } from "@tanstack/react-query";
import { getConversationMessages } from "@/lib/services/repoService";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
}

interface CodeSnippet {
  file: string;
  code: string;
}

interface ConversationTurn {
  id: number;
  userQuestion: string;
  timestamp: string;
  codeSnippets: CodeSnippet[];
  loading: boolean;
}

function MessageListSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
      {/* User message skeleton */}
      <div className="mb-8 flex flex-row gap-6 px-5">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>

      {/* Assistant message skeleton */}
      <div className="mb-8">
        <div className="mt-6">
          <div className="bg-elevated rounded-lg border border-gray-800 p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* User message skeleton */}
      <div className="mb-8 flex flex-row gap-6 px-5">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-2/3" />
        </div>
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationTurns, setConversationTurns] = useState<
    ConversationTurn[]
  >([]);
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const [chatInputDisabled, setChatInputDisabled] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const initialMessage = useChatUIStore((state) => state.initialMessage);
  const selectedModel = useChatUIStore((state) => state.selectedModel);
  const setSelectedModel = useChatUIStore((state) => state.setSelectedModel);
  const conversation = useChatUIStore((state) => state.conversation);
  const hasSentInitialMessage = useRef(false);

  // Fetch messages for selected conversation
  const { data: conversationMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", conversation?.id],
    queryFn: async () => {
      if (!conversation?.id) return [];
      const result = await getConversationMessages(conversation.id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!conversation?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const sendMessage = async (text: string) => {
    if (chatInputDisabled || !text.trim()) return;

    setChatInputDisabled(true);
    setResponseLoading(true);
    const userQuestion = text;
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `temp-${Date.now()}`,
        text: userQuestion,
        sender: "user",
        timestamp,
      },
    ]);

    // Create a new conversation turn with loading state
    const turnId = Date.now();
    setConversationTurns((prevTurns) => [
      ...prevTurns,
      {
        id: turnId,
        userQuestion,
        timestamp,
        codeSnippets: [],
        loading: true,
      },
    ]);

    setInputValue("");

    try {
      // Call the streaming API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userQuestion,
          model: selectedModel.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Handle the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let buffer = ""; // Buffer for incomplete SSE messages
      const assistantMessageId = `temp-assistant-${Date.now()}`;
      let firstContentReceived = false;

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream done. Final accumulated text:", accumulatedText);
          break;
        }

        // Decode the chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process complete SSE messages (ending with \n\n)
        const messages = buffer.split("\n\n");

        // Keep the last incomplete message in the buffer
        buffer = messages.pop() || "";

        for (const message of messages) {
          if (!message.trim()) continue;

          // Parse SSE format: "data: {...}"
          if (message.startsWith("data: ")) {
            const dataStr = message.slice(6).trim();

            // Check for stream end
            if (dataStr === "[DONE]") {
              console.log("Received [DONE] signal");
              continue;
            }

            try {
              const dataObj = JSON.parse(dataStr);

              // Extract content from {"content": "..."} format
              if (dataObj.content && typeof dataObj.content === "string") {
                accumulatedText += dataObj.content;

                // On first content, hide loading and create assistant message
                if (!firstContentReceived) {
                  firstContentReceived = true;
                  setResponseLoading(false);

                  setConversationTurns((prevTurns) =>
                    prevTurns.map((turn) =>
                      turn.id === turnId
                        ? {
                            ...turn,
                            loading: false,
                          }
                        : turn,
                    ),
                  );

                  setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                      id: assistantMessageId,
                      text: accumulatedText,
                      sender: "assistant",
                      timestamp: new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    },
                  ]);
                } else {
                  // Update the assistant message with accumulated text
                  setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, text: accumulatedText }
                        : msg,
                    ),
                  );
                }
              }
            } catch (e) {
              console.warn("Failed to parse SSE data:", dataStr, e);
            }
          }
        }
      }

      // Update conversation turn with final state
      setConversationTurns((prevTurns) =>
        prevTurns.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                loading: false,
                codeSnippets: [], // TODO: Extract code snippets from response
              }
            : turn,
        ),
      );
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `temp-error-${Date.now()}`,
          text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // Update conversation turn to show error
      setConversationTurns((prevTurns) =>
        prevTurns.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                loading: false,
                codeSnippets: [],
              }
            : turn,
        ),
      );
    } finally {
      setResponseLoading(false);
      setChatInputDisabled(false);
    }
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  // Clear messages when conversation changes (before new messages load)
  useEffect(() => {
    if (conversation) {
      setMessages([]);
      setConversationTurns([]);
    }
  }, [conversation?.id]);

  // Load conversation messages when they're fetched
  useEffect(() => {
    if (conversationMessages && conversationMessages.length > 0) {
      const loadedMessages: Message[] = conversationMessages.map((msg) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role,
        timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setMessages(loadedMessages);
    }
  }, [conversationMessages]);

  // Auto-send initial message when component mounts
  useEffect(() => {
    if (initialMessage && !hasSentInitialMessage.current) {
      hasSentInitialMessage.current = true;
      sendMessage(initialMessage);
    }
  }, [initialMessage]);

  // Show empty state when there are no messages and no initial message
  const showEmptyState =
    messages.length === 0 && !initialMessage && !conversation;

  // Show loading state when fetching messages for a selected conversation
  const showMessagesLoading = messagesLoading && !!conversation;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-grey-950 text-grey-300">
      {/* Chat Column */}
      <div className="flex flex-col w-1/2 border-r border-grey-800">
        {/* Header with Model Selector */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>

        {showEmptyState ? (
          <ChatEmptyState onSendMessage={sendMessage} />
        ) : showMessagesLoading ? (
          <MessageListSkeleton />
        ) : (
          <MessageList messages={messages} loading={responseLoading} />
        )}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={chatInputDisabled}
        />
      </div>

      {/* Answers Column */}
      <AnswerPanel conversationTurns={conversationTurns} />
    </div>
  );
}
