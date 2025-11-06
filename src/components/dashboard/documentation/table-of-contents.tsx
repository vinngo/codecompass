import { RefreshCw, ArrowUp, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  isOpen?: boolean;
  onClose?: () => void;
}

export function TableOfContentsSidebar({
  selectedFile,
  headings,
  onRefreshClick,
  isOpen = false,
  onClose,
}: TableOfContentsSidebarProps) {
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (!selectedFile || headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map((heading) => {
          const element = document.getElementById(heading.id);
          return { id: heading.id, element };
        })
        .filter((item) => item.element) as {
        id: string;
        element: HTMLElement;
      }[];

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const { id, element } = headingElements[i];
        if (element.offsetTop <= scrollPosition) {
          setActiveHeading(id);
          break;
        }
      }

      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      setShowBackToTop(scrollPercentage > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedFile, headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        w-64 border-l border-gray-800 flex flex-col bg-background
        xl:fixed xl:right-0 xl:top-0 xl:h-screen
        ${isOpen ? "fixed right-0 top-0 h-screen z-50" : "hidden xl:flex"}
      `}
      >
        {/* Mobile close button */}
        {onClose && (
          <div className="xl:hidden p-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
            <span className="text-sm font-semibold">Table of Contents</span>
            <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header section */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onRefreshClick}
            className="text-xs text-gray-400 hover:text-teal-400 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh this wiki
          </button>
        </div>

        {/* Scrollable table of contents section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-400 mb-3">
              On this page
            </h3>
            {selectedFile && (
              <div className="space-y-1">
                {headings.map((heading, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      scrollToHeading(heading.id);
                      // Close mobile drawer after click
                      if (onClose) onClose();
                    }}
                    className={`block text-xs py-1 transition-colors text-left w-full ${
                      activeHeading === heading.id
                        ? "text-teal-400 font-medium"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <div className="absolute bottom-4 right-4 flex-shrink-0">
            <button
              onClick={scrollToTop}
              className="w-8 h-8 bg-gray-800 hover:bg-teal-600 border border-gray-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
