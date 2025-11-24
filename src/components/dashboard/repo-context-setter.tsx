"use client";

import { useEffect } from "react";
import { useChatUIStore } from "@/lib/stores/useChatUIStore";

export function RepoContextSetter({ repoId }: { repoId: string }) {
  const setRepoId = useChatUIStore((state) => state.setRepoId);
  const reset = useChatUIStore((state) => state.reset);

  useEffect(() => {
    setRepoId(repoId);

    // Cleanup when component unmounts (user navigates away)
    return () => {
      reset();
    };
  }, [repoId, setRepoId, reset]);

  return null;
}
