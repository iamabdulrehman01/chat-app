"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Trash2,
  Copy,
  CheckCheck,
  Smile,
  Send,
  ArrowDown,
  MessageSquareDashed,
  User,
} from "lucide-react";
import { useSoloChatStore } from "@/store/useSoloChatStore";
import { getSocket } from "@/lib/socket";
import { Tooltip, TypingIndicator, Button } from "@/components/atoms";
import { formatShortId, getAvatarInitial, formatRelativeTime } from "@/lib/utils";

const QUICK_EMOJIS = ["👋", "😊", "🔥", "👍", "❤️", "🎉", "🚀", "✨", "👌", "❌", "✔️", "👎"];

export function SoloChatWindow({ myUserId, myUserName }) {
  const {
    activePartnerId,
    soloConversations,
    onlineUsers,
    partnerFeedbacks,
    isSoundEnabled,
    toggleSound,
    clearConversation,
    closeMobileChat,
    addSoloMessage,
  } = useSoloChatStore();

  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const containerRef = useRef(null);
  const bottomAnchorRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const conversation = activePartnerId ? soloConversations[activePartnerId] : null;
  const messages = conversation?.messages || [];
  const partnerFeedback = activePartnerId ? partnerFeedbacks[activePartnerId] : "";

  const isPartnerOnline = (onlineUsers || []).some((u) => u.userId === activePartnerId);
  const partnerName = conversation?.partnerName || "User";

  // Auto-scroll on new messages or typing
  const scrollToBottom = (smooth = true) => {
    bottomAnchorRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, partnerFeedback, activePartnerId]);

  // Scroll detection for floating jump button
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceToBottom > 120);
  };

  // Copy partner ID
  const handleCopyPartnerId = () => {
    if (activePartnerId && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(activePartnerId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Typing indicator emitter
  const emitTyping = (isTyping) => {
    const socket = getSocket();
    if (!socket || !socket.connected || !activePartnerId) return;

    socket.emit("solo-feedback", {
      fromUserId: myUserId,
      toUserId: activePartnerId,
      fromName: myUserName || "User",
      feedback: isTyping ? `${myUserName || "User"} is typing...` : "",
    });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (val.trim()) {
      emitTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        emitTyping(false);
      }, 3000);
    } else {
      emitTyping(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !activePartnerId) return;

    const socket = getSocket();
    const messagePayload = {
      id: "solo-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      fromUserId: myUserId,
      toUserId: activePartnerId,
      fromName: myUserName || "User",
      toName: partnerName,
      message: trimmed,
      dateTime: new Date().toISOString(),
    };

    // Emit over socket
    if (socket && socket.connected) {
      socket.emit("solo-message", messagePayload);
    }

    // Add locally to conversation history
    addSoloMessage({
      partnerId: activePartnerId,
      partnerInfo: {
        name: partnerName,
        email: conversation?.partnerEmail,
        picture: conversation?.partnerPicture,
      },
      message: {
        ...messagePayload,
        name: myUserName || "You",
        isOwn: true,
      },
      isOwn: true,
    });

    setText("");
    emitTyping(false);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  return (
    <div className="h-full w-full flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Active Chat Header */}
      <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-3 z-10 gap-2 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Back button on mobile */}
          <button
            type="button"
            onClick={closeMobileChat}
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Partner Avatar */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {getAvatarInitial(partnerName)}
            </div>
            {isPartnerOnline ? (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            ) : (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />
            )}
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {partnerName}
              </h3>
              <span
                className={`text-[10px] font-semibold px-2 py-0.2 rounded-full shrink-0 ${
                  isPartnerOnline
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {isPartnerOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Partner ID with Copy */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px] sm:max-w-[200px]">
                ID: {formatShortId(activePartnerId)}
              </span>
              <button
                type="button"
                onClick={handleCopyPartnerId}
                title={`Copy partner ID: ${activePartnerId}`}
                className="flex items-center gap-0.5 text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {copiedId ? (
                  <CheckCheck className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedId ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Tooltip content={isSoundEnabled ? "Mute notification sounds" : "Enable notification sounds"}>
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle notification sounds"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors active:scale-95"
            >
              {isSoundEnabled ? (
                <Volume2 className="h-4 w-4 text-blue-600" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </Tooltip>

          <Tooltip content="Clear conversation history">
            <button
              type="button"
              onClick={() => clearConversation(activePartnerId)}
              aria-label="Clear chat history"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors active:scale-95"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Message List Area */}
      <div className="relative flex-1 overflow-hidden bg-slate-50/70">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 flex flex-col gap-3.5 scroll-smooth custom-scrollbar"
        >
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center text-center p-6 text-slate-400 select-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-200/80 mb-3 text-slate-400">
                <MessageSquareDashed className="h-6 w-6 text-blue-500/70" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">
                Start solo chat with {partnerName}
              </h4>
              <p className="text-xs text-slate-400 max-w-[240px] mt-1">
                Say hello! Messages sent here are private and direct.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.isOwn || msg.fromUserId === myUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] sm:max-w-[75%] animate-messageIn ${
                    isOwn ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-2xs text-xs sm:text-[14px] leading-relaxed break-words max-w-full ${
                      isOwn
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-xs shadow-blue-500/20"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-2xl rounded-bl-xs"
                    }`}
                  >
                    {!isOwn && (
                      <div className="text-[10px] font-bold text-blue-600 mb-0.5">
                        {msg.name || partnerName}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-snug">{msg.message}</p>
                    <div
                      className={`flex items-center gap-1 text-[9px] mt-1 select-none ${
                        isOwn ? "justify-end text-blue-100/80" : "justify-end text-slate-400"
                      }`}
                    >
                      <span>{formatRelativeTime(msg.dateTime)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing indicator */}
          <TypingIndicator feedback={partnerFeedback} />

          <div ref={bottomAnchorRef} />
        </div>

        {/* Floating scroll to bottom button */}
        {showScrollBottom && (
          <button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md border border-slate-200 transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 animate-messageIn"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4 text-blue-600" />
          </button>
        )}
      </div>

      {/* Solo Chat Input Footer */}
      <footer className="relative border-t border-slate-200/80 bg-white/95 backdrop-blur-sm p-3 sm:p-4 z-10 shrink-0">
        {showEmojiPicker && (
          <div
            className="absolute bottom-full left-4 mb-2 
            flex flex-wrap items-center gap-1
            rounded-2xl border border-slate-200 bg-white p-2
            shadow-lg animate-messageIn z-30 w-[300px] sm:w-auto"
          >
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-lg hover:bg-slate-100 transition-all hover:scale-110 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            aria-label="Insert emoji"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors active:scale-95"
          >
            <Smile className="h-5 w-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder={`Message ${partnerName}...`}
            autoComplete="off"
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs sm:text-[14px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!text.trim()}
            aria-label="Send message"
            className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send className="h-4 w-4 translate-x-px" />
          </Button>
        </form>
      </footer>
    </div>
  );
}

export default SoloChatWindow;
