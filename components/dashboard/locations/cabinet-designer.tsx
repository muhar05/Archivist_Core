"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { Plus, Trash2, Eye, Box, Hammer, GripHorizontal, ChevronLeft } from "lucide-react"
import { StorageUnit } from "./types"

interface CabinetDesignerProps {
  unit: StorageUnit;
  onBack: () => void;
  onSave?: (unit: StorageUnit) => void;
  onLockerClick?: (locker: StorageUnit) => void;
}

export function CabinetDesigner({ unit, onBack, onSave, onLockerClick }: CabinetDesignerProps) {
  const [mode, setMode] = useState<'EDIT' | 'VIEW'>('EDIT')
  const [texture, setTexture] = useState<'WOOD' | 'METAL'>(unit.texture === 'WOOD' ? 'WOOD' : 'METAL')
  const [dividers, setDividers] = useState<number[]>(
    unit.children?.filter(c => c.type === 'DIVIDER').map(c => c.verticalPos || 0).sort((a, b) => a - b) || [25, 50, 75]
  )

  const handleAddDivider = () => {
    if (dividers.length >= 10) return;
    const lastPos = dividers.length > 0 ? dividers[dividers.length - 1] : 0;
    const newPos = Math.min(95, lastPos + 10);
    setDividers([...dividers, newPos].sort((a, b) => a - b));
  }

  const handleRemoveDivider = (index: number) => {
    setDividers(dividers.filter((_, i) => i !== index));
  }

  const handleDividerDrag = (index: number, info: PanInfo) => {
    const container = document.getElementById('cabinet-shell');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const newY = info.point.y - rect.top;
    const newPercent = Math.max(5, Math.min(95, (newY / rect.height) * 100));
    
    const newDividers = [...dividers];
    newDividers[index] = newPercent;
    setDividers(newDividers.sort((a, b) => a - b));
  }

  // Calculate shelves based on dividers
  const shelves = useMemo(() => {
    const sorted = [0, ...dividers, 100];
    const results = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      results.push({
        top: sorted[i],
        bottom: sorted[i+1],
        height: sorted[i+1] - sorted[i],
        id: `shelf-${i}`,
        index: i
      });
    }
    return results;
  }, [dividers]);

  const isWood = texture === 'WOOD';

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Designer Header */}
      <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
             <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Elevation Designer</span>
                <span className="text-slate-300">/</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{unit.code}</span>
             </div>
             <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                {unit.name} <span className="text-slate-400/40 font-light ml-2 font-heading">Internal Matrix</span>
             </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shadow-inner">
          <button 
            onClick={() => setMode('EDIT')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${
              mode === 'EDIT' ? 'bg-white dark:bg-slate-700 shadow-xl text-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Hammer className="w-4 h-4" />
            DESIGN MODE
          </button>
          <button 
            onClick={() => setMode('VIEW')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${
              mode === 'VIEW' ? 'bg-white dark:bg-slate-700 shadow-xl text-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Eye className="w-4 h-4" />
            INSPECT MODE
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Area */}
        <div className="flex-1 p-12 flex items-center justify-center overflow-auto bg-slate-100/50 dark:bg-slate-950/50 relative">
           {/* Background Grid Pattern */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[40px_40px]" />

           <div className="relative h-[850px] w-[550px] group perspective-[2000px]">
              {/* Cabinet Frame/Shell */}
              <div 
                id="cabinet-shell"
                className={`absolute inset-0 rounded-[2.5rem] border-20 shadow-[0_80px_150px_rgba(0,0,0,0.5)] transition-all duration-1000 overflow-hidden ${
                  isWood 
                    ? 'bg-[#1a0f0a] border-[#3e2723] shadow-amber-950/40' 
                    : 'bg-[#0f172a] border-[#1e293b] shadow-slate-950/60'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Decorative Grain/Texture Overlay */}
                <div className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000 ${
                  isWood 
                    ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]' 
                    : 'bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[20px_100%]'
                }`} />

                {/* Shelves Rendering */}
                {shelves.map((shelf) => (
                  <div 
                    key={shelf.id}
                    className="absolute inset-x-0 transition-all duration-500 flex flex-col items-center justify-center group/shelf"
                    style={{ top: `${shelf.top}%`, height: `${shelf.height}%` }}
                  >
                    {/* Inner Shadow for depth */}
                    <div className="absolute inset-0 shadow-[inset_0_8px_30px_rgba(0,0,0,0.6)] pointer-events-none" />
                    
                    {/* Content Rendering */}
                    <AnimatePresence mode="wait">
                      {mode === 'VIEW' ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="w-full h-full flex flex-wrap content-start gap-4 p-6 overflow-hidden"
                        >
                           {[...Array(Math.floor(shelf.height / 10) + 1)].map((_, li) => (
                             <div 
                               key={li} 
                               onClick={() => onLockerClick?.({
                                 id: `locker-${shelf.index}-${li}`,
                                 name: `Slot ${shelf.index + 1}-${li + 1}`,
                                 type: 'BOX',
                                 code: `A-0${shelf.index}-${li+1}`,
                                 parentId: unit.id,
                                 path: `${unit.path}.L${li}`
                               })}
                               className="w-24 h-32 bg-white/5 dark:bg-slate-800/40 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 backdrop-blur-sm hover:border-primary/50 transition-colors group/locker cursor-pointer"
                             >
                                <Box className="w-6 h-6 text-white/10 group-hover/locker:text-primary transition-colors" />
                                <span className="text-[8px] font-black text-white/20 group-hover/locker:text-white transition-colors">A-0{shelf.index}-{li+1}</span>
                             </div>
                           ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="relative text-center opacity-20 group-hover/shelf:opacity-60 transition-opacity"
                        >
                           <Box className="w-12 h-12 text-white/10 mx-auto mb-3" />
                           <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">
                                 Section {(shelf.height * 2).toFixed(0)}cm
                              </span>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Interactive Dividers */}
                {mode === 'EDIT' && dividers.map((pos, idx) => (
                  <motion.div
                    key={`div-${idx}`}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDrag={(e, info) => handleDividerDrag(idx, info)}
                    className="absolute inset-x-0 h-8 -translate-y-1/2 flex items-center z-40 cursor-ns-resize group/div"
                    style={{ top: `${pos}%` }}
                  >
                     {/* The Actual Divider Plate */}
                     <div className={`w-full h-4 border-y-2 transition-all duration-300 shadow-2xl ${
                        isWood 
                          ? 'bg-[#3e2723] border-[#5d4037] group-hover/div:bg-amber-800' 
                          : 'bg-slate-700 border-slate-600 group-hover/div:bg-slate-500'
                     } group-hover/div:shadow-primary/20 flex items-center justify-center overflow-hidden`}>
                        <div className="w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[10px_10px]" />
                        <GripHorizontal className="absolute w-5 h-5 text-white/10 group-hover/div:text-white/40" />
                     </div>

                     {/* Action Buttons */}
                     <motion.button 
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={() => handleRemoveDivider(idx)}
                       className="absolute right-6 w-10 h-10 rounded-2xl bg-error text-white opacity-0 group-hover/div:opacity-100 transition-all flex items-center justify-center shadow-2xl z-50 border-2 border-white/10"
                     >
                       <Trash2 className="w-5 h-5" />
                     </motion.button>

                     {/* Tooltip */}
                     <div className="absolute left-6 px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg opacity-0 group-hover/div:opacity-100 transition-opacity border border-white/10 shadow-2xl">
                        {pos.toFixed(1)}% Elevation
                     </div>
                  </motion.div>
                ))}
              </div>

              {/* Floor Shadow */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[110%] h-16 bg-black/40 blur-3xl rounded-[100%] pointer-events-none" />
           </div>
        </div>

        {/* Designer Sidebar */}
        <div className="w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col">
           <div className="mb-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Visual Style</h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { id: 'WOOD', label: 'Polished Oak', color: 'bg-amber-900' },
                   { id: 'METAL', label: 'Brushed Steel', color: 'bg-slate-700' }
                 ].map(t => (
                   <button
                     key={t.id}
                     onClick={() => setTexture(t.id as 'WOOD' | 'METAL')}
                     className={`flex flex-col gap-3 p-4 rounded-3xl border-2 transition-all ${
                       texture === t.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800'
                     }`}
                   >
                     <div className={`w-full h-12 rounded-xl ${t.color} shadow-inner`} />
                     <span className={`text-[10px] font-black uppercase tracking-widest ${texture === t.id ? 'text-primary' : 'text-slate-500'}`}>
                        {t.label}
                     </span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="mb-10 flex-1">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Matrix</h3>
                 <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md">{dividers.length} DIVIDERS</span>
              </div>
              
              <div className="space-y-3">
                 {dividers.map((pos, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                            {i + 1}
                         </div>
                         <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Horizontal Plate</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{pos.toFixed(1)}% Elevation</span>
                   </div>
                 ))}
              </div>

              <button 
                onClick={handleAddDivider}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary/50 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <Plus className="w-4 h-4" />
                Add Horizontal Plate
              </button>
           </div>

           <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <button 
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                onClick={() => onSave?.(unit)}
              >
                 Finalize Cabinet Layout
              </button>
              <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Changes persist to system database</p>
           </div>
        </div>
      </div>
    </div>
  )
}
