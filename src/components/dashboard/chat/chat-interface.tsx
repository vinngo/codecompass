"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import AnswerPanel from "./answer-panel";

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
        body: JSON.stringify({ query: userQuestion }),
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
      const assistantMessageId = Date.now();

      // Create initial assistant message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: assistantMessageId,
          text: "",
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // Hide loading indicator now that streaming is about to start
      setResponseLoading(false);

      // Update conversation turn
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

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream done. Final accumulated text:", accumulatedText);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedText += parsed.content;

                // Update the assistant message with accumulated text
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, text: accumulatedText }
                      : msg,
                  ),
                );
              }
            } catch (e) {
              // Skip invalid JSON
              console.warn("Failed to parse SSE data:", line);
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

  return (
    <div className="flex h-[calc(100vh-64px)] bg-grey-950 text-grey-300">
      {/* Chat Column */}
      <div className="flex flex-col w-1/2 border-r border-grey-800">
        <MessageList messages={messages} loading={responseLoading} />
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
