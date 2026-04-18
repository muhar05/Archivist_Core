"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoanSession } from "../locations/types"
import { LoanStatusBadge } from "./loan-status-badge"

interface LoanTableProps {
  loans: LoanSession[];
  onReturn?: (id: string) => void;
}

export function LoanTable({ loans, onReturn }: LoanTableProps) {
  const [search, setSearch] = useState("");

  const filteredLoans = loans.filter(l => 
    l.recordTitle.toLowerCase().includes(search.toLowerCase()) ||
    l.recordCode.toLowerCase().includes(search.toLowerCase()) ||
    l.borrowerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            person_search
          </span>
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari peminjam, arsip, atau kode..."
            className="w-full bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl pl-12 pr-6 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-outline-variant/10 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Archival Item</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Borrower</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Loan Period</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredLoans.map((loan, idx) => {
                  const isOverdue = loan.status === 'OVERDUE';
                  
                  return (
                    <motion.tr
                      key={loan.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors border-b border-outline-variant/5 last:border-none cursor-default ${isOverdue ? 'bg-rose-50/30' : ''}`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${isOverdue ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <span className="material-symbols-outlined text-lg">
                              {isOverdue ? 'priority_high' : 'assignment'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{loan.recordTitle}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{loan.recordCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div>
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{loan.borrowerName}</div>
                          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{loan.borrowerId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-900 dark:text-white">{loan.loanDate}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Until {loan.dueDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <LoanStatusBadge status={loan.status} />
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {loan.status !== 'RETURNED' && (
                            <button 
                              onClick={() => onReturn?.(loan.id)}
                              className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all scale-100 active:scale-90 flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-xs">keyboard_return</span>
                              Return Item
                            </button>
                          )}
                          <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-xl">info</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredLoans.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <span className="material-symbols-outlined text-6xl opacity-20">sensor_door</span>
              <p className="text-sm font-medium">No active loan sessions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
