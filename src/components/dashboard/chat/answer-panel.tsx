import React from "react";

interface Answer {
  id: number;
  title: string;
  content: string;
  source?: string;
}

interface AnswerPanelProps {
  answers: Answer[];
}

export default function AnswerPanel({ answers }: AnswerPanelProps) {
  return (
    <div className="flex-1 border-l border-grey-800 bg-grey-950 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-grey-100 mb-6">Answers</h2>

        {answers.length === 0 ? (
          <div className="text-center text-grey-500 mt-12">
            <p className="text-sm mt-2">
              Relevant code snippets will appear along with your question
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className="bg-grey-900 rounded-lg border border-grey-800 p-4 hover:border-grey-700 transition-colors"
              >
                <h3 className="text-base font-medium text-grey-100 mb-2">
                  {answer.title}
                </h3>
                <p className="text-sm text-grey-400 leading-relaxed mb-3">
                  {answer.content}
                </p>
                {answer.source && (
                  <div className="text-xs text-grey-600">
                    Source: {answer.source}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
