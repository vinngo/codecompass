"use client";

import React, { useState } from "react";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import AnswerPanel from "./answer-panel";
import { setTimeout } from "timers";

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
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  const [codeSnippetsLoading, setCodeSnippetsLoading] =
    useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  // replace with backend data later

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
      setCodeSnippetsLoading(true);

      setTimeout(() => {
        setCodeSnippetsLoading(false);
        setCodeSnippets([
          ...codeSnippets,
          {
            file: `file${codeSnippets.length + 1}.ts`,
            code: `"use client";

            import React, { useState } from "react";
            import MessageList from "./message-list";
            import ChatInput from "./chat-input";
            import AnswerPanel from "./answer-panel";
            import { setTimeout } from "timers";

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
              const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
              const [codeSnippetsLoading, setCodeSnippetsLoading] =
                useState<boolean>(false);
              const [inputValue, setInputValue] = useState("");
              // replace with backend data later

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
                  setCodeSnippetsLoading(true);

                  setTimeout(() => {
                    setCodeSnippetsLoading(false);
                    setCodeSnippets([
                      ...codeSnippets,
                      {
                        code: "console.log()",
                      },
                    ]);
                  }, 5000);

                  setInputValue("");
                }
              };

              return (
                <div className="flex h-[calc(100vh-64px)] bg-grey-950 text-grey-300">
                  {/* Chat Column */}
                  <div className="flex flex-col w-1/2 border-r border-grey-800">
                    <MessageList messages={messages} />
                    <ChatInput
                      value={inputValue}
                      onChange={setInputValue}
                      onSend={handleSend}
                    />
                  </div>

                  {/* Answers Column */}
                  <AnswerPanel loading={codeSnippetsLoading} codeSnippets={codeSnippets} />
                </div>
              );
            }
`,
          },
        ]);
      }, 5000);

      setInputValue("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-grey-950 text-grey-300">
      {/* Chat Column */}
      <div className="flex flex-col w-1/2 border-r border-grey-800">
        <MessageList messages={messages} />
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
        />
      </div>

      {/* Answers Column */}
      <AnswerPanel loading={codeSnippetsLoading} codeSnippets={codeSnippets} />
    </div>
  );
}
