import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocumentationStore } from "@/lib/stores/useDocumentationStore";

interface Page {
  id: string;
  documentation_id: string;
  title: string;
  slug: string;
  content: string;
  order_index: number;
  parent_page_id: string | null;
  referenced_files: string[] | null;
  referenced_symbols: string[] | null;
  metadata: JSON | null;
  created_at: string;
  updated_at: string;
  version: number;
}

interface MainContentProps {
  selectedFile: Page | null;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export function MainContent({
  selectedFile,
  scrollContainerRef: externalRef,
}: MainContentProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = externalRef || internalRef;

  const selectedVersion = useDocumentationStore(
    (state) => state.selectedVersion,
  );
  const availableVersions = useDocumentationStore(
    (state) => state.availableVersions,
  );
  const selectVersion = useDocumentationStore((state) => state.selectVersion);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [selectedFile, scrollContainerRef]);

  const handleVersionChange = (version: string) => {
    selectVersion(parseInt(version, 10));
  };

  if (!selectedFile) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="border-b border-grey-800 px-6 py-3"></div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-grey-500 text-sm">
            Select a file to view documentation
          </p>
        </div>
      </div>
    );
  }

  const generateHeadingId = (text: string) => {
    return text.toLowerCase().replace(/[^\w]+/g, "-");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-grey-800 px-6 py-3 flex items-center justify-between">
        <div className="flex flex-row gap-5 items-center">
          <h1 className="text-xl font-bold">{selectedFile.title}</h1>
          <Select
            value={selectedVersion?.toString()}
            onValueChange={handleVersionChange}
          >
            <SelectTrigger className="w-17 h-8 text-sm font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableVersions.map((v) => (
                <SelectItem key={v.version} value={v.version.toString()}>
                  v{v.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button className="text-xs h-8 px-4 border border-grey-700 rounded hover:bg-grey-800 transition-colors flex items-center gap-2">
          <span>Relevant source files</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-grey-950"
      >
        <div className="max-w-full lg:max-w-4xl mx-4 md:mx-8 lg:ml-24 lg:mr-8 py-8 pb-135">
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                h1: ({ node, children, ...props }) => {
                  const text = typeof children === "string" ? children : "";
                  const id = generateHeadingId(text);
                  return (
                    <h1
                      id={id}
                      className="text-3xl font-bold text-gray-800 dark:text-white mb-6 mt-2 scroll-mt-20"
                      {...props}
                    >
                      {children}
                    </h1>
                  );
                },
                h2: ({ node, children, ...props }) => {
                  const text = typeof children === "string" ? children : "";
                  const id = generateHeadingId(text);
                  return (
                    <h2
                      id={id}
                      className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 mt-10 scroll-mt-20"
                      {...props}
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ node, children, ...props }) => {
                  const text = typeof children === "string" ? children : "";
                  const id = generateHeadingId(text);
                  return (
                    <h3
                      id={id}
                      className="text-xl font-semibold text-gray-800 dark:text-white mb-3 mt-8 scroll-mt-20"
                      {...props}
                    >
                      {children}
                    </h3>
                  );
                },
                h4: ({ node, children, ...props }) => {
                  const text = typeof children === "string" ? children : "";
                  const id = generateHeadingId(text);
                  return (
                    <h4
                      id={id}
                      className="text-lg font-semibold text-gray-800 dark:text-white mb-3 mt-6 scroll-mt-20"
                      {...props}
                    >
                      {children}
                    </h4>
                  );
                },
                h5: ({ node, children, ...props }) => {
                  const text = typeof children === "string" ? children : "";
                  const id = generateHeadingId(text);
                  return (
                    <h5
                      id={id}
                      className="text-base font-semibold text-gray-800 dark:text-white mb-2 mt-4 scroll-mt-20"
                      {...props}
                    >
                      {children}
                    </h5>
                  );
                },
                h6: ({ node, children, ...props }) => {
                  const text = typeof children === "string" ? children : "";
                  const id = generateHeadingId(text);
                  return (
                    <h6
                      id={id}
                      className="text-sm font-semibold text-gray-800 dark:text-white mb-2 mt-4 scroll-mt-20"
                      {...props}
                    >
                      {children}
                    </h6>
                  );
                },
                p: ({ node, ...props }) => (
                  <p
                    className="text-grey-300 leading-relaxed mb-4"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="list-disc list-inside text-grey-300 mb-4 space-y-2"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal list-inside text-grey-300 mb-4 space-y-2"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-grey-300" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-teal-400 hover:text-teal-300 hover:underline"
                    {...props}
                  />
                ),
                code: ({ node, className, children, ...props }) => {
                  const isInline = !className?.includes("language-");
                  return isInline ? (
                    <code
                      className="bg-grey-800 text-teal-400 px-1.5 py-0.5 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className="block bg-grey-800 text-grey-300 p-4 rounded border border-grey-700 overflow-x-auto"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-teal-500 pl-4 italic text-grey-400 my-4"
                    {...props}
                  />
                ),
              }}
            >
              {selectedFile.content}
            </ReactMarkdown>
          </div>

          {selectedFile.referenced_files &&
            selectedFile.referenced_files.length > 0 && (
              <div className="mt-6 pt-4 border-t border-grey-800">
                <h3 className="text-xs font-semibold text-grey-400 mb-2">
                  Referenced Files
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedFile.referenced_files.map((file, i) => (
                    <button
                      key={i}
                      className="bg-grey-800 hover:bg-grey-700 rounded px-2 py-1 text-xs text-teal-400 transition-colors font-mono"
                    >
                      {file}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
