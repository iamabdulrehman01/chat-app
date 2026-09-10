"use client";

import React from "react";
import { Search, X, MessageSquare, Users, PlusCircle, Trash2, CheckCheck } from "lucide-react";
import { useSoloChatStore } from "@/store/useSoloChatStore";
import { formatRelativeTime, formatShortId, getAvatarInitial } from "@/lib/utils";

export function SoloChatSidebar({ myUserId, onSelectUser }) {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    soloConversations,
    onlineUsers,
    activePartnerId,
    startConversationWithUser,
    deleteConversation,
  } = useSoloChatStore();

  const conversationList = Object.values(soloConversations || {}).sort((a, b) => {
    const timeA = new Date(a.lastUpdated || 0).getTime();
    const timeB = new Date(b.lastUpdated || 0).getTime();
    return timeB - timeA;
  });

  const onlineOtherUsers = (onlineUsers || []).filter((u) => u.userId !== myUserId);

  // Filter based on search query
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filteredConversations = conversationList.filter((c) => {
    if (!trimmedQuery) return true;
    return (
      (c.partnerName && c.partnerName.toLowerCase().includes(trimmedQuery)) ||
      (c.partnerId && c.partnerId.toLowerCase().includes(trimmedQuery)) ||
      (c.partnerEmail && c.partnerEmail.toLowerCase().includes(trimmedQuery))
    );
  });

  const filteredOnlineUsers = onlineOtherUsers.filter((u) => {
    if (!trimmedQuery) return true;
    return (
      (u.userName && u.userName.toLowerCase().includes(trimmedQuery)) ||
      (u.userId && u.userId.toLowerCase().includes(trimmedQuery)) ||
      (u.userEmail && u.userEmail.toLowerCase().includes(trimmedQuery))
    );
  });

  const isQueryNewId =
    trimmedQuery &&
    trimmedQuery !== myUserId?.toLowerCase() &&
    !conversationList.some((c) => c.partnerId.toLowerCase() === trimmedQuery) &&
    !onlineOtherUsers.some((u) => u.userId.toLowerCase() === trimmedQuery);

  const handleStartCustomId = () => {
    if (!searchQuery.trim()) return;
    const targetId = searchQuery.trim();
    startConversationWithUser({
      userId: targetId,
      userName: `User (${formatShortId(targetId)})`,
      userEmail: "",
    });
  };

  return (
    <aside className="w-full sm:w-80 md:w-88 h-full bg-white border-r border-slate-200/80 flex flex-col shrink-0">
      {/* Header & Search */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Solo Messages
            </h2>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {onlineOtherUsers.length} online
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find by Unique ID, name, email..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-[13px] rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick action: Start chat with entered ID */}
        {isQueryNewId && (
          <button
            type="button"
            onClick={handleStartCustomId}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/70 text-blue-700 transition-all text-left animate-messageIn"
          >
            <div className="flex items-center gap-2 min-w-0">
              <PlusCircle className="w-4 h-4 shrink-0 text-blue-600" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold">Start chat with ID</p>
                <p className="text-[10px] font-mono text-blue-600/80 truncate">
                  {searchQuery.trim()}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-md shrink-0">
              Chat
            </span>
          </button>
        )}

        {/* Tabs: Recent Chats vs Online Users */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("chats")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "chats"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chats ({conversationList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("online")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "online"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Online ({onlineOtherUsers.length})</span>
          </button>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
        {activeTab === "chats" && (
          <>
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center my-auto">
                <p className="text-xs font-semibold text-slate-600">No conversations yet</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Search by Unique ID above or select an online user from the "Online" tab!
                </p>
              </div>
            ) : (
              filteredConversations.map((convo) => {
                const isOnline = onlineOtherUsers.some(
                  (u) => u.userId === convo.partnerId
                );
                const isActive = activePartnerId === convo.partnerId;
                const lastMsg =
                  convo.messages && convo.messages.length > 0
                    ? convo.messages[convo.messages.length - 1]
                    : null;

                return (
                  <div
                    key={convo.partnerId}
                    onClick={() =>
                      startConversationWithUser({
                        userId: convo.partnerId,
                        userName: convo.partnerName,
                        userEmail: convo.partnerEmail,
                        userPicture: convo.partnerPicture,
                      })
                    }
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? "bg-blue-50/90 border border-blue-200/80 shadow-2xs"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 shadow-2xs">
                          {getAvatarInitial(convo.partnerName)}
                        </div>
                        {isOnline ? (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                        ) : (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pr-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {convo.partnerName || "User"}
                          </p>
                          {lastMsg && (
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {formatRelativeTime(lastMsg.dateTime)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-1 mt-0.5">
                          <p className="text-[11px] text-slate-500 truncate">
                            {lastMsg
                              ? (lastMsg.isOwn ? "You: " : "") + lastMsg.message
                              : "No messages yet"}
                          </p>
                          {convo.unreadCount > 0 && (
                            <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">
                              {convo.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete conversation button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(convo.partnerId);
                      }}
                      title="Delete conversation"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all ml-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === "online" && (
          <>
            {filteredOnlineUsers.length === 0 ? (
              <div className="p-6 text-center my-auto">
                <p className="text-xs font-semibold text-slate-600">No other users online</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Share your Unique ID to let friends connect and solo chat with you!
                </p>
              </div>
            ) : (
              filteredOnlineUsers.map((user) => (
                <div
                  key={user.userId}
                  onClick={() =>
                    startConversationWithUser({
                      userId: user.userId,
                      userName: user.userName,
                      userEmail: user.userEmail,
                      userPicture: user.userPicture,
                    })
                  }
                  className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 shadow-2xs">
                        {getAvatarInitial(user.userName)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {user.userName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        ID: {formatShortId(user.userId)}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-600 hover:text-white transition-all shrink-0">
                    Chat
                  </span>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </aside>
  );
}

export default SoloChatSidebar;
