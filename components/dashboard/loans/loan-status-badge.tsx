"use client"

import React from "react"
import { LoanStatus } from "../locations/types"

interface LoanStatusBadgeProps {
  status: LoanStatus;
}

export function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  const styles = {
    ONGOING: "bg-primary/10 text-primary border-primary/20",
    OVERDUE: "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse",
    RETURNED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  }[status];

  const labels = {
    ONGOING: "Dalam Peminjaman",
    OVERDUE: "Terlambat",
    RETURNED: "Sudah Kembali",
  }[status];

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${styles}`}>
      {labels}
    </span>
  );
}
