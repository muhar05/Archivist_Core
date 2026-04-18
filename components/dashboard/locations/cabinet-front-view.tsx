"use client"

import React from "react"
import { motion, PanInfo } from "framer-motion"
import { StorageUnit } from "./types"
import { Archive, Lock, Info } from "lucide-react"

interface CabinetFrontViewProps {
  stack: StorageUnit[];
  onLockerClick: (locker: StorageUnit) => void;
  onBack: () => void;
}

export function CabinetFrontView({ stack, onLockerClick, onBack }: CabinetFrontViewProps) {
  // Sort stack from top to bottom (highest stackOrder first)
  const sortedStack = [...stack].sort((a, b) => (b.stackOrder || 0) - (a.stackOrder || 0));
  const mainCabinet = sortedStack[0];

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
      layoutId={`cabinet-stack-${mainCabinet.x}-${mainCabinet.y}`}
      className="absolute inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col p-8 rounded-4xl border-12 border-slate-800 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10 px-4">
        <div>
          <button 
            onClick={onBack}
            className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline mb-3 flex items-center gap-1"
          >
            ← BACK TO ROOM
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Archive</span>
            <span className="text-slate-300">/</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor {mainCabinet.x},{mainCabinet.y}</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
            Vertical Storage Stack
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {stack.length} Units Stacked
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Operational
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Stack List */}
      <div className="flex-1 space-y-12 overflow-y-auto px-4 pb-12 scrollbar-thin">
        {sortedStack.map((cabinet, sIdx) => {
          const lockers = cabinet.children || [];
          return (
            <div key={cabinet.id} className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-lg">
                   LEVEL {stack.length - sIdx}
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                   {cabinet.name}
                 </h3>
                 <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {lockers.map((locker, idx) => {
                  const isFull = (locker.currentLoad || 0) >= (locker.capacity || 1);
                  return (
                    <motion.div
                      key={locker.id}
                      layout
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      onClick={() => onLockerClick(locker)}
                      className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-outline-variant/10 hover:border-primary transition-colors cursor-pointer shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-xl ${isFull ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-600'}`}>
                          {isFull ? <Lock className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
                        </div>
                        <span className="text-[9px] font-black text-slate-400">{locker.code}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                        {locker.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isFull ? 'text-slate-400' : 'text-emerald-500'}`}>
                          {isFull ? 'FULL' : 'AVAILABLE'}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}

                <button className="border-2 border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary transition-all min-h-[120px]">
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">New Slot</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
