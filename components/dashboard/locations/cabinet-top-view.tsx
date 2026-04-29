"use client"

import React from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { StorageUnit } from "./types"

interface CabinetTopViewProps {
  unit: StorageUnit;
  gridSize?: number;
  isSelected?: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onDragUpdate: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onRemove: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  viewMode?: 'TOP' | 'ISO';
}

export function CabinetTopView({ 
  unit, 
  gridSize = 50, 
  isSelected = false,
  onClick, 
  onDoubleClick, 
  onDragUpdate, 
  onResize,
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

  const handleResize = (e: React.MouseEvent, direction: 'right' | 'bottom' | 'both') => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = unit.width || 2;
    const startHeight = unit.height || 1;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = Math.round((moveEvent.clientX - startX) / gridSize);
      const deltaY = Math.round((moveEvent.clientY - startY) / gridSize);
      
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === 'right' || direction === 'both') {
        newWidth = Math.max(1, startWidth + deltaX);
      }
      if (direction === 'bottom' || direction === 'both') {
        newHeight = Math.max(1, startHeight + deltaY);
      }

      if (newWidth !== unit.width || newHeight !== unit.height) {
        onResize(unit.id, newWidth, newHeight);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const isBlueprint = viewMode === 'TOP';

  const bgStyles = isBlueprint 
    ? isSelected ? "bg-sky-500/20 border-sky-400" : "bg-sky-500/10 border-sky-400/50" 
    : {
        METAL: "bg-linear-to-br from-slate-400 to-slate-600 border-slate-700",
        WOOD: "bg-linear-to-br from-amber-700 to-amber-900 border-amber-950",
        GLASS: "bg-sky-100/30 backdrop-blur-md border-sky-200"
      }[unit.texture || 'METAL'];

  return (
    <motion.div
      layoutId={`cabinet-${unit.id}`}
      drag={viewMode === 'TOP'} // Only drag in TOP view for better control
      dragConstraints={containerRef}
      dragElastic={0.05}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isBlueprint ? 1.01 : 1.02, zIndex: 30 }}
      whileTap={{ cursor: "grabbing" }}
      className={`group absolute transition-all duration-300 ${viewMode === 'ISO' ? 'z-30' : 'z-20'} ${isSelected ? 'ring-2 ring-primary/50' : ''}`}
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
      <div className={`relative w-full h-full rounded-sm border-2 shadow-2xl flex items-center justify-center transition-all duration-300 ${bgStyles} ${isBlueprint ? 'shadow-sky-500/20' : ''}`}>
        {/* Resize Handles (Only in Blueprint + Selected) */}
        {isBlueprint && isSelected && (
          <>
            <div 
              className="absolute right-0 inset-y-0 w-2 cursor-ew-resize hover:bg-primary/20 transition-colors" 
              onMouseDown={(e) => handleResize(e, 'right')}
            />
            <div 
              className="absolute bottom-0 inset-x-0 h-2 cursor-ns-resize hover:bg-primary/20 transition-colors" 
              onMouseDown={(e) => handleResize(e, 'bottom')}
            />
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-primary/40 transition-colors z-50 flex items-center justify-center" 
              onMouseDown={(e) => handleResize(e, 'both')}
            >
               <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-primary" />
            </div>
          </>
        )}

        {/* Top Handle / Detail (Only in Reality) */}
        {!isBlueprint && <div className="absolute top-1 left-1.5 right-1.5 h-1 bg-white/10 rounded-full" />}
        
        {/* Hover Action Menu (Hidden if resizing) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-900/60 backdrop-blur-[2px] transition-all flex items-center justify-center gap-2 z-40">
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
        <div className="relative text-center pointer-events-none px-2 overflow-hidden">
          <span className={`text-[10px] font-black uppercase tracking-tighter block leading-tight transition-colors duration-300 ${isBlueprint ? 'text-sky-400' : 'text-white/40'}`}>
            {unit.name}
          </span>
          {isBlueprint && (
            <span className="text-[8px] font-bold text-sky-500/50 uppercase block mt-1">
              {unit.width}m × {unit.height}m
            </span>
          )}
        </div>

        {/* Decorative Shading (Only in Reality) */}
        {!isBlueprint && <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />}
      </div>
    </motion.div>
  )
}
