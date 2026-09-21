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

// Normalize email addresses (special handling for Gmail to ignore dots and alias tags)
export function normalizeEmail(email) {
  if (!email || typeof email !== "string") return "";
  let clean = email.trim().toLowerCase();
  if (clean.endsWith("@gmail.com") || clean.endsWith("@googlemail.com")) {
    const parts = clean.split("@");
    const localPart = parts[0].replace(/\./g, "").split("+")[0];
    clean = `${localPart}@gmail.com`;
  }
  return clean;
}

// Generate a deterministic, collision-resistant 4-digit ID (1000 - 9999) from an email or string identifier
export function generate4DigitIdFromEmail(email) {
  if (!email || typeof email !== "string") return null;
  const str = normalizeEmail(email) || email.trim().toLowerCase();
  if (!str) return null;

  let h1 = 0xdeadbeef;
  let h2 = 0x41c64e6d;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const combined = (Math.abs(h1 ^ h2) >>> 0);
  const num = 1000 + (combined % 9000);
  return String(num);
}

// Get unique 4-digit user ID associated with user's Gmail/email or persistent client fallback
export function getUserUniqueId(user) {
  if (user?.email) {
    const emailId = generate4DigitIdFromEmail(user.email);
    if (emailId) return emailId;
  }
  if (user?.userEmail) {
    const emailId = generate4DigitIdFromEmail(user.userEmail);
    if (emailId) return emailId;
  }
  if (user?.userId && /^\d{4}$/.test(String(user.userId))) {
    return String(user.userId);
  }
  if (user?.sub) {
    const subId = generate4DigitIdFromEmail(user.sub);
    if (subId) return subId;
  }

  if (typeof window !== "undefined") {
    let localId = localStorage.getItem("chat_unique_user_id");
    // If not set or is an old non-4-digit string, regenerate a clean 4-digit ID
    if (!localId || !/^\d{4}$/.test(localId)) {
      localId = String(Math.floor(1000 + Math.random() * 9000));
      localStorage.setItem("chat_unique_user_id", localId);
    }
    return localId;
  }

  return "1000";
}

// Format ID for compact visual preview
export function formatShortId(id) {
  if (!id) return "";
  const str = String(id);
  if (str.length <= 6) return str;
  return `${str.substring(0, 4)}...${str.substring(str.length - 2)}`;
}
