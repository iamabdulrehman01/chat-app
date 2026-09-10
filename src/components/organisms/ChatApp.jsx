"use client";

import React, { useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSocket } from "@/lib/socket";
import { useChatStore } from "@/store/useChatStore";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatApp() {
  const { user } = useUser();
  const {
    userName,
    setUserName,
    addMessage,
    pruneExpiredMessages,
    setClientsTotal,
    setFeedbackText,
    setIsConnected,
    isSoundEnabled,
  } = useChatStore();

  const audioRef = useRef(null);

  // Sync authenticated user name with chat store if not already customized
  useEffect(() => {
    if (user && (userName === "anonymous" || !userName)) {
      const displayName = user.name || user.nickname || user.email?.split("@")[0];
      if (displayName) {
        setUserName(displayName);
      }
    }
  }, [user, userName, setUserName]);

  // Background interval: auto-erase messages that reach their 1-hour expiration in real time
  useEffect(() => {
    pruneExpiredMessages();
    const interval = setInterval(() => {
      pruneExpiredMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [pruneExpiredMessages]);

  useEffect(() => {
    // Preload audio
    audioRef.current = new Audio("/message-tone.mp3");

    const socket = getSocket();
    if (!socket) return;

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onClientsTotal = (total) => {
      setClientsTotal(total);
    };

    const onChatMessage = (data) => {
      // Play audio notification chime
      if (isSoundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Autoplay policy may block without prior gesture
        });
      }

      addMessage({
        id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        name: data.name,
        message: data.message,
        dateTime: data.dateTime || new Date().toISOString(),
        isOwn: false,
      });
    };

    const onFeedback = (data) => {
      setFeedbackText(data.feedback || "");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("clients-total", onClientsTotal);
    socket.on("chat-message", onChatMessage);
    socket.on("feedback", onFeedback);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("clients-total", onClientsTotal);
      socket.off("chat-message", onChatMessage);
      socket.off("feedback", onFeedback);
    };
  }, [addMessage, setClientsTotal, setFeedbackText, setIsConnected, isSoundEnabled]);

  return (
    <div className="w-full h-full flex-1 bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-chat border-0 sm:border sm:border-slate-200/80 flex flex-col overflow-hidden relative transition-all">
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  );
}

export default ChatApp;
