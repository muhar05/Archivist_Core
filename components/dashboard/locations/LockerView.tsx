"use client"

import React from "react"
import type { Report } from "@/services/reportService"
import { Plus, Search, FileText, User, ArrowUpRight, ArrowDownLeft, Eye } from "lucide-react"

interface LockerViewProps {
  reports: (Report & { creator: { full_name: string } })[]
  unitName: string
  onDeposit?: () => void
  onLoan?: (reportId: string) => void
  onView?: (reportId: string) => void
}

export const LockerView: React.FC<LockerViewProps> = ({ 
  reports, 
  unitName,
  onDeposit,
  onLoan,
  onView
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
             <FileText className="w-5 h-5 text-blue-500" />
             Records in {unitName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Total {reports.length} physical records found in this locker</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reports..."
              className="bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all w-64"
            />
          </div>
          <button 
            onClick={onDeposit}
            className="primary-gradient text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Taro Laporan
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black border-b border-white/5">
                <th className="px-8 py-5">Record Information</th>
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Archived By</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/5">
                        <FileText className="w-8 h-8 text-slate-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-bold">No reports found</p>
                        <p className="text-xs text-slate-600">Start by depositing a new record into this locker</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg ${
                           report.status === 'archived' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                           report.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                           'bg-blue-500/10 border-blue-500/20 text-blue-500'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{report.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="text-[10px] text-slate-500 font-mono tracking-tighter">ID: {report.id}</div>
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">#{report.report_number}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-300 font-medium">{report.client || "-"}</td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        report.status === "archived" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        report.status === "pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${
                           report.status === "archived" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                           report.status === "pending" ? "bg-amber-500" :
                           "bg-blue-500"
                        }`} />
                        {report.status}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                           <User className="w-3 h-3 text-slate-500" />
                         </div>
                         <span className="text-xs text-slate-400 font-medium">{report.creator?.full_name || "System"}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => onView?.(report.id)}
                          className="w-9 h-9 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {report.status === 'archived' ? (
                          <button 
                            onClick={() => onLoan?.(report.id)}
                            className="h-9 px-4 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-blue-500/20"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                            Pinjam
                          </button>
                        ) : report.status === 'loaned' ? (
                           <button 
                             className="h-9 px-4 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"
                           >
                             <ArrowDownLeft className="w-4 h-4" />
                             Kembalikan
                           </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
