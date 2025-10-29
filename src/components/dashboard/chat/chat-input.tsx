import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-grey-800 bg-grey-900">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a follow-up question"
            rows={2}
            disabled={disabled}
            className="w-full bg-grey-800 text-grey-100 px-4 py-3 pr-12 rounded-lg border border-grey-700 focus:outline-none
                    focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:shadow-[0_0_15px_rgba(20,184,166,0.3)]
                    placeholder-grey-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed
                    transition-shadow duration-200"
          />
          <button
            onClick={onSend}
            className="absolute bottom-3 right-3 p-2 text-teal-500 hover:text-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!value.trim() || disabled}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
