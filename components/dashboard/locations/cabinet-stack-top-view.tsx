"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StorageUnit } from "./types"
import { Layers } from "lucide-react"

interface CabinetStackTopViewProps {
  units: StorageUnit[];
  gridSize?: number;
  onClick: () => void;
  onDoubleClick: () => void;
  onDragUpdate: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  viewMode?: 'TOP' | 'ISO';
}

export function CabinetStackTopView({ 
  units, 
  gridSize = 50, 
  onClick, 
  onDoubleClick, 
  onDragUpdate, 
  onRemove, 
  containerRef,
  viewMode = 'TOP'
}: CabinetStackTopViewProps) {
  const topUnit = [...units].sort((a, b) => (b.stackOrder || 0) - (a.stackOrder || 0))[0];
  const width = (topUnit.width || 2) * gridSize;
  const height = (topUnit.height || 1) * gridSize;
  const x = (topUnit.x || 0) * gridSize;
  const y = (topUnit.y || 0) * gridSize;

  const stackHeight = units.length * 60; // 60px per unit level

  const isBlueprint = viewMode === 'TOP';

  const bgStyles = isBlueprint
    ? "bg-sky-500/10 border-sky-400/50"
    : {
        METAL: "bg-linear-to-br from-slate-400 to-slate-600 border-slate-700",
        WOOD: "bg-linear-to-br from-amber-700 to-amber-900 border-amber-950",
        GLASS: "bg-sky-100/30 backdrop-blur-md border-sky-200"
      }[topUnit.texture || 'METAL'];

  return (
    <div 
      className={`absolute transition-all duration-1000 ${viewMode === 'ISO' ? 'z-30' : 'z-20'}`}
      style={{
        width: width,
        height: height,
        left: x,
        top: y,
        transformStyle: 'preserve-3d',
        transform: viewMode === 'ISO' ? `translateZ(${stackHeight}px)` : 'translateZ(0px)'
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
              className={`absolute bottom-0 inset-x-0 origin-bottom shadow-inner border-x-2 border-b-2 ${bgStyles}`}
              style={{ 
                height: `${stackHeight}px`,
                transform: `translateY(${stackHeight}px) rotateX(-90deg)` 
              }}
            >
               {/* Stacking indicator on front face */}
               <div className="flex flex-col h-full [transform:rotateX(0deg)]">
                  {[...Array(units.length)].map((_, i) => (
                    <div key={i} className="flex-1 border-t border-black/20" />
                  ))}
               </div>
            </div>
            {/* Right Face */}
            <div 
              className={`absolute top-0 right-0 h-full origin-right rotate-y-90 border-y-2 border-r-2 ${bgStyles}`}
              style={{ 
                width: `${stackHeight}px`,
                transform: 'translateX(0px) rotateY(90deg)' 
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Stack Layers (Always visible for top-down depth) */}
      {[...Array(Math.min(units.length - 1, 2))].map((_, i) => (
        <div 
          key={i}
          className={`absolute inset-x-1 inset-y-1 rounded-sm border transition-all duration-1000 ${
            isBlueprint 
              ? 'bg-sky-500/5 border-sky-400/20' 
              : 'bg-slate-800/20 border-slate-700/30 shadow-sm'
          }`}
          style={{ transform: `translate(${(i+1)*2}px, ${(i+1)*2}px)` }}
        />
      ))}

      <motion.div
        layoutId={`cabinet-stack-${topUnit.x}-${topUnit.y}`}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={`relative w-full h-full cursor-pointer rounded-sm border-2 shadow-2xl transition-all duration-1000 flex items-center justify-center ${bgStyles} ${isBlueprint ? 'shadow-sky-500/20' : 'hover:shadow-primary/40'}`}
      >
        {/* Stack Indicator Badge */}
        <div className={`absolute -top-3 -right-3 text-[10px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1 z-50 transition-all duration-1000 ${
          isBlueprint 
            ? 'bg-sky-400 text-slate-900' 
            : 'bg-primary text-white'
        }`}>
          <Layers className="w-3 h-3" />
          {units.length}
        </div>

        <div className={`relative text-center pointer-events-none px-2 scale-90 transition-colors duration-1000 ${isBlueprint ? 'text-sky-400' : 'text-white'}`}>
          <p className="text-[10px] font-black uppercase tracking-tighter leading-tight opacity-40">
            STACKED
          </p>
          <p className={`text-[8px] font-bold uppercase tracking-[0.2em] ${isBlueprint ? 'text-sky-500' : 'text-white/30'}`}>
            L1-{units.length}
          </p>
        </div>

        {/* Decorative Shading (Only Reality) */}
        {!isBlueprint && <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/30 to-transparent pointer-events-none" />}
      </motion.div>
    </div>
  )
}
