"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, List, FileText, Loader2 } from "lucide-react";
import { FileTreeSidebar } from "./file-tree";
import { MainContent } from "./main-content";
import { TableOfContentsSidebar } from "./table-of-contents";
import { Page, FileTreeNode, Heading } from "./types";
import { buildFileTree, extractHeadings } from "./utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Empty } from "@/components/ui/empty";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";
import { indexRepository, getDocPages } from "@/lib/services/repoService";
import { motion } from "framer-motion";

export default function DocumentationViewer({ repoId }: { repoId: string }) {
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<Page | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastIndexed, setLastIndexed] = useState<string>("");
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const mainContentScrollRef = useRef<HTMLDivElement>(null);
  const setHasDocumentation = useChatUIStore(
    (state) => state.setHasDocumentation,
  );

  /*This is a React anti-pattern. Replace with tanstack query later*/
  useEffect(() => {
    fetchDocumentation();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const extractedHeadings = extractHeadings(selectedFile.content);
      setHeadings(extractedHeadings);
    }
  }, [selectedFile]);

  const fetchDocumentation = async () => {
    try {
      setIsLoading(true);

      const result = await getDocPages(repoId);

      if (!result.success) {
        console.error("Error fetching documentation:", result.error);
        setFileTree([]);
        setHasDocumentation(false);
        setIsLoading(false);
        return;
      }

      // Map DocPage[] to Page[]
      const pages: Page[] = result.data.map((docPage) => {
        // Helper function to parse JSON fields to string arrays
        const parseToStringArray = (field: unknown): string[] | null => {
          if (!field) return null;
          if (Array.isArray(field)) return field;
          if (typeof field === "string") {
            try {
              const parsed = JSON.parse(field);
              return Array.isArray(parsed) ? parsed : null;
            } catch {
              return null;
            }
          }
          return null;
        };

        return {
          id: docPage.id,
          documentation_id: docPage.documentation_id,
          title: docPage.title ?? "Untitled",
          slug: docPage.slug ?? "",
          content: docPage.content ?? "",
          order_index: docPage.order_index ?? 0,
          parent_page_id: docPage.parent_page_id,
          referenced_files: parseToStringArray(docPage.referenced_files),
          referenced_symbols: parseToStringArray(docPage.referenced_symbols),
          metadata: docPage.metadata,
          created_at: docPage.created_at,
          updated_at: docPage.updated_at ?? docPage.created_at,
          version: 1, // Default version for now
        };
      });

      const tree = buildFileTree(pages);
      setFileTree(tree);

      // Set the first page as selected if available
      if (pages.length > 0) {
        setSelectedFile(pages[0]);
      }

      // Update chat UI store with documentation availability
      setHasDocumentation(pages.length > 0);
    } catch (error) {
      console.error("Error fetching documentation:", error);
      setHasDocumentation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleRefresh = () => {
    try {
      setError("");
      /*
        server action: call the backend to reindex the codebase and update status in postgres
      */

      setShowRefreshModal(false);
    } catch (e) {
      setError("could not refresh:" + e);
    }
  };

  const handleGenerate = async () => {
    try {
      setError("");
      setIsGenerating(true);

      const result = await indexRepository(repoId);

      if (!result.success) {
        setError(result.error);
        setIsGenerating(false);
        return;
      }

      setShowGenerateModal(false);
      setIsGenerating(false);
      // Optionally refetch documentation after indexing starts
      await fetchDocumentation();
    } catch (e) {
      setError("Could not generate documentation: " + e);
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-gray-400">Loading documentation...</div>
      </div>
    );
  }

  if (fileTree.length === 0) {
    return (
      <>
        <div className="flex h-full items-center justify-center bg-background">
          <Empty
            title="No documentation available"
            description="Index your codebase to generate documentation and enable AI insights."
            icon={<FileText className="h-8 w-8" />}
          >
            <Button onClick={() => setShowGenerateModal(true)}>
              Index Codebase
            </Button>
          </Empty>
        </div>

        <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Index Codebase</DialogTitle>
              <DialogDescription>
                This will index your codebase. This process may take a while
                depending on the size of your repository.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="w-full p-3 bg-destructive/10 text-destructive text-sm rounded-md text-center">
                {error}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowGenerateModal(false)}
                className="w-full sm:w-auto"
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2"
                    >
                      <Loader2 className="h-4 w-4" />
                    </motion.div>
                    Indexing...
                  </div>
                ) : (
                  "Index"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="flex bg-background h-full">
      {/* Mobile toggle buttons */}
      <div className="fixed bottom-20 left-4 z-30 flex flex-col gap-2 lg:hidden">
        <Button
          size="icon"
          variant="default"
          onClick={() => setIsFileTreeOpen(true)}
          className="shadow-lg"
          aria-label="Open file tree"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-2 xl:hidden">
        <Button
          size="icon"
          variant="default"
          onClick={() => setIsTocOpen(true)}
          className="shadow-lg"
          aria-label="Open table of contents"
        >
          <List className="h-5 w-5" />
        </Button>
      </div>

      <FileTreeSidebar
        fileTree={fileTree}
        selectedFile={selectedFile}
        expandedNodes={expandedNodes}
        searchQuery={searchQuery}
        lastIndexed={lastIndexed}
        onSelectFile={setSelectedFile}
        onToggleExpanded={toggleExpanded}
        onSearchChange={setSearchQuery}
        isOpen={isFileTreeOpen}
        onClose={() => setIsFileTreeOpen(false)}
      />

      <MainContent
        selectedFile={selectedFile}
        scrollContainerRef={mainContentScrollRef}
      />

      <TableOfContentsSidebar
        selectedFile={selectedFile}
        headings={headings}
        onRefreshClick={() => setShowRefreshModal(true)}
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        scrollContainerRef={mainContentScrollRef}
      />

      <Dialog open={showRefreshModal} onOpenChange={setShowRefreshModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refresh this wiki</DialogTitle>
            <DialogDescription>
              This action will reindex your codebase. Documentation and chat
              will be unavailable for a short time.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="w-full p-3 bg-destructive/10 text-destructive text-sm rounded-md text-center">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button className="w-full sm:w-auto" onClick={handleRefresh}>
              Refresh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
