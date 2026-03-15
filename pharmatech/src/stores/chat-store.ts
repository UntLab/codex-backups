"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string | null;
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (v: boolean) => void;
  toggleChat: () => void;
  setSessionId: (id: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Salam! 👋 Mən PharmaTech-in süni intellekt köməkçisiyəm. Sizə necə kömək edə bilərəm?\n\nMəsələn: \"Başım ağrıyır\" və ya \"Uşaq üçün vitamin\"",
      timestamp: Date.now(),
    },
  ],
  isOpen: false,
  isLoading: false,
  sessionId: null,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),

  setLoading: (isLoading) => set({ isLoading }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setSessionId: (sessionId) => set({ sessionId }),
  clearMessages: () =>
    set({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Salam! 👋 Mən PharmaTech-in süni intellekt köməkçisiyəm. Sizə necə kömək edə bilərəm?",
          timestamp: Date.now(),
        },
      ],
    }),
}));
