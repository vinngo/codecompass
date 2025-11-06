import { create } from "zustand";

interface ChatUIState {
  isExpanded: boolean;
  initialMessage: string;
  expand: (message: string) => void;
  minimize: () => void;
  toggle: () => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
  isExpanded: false,
  initialMessage: "",
  expand: (message: string) =>
    set({ isExpanded: true, initialMessage: message }),
  minimize: () => set({ isExpanded: false, initialMessage: "" }),
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));
