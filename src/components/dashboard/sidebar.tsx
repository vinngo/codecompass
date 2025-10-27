"use client";

import { useState, createContext, useContext } from "react";
import { motion } from "motion/react";

// Context to share sidebar state with SidebarItems
const SidebarContext = createContext<{ isExpanded: boolean }>({
  isExpanded: false,
});

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SidebarContext.Provider value={{ isExpanded: isHovered }}>
      <motion.aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 280 : 60 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="h-screen bg-background border-r border-border flex flex-col overflow-hidden"
      >
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col gap-1 mt-4 w-full px-2">{children}</div>
        </div>
      </motion.aside>
    </SidebarContext.Provider>
  );
}

// Hook to access sidebar state
export function useSidebar() {
  return useContext(SidebarContext);
}

// Sidebar item that shows icon when collapsed, icon + label when expanded
export function SidebarItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const { isExpanded } = useSidebar();

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors w-full"
    >
      <div className="shrink-0 w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      {isExpanded && (
        <span className="text-sm text-foreground truncate whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
}
