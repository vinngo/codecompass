"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, List, FileText } from "lucide-react";
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

export default function DocumentationViewer() {
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

      // Mock data information from deepwiki vs code architecture

      /*
      const mockPages: Page[] = [
        {
          id: "1",
          documentation_id: "doc-1",
          title: "VS Code Architecture Overview",
          slug: "vs-code-architecture-overview",
          content: `# VS Code Architecture Overview

## Purpose and Scope

This document provides a high-level overview of VS Code architecture, focusing on the multi-process design, core systems, and how major components interact. It explains the separation between the main process, renderer process, extension host, and specialized processes, as well as the foundational services and dependency injection patterns used throughout the codebase.

For detailed information about specific subsystems:

- Application startup and initialization: see Application Startup and Process Architecture
- Build system details: see Build System and Package Management
- Native module compilation: see Native Module Compilation and Platform Support
- Extension architecture: see Extension System
- Workbench UI framework: see Workbench and UI Framework
- Monaco editor integration: see Monaco Editor Integration

## Multi-Process Architecture

VS Code runs as a multi-process Electron application with clear separation of concerns for security, stability, and extensibility.

### Process Responsibilities

Each process has specific responsibilities and boundaries to maintain security and stability.

### Core Workbench Architecture

The workbench is the main UI shell that hosts the editor and all UI components.

## Extension System Architecture

Extensions run in a separate process for security and stability.

### Extension API Surface

The extension API is designed to be stable and backwards compatible.

### Type Converters

Type converters handle the translation between internal and external types.

### Service Dependency Injection

Services are registered and injected throughout the codebase using dependency injection.

### Core Service Interfaces

Core services provide fundamental functionality to all parts of the application.

### Editor and Monaco Integration

The Monaco editor is integrated into the workbench as the core text editing component.

### Editor Configuration

Editor configuration is managed through a centralized service.

## Build System and Packaging

The build system handles TypeScript compilation, native modules, and packaging.

### Key Build Artifacts

Build artifacts include the packaged application and extension marketplace packages.

### Initialization Sequence

The initialization sequence defines the startup order of all components.`,
          order_index: 1,
          parent_page_id: null,
          referenced_files: [
            "src/vs/code/electron-main/main.ts",
            "src/vs/workbench/workbench.ts",
          ],
          referenced_symbols: null,
          metadata: null,
          created_at: "2025-10-19T00:00:00Z",
          updated_at: "2025-10-19T00:00:00Z",
          version: 1,
        },
        {
          id: "2",
          documentation_id: "doc-1",
          title: "Application Startup and Process Architecture",
          slug: "application-startup",
          content: `# Application Startup and Process Architecture\n\nDetailed information about how VS Code starts up and initializes its processes.`,
          order_index: 1,
          parent_page_id: "1",
          referenced_files: null,
          referenced_symbols: null,
          metadata: null,
          created_at: "2025-10-19T00:00:00Z",
          updated_at: "2025-10-19T00:00:00Z",
          version: 1,
        },
        {
          id: "3",
          documentation_id: "doc-1",
          title: "Build System and Package Management",
          slug: "build-system",
          content: `# Build System and Package Management\n\nInformation about the build system.`,
          order_index: 2,
          parent_page_id: "1",
          referenced_files: null,
          referenced_symbols: null,
          metadata: null,
          created_at: "2025-10-19T00:00:00Z",
          updated_at: "2025-10-19T00:00:00Z",
          version: 1,
        },
        {
          id: "4",
          documentation_id: "doc-1",
          title: "Extension System",
          slug: "extension-system",
          content: `# Extension System\n\nHow extensions work in VS Code.`,
          order_index: 2,
          parent_page_id: null,
          referenced_files: null,
          referenced_symbols: null,
          metadata: null,
          created_at: "2025-10-19T00:00:00Z",
          updated_at: "2025-10-19T00:00:00Z",
          version: 1,
        },
      ];
      */
      const mockPages: Page[] = [];

      const tree = buildFileTree(mockPages);
      setFileTree(tree);
      setLastIndexed("19 October 2025 (cc66fc)");

      setExpandedNodes(new Set(["1", "4"]));
      setSelectedFile(mockPages[0]);

      // Update chat UI store with documentation availability
      setHasDocumentation(mockPages.length > 0);
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

  const handleGenerate = () => {
    try {
      setError("");
      /*
        server action: call the backend to index the codebase for the first time
        and update status in postgres
      */

      setShowGenerateModal(false);
    } catch (e) {
      setError("could not generate documentation:" + e);
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
            description="Index your codebase to gain documentation and AI insights."
            icon={<FileText className="h-8 w-8" />}
          >
            <Button onClick={() => setShowGenerateModal(true)}>
              Generate Documentation
            </Button>
          </Empty>
        </div>

        <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Documentation</DialogTitle>
              <DialogDescription>
                This will index your codebase and generate comprehensive
                documentation. This process may take a while depending on the
                size of your repository.
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
              >
                Cancel
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleGenerate}>
                Generate
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
