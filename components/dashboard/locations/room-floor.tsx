"use client"

import React from "react"
import { motion } from "framer-motion"

interface RoomFloorProps {
  children: React.ReactNode;
  gridSize?: number; // 50px = 50cm
  widthUnits?: number;
  heightUnits?: number;
  viewMode?: 'TOP' | 'ISO';
}

export function RoomFloor({ 
  children, 
  gridSize = 50, 
  widthUnits = 10, 
  heightUnits = 10,
  viewMode = 'TOP'
}: RoomFloorProps) {
  const pixelWidth = widthUnits * gridSize;
  const pixelHeight = heightUnits * gridSize;

  const isBlueprint = viewMode === 'TOP';

  return (
    <div className={`relative w-full h-full min-h-[700px] flex items-center justify-center transition-all duration-1000 overflow-hidden ${
      isBlueprint 
        ? 'bg-[#0f172a]' // Blueprint Deep Blue
        : 'bg-slate-200 dark:bg-slate-950'
    } ${viewMode === 'ISO' ? '[perspective:2000px] mt-12' : ''}`}>
      
      <div 
        className={`relative rounded-3xl border-[12px] shadow-2xl transition-all duration-1000 ease-in-out ${
          isBlueprint
            ? 'bg-[#1e293b] border-[#334155] shadow-[0_0_50px_rgba(30,41,59,0.5)]'
            : 'bg-slate-100 dark:bg-slate-900 border-slate-800'
        } ${
          viewMode === 'ISO' 
            ? 'rotate-x-[55deg] rotate-z-[-35deg] shadow-[0_50px_100px_rgba(0,0,0,0.5)] translate-y-[-50px]' 
            : 'rotate-0'
        }`}
        style={{
          width: pixelWidth + 24, 
          height: pixelHeight + 24,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Floor Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            opacity: isBlueprint ? 0.4 : 0.1,
            backgroundImage: isBlueprint
              ? `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`
              : `linear-gradient(to right, #64748b 1px, transparent 1px),
                 linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`
          }}
        />

        {/* actual Floor Surface */}
        <div 
          className="relative transition-colors duration-1000"
          style={{
            width: pixelWidth,
            height: pixelHeight,
            backgroundColor: isBlueprint ? '#1e293b' : 'transparent',
            backgroundImage: isBlueprint
              ? `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`
              : `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
            backgroundSize: `50px 50px`
          }}
        >
          {children}
        </div>

        {/* Realistic Ceiling Vignette Overlay (Only in ISO) */}
        {!isBlueprint && (
          <div 
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background: 'radial-gradient(circle at center, transparent 30%, rgba(15, 23, 42, 0.15) 100%)',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.5)'
            }}
          />
        )}
      </div>
      
      {/* Dynamic Scale Indicator */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 backdrop-blur-md px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl border transition-all duration-1000 ${
        isBlueprint
          ? 'bg-[#0f172a]/80 text-sky-400 border-sky-900/50'
          : 'bg-slate-900/80 text-white border-white/10'
      }`}>
        <span className="opacity-50">Dimension:</span>
        <span>{widthUnits * 0.5}m × {heightUnits * 0.5}m</span>
      </div>
    </div>
  )
}
