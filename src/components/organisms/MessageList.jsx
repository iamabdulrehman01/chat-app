"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowDown, MessageSquareDashed } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { MessageBubble } from "@/components/molecules";
import { TypingIndicator } from "@/components/atoms";

export function MessageList() {
  const { messages, feedbackText } = useChatStore();
  const [mounted, setMounted] = useState(false);
  const displayedMessages = mounted ? messages : [];
  const containerRef = useRef(null);
  const bottomAnchorRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll on new message or feedback
  const scrollToBottom = (smooth = true) => {
    bottomAnchorRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, feedbackText]);

  // Handle scroll detection
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceToBottom > 120);
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-slate-50/70">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 flex flex-col gap-3.5 scroll-smooth custom-scrollbar"
      >
        {!mounted || displayedMessages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center text-center p-6 text-slate-400 select-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200/80 mb-3 text-slate-400">
              <MessageSquareDashed className="h-6 w-6 text-blue-500/70" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">No messages yet</h3>
            <p className="text-xs text-slate-500 max-w-[240px] mt-1">
              Start the conversation by typing a message below!
            </p>
          </div>
        ) : (
          displayedMessages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}

        {/* Typing indicator */}
        <TypingIndicator feedback={feedbackText} />

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
  );
}

export default MessageList;
