"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, User, Calendar, Info, CheckCircle2, AlertTriangle, MapPin, Building2 } from "lucide-react"
import { type Report } from "@/services/reportService"

interface ReportMetadata {
  is_sop_complete?: boolean;
  sop_checklist?: string[];
  rejection_reason?: string;
  admin_notes?: string;
  verified_at?: string;
  rejected_at?: string;
}

interface ReportDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: (Report & { 
    creator?: { full_name: string },
    unit?: { name: string; room?: { name: string } }
  }) | null;
}

export function ReportDetailDialog({ isOpen, onClose, report }: ReportDetailDialogProps) {
  if (!report) return null;

  const metadata = report.metadata as ReportMetadata;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10"
          >
            {/* Header / Hero */}
            <div className="relative h-48 w-full p-10 flex items-end">
              <div className="absolute inset-0 primary-gradient opacity-20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)]" />
              
              <div className="relative flex items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-2xl ${
                  report.status === 'archived' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                  report.status === 'pending' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                  report.status === 'rejected' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' :
                  'bg-blue-500/20 border-blue-500/50 text-blue-400'
                }`}>
                  <FileText className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Record Document</span>
                    <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      report.status === 'archived' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      'bg-slate-800 text-slate-400 border-white/5'
                    }`}>
                      {report.status}
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tighter leading-tight">{report.title}</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">#{report.report_number}</p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-900">
              {/* Left Side: Main Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Core Information</h3>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Client / Pemilik</p>
                      <p className="text-sm font-bold text-slate-200">{report.client || "No Client Assigned"}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Tanggal Pendaftaran</p>
                      <p className="text-sm font-bold text-slate-200">{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Didaftarkan Oleh</p>
                      <p className="text-sm font-bold text-slate-200">{report.creator?.full_name || "Unknown Staff"}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white/3 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-2 mb-3">
                      <Info className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description / Notes</span>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed italic">
                      {report.description || "Tidak ada deskripsi tambahan untuk laporan ini."}
                   </p>
                </div>
              </div>

              {/* Right Side: Status & Compliance */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Verification & Compliance</h3>
                  
                  <div className={`p-6 rounded-[1.8rem] border ${
                    metadata?.is_sop_complete 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-amber-500/5 border-amber-500/20'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {metadata?.is_sop_complete 
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          : <AlertTriangle className="w-5 h-5 text-amber-500" />
                        }
                        <span className="text-xs font-black text-white uppercase tracking-tight">SOP Checklist</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase ${metadata?.is_sop_complete ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {metadata?.is_sop_complete ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                       {metadata?.sop_checklist?.map((item, i) => (
                         <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                           <div className="w-1 h-1 rounded-full bg-slate-700" />
                           {item}
                         </div>
                       ))}
                    </div>
                  </div>

                  {report.status === 'rejected' && metadata?.rejection_reason && (
                    <div className="p-5 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                       <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Reason for Rejection</p>
                       <p className="text-xs text-rose-200/70 italic leading-relaxed">{metadata.rejection_reason}</p>
                    </div>
                  )}

                  <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Physical Location</p>
                      <p className="text-[11px] font-bold text-white uppercase tracking-widest">Locker: {report.unit?.name || "TBD"}</p>
                      <p className="text-[9px] text-slate-500 font-medium">Room: {report.unit?.room?.name || "Warehouse Area"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={onClose}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
