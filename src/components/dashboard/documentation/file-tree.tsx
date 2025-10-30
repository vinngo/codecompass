import { JSX } from "react";
import { Search, ChevronRight, ChevronDown } from "lucide-react";

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
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

interface FileTreeNode extends Page {
  children: FileTreeNode[];
}

interface FileTreeSidebarProps {
  fileTree: FileTreeNode[];
  selectedFile: Page | null;
  expandedNodes: Set<string>;
  searchQuery: string;
  lastIndexed: string;
  onSelectFile: (file: Page) => void;
  onToggleExpanded: (nodeId: string) => void;
  onSearchChange: (query: string) => void;
}

export function FileTreeSidebar({
  fileTree,
  selectedFile,
  expandedNodes,
  searchQuery,
  lastIndexed,
  onSelectFile,
  onToggleExpanded,
  onSearchChange,
}: FileTreeSidebarProps) {
  const filterNodes = (nodes: FileTreeNode[], query: string): FileTreeNode[] => {
    if (!query) return nodes;
    
    const lowerQuery = query.toLowerCase();
    const filtered: FileTreeNode[] = [];
    
    nodes.forEach(node => {
      const matchesSearch = node.title.toLowerCase().includes(lowerQuery);
      const filteredChildren = filterNodes(node.children, query);
      
      if (matchesSearch || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren
        });
      }
    });
    
    return filtered;
  };

  const filteredTree = filterNodes(fileTree, searchQuery);

  const renderFileTree = (nodes: FileTreeNode[], level: number = 0): JSX.Element[] => {
    return nodes.map(node => {
      const hasChildren = node.children.length > 0;
      const isExpanded = searchQuery ? true : expandedNodes.has(node.id);
      const isSelected = selectedFile?.id === node.id;

      return (
        <div key={node.id}>
          <button
            onClick={() => {
              onSelectFile(node);
              if (hasChildren) {
                onToggleExpanded(node.id);
              }
            }}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm transition-colors rounded ${
              isSelected
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-900/50 hover:text-gray-300'
            }`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-3 h-3 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
              )
            ) : (
              <div className="w-3" />
            )}
            <span className="truncate text-xs">{node.title}</span>
          </button>
          {hasChildren && isExpanded && (
            <div>{renderFileTree(node.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-64 border-r border-gray-800 flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <div className="text-xs text-gray-500 mb-2">
          Last indexed: {lastIndexed}
        </div>
      </div>

      <div className="p-2 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full bg-gray-900 border border-gray-800 rounded pl-7 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredTree.length > 0 ? (
          renderFileTree(filteredTree)
        ) : (
          <div className="text-xs text-gray-500 p-2">No results found</div>
        )}
      </div>
    </div>
  );
}