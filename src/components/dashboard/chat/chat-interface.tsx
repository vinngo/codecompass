"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import AnswerPanel from "./answer-panel";
import ChatEmptyState from "./chat-empty-state";
import ModelSelector, { AVAILABLE_MODELS } from "./model-selector";

interface Message {
  id: number;
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
  const hasSentInitialMessage = useRef(false);

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
        id: prevMessages.length + 1,
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
      const assistantMessageId = Date.now();
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
          id: Date.now(),
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

  // Auto-send initial message when component mounts
  useEffect(() => {
    if (initialMessage && !hasSentInitialMessage.current) {
      hasSentInitialMessage.current = true;
      sendMessage(initialMessage);
    }
  }, [initialMessage]);

  // Show empty state when there are no messages and no initial message
  const showEmptyState = messages.length === 0 && !initialMessage;

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
