"use client";

import React, { useState } from "react";
import { MessageCircle, Fingerprint, Copy, CheckCheck, Users, Search, ArrowRight } from "lucide-react";
import { useSoloChatStore } from "@/store/useSoloChatStore";
import { formatShortId, getAvatarInitial } from "@/lib/utils";

export function SoloChatEmptyState({ myUserId, myUserName, onSelectUser }) {
  const [copied, setCopied] = useState(false);
  const { onlineUsers } = useSoloChatStore();

  const handleCopy = () => {
    if (myUserId && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(myUserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const otherOnlineUsers = (onlineUsers || []).filter((u) => u.userId !== myUserId);

  return (
    <div className="h-full w-full flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto custom-scrollbar animate-messageIn">
      {/* Icon Graphic */}
      <div className="relative mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-200/80 shadow-xs">
          <MessageCircle className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        Solo Direct Chat
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 leading-relaxed">
        Connect one-on-one with anyone. Share your Unique ID or search for other users to begin a private conversation.
      </p>

      {/* User's Shareable Unique ID Card */}
      {myUserId && (
        <div className="mt-5 w-full max-w-sm bg-gradient-to-r from-blue-50/80 via-indigo-50/70 to-purple-50/60 border border-blue-200/90 rounded-2xl p-4 shadow-sm text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-blue-700">
                Your Shareable Unique ID
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Findable
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-blue-100 shadow-2xs">
            <span className="font-mono text-xs font-semibold text-slate-800 truncate" title={myUserId}>
              {myUserId}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Friends can paste this ID into their search bar to chat with you directly.
          </p>
        </div>
      )}

      {/* Quick Start with Online Users */}
      <div className="mt-6 w-full max-w-sm text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Online Members ({otherOnlineUsers.length})
          </span>
        </div>

        {otherOnlineUsers.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center text-xs text-slate-400">
            No other members currently online. Enter a friend's Unique ID in the search bar on the left to start chatting!
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {otherOnlineUsers.slice(0, 4).map((u) => (
              <div
                key={u.userId}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                      {getAvatarInitial(u.userName)}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {u.userName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      ID: {formatShortId(u.userId)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectUser(u)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-semibold transition-all active:scale-95"
                >
                  <span>Chat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SoloChatEmptyState;
