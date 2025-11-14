"use client";

import { useEffect, useState } from "react";

interface Video {
  url: string;
  pathname: string;
  downloadUrl: string;
}

export default function Demo() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch("/api/videos");
        const data = await response.json();

        if (data.videos && data.videos.length > 0) {
          // Use the first video from the list
          setVideoUrl(data.videos[0].url);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, []);

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 pb-16">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6 text-teal-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <span className="text-teal-400 font-semibold">AI-Powered Solution</span>
      </div>
      <h2 className="text-4xl font-bold mb-4">
        CodeCompass will include an AI guide to any codebase
      </h2>
      <p className="text-gray-400 text-lg mb-16 max-w-8xl">
        CodeCompass aims to transforms how developers explore and understand
        code. The RAG-powered chatbot will provide instant answers, while
        automatic documentation generation will keep everything up-to-date.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Features list */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-teal-500 mt-1">✓</span>
            <span className="text-foreground">
              Instant answers to codebase questions
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-teal-500 mt-1">✓</span>
            <span className="text-foreground">
              Automatic documentation generation
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-teal-500 mt-1">✓</span>
            <span className="text-foreground">
              Visual component tree diagrams
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-teal-500 mt-1">✓</span>
            <span className="text-foreground">
              Multi-platform repository support
            </span>
          </div>
        </div>

        {/* Right side - Video demo */}
        <div className="relative rounded-lg overflow-hidden border border-border bg-card shadow-lg">
          {loading ? (
            <div className="w-full aspect-video flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Loading video...</p>
            </div>
          ) : videoUrl ? (
            <video
              className="w-full h-auto"
              controls
              preload="metadata"
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">No video available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
