"use client";

import React from "react";

export function TypingIndicator({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="self-start animate-messageIn">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 shadow-sm text-xs italic text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span
            className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-typingBounce"
            style={{ animationDelay: "-0.32s" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-typingBounce"
            style={{ animationDelay: "-0.16s" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-typingBounce"
            style={{ animationDelay: "0s" }}
          />
        </span>
        <span className="font-medium text-slate-600">{feedback}</span>
      </div>
    </div>
  );
}
