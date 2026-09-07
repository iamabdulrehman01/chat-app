"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { getSocket } from "@/lib/socket";
import { Button } from "@/components/ui/button";

const QUICK_EMOJIS = ["👋", "😊", "🔥", "👍", "❤️", "🎉", "🚀", "✨", "👌", "❌", "✔️", "👎"];

export function ChatInput() {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const { userName, addMessage } = useChatStore();

  const emitTyping = (isTyping) => {
    const socket = getSocket();
    if (!socket || !socket.connected) return;

    const currentName = userName.trim() || "anonymous";
    socket.emit("feedback", {
      feedback: isTyping ? `${currentName} is typing...` : "",
    });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (val.trim()) {
      emitTyping(true);

      // Auto-clear typing status after 3 seconds of pause
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        emitTyping(false);
      }, 3000);
    } else {
      emitTyping(false);
    }
  };

  const handleFocus = () => {
    if (text.trim()) {
      emitTyping(true);
    }
  };

  const handleBlur = () => {
    emitTyping(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const socket = getSocket();
    const messagePayload = {
      name: userName.trim() || "anonymous",
      message: trimmed,
      dateTime: new Date().toISOString(),
    };

    // Emit to server
    if (socket && socket.connected) {
      socket.emit("message", messagePayload);
    }

    // Add directly to local store as own message
    addMessage({
      id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      name: messagePayload.name,
      message: messagePayload.message,
      dateTime: messagePayload.dateTime,
      isOwn: true,
    });

    // Reset input and typing status
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
    <footer className="relative border-t border-slate-200/80 bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 z-10">
      {/* Quick emoji drawer */}
      {showEmojiPicker && (
        <div
          className="absolute bottom-full left-4 mb-2 
          flex flex-wrap items-center gap-1
          rounded-2xl border border-slate-200 bg-white p-2
          shadow-lg animate-messageIn z-30 w-[340px] sm:w-auto "
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
        {/* Emoji picker trigger */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Insert emoji"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 active:scale-95"
        >
          <Smile className="h-5 w-5" />
        </button>

        {/* Message Input */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Type a message..."
          autoComplete="off"
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm sm:text-[15px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
        />

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          disabled={!text.trim()}
          aria-label="Send message"
          className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5 translate-x-px" />
        </Button>
      </form>
    </footer>
  );
}
