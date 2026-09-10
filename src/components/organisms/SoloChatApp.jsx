"use client";

import React, { useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSocket } from "@/lib/socket";
import { useSoloChatStore } from "@/store/useSoloChatStore";
import { getUserUniqueId } from "@/lib/utils";
import { SoloChatSidebar } from "./SoloChatSidebar";
import { SoloChatWindow } from "./SoloChatWindow";
import { SoloChatEmptyState } from "./SoloChatEmptyState";

export function SoloChatApp({ sessionUser }) {
  const { user: clientUser } = useUser();
  const user = clientUser || sessionUser;

  const {
    myUserId,
    myUserName,
    setMyUser,
    setOnlineUsers,
    activePartnerId,
    showMobileChat,
    addSoloMessage,
    setPartnerFeedback,
    startConversationWithUser,
    isSoundEnabled,
  } = useSoloChatStore();

  const audioRef = useRef(null);

  // Sync user info into store
  useEffect(() => {
    if (user) {
      const uniqueId = getUserUniqueId(user);
      const storedName =
        typeof window !== "undefined"
          ? localStorage.getItem("chat_display_name")
          : "";
      const name =
        storedName ||
        user.name ||
        user.nickname ||
        user.email?.split("@")[0] ||
        "User";

      setMyUser({
        userId: uniqueId,
        userName: name,
        userEmail: user.email || "",
        userPicture: user.picture || "",
      });
    }
  }, [user, setMyUser]);

  // Socket connection & event registration
  useEffect(() => {
    // Preload audio tone
    audioRef.current = new Audio("/message-tone.mp3");

    const socket = getSocket();
    if (!socket) return;

    const uniqueId = getUserUniqueId(user);
    const storedName =
      typeof window !== "undefined"
        ? localStorage.getItem("chat_display_name")
        : "";
    const name =
      storedName ||
      user?.name ||
      user?.nickname ||
      user?.email?.split("@")[0] ||
      myUserName ||
      "User";

    const register = () => {
      if (uniqueId) {
        socket.emit("register-user", {
          userId: uniqueId,
          userName: name,
          userEmail: user?.email || "",
          userPicture: user?.picture || "",
        });
      }
    };

    if (socket.connected) {
      register();
    }
    socket.on("connect", register);

    // Online users update
    const onOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    // Incoming 1-on-1 message
    const onSoloMessage = (data) => {
      if (!data || !data.fromUserId) return;

      // Play audio notification chime
      if (isSoundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Autoplay policy may block if no prior user interaction
        });
      }

      addSoloMessage({
        partnerId: data.fromUserId,
        partnerInfo: {
          name: data.fromName || "User",
          email: "",
          picture: "",
        },
        message: {
          id: data.id || "msg-" + Date.now(),
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
          name: data.fromName || "User",
          message: data.message,
          dateTime: data.dateTime || new Date().toISOString(),
          isOwn: false,
        },
        isOwn: false,
      });
    };

    // Message sent sync from other tabs/devices
    const onSoloMessageSent = (data) => {
      if (!data || !data.toUserId) return;
      addSoloMessage({
        partnerId: data.toUserId,
        partnerInfo: {
          name: data.toName || "User",
        },
        message: {
          id: data.id || "msg-" + Date.now(),
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
          name: data.fromName || "You",
          message: data.message,
          dateTime: data.dateTime || new Date().toISOString(),
          isOwn: true,
        },
        isOwn: true,
      });
    };

    // Partner typing feedback
    const onSoloFeedback = (data) => {
      if (!data || !data.fromUserId) return;
      setPartnerFeedback(data.fromUserId, data.feedback || "");
    };

    socket.on("online-users", onOnlineUsers);
    socket.on("solo-message", onSoloMessage);
    socket.on("solo-message-sent", onSoloMessageSent);
    socket.on("solo-feedback", onSoloFeedback);

    // Query online users initially
    socket.emit("get-online-users");

    return () => {
      socket.off("connect", register);
      socket.off("online-users", onOnlineUsers);
      socket.off("solo-message", onSoloMessage);
      socket.off("solo-message-sent", onSoloMessageSent);
      socket.off("solo-feedback", onSoloFeedback);
    };
  }, [
    user,
    myUserName,
    setOnlineUsers,
    addSoloMessage,
    setPartnerFeedback,
    isSoundEnabled,
  ]);

  const currentUserId = myUserId || getUserUniqueId(user);
  const currentUserName = myUserName || user?.name || "User";

  return (
    <div className="w-full h-full flex-1 bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-chat border-0 sm:border sm:border-slate-200/80 flex overflow-hidden relative transition-all">
      {/* Sidebar: always visible on desktop; on mobile visible if not in an active chat view */}
      <div
        className={`h-full ${
          showMobileChat && activePartnerId ? "hidden sm:flex" : "flex w-full sm:w-auto"
        }`}
      >
        <SoloChatSidebar
          myUserId={currentUserId}
          onSelectUser={(u) => startConversationWithUser(u)}
        />
      </div>

      {/* Main Conversation Window / Empty State */}
      <div
        className={`h-full flex-1 min-w-0 ${
          !showMobileChat && !activePartnerId ? "hidden sm:flex" : "flex"
        }`}
      >
        {activePartnerId ? (
          <SoloChatWindow
            myUserId={currentUserId}
            myUserName={currentUserName}
          />
        ) : (
          <SoloChatEmptyState
            myUserId={currentUserId}
            myUserName={currentUserName}
            onSelectUser={(u) => startConversationWithUser(u)}
          />
        )}
      </div>
    </div>
  );
}

export default SoloChatApp;
