"use client"

import React from "react"
import { motion, PanInfo } from "framer-motion"
import { StorageUnit } from "./types"

interface CabinetTopViewProps {
  unit: StorageUnit;
  gridSize?: number;
  onClick: () => void;
  onDoubleClick: () => void;
  onDragUpdate: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function CabinetTopView({ unit, gridSize = 50, onClick, onDoubleClick, onDragUpdate, onRemove, containerRef }: CabinetTopViewProps) {
  const width = (unit.width || 2) * gridSize;
  const height = (unit.height || 1) * gridSize;
  const x = (unit.x || 0) * gridSize;
  const y = (unit.y || 0) * gridSize;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const newX = Math.round((x + info.offset.x) / gridSize);
    const newY = Math.round((y + info.offset.y) / gridSize);
    onDragUpdate(unit.id, newX, newY);
  };

  const bgStyles = {
    METAL: "bg-linear-to-br from-slate-400 to-slate-600 border-slate-700",
    WOOD: "bg-linear-to-br from-amber-700 to-amber-900 border-amber-950",
    GLASS: "bg-sky-100/30 backdrop-blur-md border-sky-200"
  }[unit.texture || 'METAL'];

  return (
    <motion.div
      layoutId={`cabinet-${unit.id}`}
      drag
      dragConstraints={containerRef}
      dragElastic={0.05}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 30 }}
      whileTap={{ cursor: "grabbing" }}
      className={`group absolute cursor-pointer rounded-sm border-2 shadow-2xl transition-shadow hover:shadow-primary/30 flex items-center justify-center ${bgStyles}`}
      style={{
        width: width - 4,
        height: height - 4,
        left: x + 2,
        top: y + 2,
        zIndex: 20
      }}
    >
      {/* Top Handle / Detail */}
      <div className="absolute top-1 left-1.5 right-1.5 h-1 bg-white/10 rounded-full" />
      
      {/* Hover Action Menu */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-900/60 backdrop-blur-[2px] transition-all flex items-center justify-center gap-2 z-50">
         <button 
           onClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
           className="p-1 px-2.5 bg-white text-primary rounded-lg shadow-xl hover:scale-110 active:scale-95 transition-all"
         >
           <span className="material-symbols-outlined text-sm">open_in_new</span>
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); onRemove(unit.id); }}
           className="p-1 px-2.5 bg-white text-error rounded-lg shadow-xl hover:scale-110 active:scale-95 transition-all"
         >
           <span className="material-symbols-outlined text-sm">delete</span>
         </button>
      </div>

      {/* Label */}
      <div className="relative text-center pointer-events-none px-2">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter block leading-tight">
          {unit.name}
        </span>
      </div>

      {/* Decorative Shading */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
    </motion.div>
  )
}
