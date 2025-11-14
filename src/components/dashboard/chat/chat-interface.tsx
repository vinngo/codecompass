"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import AnswerPanel from "./answer-panel";
import ModelSelector, { AVAILABLE_MODELS, LLMModel } from "./model-selector";
import ChatEmptyState from "./chat-empty-state";

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
  const [selectedModel, setSelectedModel] = useState<LLMModel>(AVAILABLE_MODELS[0]);
  const initialMessage = useChatUIStore((state) => state.initialMessage);
  const hasSentInitialMessage = useRef(false);

  const handleModelChange = async (model: LLMModel) => {
    setSelectedModel(model);
    console.log('Selected model:', model.id);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedModel', JSON.stringify(model));
    }
    
  };

  useEffect(() => {
    const savedModel = useChatUIStore.getState().selectedModel;
    if (savedModel) {
      const model = AVAILABLE_MODELS.find(m => m.id === savedModel.id);
      if (model) {
        setSelectedModel(model);
      }
    }
  }, []);

  const sendMessage = (text: string) => {
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

      // Handle the streaming response with client-side transformation
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      const assistantMessageId = Date.now();

      // Create initial assistant message (but don't show it yet)
      const assistantMessageCreated = false;
      let firstContentReceived = false;

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream done. Final accumulated text:", accumulatedText);
          break;
        }

        // Handle backend's complex format: numeric-keyed JSON objects
        const rawText = decoder.decode(value, { stream: true });

        // Multiple JSON objects may be concatenated, split them
        const jsonObjects = rawText.split(/(?<=\})(?=\{)/);

        for (const jsonStr of jsonObjects) {
          try {
            const parsed = JSON.parse(jsonStr);

            // Backend sends objects with numeric keys representing byte arrays
            if (
              typeof parsed === "object" &&
              parsed !== null &&
              "0" in parsed
            ) {
              // Convert numeric keys to Uint8Array and decode
              const bytes = new Uint8Array(Object.values(parsed) as number[]);
              const actualText = decoder.decode(bytes);

              // Backend sends SSE format: "data: {...}\n\n"
              if (actualText.startsWith("data: ")) {
                try {
                  const sseJsonStr = actualText.slice(6).trim(); // Remove "data: " prefix
                  const dataObj = JSON.parse(sseJsonStr);

                  // Extract delta from nested structure: {"content": {"delta": "..."}}
                  if (
                    dataObj.content &&
                    dataObj.content.delta &&
                    typeof dataObj.content.delta === "string"
                  ) {
                    accumulatedText += dataObj.content.delta;

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
                  // Ignore parse errors for non-delta chunks
                  console.warn("Failed to parse SSE data:", actualText);
                }
              }
            }
          } catch (e) {
            // Ignore parse errors - may be incomplete JSON at chunk boundary
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

      {/* Main Chat Area */}
      <div className="flex flex-1 overflow-hidden">
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
    </div>
  );
}