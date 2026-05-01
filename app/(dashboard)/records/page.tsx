"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllReportsAction } from "@/actions/reportActions"
import { RecordTable } from "@/components/dashboard/records/record-table"
import { AddRecordDialog } from "@/components/dashboard/records/add-record-dialog"
import { RecordStatus, RecordPriority } from "@/components/dashboard/locations/types"

export default function RecordsPage() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Fetch real data from database
  const { data: rawReports, isLoading } = useQuery({
    queryKey: ["reports", "all"],
    queryFn: () => getAllReportsAction()
  });

  // Transform database reports to UI-friendly format
  const reports = (rawReports || []).map((r) => ({
    id: r.id,
    title: r.title,
    code: r.id.split("-")[0].toUpperCase(),
    category: "General",
    status: (r.status === "archived" ? "ACTIVE" : r.status === "loaned" ? "BORROWED" : "PENDING") as RecordStatus,
    priority: "MEDIUM" as RecordPriority,
    location: r.unit ? `${r.unit.room?.name || "Room"} - ${r.unit.name}` : "Unknown",
    registeredAt: new Date(r.created_at).toISOString().split('T')[0],
  }));

  const stats = [
    { label: "Total Arsip", value: reports.length, icon: "inventory_2", color: "text-primary bg-primary/10" },
    { label: "Sedang Dipinjam", value: reports.filter(r => r.status === "BORROWED").length, icon: "output", color: "text-amber-500 bg-amber-500/10" },
    { label: "Pending", value: reports.filter(r => r.status === "PENDING").length, icon: "pending", color: "text-rose-500 bg-rose-500/10" },
    { label: "Archived", value: reports.filter(r => r.status === "ACTIVE").length, icon: "verified", color: "text-emerald-500 bg-emerald-500/10" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors">Digital Repository</span>
            <span className="text-slate-300">/</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Document Records</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">
            Records Management
          </h1>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-3 primary-gradient px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-all scale-100 active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add_box</span>
          Pendaftaran Arsip Baru
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-outline-variant/10 flex flex-col gap-4 group hover:border-primary/20 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {reports.length > 0 ? (
          <RecordTable records={reports} />
        ) : (
          <div className="py-24 flex flex-col items-center justify-center bg-slate-900/50 rounded-4xl border border-dashed border-slate-800 text-slate-500 gap-4">
            <span className="material-symbols-outlined text-6xl opacity-20">folder_off</span>
            <div className="text-center">
              <p className="text-sm font-bold text-white mb-1">No Records Found</p>
              <p className="text-xs">Database arsip digital masih kosong.</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add Record Modal */}
      <AddRecordDialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onAdd={() => {
          queryClient.invalidateQueries({ queryKey: ["reports"] });
          setIsAddOpen(false);
        }} 
      />
    </div>
  )
}
