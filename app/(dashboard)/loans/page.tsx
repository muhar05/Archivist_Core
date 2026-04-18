"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { LoanSession } from "@/components/dashboard/locations/types"
import { LoanTable } from "@/components/dashboard/loans/loan-table"
import { AddLoanDialog } from "@/components/dashboard/loans/add-loan-dialog"

const DUMMY_LOANS: LoanSession[] = [
  {
    id: "1",
    recordId: "rec-1",
    recordTitle: "Laporan Tahunan Keuangan 2023",
    recordCode: "FIN-2023-089",
    borrowerName: "Ahmad Subarjo",
    borrowerId: "NIP-00123",
    loanDate: "2024-04-10",
    dueDate: "2024-04-17",
    status: "OVERDUE",
    notes: "Keperluan audit pajak internal",
  },
  {
    id: "2",
    recordId: "rec-2",
    recordTitle: "Kontrak Vendor - Logistic Pro",
    recordCode: "LGL-2024-012",
    borrowerName: "Siti Aminah",
    borrowerId: "NIP-00445",
    loanDate: "2024-04-15",
    dueDate: "2024-04-22",
    status: "ONGOING",
    notes: "Review perpanjangan kontrak",
  },
  {
    id: "3",
    recordId: "rec-3",
    recordTitle: "Data Karyawan Jakarta Selatan",
    recordCode: "HR-2024-445",
    borrowerName: "Budi Cahyono",
    borrowerId: "NIP-00223",
    loanDate: "2024-04-01",
    dueDate: "2024-04-10",
    returnDate: "2024-04-09",
    status: "RETURNED",
  }
];

export default function LoansPage() {
  const [loans, setLoans] = useState<LoanSession[]>(DUMMY_LOANS);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAddLoan = (newLoan: Omit<LoanSession, "id">) => {
    const loan: LoanSession = {
      ...newLoan,
      id: Math.random().toString(36).substr(2, 9),
    };
    setLoans(prev => [loan, ...prev]);
  };

  const handleReturn = (id: string) => {
    setLoans(prev => prev.map(l => 
      l.id === id 
        ? { ...l, status: "RETURNED", returnDate: new Date().toISOString().split('T')[0] } 
        : l
    ));
  };

  const stats = [
    { label: "Peminjaman Aktif", value: loans.filter(l => l.status === "ONGOING").length, icon: "sync", color: "text-primary bg-primary/10" },
    { label: "Terlambat Kembali", value: loans.filter(l => l.status === "OVERDUE").length, icon: "error", color: "text-rose-500 bg-rose-500/10" },
    { label: "Kembali Hari Ini", value: 1, icon: "check_circle", color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Total Permintaan", value: 42, icon: "history", color: "text-slate-500 bg-slate-500/10" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors">Archival Operations</span>
            <span className="text-slate-300">/</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Circulation & Loans</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">
            Loans Management
          </h1>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-3 primary-gradient px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:opacity-90 transition-all scale-100 active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">shortcut</span>
          Registrasi Peminjaman
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl shadow-slate-200/50 flex flex-col gap-4 group hover:border-primary/20 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {stat.value}
                {stat.label === "Terlambat Kembali" && stat.value > 0 && <span className="ml-2 text-xs font-black text-rose-500 uppercase tracking-tighter">Action Required</span>}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Circulation Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <LoanTable loans={loans} onReturn={handleReturn} />
      </motion.div>

      {/* Add Loan Modal */}
      <AddLoanDialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onAdd={handleAddLoan} 
      />
    </div>
  )
}
