"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Layout, Maximize2 } from "lucide-react"

interface AddRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (config: { name: string; floor_number: number; grid_width: number; grid_height: number }) => void;
}

export function AddRoomDialog({ isOpen, onClose, onAdd }: AddRoomDialogProps) {
  const [name, setName] = useState("")
  const [floorNumber, setFloorNumber] = useState(1)
  const [gridWidth, setGridWidth] = useState(50)
  const [gridHeight, setGridHeight] = useState(50)

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name) return;
    onAdd({ name, floor_number: floorNumber, grid_width: gridWidth, grid_height: gridHeight });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/10 p-10 overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 rounded-full" />
          
          <div className="flex justify-between items-center mb-10 relative">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">
                Register Facility
              </h2>
              <p className="text-xs font-medium text-slate-400">Configure new warehouse storage area</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-error transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8 relative">
            {/* Primary Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 flex items-center gap-2">
                  <Layout className="w-3 h-3 text-primary" /> Facility Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Vault Alpha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                />
              </div>

              <div className="space-y-3 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-primary">layers</span> Floor Number
                </label>
                <input 
                  type="number"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Grid Configuration */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Grid Precision</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{gridWidth}px × {gridHeight}px</span>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Grid Width</span>
                    <input 
                      type="range" min="10" max="200" step="10"
                      value={gridWidth} onChange={(e) => setGridWidth(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Grid Height</span>
                    <input 
                      type="range" min="10" max="200" step="10"
                      value={gridHeight} onChange={(e) => setGridHeight(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4 relative">
            <button 
              onClick={onClose}
              className="flex-1 py-5 text-sm font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!name}
              className="flex-1 py-5 bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/30"
            >
              Start Building
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
