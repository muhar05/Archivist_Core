"use client"

import React from "react"
import { RecordStatus, RecordPriority } from "../locations/types"

interface RecordStatusBadgeProps {
  status: RecordStatus;
}

export function RecordStatusBadge({ status }: RecordStatusBadgeProps) {
  const styles = {
    ARCHIVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/20",
    BORROWED: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20",
    ACTIVE: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-500/20",
    DISPOSED: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-500/20",
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/20",
  }[status];

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles}`}>
      {status}
    </span>
  );
}

interface RecordPriorityBadgeProps {
  priority: RecordPriority;
}

export function RecordPriorityBadge({ priority }: RecordPriorityBadgeProps) {
  const styles = {
    LOW: "text-slate-400 dark:text-slate-500",
    MEDIUM: "text-sky-500 dark:text-sky-400",
    HIGH: "text-amber-500 dark:text-amber-400",
    CRITICAL: "text-rose-500 dark:text-rose-400 animate-pulse",
  }[priority] || "text-slate-400";

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full bg-current ${styles}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${styles}`}>
        {priority}
      </span>
    </div>
  );
}
