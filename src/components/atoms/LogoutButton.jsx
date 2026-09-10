"use client";

import React from "react";
import { LogOut } from "lucide-react";

export function LogoutButton({ className, variant = "default" }) {
  const defaultClasses =
    variant === "compact"
      ? "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 text-xs font-semibold rounded-full transition-all active:scale-95"
      : "w-full text-center flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 font-semibold rounded-full text-[14px] transition-all hover:scale-[1.01] active:scale-[0.98]";

  return (
    <a
      href="/auth/logout"
      className={className || defaultClasses}
    >
      <LogOut className={variant === "compact" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      <span>Logout</span>
    </a>
  );
}

export default LogoutButton;
