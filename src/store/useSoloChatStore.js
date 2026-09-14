import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSoloChatStore = create(
  persist(
    (set, get) => ({
      myUserId: "",
      myUserName: "",
      myUserEmail: "",
      myUserPicture: "",

      onlineUsers: [],
      activePartnerId: null,
      soloConversations: {}, // { [partnerId]: { partnerId, partnerName, partnerEmail, partnerPicture, unreadCount, messages, lastUpdated } }
      partnerFeedbacks: {}, // { [partnerId]: string }

      isSoundEnabled: true,
      searchQuery: "",
      activeTab: "chats", // "chats" | "online"
      showMobileChat: false, // On mobile: true shows conversation, false shows sidebar

      setMyUser: ({ userId, userName, userEmail, userPicture }) =>
        set((state) => ({
          myUserId: userId || state.myUserId,
          myUserName: userName || state.myUserName,
          myUserEmail: userEmail || state.myUserEmail,
          myUserPicture: userPicture || state.myUserPicture,
        })),

      setOnlineUsers: (users) => set({ onlineUsers: users || [] }),

      setActivePartnerId: (partnerId) =>
        set((state) => {
          const convos = { ...state.soloConversations };
          if (partnerId && convos[partnerId]) {
            convos[partnerId] = {
              ...convos[partnerId],
              unreadCount: 0,
            };
          }
          return {
            activePartnerId: partnerId,
            soloConversations: convos,
            showMobileChat: true,
          };
        }),

      closeMobileChat: () => set({ showMobileChat: false }),

      setPartnerFeedback: (partnerId, feedback) =>
        set((state) => ({
          partnerFeedbacks: {
            ...state.partnerFeedbacks,
            [partnerId]: feedback || "",
          },
        })),

      startConversationWithUser: (user) => {
        if (!user || !user.userId) return;
        const targetId = user.userId;

        set((state) => {
          const convos = { ...state.soloConversations };
          if (!convos[targetId]) {
            convos[targetId] = {
              partnerId: targetId,
              partnerName: user.userName || user.name || "User",
              partnerEmail: user.userEmail || user.email || "",
              partnerPicture: user.userPicture || user.picture || "",
              unreadCount: 0,
              messages: [],
              lastUpdated: new Date().toISOString(),
            };
          } else {
            // Update partner info if available
            convos[targetId] = {
              ...convos[targetId],
              partnerName: user.userName || user.name || convos[targetId].partnerName,
              partnerEmail: user.userEmail || user.email || convos[targetId].partnerEmail,
              partnerPicture: user.userPicture || user.picture || convos[targetId].partnerPicture,
              unreadCount: 0,
            };
          }

          return {
            soloConversations: convos,
            activePartnerId: targetId,
            showMobileChat: true,
            searchQuery: "",
          };
        });
      },

      addSoloMessage: ({ partnerId, partnerInfo, message, isOwn }) => {
        if (!partnerId || !message) return;

        set((state) => {
          const convos = { ...state.soloConversations };
          const existing = convos[partnerId] || {
            partnerId,
            partnerName: partnerInfo?.name || "User",
            partnerEmail: partnerInfo?.email || "",
            partnerPicture: partnerInfo?.picture || "",
            unreadCount: 0,
            messages: [],
          };

          const isCurrentlyActive = state.activePartnerId === partnerId;
          const newUnreadCount =
            !isOwn && !isCurrentlyActive
              ? (existing.unreadCount || 0) + 1
              : 0;

          // Deduplicate message by id if already present
          const existingMessages = existing.messages || [];
          const exists = existingMessages.some((m) => m.id === message.id);
          const updatedMessages = exists ? existingMessages : [...existingMessages, message];

          convos[partnerId] = {
            ...existing,
            partnerName: partnerInfo?.name || existing.partnerName,
            partnerEmail: partnerInfo?.email || existing.partnerEmail,
            partnerPicture: partnerInfo?.picture || existing.partnerPicture,
            unreadCount: newUnreadCount,
            messages: updatedMessages,
            lastUpdated: message.dateTime || new Date().toISOString(),
          };

          return { soloConversations: convos };
        });
      },

      clearConversation: (partnerId) =>
        set((state) => {
          if (!partnerId || !state.soloConversations[partnerId]) return state;
          return {
            soloConversations: {
              ...state.soloConversations,
              [partnerId]: {
                ...state.soloConversations[partnerId],
                messages: [],
                unreadCount: 0,
              },
            },
          };
        }),

      deleteConversation: (partnerId) =>
        set((state) => {
          if (!partnerId) return state;
          const convos = { ...state.soloConversations };
          delete convos[partnerId];
          return {
            soloConversations: convos,
            activePartnerId:
              state.activePartnerId === partnerId ? null : state.activePartnerId,
            showMobileChat: state.activePartnerId === partnerId ? false : state.showMobileChat,
          };
        }),

      toggleSound: () =>
        set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "solo-chat-storage",
      partialize: (state) => ({
        soloConversations: state.soloConversations,
        isSoundEnabled: state.isSoundEnabled,
        myUserId: state.myUserId,
      }),
    }
  )
);
