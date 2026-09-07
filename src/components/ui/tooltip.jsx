import * as React from "react";
import { cn } from "@/lib/utils";

export function Tooltip({
  content,
  children,
  position = "top",
  className,
}) {
  return (
    <div className={cn("group relative inline-flex items-center", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-999 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-md transition-opacity duration-200 opacity-0 group-hover:opacity-100",
          position === "top" && "bottom-full mb-2 left-1/2 -translate-x-1/2",
          position === "bottom" && "top-full mt-2 left-1/2 -translate-x-1/2"
        )}
      >
        {content}
      </span>
    </div>
  );
}
