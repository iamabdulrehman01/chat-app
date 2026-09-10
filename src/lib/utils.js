import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Generate an avatar initial or default icon
export function getAvatarInitial(name) {
  const trimmed = name ? name.trim() : "";
  if (!trimmed || trimmed.toLowerCase() === "anonymous") {
    return "👤";
  }
  return trimmed.charAt(0).toUpperCase();
}

// Format relative date with live fallback
export function formatRelativeTime(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 10) return "just now";
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

// Get unique user ID from Auth0 user or fallback to persistent client ID
export function getUserUniqueId(user) {
  if (user?.sub) return user.sub;
  if (user?.userId) return user.userId;
  if (typeof window !== "undefined") {
    let localId = localStorage.getItem("chat_unique_user_id");
    if (!localId) {
      localId = "usr_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("chat_unique_user_id", localId);
    }
    return localId;
  }
  return "usr_guest";
}

// Format ID for compact visual preview
export function formatShortId(id) {
  if (!id) return "";
  if (id.length <= 16) return id;
  return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`;
}
