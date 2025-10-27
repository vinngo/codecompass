"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function NavContext() {
  const [contextText, setContextText] = useState("");
  const lastSegment = usePathname().split("/").pop();

  useEffect(() => {
    if (lastSegment === "organizations") {
      setContextText("Organizations");
    } else if (lastSegment === "repositories") {
      setContextText("Repositories");
    } else if (lastSegment === "documentation") {
      setContextText("Documentation");
    } else if (lastSegment === "chat") {
      setContextText("Chat");
    } else if (lastSegment === "new") {
      setContextText("New Organization");
    } else {
      setContextText("New Repository");
    }
  }, [lastSegment]);

  return (
    <span className="font-semibold text-foreground text-sm">{contextText}</span>
  );
}
