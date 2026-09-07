"use client";

import React, { useState, useEffect } from "react";
import { formatRelativeTime } from "@/lib/utils";

export function MessageBubble({ message }) {
  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelativeTime(message.dateTime)
  );

  useEffect(() => {
    // Keep timestamps updated live every 15 seconds
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(message.dateTime));
    }, 15000);

    return () => clearInterval(interval);
  }, [message.dateTime]);

  const isOwn = message.isOwn;

  return (
    <div
      className={`flex flex-col max-w-[85%] sm:max-w-[75%] animate-messageIn ${
        isOwn ? "self-end items-end" : "self-start items-start"
      }`}
    >
      <div
        className={`px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-sm text-sm sm:text-[15px] leading-relaxed break-words max-w-full ${
          isOwn
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-sm shadow-blue-500/20"
            : "bg-white text-slate-800 border border-slate-200/80 rounded-2xl rounded-bl-sm shadow-slate-100"
        }`}
      >
        <div
          className={`text-[11px] font-bold tracking-wide mb-0.5 ${
            isOwn ? "text-blue-100 text-right" : "text-blue-600 text-left"
          }`}
        >
          {isOwn ? "You" : message.name || "anonymous"}
        </div>
        <p className="whitespace-pre-wrap leading-snug">{message.message}</p>
        <div
          className={`flex items-center gap-1 text-[10px] mt-1 select-none ${
            isOwn ? "justify-end text-blue-100/80" : "justify-end text-slate-400"
          }`}
        >
          <span>{relativeTime}</span>
        </div>
      </div>
    </div>
  );
}
