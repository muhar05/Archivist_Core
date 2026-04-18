"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { ArchivalRecord } from "@/components/dashboard/locations/types"
import { RecordTable } from "@/components/dashboard/records/record-table"
import { AddRecordDialog } from "@/components/dashboard/records/add-record-dialog"

const DUMMY_RECORDS: ArchivalRecord[] = [
  {
    id: "1",
    title: "Laporan Tahunan Keuangan 2023",
    code: "FIN-2023-089",
    category: "Finance",
    status: "ACTIVE",
    priority: "HIGH",
    location: "Row A-01, Cabinet 02",
    registeredAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Kontrak Vendor - Logistic Pro",
    code: "LGL-2024-012",
    category: "Legal",
    status: "BORROWED",
    priority: "MEDIUM",
    location: "Row B-05, Cabinet 10",
    registeredAt: "2024-02-10",
  },
  {
    id: "3",
    title: "Data Karyawan Jakarta Selatan",
    code: "HR-2024-445",
    category: "HR",
    status: "ARCHIVED",
    priority: "LOW",
    location: "Vault B, Row 12",
    registeredAt: "2024-03-01",
  },
  {
    id: "4",
    title: "Sertifikat Tanah Kantor Pusat",
    code: "LGL-S-001",
    category: "Legal",
    status: "ACTIVE",
    priority: "CRITICAL",
    location: "Safety Deposit Box 01",
    registeredAt: "2023-11-20",
  },
  {
    id: "5",
    title: "Audit Eksternal Pajak 2024",
    code: "FIN-A-2024",
    category: "Finance",
    status: "PENDING",
    priority: "HIGH",
    location: "Reception Holding",
    registeredAt: "2024-04-18",
  }
];

export default function RecordsPage() {
  const [records, setRecords] = useState<ArchivalRecord[]>(DUMMY_RECORDS);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAddRecord = (newRecord: Omit<ArchivalRecord, "id" | "registeredAt">) => {
    const record: ArchivalRecord = {
      ...newRecord,
      id: Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setRecords(prev => [record, ...prev]);
  };

  const stats = [
    { label: "Total Arsip", value: records.length, icon: "inventory_2", color: "text-primary bg-primary/10" },
    { label: "Sedang Dipinjam", value: records.filter(r => r.status === "BORROWED").length, icon: "output", color: "text-amber-500 bg-amber-500/10" },
    { label: "Prioritas Tinggi", value: records.filter(r => r.priority === "HIGH" || r.priority === "CRITICAL").length, icon: "priority_high", color: "text-rose-500 bg-rose-500/10" },
    { label: "Baru Minggu Ini", value: 3, icon: "new_releases", color: "text-emerald-500 bg-emerald-500/10" },
  ];

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
          className="flex items-center gap-3 primary-gradient px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:opacity-90 transition-all scale-100 active:scale-95"
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
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl shadow-slate-200/50 flex flex-col gap-4 group hover:border-primary/20 transition-all"
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
        <RecordTable records={records} />
      </motion.div>

      {/* Add Record Modal */}
      <AddRecordDialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onAdd={handleAddRecord} 
      />
    </div>
  )
}
