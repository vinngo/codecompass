import { RefreshCw } from "lucide-react";

interface Page {
  id: string;
  title: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsSidebarProps {
  selectedFile: Page | null;
  headings: Heading[];
  onRefreshClick: () => void;
}

export function TableOfContentsSidebar({
  selectedFile,
  headings,
  onRefreshClick,
}: TableOfContentsSidebarProps) {
  return (
    <div className="w-64 border-l border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <button 
          onClick={onRefreshClick}
          className="text-xs text-gray-400 hover:text-teal-400 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh this wiki
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 mb-3">On this page</h3>
        {selectedFile && (
          <div className="space-y-1">
            {headings.map((heading, i) => (
              <a
                key={i}
                href={`#${heading.id}`}
                className={`block text-xs py-1 transition-colors ${
                  i === 0 ? 'text-teal-400' : 'text-gray-400 hover:text-gray-300'
                }`}
                style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
              >
                {heading.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}