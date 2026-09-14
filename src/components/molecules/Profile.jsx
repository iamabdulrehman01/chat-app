"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Pencil, Check, X, Copy, CheckCheck, Fingerprint } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { getUserUniqueId, formatShortId } from "@/lib/utils";

const DISPLAY_NAME_KEY = "chat_display_name";

function getInitials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}

export function Profile({ compact = false }) {
  const { user, isLoading } = useUser();
  const { userName, setUserName } = useChatStore();

  const [displayName, setDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  // Initialize and persist display name
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedName = localStorage.getItem(DISPLAY_NAME_KEY);
    if (storedName && storedName.trim()) {
      setDisplayName(storedName);
      setTempName(storedName);
      setUserName(storedName);
    } else if (userName && userName !== "anonymous") {
      setDisplayName(userName);
      setTempName(userName);
      localStorage.setItem(DISPLAY_NAME_KEY, userName);
    } else if (user) {
      const fallback = user.name || user.nickname || user.email?.split("@")[0] || "anonymous";
      setDisplayName(fallback);
      setTempName(fallback);
      setUserName(fallback);
      localStorage.setItem(DISPLAY_NAME_KEY, fallback);
    }
  }, [user, userName, setUserName]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSaveName = (e) => {
    if (e) e.preventDefault();
    const finalName = tempName.trim() || user?.name || "anonymous";
    setDisplayName(finalName);
    setUserName(finalName);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISPLAY_NAME_KEY, finalName);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(displayName);
    setIsEditing(false);
  };

  const uniqueId = getUserUniqueId(user);

  const handleCopyId = (e) => {
    if (e) e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(uniqueId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <p className="text-xs text-slate-400">Loading profile...</p>;
  if (!user) return null;

  // Compact view for top header bars (group-chat / solo-chat)
  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 rounded-full py-1 pl-1.5 pr-2.5 text-[12px] text-slate-700 max-w-full">
        <span className="w-6 h-6 bg-gradient-to-b from-[#2d2d42] to-[#161620] rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          {getInitials(displayName || user.name, user.email)}
        </span>
        <span className="font-semibold text-slate-800 truncate max-w-[110px]">
          {displayName || user.name || "User"}
        </span>
        <button
          type="button"
          onClick={handleCopyId}
          title={`Copy your Unique ID: ${uniqueId}`}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200/80 text-[10px] font-semibold text-blue-600 transition-colors shrink-0 shadow-2xs active:scale-95"
        >
          {copied ? (
            <>
              <CheckCheck className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-blue-500" />
              <span>Copy ID</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Full view for Account Card on Home page
  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Successfully authenticated status */}
      <div className="flex items-center gap-2 text-emerald-600 text-[13px] font-medium">
        <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>Successfully authenticated</span>
      </div>

      {/* Unique ID Card for Solo Chat findability */}
      <div className="w-full flex items-center justify-between gap-2 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/50 border border-blue-200/70 rounded-2xl px-3.5 py-2.5 transition-all">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/25">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 leading-tight">
                Your Unique ID
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-semibold">
                Solo Chat
              </span>
            </div>
            <span
              className="text-[12px] font-mono font-medium text-slate-700 truncate max-w-[160px]"
              title={uniqueId}
            >
              {formatShortId(uniqueId)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyId}
          title="Copy Unique ID to share with friends"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-semibold shadow-2xs border border-slate-200 transition-all active:scale-95 shrink-0"
        >
          {copied ? (
            <>
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px]">Copy ID</span>
            </>
          )}
        </button>
      </div>

      {/* Editable Display Name Card */}
      {isEditing ? (
        <form
          onSubmit={handleSaveName}
          className="w-full flex items-center gap-2 bg-white border-2 border-blue-500 rounded-2xl px-3 py-1.5 shadow-sm transition-all"
        >
          <input
            ref={inputRef}
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Write your name..."
            maxLength={25}
            className="flex-1 bg-transparent text-[13px] sm:text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="submit"
              title="Save name"
              aria-label="Save name"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors active:scale-95"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              title="Cancel"
              aria-label="Cancel editing"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="w-full flex items-center justify-between gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 transition-colors hover:bg-slate-100/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-gradient-to-b from-[#2d2d42] to-[#161620] rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm">
              {getInitials(displayName || user.name, user.email)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-tight">
                Display Name
              </span>
              <span className="text-[13px] sm:text-[14px] font-semibold text-slate-800 truncate">
                {displayName || user.name || "Write your name"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setTempName(displayName);
              setIsEditing(true);
            }}
            title="Edit your name"
            aria-label="Edit your display name"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* User Email Pill */}
      <div className="flex items-center gap-2 bg-slate-100/80 rounded-full py-1.5 pl-3 pr-4 text-[12px] text-slate-600 max-w-full">
        <span className="text-slate-400 text-[11px] font-medium">Email:</span>
        <span className="truncate font-medium">{user.email}</span>
      </div>
    </div>
  );
}

export default Profile;
