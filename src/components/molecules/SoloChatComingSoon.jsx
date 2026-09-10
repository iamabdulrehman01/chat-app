"use client";

import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";

export function SoloChatComingSoon({ onSwitchToGroup }) {
  return (
    <div className="w-full h-full flex-1 bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-chat border-0 sm:border sm:border-slate-200/80 flex flex-col items-center justify-center p-6 text-center animate-messageIn">
      <div className="relative mb-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/60 shadow-inner">
          <MessageCircle className="h-10 w-10 text-blue-600" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-white shadow-md shadow-amber-400/30">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        Feature in Progress
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        Solo Chat Coming Soon
      </h2>

      <p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed">
        One-on-one direct messaging is currently under active development. You will soon be able to chat privately with individual members!
      </p>

      {onSwitchToGroup && (
        <button
          type="button"
          onClick={onSwitchToGroup}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
        >
          Go to Group Chat
        </button>
      )}
    </div>
  );
}

export default SoloChatComingSoon;
