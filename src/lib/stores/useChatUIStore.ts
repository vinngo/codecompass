import { create } from "zustand";
import { persist } from 'zustand/middleware';

interface LLMModel {
  id: string;
  name: string;
  provider: string;
}

interface ChatUIState {
  isExpanded: boolean;
  initialMessage: string | null;
  selectedModel: LLMModel | null;
  
  expand: (message?: string) => void;
  minimize: () => void;
  setSelectedModel: (model: LLMModel) => void;
}

export const useChatUIStore = create<ChatUIState>()(
  persist(
    (set) => ({
      isExpanded: false,
      initialMessage: null,
      selectedModel: null,

      expand: (message) => set({ 
        isExpanded: true, 
        initialMessage: message || null 
      }),
      
      minimize: () => set({ 
        isExpanded: false, 
        initialMessage: null 
      }),

      setSelectedModel: (model) => set({ selectedModel: model }),
    }),
    {
      name: 'chat-ui-storage',
      partialize: (state) => ({ 
        selectedModel: state.selectedModel 
      }),
    }
  )
);