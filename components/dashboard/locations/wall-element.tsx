"use client"

import React from "react"
import { motion, PanInfo } from "framer-motion"
import { StorageUnit } from "./types"

interface WallElementProps {
  unit: StorageUnit;
  gridSize?: number;
  siblings: StorageUnit[];
  containerRef: React.RefObject<HTMLDivElement>;
  onDragUpdate: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
}

export function WallElement({ unit, gridSize = 50, siblings, containerRef, onDragUpdate, onRemove }: WallElementProps) {
  const width = (unit.width || 1) * gridSize;
  const height = (unit.height || 1) * gridSize;
  const x = (unit.x || 0) * gridSize;
  const y = (unit.y || 0) * gridSize;

  const ux = unit.x ?? 0;
  const uy = unit.y ?? 0;
  const uw = unit.width ?? 1;
  const uh = unit.height ?? 1;

  // Neighbor Detection
  const hasLeft = siblings.some(s => s.type === 'WALL' && s.id !== unit.id && s.x === ux - 1 && s.y === uy);
  const hasRight = siblings.some(s => s.type === 'WALL' && s.id !== unit.id && s.x === ux + uw && s.y === uy);
  const hasTop = siblings.some(s => s.type === 'WALL' && s.id !== unit.id && s.y === uy - 1 && s.x === ux);
  const hasBottom = siblings.some(s => s.type === 'WALL' && s.id !== unit.id && s.y === uy + uh && s.x === ux);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const newX = Math.round((x + info.offset.x) / gridSize);
    const newY = Math.round((y + info.offset.y) / gridSize);
    onDragUpdate(unit.id, newX, newY);
  };

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0.05}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className={`group absolute bg-slate-800 border-slate-900 shadow-xl cursor-move z-20 
        ${!hasTop ? 'border-t-2' : ''} 
        ${!hasBottom ? 'border-b-2' : ''} 
        ${!hasLeft ? 'border-l-2' : ''} 
        ${!hasRight ? 'border-r-2' : ''}
        ${!hasTop && !hasLeft ? 'rounded-tl-sm' : ''}
        ${!hasTop && !hasRight ? 'rounded-tr-sm' : ''}
        ${!hasBottom && !hasLeft ? 'rounded-bl-sm' : ''}
        ${!hasBottom && !hasRight ? 'rounded-br-sm' : ''}
      `}
      style={{
        width: width,
        height: height,
        left: x,
        top: y,
      }}
    >
      {/* Texture / Inner Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Delete Action Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-error/20 backdrop-blur-[1px] transition-all flex items-center justify-center z-50">
         <button 
           onClick={(e) => { e.stopPropagation(); onRemove(unit.id); }}
           className="w-6 h-6 rounded-md bg-white text-error flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
         >
           <span className="material-symbols-outlined text-xs">close</span>
         </button>
      </div>
    </motion.div>
  )
}
