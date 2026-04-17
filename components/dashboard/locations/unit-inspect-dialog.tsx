"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, Calendar, Hash, Package } from "lucide-react"
import { StorageUnit, StoredReport } from "./types"
import { buttonSpring } from "@/constants/animations"

interface UnitInspectDialogProps {
  unit: StorageUnit | null;
  reports: StoredReport[];
  onClose: () => void;
}

export function UnitInspectDialog({ unit, reports, onClose }: UnitInspectDialogProps) {
  if (!unit) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Dialog Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-4xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-outline-variant/10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                  {unit.type} UNIT
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  ID: {unit.id.slice(0, 8)}
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">
                {unit.name}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto scrollbar-thin flex-1">
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Hash className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Serial Code</p>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase">
                  {unit.code || 'UNASSIGNED-001'}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Package className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Storage Fill</p>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {unit.currentLoad} / {unit.capacity} Slots Used
                </p>
              </div>
            </div>

            {/* Stored Items List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  Stored Archives ({reports.length})
                </h3>
              </div>

              {reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map(report => (
                    <div 
                      key={report.id}
                      className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{report.title}</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>{report.code}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {report.registeredAt}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                   <p className="text-xs font-bold text-slate-400 italic">No reports registered in this unit.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 bg-slate-50 dark:bg-slate-800 py-6 border-t border-outline-variant/10 flex justify-end gap-4">
             <button 
               onClick={onClose}
               className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
             >
               Dismiss
             </button>
             <motion.button 
               {...buttonSpring}
               className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 text-sm"
             >
               Update Assets
             </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
