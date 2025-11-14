import { create } from "zustand";
import { Conversation } from "@/app/types/supabase";

interface LLMModel {
  id: string;
  name: string;
  provider: string;
}

interface ChatUIState {
  isExpanded: boolean;
  initialMessage: string;
  selectedModel: LLMModel;
  conversation: Conversation | null;
  expand: (message: string) => void;
  minimize: () => void;
  setSelectedModel: (model: LLMModel) => void;
  toggle: () => void;
}

const DEFAULT_MODEL: LLMModel = {
  id: "claude-4.5-sonnet",
  name: "Claude 4.5 Sonnet",
  provider: "Anthropic",
};

export const useChatUIStore = create<ChatUIState>((set) => ({
  isExpanded: false,
  initialMessage: "",
  selectedModel: DEFAULT_MODEL,
  conversation: null,
  expand: (message: string) =>
    set({ isExpanded: true, initialMessage: message }),
  minimize: () => set({ isExpanded: false, initialMessage: "" }),
  setSelectedModel: (model: LLMModel) => set({ selectedModel: model }),
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));
