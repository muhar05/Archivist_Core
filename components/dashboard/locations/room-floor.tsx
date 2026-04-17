"use client"

import React from "react"
import { motion } from "framer-motion"

interface RoomFloorProps {
  children: React.ReactNode;
  gridSize?: number; // 50px = 50cm
  widthUnits?: number;
  heightUnits?: number;
}

export function RoomFloor({ 
  children, 
  gridSize = 50, 
  widthUnits = 10, 
  heightUnits = 10 
}: RoomFloorProps) {
  const pixelWidth = widthUnits * gridSize;
  const pixelHeight = heightUnits * gridSize;

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center bg-slate-200 dark:bg-slate-950 p-12 transition-all duration-500">
      <div 
        className="relative bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border-[12px] border-slate-800 shadow-2xl"
        style={{
          width: pixelWidth + 24, // + walls
          height: pixelHeight + 24,
        }}
      >
        {/* Floor Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #64748b 1px, transparent 1px),
              linear-gradient(to bottom, #64748b 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`
          }}
        />

        {/* Actual Floor Surface */}
        <div 
          className="relative"
          style={{
            width: pixelWidth,
            height: pixelHeight,
          }}
        >
          {children}
        </div>

        {/* Ceiling Vignette / Depth Overlay */}
        <div className="absolute inset-0 pointer-events-none ring-[100px] ring-inset ring-black/5 shadow-[inset_0_0_120px_rgba(0,0,0,0.3)] z-40" />
      </div>
      
      {/* Dynamic Scale Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
        <span>Room Scale: {widthUnits * 0.5}m x {heightUnits * 0.5}m</span>
      </div>
    </div>
  )
}
