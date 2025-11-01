"use client";

import React, { useState } from "react";
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

  const handleSend = async () => {
    if (chatInputDisabled) return;

    if (inputValue.trim()) {
      setChatInputDisabled(true);
      setResponseLoading(true);
      const userQuestion = inputValue;
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
        // Call the Next.js API endpoint
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: userQuestion,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from chat API");
        }

        // Parse the JSON response
        const data = await response.json();
        const responseText =
          data.response || "Sorry, I couldn't process your request.";

        // Add assistant response to messages
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: responseText,
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        // Update the conversation turn with code snippets (if provided by backend)
        setConversationTurns((prevTurns) =>
          prevTurns.map((turn) =>
            turn.id === turnId
              ? {
                  ...turn,
                  loading: false,
                  codeSnippets: data.codeSnippets || [],
                }
              : turn,
          ),
        );
      } catch (error) {
        console.error("Error sending message:", error);

        // Add error message to chat
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: "Sorry, there was an error processing your request. Please try again.",
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        // Update turn to show error state
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
    }
  };

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
