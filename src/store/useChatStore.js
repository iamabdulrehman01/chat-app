import { create } from "zustand";
import { persist } from "zustand/middleware";

// Exactly 1 hour in milliseconds (60 minutes * 60 seconds * 1000 ms)
export const MESSAGE_TTL_MS = 60 * 60 * 1000;

// Helper to check if a message has exceeded the 1-hour expiration
export const isMessageExpired = (msg, now = Date.now()) => {
  if (!msg || !msg.dateTime) return true;
  const msgTime = new Date(msg.dateTime).getTime();
  if (isNaN(msgTime)) return true;
  return now - msgTime >= MESSAGE_TTL_MS;
};

export const useChatStore = create(
  persist(
    (set) => ({
      userName: "anonymous",
      messages: [],
      clientsTotal: 1,
      feedbackText: "",
      isSoundEnabled: true,
      isConnected: false,

      setUserName: (name) => set({ userName: name }),

      addMessage: (message) => {
        const now = Date.now();
        set((state) => ({
          messages: [
            ...state.messages.filter((m) => !isMessageExpired(m, now)),
            message,
          ],
        }));
      },

      pruneExpiredMessages: () => {
        const now = Date.now();
        set((state) => {
          const validMessages = state.messages.filter(
            (m) => !isMessageExpired(m, now)
          );
          if (validMessages.length !== state.messages.length) {
            return { messages: validMessages };
          }
          return state;
        });
      },

      setClientsTotal: (total) => set({ clientsTotal: total }),
      setFeedbackText: (feedback) => set({ feedbackText: feedback }),
      toggleSound: () =>
        set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
      clearChat: () => set({ messages: [] }),
      setIsConnected: (connected) => set({ isConnected: connected }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => {
        const now = Date.now();
        return {
          userName: state.userName,
          isSoundEnabled: state.isSoundEnabled,
          messages: state.messages.filter((m) => !isMessageExpired(m, now)),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state && typeof state.pruneExpiredMessages === "function") {
          state.pruneExpiredMessages();
        }
      },
    }
  )
);
