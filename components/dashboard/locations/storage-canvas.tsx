"use client"

import React from "react"
import { motion } from "framer-motion"
import { ChevronRight, Maximize2, Info, LayoutGrid, List } from "lucide-react"
import { StorageUnit } from "./types"
import { fadeInSubtle, staggerContainer, buttonSpring } from "@/constants/animations"

interface StorageCanvasProps {
  path: StorageUnit[];
  onDrillDown: (unit: StorageUnit) => void;
  onJumpTo: (index: number) => void;
  currentUnits: StorageUnit[];
  onInspect: (unit: StorageUnit) => void;
}

export function StorageCanvas({ path, onDrillDown, onJumpTo, currentUnits, onInspect }: StorageCanvasProps) {
  const currentUnit = path[path.length - 1];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full"
    >
      {/* Dynamic Breadcrumbs Area */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <button 
          onClick={() => onJumpTo(-1)}
          className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
        >
          WAREHOUSE
        </button>
        {path.map((unit, idx) => (
          <React.Fragment key={unit.id}>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <button 
              onClick={() => onJumpTo(idx)}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                idx === path.length - 1 ? 'text-primary' : 'text-slate-400 hover:text-primary'
              }`}
            >
              {unit.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between mb-8">
        <motion.div variants={fadeInSubtle}>
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">
            {currentUnit?.name || 'Main Overview'}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {currentUnit?.type || 'WAREHOUSE'} MANAGEMENT
          </p>
        </motion.div>

        <motion.div variants={fadeInSubtle} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button className="p-2 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-primary">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <List className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* The Arena (2D Grid) */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
        {currentUnits.length > 0 ? (
          <motion.div 
            variants={fadeInSubtle}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {currentUnits.map((unit) => {
              const capacityPercent = unit.capacity ? (unit.currentLoad! / unit.capacity) * 100 : 0;
              const isFull = capacityPercent >= 100;

              return (
                <motion.div 
                  key={unit.id}
                  whileHover={{ y: -4 }}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                        isFull ? 'bg-error' : 'bg-primary'
                      }`}>
                        <Maximize2 className="w-5 h-5" />
                      </div>
                      <div className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                        isFull ? 'bg-error/10 text-error' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {isFull ? 'Full' : 'Space Avail.'}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5 truncate group-hover:text-primary transition-colors">
                      {unit.name}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                      {unit.code || '--'}
                    </p>

                    {/* Capacity Indicator */}
                    <div className="space-y-2">
                       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                         <span className="text-slate-400">Load Factor</span>
                         <span className="text-slate-900 dark:text-white">{unit.currentLoad}/{unit.capacity} Items</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${capacityPercent}%` }}
                            className={`h-full ${isFull ? 'bg-error' : 'bg-primary'}`}
                          />
                       </div>
                    </div>
                  </div>

                  {/* Actions Overlay */}
                  <div className="flex border-t border-outline-variant/10">
                    <button 
                      onClick={() => onDrillDown(unit)}
                      className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border-r border-outline-variant/10"
                    >
                      Enter Unit
                    </button>
                    <button 
                      onClick={() => onInspect(unit)}
                      className="p-4 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            variants={fadeInSubtle}
            className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 dark:bg-slate-900/50 rounded-4xl border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-4xl flex items-center justify-center text-slate-200 dark:text-slate-700 mb-6 shadow-xl shadow-slate-200/50">
              <LayoutGrid className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">Empty Storage Unit</h3>
            <p className="text-sm text-slate-500 max-w-xs mb-8">
              No nested items found in this section. Start by creating a sub-unit using the explorer.
            </p>
            <motion.button 
              {...buttonSpring}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
            >
              Add First Sub-Unit
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
