"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Volume2, VolumeX, Trash2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { getAvatarInitial } from "@/lib/utils";

export function ChatHeader() {
  const {
    userName,
    setUserName,
    clientsTotal,
    isSoundEnabled,
    toggleSound,
    clearChat,
    isConnected,
  } = useChatStore();

  const [mounted, setMounted] = useState(false);
  const [localName, setLocalName] = useState(userName);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalName(userName);
  }, [userName]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setLocalName(val);
    setUserName(val.trim() || "anonymous");
  };

  if (!mounted) {
    return (
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5 z-10 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">Live Chat</h1>
            <span className="text-xs text-slate-500">Loading...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-3.5 z-10 gap-3">
      {/* Brand & Client Status */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25 transition-transform hover:scale-105">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Live Chat
            </h1>
            {isConnected ? (
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Socket Connected" />
            ) : (
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" title="Connecting..." />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="default" className="gap-1.5 px-2 py-0 text-[11px] font-medium text-slate-600 bg-slate-100/90 border-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulseGlow" />
              <span>Total clients: {clientsTotal}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Controls & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound toggle button */}
        <Tooltip content={isSoundEnabled ? "Mute notification sounds" : "Enable notification sounds"}>
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle notification sounds"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 active:scale-95"
          >
            {isSoundEnabled ? (
              <Volume2 className="h-4 w-4 text-blue-600" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
          </button>
        </Tooltip>

        {/* Clear chat button */}
        <Tooltip content="Clear chat history">
          <button
            type="button"
            onClick={clearChat}
            aria-label="Clear chat"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </Tooltip>

        {/* User Identity pill */}
        <div
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-2 py-1 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/15"
          title="Click to edit your display name"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 text-xs font-bold text-slate-700 shadow-inner">
            {getAvatarInitial(localName)}
          </div>
          <input
            type="text"
            value={localName}
            onChange={handleNameChange}
            maxLength={20}
            placeholder="Your name"
            aria-label="Display name"
            className="w-20 sm:w-28 border-none bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 transition-all focus:w-28 sm:focus:w-36"
          />
        </div>
      </div>
    </header>
  );
}
