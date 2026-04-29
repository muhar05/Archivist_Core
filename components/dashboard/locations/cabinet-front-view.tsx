"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { StorageUnit } from "./types"
import { Archive, Lock, Hammer } from "lucide-react"
import { CabinetDesigner } from "./cabinet-designer"

interface CabinetFrontViewProps {
  stack: StorageUnit[];
  onLockerClick: (locker: StorageUnit) => void;
  onBack: () => void;
}

export function CabinetFrontView({ stack, onLockerClick, onBack }: CabinetFrontViewProps) {
  const [designingUnitId, setDesigningUnitId] = useState<string | null>(null);

  // Sort stack from top to bottom (highest stackOrder first)
  const sortedStack = [...stack].sort((a, b) => (b.stackOrder || 0) - (a.stackOrder || 0));
  const mainCabinet = sortedStack[0];

  const designingUnit = useMemo(() => 
    stack.find(u => u.id === designingUnitId), 
    [stack, designingUnitId]
  );

  if (designingUnit) {
    return (
      <CabinetDesigner 
        unit={designingUnit} 
        onBack={() => setDesigningUnitId(null)} 
        onSave={() => setDesigningUnitId(null)}
        onLockerClick={onLockerClick}
      />
    );
  }

  return (
    <motion.div 
      layoutId={`cabinet-stack-${mainCabinet.x}-${mainCabinet.y}`}
      className="absolute inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col p-8 rounded-4xl border-16 border-slate-800 shadow-2xl overflow-hidden"
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Archive elevation</span>
            <span className="text-slate-300">/</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coord {mainCabinet.x},{mainCabinet.y}</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
            Storage Matrix <span className="text-slate-300 font-light">Stack Overview</span>
          </h2>
        </div>
      </div>

      {/* Vertical Stack List */}
      <div className="flex-1 space-y-12 overflow-y-auto px-4 pb-12 scrollbar-thin">
        {sortedStack.map((cabinet, sIdx) => {
          const lockers = cabinet.children?.filter(c => c.type !== 'DIVIDER') || [];
          return (
            <div key={cabinet.id} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-lg">
                     LEVEL {stack.length - sIdx}
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                     {cabinet.name}
                   </h3>
                </div>
                <button 
                  onClick={() => setDesigningUnitId(cabinet.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                >
                  <Hammer className="w-3 h-3" />
                  Redesign Internals
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {lockers.map((locker) => {
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
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
