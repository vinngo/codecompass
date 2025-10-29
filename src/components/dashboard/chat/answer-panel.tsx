"use client";

import AnimatedSkeleton from "./animated-skeleton";
import CodeSnippet from "./code-snippet";

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

interface AnswerPanelProps {
  conversationTurns: ConversationTurn[];
}

export default function AnswerPanel({ conversationTurns }: AnswerPanelProps) {
  return (
    <div className="flex-1 border-l border-grey-800 bg-grey-950 overflow-y-auto">
      <div className="px-6 py-4">
        {conversationTurns.length === 0 ? (
          <div className="text-center text-grey-500 mt-12">
            <p className="text-sm mt-2">
              Relevant code snippets will appear here, grouped by your questions
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {conversationTurns.map((turn) => (
              <div key={turn.id} className="space-y-3">
                {/* Question Header */}
                <div className="sticky top-0 bg-grey-950 py-2 border-b bg-background border-grey-800">
                  <p className="text-sm text-grey-400 font-medium">
                    {turn.userQuestion}
                  </p>
                  <p className="text-xs text-grey-600 mt-1">{turn.timestamp}</p>
                </div>

                {/* Code Snippets for this question */}
                <div className="space-y-4">
                  {turn.loading ? (
                    <AnimatedSkeleton />
                  ) : turn.codeSnippets.length > 0 ? (
                    turn.codeSnippets.map((snippet, index) => (
                      <CodeSnippet
                        key={`${turn.id}-${index}`}
                        file={snippet.file}
                        code={snippet.code}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-grey-600 italic">
                      No code snippets for this question
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
