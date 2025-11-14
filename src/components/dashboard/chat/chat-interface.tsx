"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import AnswerPanel from "./answer-panel";
import ModelSelector, { AVAILABLE_MODELS, LLMModel } from "./model-selector";

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

    setTimeout(() => {
      //simulate LLM response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: `Hello! I'm an AI assistant. I can help you understand and navigate the codebase.

Since you're asking about this repository, I can help you with questions about:

- Architecture and design patterns
- Code organization and structure
- Specific implementations and how they work
- Relationships between different components

Feel free to ask me specific questions about how the code works, where certain functionality is implemented, or how different components interact with each other!`,
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // Update the conversation turn with code snippets
      setConversationTurns((prevTurns) =>
        prevTurns.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                loading: false,
                codeSnippets: [
                  {
                    file: `example-${turnId}.ts`,
                    code: `"use client";

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

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: inputValue,
          sender: "user",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      setInputValue("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <MessageList messages={messages} />
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
      />
    </div>
  );
}`,
                  },
                ],
              }
            : turn,
        ),
      );
      setResponseLoading(false);
      setChatInputDisabled(false);
    }, 5000);
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
    <div className="flex flex-col h-[calc(100vh-64px)] bg-grey-950 text-grey-300">
      {/* Header with Model Selector */}
      <div className="border-b border-grey-800 px-4 py-3 flex items-center justify-between bg-grey-900">
        <h2 className="text-sm font-semibold text-grey-300">Chat</h2>
        <ModelSelector 
          selectedModel={selectedModel}
          onSelectModel={handleModelChange}
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