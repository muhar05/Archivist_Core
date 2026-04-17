"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Maximize } from "lucide-react"
import { buttonSpring } from "@/constants/animations"

interface AddCabinetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (config: { name: string; width: number; height: number; texture: 'METAL' | 'WOOD' }) => void;
  gridX: number;
  gridY: number;
}

export function AddCabinetDialog({ isOpen, onClose, onAdd, gridX, gridY }: AddCabinetDialogProps) {
  const [name, setName] = useState(`Lemari ${gridX}-${gridY}`)
  const [width, setWidth] = useState(2)
  const [height, setHeight] = useState(1)
  const [texture, setTexture] = useState<'METAL' | 'WOOD'>('METAL')

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/10 p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              Place Cabinet
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Width (Units)</label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                  <Maximize className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="bg-transparent border-none w-full text-sm font-bold outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Depth (Units)</label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                  <Maximize className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="bg-transparent border-none w-full text-sm font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Finish Texture</label>
              <div className="flex gap-2">
                {(['METAL', 'WOOD'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTexture(t)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      texture === t 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <motion.button 
              {...buttonSpring}
              onClick={() => onAdd({ name, width, height, texture })}
              className="flex-1 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 text-xs"
            >
              Place at {gridX}, {gridY}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
