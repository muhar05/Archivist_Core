"use client"

import React from "react"
import { motion, PanInfo } from "framer-motion"
import { StorageUnit } from "./types"
import { Archive, Lock, Info } from "lucide-react"

interface CabinetFrontViewProps {
  cabinet: StorageUnit;
  onLockerClick: (locker: StorageUnit) => void;
  onBack: () => void;
}

export function CabinetFrontView({ cabinet, onLockerClick, onBack }: CabinetFrontViewProps) {
  const lockers = cabinet.children || [];

  const handleDragEnd = (idx: number, info: PanInfo) => {
    // In a real app, calculate new index based on drop position
    // For now, we'll demonstrate the capability
    if (Math.abs(info.offset.x) > 50 || Math.abs(info.offset.y) > 50) {
      console.log(`Reordering locker at index ${idx}`);
      // Notify parent of potential reorder
    }
  };

  return (
    <motion.div 
      layoutId={`cabinet-${cabinet.id}`}
      className="absolute inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col p-8 rounded-4xl border-12 border-slate-800 shadow-2xl overflow-hidden"
    >
      {/* Cabinet Frame Overlay */}
      <div className="absolute inset-x-0 top-0 h-4 bg-slate-700/50 blur-sm pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-10 px-4">
        <div>
          <button 
            onClick={onBack}
            className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline mb-2 flex items-center gap-1"
          >
            ← BACK TO ROOM FLOORPLAN
          </button>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
            {cabinet.name}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            INTERNAL SLOTS DESIGNER • {lockers.length} UNITS
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                   <Archive className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                   <p className="text-sm font-black text-slate-900 dark:text-white">Operational</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Internal Locker Grid with DND */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto p-4 scrollbar-thin">
        {lockers.map((locker, idx) => {
          const isFull = (locker.currentLoad || 0) >= (locker.capacity || 1);
          
          return (
            <motion.div
              key={locker.id}
              layout
              drag
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => handleDragEnd(idx, info)}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              whileDrag={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              onClick={() => onLockerClick(locker)}
              className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-outline-variant/10 hover:border-primary transition-colors cursor-grab active:cursor-grabbing shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${isFull ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-600'}`}>
                  {isFull ? <Lock className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                {locker.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Slot {locker.code || (idx + 1).toString().padStart(2, '0')}
              </p>

              {/* Status Indicator Bar */}
              <div className="mt-6 flex items-center justify-between">
                <div className={`w-2 h-2 rounded-full ${isFull ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${isFull ? 'text-slate-400' : 'text-emerald-500'}`}>
                  {isFull ? 'FULL' : 'AVAILABLE'}
                </span>
              </div>
            </motion.div>
          )
        })}

        {/* Add Slot Button */}
        <button className="border-2 border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary/40 transition-all min-h-[160px]">
          <div className="w-10 h-10 rounded-full border border-dashed border-current flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">add</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Add New Slot</span>
        </button>
      </div>
    </motion.div>
  )
}
