"use client";

//@ts-expect-error react-syntax highligher SHOULD be installed
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

//@ts-expect-error react-syntax highligher SHOULD be installed
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeSnippet({
  file,
  code,
}: {
  file: string;
  code: string;
}) {
  return (
    <div className="bg-elevated rounded-sm">
      <div className="flex flex-row">
        <div className="font-sans text-xs pl-2 pt-1">{file}</div>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={vscDarkPlus}
        showLineNumbers={true}
        customStyle={{
          background: "#1e1e1e",
          padding: "1rem",

          fontSize: "11px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
