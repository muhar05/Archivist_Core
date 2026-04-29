"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, Calendar, Hash, Printer, Plus, FolderOpen } from "lucide-react"
import { StorageUnit, StoredReport } from "./types"
import { buttonSpring } from "@/constants/animations"

interface LockerDetailsModalProps {
  unit: StorageUnit | null;
  reports: StoredReport[];
  onClose: () => void;
  onAddReport?: (unitId: string) => void;
  onPrintLabel?: (unitId: string) => void;
}

export function LockerDetailsModal({ 
  unit, 
  reports, 
  onClose, 
  onAddReport, 
  onPrintLabel 
}: LockerDetailsModalProps) {
  if (!unit) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Dialog Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Decorative Header Bar */}
          <div className="h-2 bg-primary w-full" />

          {/* Header */}
          <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-start gap-6">
               <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                  <FolderOpen className="w-8 h-8" />
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/10">
                      Archive Slot
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      COORD: {unit.code || '--'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">
                    {unit.name}
                  </h2>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-10 overflow-hidden flex-1 flex flex-col">
            {/* Meta Stats (No Capacity Limit) */}
            <div className="grid grid-cols-2 gap-6 mb-10">
               <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-slate-400 mb-2">
                     <FileText className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Reports Contained</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{reports.length} Items</p>
               </div>
               <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-slate-400 mb-2">
                     <Hash className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Internal ID</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate uppercase">{unit.id.slice(0, 16)}</p>
               </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
              <div className="space-y-3 pb-4">
                {reports.length > 0 ? (
                  reports.map(report => (
                    <motion.div 
                      key={report.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-700 group-hover:bg-primary group-hover:text-white transition-all">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white mb-1">{report.title}</p>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="text-primary/70">{report.code}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {report.registeredAt}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="p-3 text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                         <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-10 bg-slate-50/50 dark:bg-slate-800/30 rounded-4xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                     <FileText className="w-10 h-10 text-slate-300 mb-3" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Slot is currently empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-10 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-6">
             <div className="flex gap-4">
                <motion.button 
                  {...buttonSpring}
                  onClick={() => onPrintLabel?.(unit.id)}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-black text-[10px] uppercase tracking-widest hover:border-primary/50 transition-all shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Label
                </motion.button>
             </div>

             <motion.button 
               {...buttonSpring}
               onClick={() => onAddReport?.(unit.id)}
               className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 text-[10px] uppercase tracking-[0.2em]"
             >
               <Plus className="w-4 h-4" />
               Add Report to this Slot
             </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
