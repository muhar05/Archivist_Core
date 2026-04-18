"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Layout, Code, Users, Maximize2 } from "lucide-react"

interface AddRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (config: { name: string; code: string; capacity: number; width: number; height: number }) => void;
}

export function AddRoomDialog({ isOpen, onClose, onAdd }: AddRoomDialogProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [capacity, setCapacity] = useState(100)
  const [width, setWidth] = useState(14)
  const [height, setHeight] = useState(12)

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name || !code) return;
    onAdd({ name, code, capacity, width, height });
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

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 flex items-center gap-2">
                  <Code className="w-3 h-3 text-primary" /> Area Code
                </label>
                <input 
                  type="text"
                  placeholder="SEC-A-01"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 flex items-center gap-2">
                  <Users className="w-3 h-3 text-primary" /> Max Capacity
                </label>
                <input 
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Floorplan Dimensions */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Floor Dimensions</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{width} × {height} Grid Units</span>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Width Units</span>
                    <input 
                      type="range" min="8" max="40" step="1"
                      value={width} onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Height Units</span>
                    <input 
                      type="range" min="8" max="40" step="1"
                      value={height} onChange={(e) => setHeight(Number(e.target.value))}
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
              disabled={!name || !code}
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
