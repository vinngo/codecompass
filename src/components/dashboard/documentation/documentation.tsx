"use client";

import { useState, useEffect } from "react";
import { FileTreeSidebar } from './file-tree';
import { MainContent } from './main-content';
import { TableOfContentsSidebar } from './table-of-contents';
import { RefreshModal } from './refresh-modal';
import { Page, FileTreeNode, Heading } from './types';
import { buildFileTree, extractHeadings } from './utils';


export default function DocumentationViewer() {
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<Page | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastIndexed, setLastIndexed] = useState<string>('');
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showRefreshModal, setShowRefreshModal] = useState(false);

  const repoId = 'microsoft/vscode';

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
      const mockPages: Page[] = [
        {
          id: '1',
          documentation_id: 'doc-1',
          title: 'VS Code Architecture Overview',
          slug: 'vs-code-architecture-overview',
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
          referenced_files: ['src/vs/code/electron-main/main.ts', 'src/vs/workbench/workbench.ts'],
          referenced_symbols: null,
          metadata: null,
          created_at: '2025-10-19T00:00:00Z',
          updated_at: '2025-10-19T00:00:00Z',
        },
        {
          id: '2',
          documentation_id: 'doc-1',
          title: 'Application Startup and Process Architecture',
          slug: 'application-startup',
          content: `# Application Startup and Process Architecture\n\nDetailed information about how VS Code starts up and initializes its processes.`,
          order_index: 1,
          parent_page_id: '1',
          referenced_files: null,
          referenced_symbols: null,
          metadata: null,
          created_at: '2025-10-19T00:00:00Z',
          updated_at: '2025-10-19T00:00:00Z',
        },
        {
          id: '3',
          documentation_id: 'doc-1',
          title: 'Build System and Package Management',
          slug: 'build-system',
          content: `# Build System and Package Management\n\nInformation about the build system.`,
          order_index: 2,
          parent_page_id: '1',
          referenced_files: null,
          referenced_symbols: null,
          metadata: null,
          created_at: '2025-10-19T00:00:00Z',
          updated_at: '2025-10-19T00:00:00Z',
        },
        {
          id: '4',
          documentation_id: 'doc-1',
          title: 'Extension System',
          slug: 'extension-system',
          content: `# Extension System\n\nHow extensions work in VS Code.`,
          order_index: 2,
          parent_page_id: null,
          referenced_files: null,
          referenced_symbols: null,
          metadata: null,
          created_at: '2025-10-19T00:00:00Z',
          updated_at: '2025-10-19T00:00:00Z',
        },
      ];

      const tree = buildFileTree(mockPages);
      setFileTree(tree);
      setLastIndexed('19 October 2025 (cc66fc)');
      
      setExpandedNodes(new Set(['1', '4']));
      setSelectedFile(mockPages[0]);
    } catch (error) {
      console.error('Error fetching documentation:', error);
    } finally {
      setIsLoading(false);
    }
  };

// Function for API call ? 
 /*
const fetchDocumentation = async () => {
  try {
    setIsLoading(true);

    // Fetch from API
    const response = await fetch(`/api/documentation?repo_id=${repoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch documentation');
    }
    
    const data = await response.json();

    // Build the file tree from API data
    const tree = buildFileTree(data.pages);
    setFileTree(tree);
    setLastIndexed(data.last_indexed || '19 October 2025 (cc66fc)');
    
    // Auto-expand first level nodes
    setExpandedNodes(new Set(['1', '4']));
    
    // Select first page by default
    if (data.pages && data.pages.length > 0) {
      setSelectedFile(data.pages[0]);
    }
  } catch (error) {
    console.error('Error fetching documentation:', error);
    setError('Failed to load documentation');
  } finally {
    setIsLoading(false);
  }
};
*/

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-gray-400">Loading documentation...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      <FileTreeSidebar
        fileTree={fileTree}
        selectedFile={selectedFile}
        expandedNodes={expandedNodes}
        searchQuery={searchQuery}
        lastIndexed={lastIndexed}
        onSelectFile={setSelectedFile}
        onToggleExpanded={toggleExpanded}
        onSearchChange={setSearchQuery}
      />

      <MainContent selectedFile={selectedFile} />

      <TableOfContentsSidebar
        selectedFile={selectedFile}
        headings={headings}
        onRefreshClick={() => setShowRefreshModal(true)}
      />

      <RefreshModal
        isOpen={showRefreshModal}
        onClose={() => setShowRefreshModal(false)}
      />
    </div>
  );
}