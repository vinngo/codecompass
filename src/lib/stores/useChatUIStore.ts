import { create } from "zustand";
import { persist } from 'zustand/middleware';

interface LLMModel {
  id: string;
  name: string;
  provider: string;
}

import { Conversation } from "@/app/types/supabase";

interface ChatUIState {
  isExpanded: boolean;
  initialMessage: string;
  conversation: Conversation | null;
  expand: (message: string) => void;
  minimize: () => void;
  setSelectedModel: (model: LLMModel) => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
  isExpanded: false,
  initialMessage: "",
  conversation: null,
  expand: (message: string) =>
    set({ isExpanded: true, initialMessage: message }),
  minimize: () => set({ isExpanded: false, initialMessage: "" }),
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));
