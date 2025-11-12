"use client";

import { Sparkles } from "lucide-react";

interface ChatEmptyStateProps {
  onSendMessage: (message: string) => void;
}

export default function ChatEmptyState({ onSendMessage }: ChatEmptyStateProps) {
  const time = new Date().getHours();

  const suggestions = [
    "Explain this codebase structure",
    "How does authentication work?",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
      {/* Greeting */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-normal text-grey-100 mb-2">
          <Sparkles className="inline-block h-8 w-8 mr-2 text-teal-500" />
          {time < 12
            ? "Good Morning"
            : time < 17
              ? "Good Afternoon"
              : "Good Evening"}
        </h1>
        <p className="text-grey-400">Ask me anything about this codebase</p>
      </div>

      {/* Suggested Prompts */}
      <div className="w-full max-w-2xl">
        <p className="text-sm text-grey-400 mb-3">Suggested prompts:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 bg-grey-800 border border-grey-700 rounded-lg
                       text-left text-sm text-grey-200 hover:bg-grey-750
                       hover:border-teal-500/50 transition-all duration-200
                       hover:shadow-[0_0_10px_rgba(20,184,166,0.2)]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
