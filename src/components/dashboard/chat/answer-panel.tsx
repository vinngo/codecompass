"use client";

import AnimatedSkeleton from "./animated-skeleton";
import CodeSnippet from "./code-snippet";
interface AnswerPanelProps {
  loading: boolean;
  codeSnippets: CodeSnippet[];
}

interface CodeSnippet {
  file: string;
  code: string;
}

export default function AnswerPanel({
  codeSnippets,
  loading,
}: AnswerPanelProps) {
  return (
    <div className="flex-1 border-l border-grey-800 bg-grey-950 overflow-y-auto">
      <div className="px-6">
        {loading ? (
          <AnimatedSkeleton />
        ) : codeSnippets.length === 0 ? (
          <div className="text-center text-grey-500 mt-12">
            <p className="text-sm mt-2">
              Relevant code snippets will appear along with your question
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {codeSnippets.map((snippet, index) => (
              <CodeSnippet
                key={index}
                file={snippet.file}
                code={snippet.code}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
