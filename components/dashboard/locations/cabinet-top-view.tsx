"use client"

import React from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { StorageUnit } from "./types"

interface CabinetTopViewProps {
  unit: StorageUnit;
  gridSize?: number;
  onClick: () => void;
  onDoubleClick: () => void;
  onDragUpdate: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  viewMode?: 'TOP' | 'ISO';
}

export function CabinetTopView({ 
  unit, 
  gridSize = 50, 
  onClick, 
  onDoubleClick, 
  onDragUpdate, 
  onRemove, 
  containerRef,
  viewMode = 'TOP'
}: CabinetTopViewProps) {
  const width = (unit.width || 2) * gridSize;
  const height = (unit.height || 1) * gridSize;
  const x = (unit.x || 0) * gridSize;
  const y = (unit.y || 0) * gridSize;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const newX = Math.round((x + info.offset.x) / gridSize);
    const newY = Math.round((y + info.offset.y) / gridSize);
    onDragUpdate(unit.id, newX, newY);
  };

  const isBlueprint = viewMode === 'TOP';

  const bgStyles = isBlueprint 
    ? "bg-sky-500/10 border-sky-400/50" 
    : {
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
      className={`group absolute transition-all duration-1000 ${viewMode === 'ISO' ? 'z-30' : 'z-20'}`}
      style={{
        width: width - 4,
        height: height - 4,
        left: x + 2,
        top: y + 2,
        transformStyle: 'preserve-3d',
        transform: viewMode === 'ISO' ? `translateZ(60px)` : 'translateZ(0px)'
      }}
    >
      {/* 3D Side Faces (Only visible in ISO) */}
      <AnimatePresence>
        {viewMode === 'ISO' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Front Face */}
            <div 
              className={`absolute bottom-0 inset-x-0 h-[60px] origin-bottom -rotate-x-90 border-x-2 border-b-2 shadow-inner ${bgStyles}`}
              style={{ transform: 'translateY(60px) rotateX(-90deg)' }}
            />
            {/* Right Face */}
            <div 
              className={`absolute top-0 right-0 h-full w-[60px] origin-right rotate-y-90 border-y-2 border-r-2 ${bgStyles}`}
              style={{ transform: 'translateX(0px) rotateY(90deg)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Face / Schematic Face */}
      <div className={`relative w-full h-full rounded-sm border-2 shadow-2xl flex items-center justify-center transition-all duration-1000 ${bgStyles} ${isBlueprint ? 'shadow-sky-500/20' : ''}`}>
        {/* Top Handle / Detail (Only in Reality) */}
        {!isBlueprint && <div className="absolute top-1 left-1.5 right-1.5 h-1 bg-white/10 rounded-full" />}
        
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
          <span className={`text-[10px] font-black uppercase tracking-tighter block leading-tight transition-colors duration-1000 ${isBlueprint ? 'text-sky-400' : 'text-white/40'}`}>
            {unit.name}
          </span>
          {isBlueprint && (
            <span className="text-[8px] font-bold text-sky-500/50 uppercase block mt-1">
              {unit.width}x{unit.height}
            </span>
          )}
        </div>

        {/* Decorative Shading (Only in Reality) */}
        {!isBlueprint && <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />}
      </div>
    </motion.div>
  )
}
