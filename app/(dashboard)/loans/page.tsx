"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getLoansAction, returnLoanAction } from "@/actions/loanActions"
import { LoanSession, LoanStatus } from "@/components/dashboard/locations/types"
import { LoanTable } from "@/components/dashboard/loans/loan-table"
import { AddLoanDialog } from "@/components/dashboard/loans/add-loan-dialog"
import { toast } from "sonner"

export default function LoansPage() {
  const queryClient = useQueryClient()
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Fetch Loans
  const { data: rawLoans, isLoading, isError, error } = useQuery({
    queryKey: ["loans"],
    queryFn: () => getLoansAction()
  })

  // Transform raw Supabase data to LoanSession UI type
  const loans: LoanSession[] = (rawLoans || []).map((l) => {
    const raw = l as unknown as { 
      id: string; 
      report_id: string; 
      borrower_id: string; 
      loan_date: string; 
      due_date: string; 
      return_date?: string; 
      status: string; 
      notes?: string;
      report?: { title: string };
      borrower?: { full_name: string };
    }
    
    return {
      id: raw.id,
      recordId: raw.report_id,
      recordTitle: raw.report?.title || "Unknown Report",
      recordCode: raw.report_id.split("-")[0].toUpperCase(),
      borrowerName: raw.borrower?.full_name || "Unknown Borrower",
      borrowerId: raw.borrower_id.split("-")[0].toUpperCase(),
      loanDate: new Date(raw.loan_date).toLocaleDateString(),
      dueDate: new Date(raw.due_date).toLocaleDateString(),
      returnDate: raw.return_date ? new Date(raw.return_date).toLocaleDateString() : undefined,
      status: raw.status as LoanStatus,
      notes: raw.notes || ""
    }
  })

  const returnMutation = useMutation({
    mutationFn: ({ loanId, reportId }: { loanId: string; reportId: string }) => 
      returnLoanAction(loanId, reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] })
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      toast.success("Record returned successfully")
    }
  })


  const stats = [
    { label: "Peminjaman Aktif", value: loans.filter(l => l.status === "ONGOING").length, icon: "sync", color: "text-primary bg-primary/10" },
    { label: "Terlambat Kembali", value: loans.filter(l => l.status === "OVERDUE").length, icon: "error", color: "text-rose-500 bg-rose-500/10" },
    { label: "Kembali Hari Ini", value: loans.filter(l => l.returnDate === new Date().toLocaleDateString()).length, icon: "check_circle", color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Total Permintaan", value: loans.length, icon: "history", color: "text-slate-500 bg-slate-500/10" },
  ]


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <span className="material-symbols-outlined text-rose-500 text-5xl">error</span>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Gagal memuat data</h2>
          <p className="text-slate-500 text-sm">{(error as Error)?.message || "Terjadi kesalahan pada server"}</p>
          <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["loans"] })}
            className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }


  if (!isLoading && (!loans || loans.length === 0)) {
    return (
      <div className="space-y-10 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white font-heading">Loans Management</h1>
            <p className="text-slate-500 text-sm">No active loan sessions found.</p>
          </div>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="primary-gradient px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white"
          >
            Registrasi Peminjaman
          </button>
        </div>
        
        <div className="py-20 flex flex-col items-center justify-center bg-slate-900/50 rounded-4xl border border-slate-800 text-slate-500 gap-4">
          <span className="material-symbols-outlined text-6xl opacity-20">sensor_door</span>
          <p className="text-sm font-medium italic">Database sirkulasi masih kosong.</p>
        </div>

        <AddLoanDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={() => setIsAddOpen(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors">Archival Operations</span>
            <span className="text-slate-300">/</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Circulation & Loans</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white font-heading">
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
            className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col gap-4 group hover:border-primary/20 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">
                {stat.value}
                {stat.label === "Terlambat Kembali" && stat.value > 0 && <span className="ml-2 text-xs font-black text-rose-500 uppercase tracking-tighter">Action Required</span>}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
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
        <LoanTable 
          loans={loans} 
          onReturn={(id) => {
            const loan = rawLoans?.find(l => l.id === id)
            if (loan) {
              returnMutation.mutate({ loanId: id, reportId: loan.report_id })
            }
          }} 
        />
      </motion.div>



      {/* Add Loan Modal (Not implemented with Supabase yet, will need to be updated) */}
      <AddLoanDialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onAdd={() => {
          // Future: Implementation for adding loan with Supabase
          toast.info("Gunakan Locker View untuk registrasi peminjaman arsip spesifik")
          setIsAddOpen(false)
        }} 
      />
    </div>
  )
}

