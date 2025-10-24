"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const chapters = [
    { title: "Introduction" },
    { title: "Setup Guide" },
    { title: "File Structure" },
    { title: "API Reference" },
    { title: "Examples" },
  ];

  return (
    <div
      className={`relative h-screen transition-all duration-300 bg-muted border-r border-border
        ${isOpen ? "w-64" : "w-16"} flex flex-col`}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-3 -right-3 bg-background border rounded-full shadow-sm"
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </Button>

      {/* Sidebar content */}
      <div className="flex flex-col mt-12 space-y-2 p-3">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-primary" size={18} />
          {isOpen && (
            <span className="font-semibold text-foreground">Documentation</span>
          )}
        </div>

        {chapters.map((ch, idx) => (
          <Button
            key={idx}
            variant="ghost"
            className={`w-full justify-start ${!isOpen && "px-2"}`}
          >
            {isOpen ? ch.title : ch.title[0]}
          </Button>
        ))}

        <div className="mt-6 border-t border-border pt-3">
          <Button variant="outline" className="w-full justify-start">
            <MessageCircle size={18} className="mr-2" />
            {isOpen && "Switch to Chat"}
          </Button>
        </div>
      </div>
    </div>
  );
}
