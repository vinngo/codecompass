import { create } from "zustand";

type Message = {
  id: string;
  conversation_id: string;
  content: string;
  created_at: string;
};

type Conversation = {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
};

type ChatState = {
  // Messages
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  // Conversations
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  clearConversations: () => void;

  // Currently selected conversation
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  // ----- MESSAGES -----
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),

  // ----- CONVERSATIONS -----
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((state) => ({ conversations: [...state.conversations, conversation] })),
  clearConversations: () => set({ conversations: [] }),

  // ----- ACTIVE CONVERSATION -----
  activeConversationId: null,
  setActiveConversationId: (id) => set({ activeConversationId: id }),
}));
