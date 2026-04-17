"use client"

import React from "react"
import { motion } from "framer-motion"
import { Building2, Layers, MapPin, Users } from "lucide-react"
import { StorageUnit } from "./types"
import { buttonSpring } from "@/constants/animations"

interface RoomCardProps {
  room: StorageUnit;
  onClick: () => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  // Mock floor count for visualization
  const floorCount = 2;
  const loadPercent = room.capacity ? (room.currentLoad! / room.capacity) * 100 : 0;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className="group bg-white dark:bg-slate-900 rounded-4xl border border-outline-variant/10 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
        <Building2 className="w-16 h-16 text-primary/20 group-hover:text-primary/40 transition-colors" />
        
        <div className="absolute bottom-4 left-4 flex gap-2">
           <div className="px-3 py-1 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">
             {floorCount} FLOORS
           </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white mb-1">
              {room.name}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Main Facility • {room.code || 'SEC-01'}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Capacity</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">{room.capacity} Units</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Staff</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">Active</p>
          </div>
        </div>

        {/* Occupation Bar */}
        <div className="space-y-2">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
             <span className="text-slate-400">Inventory Load</span>
             <span className={loadPercent > 80 ? 'text-error' : 'text-primary'}>{Math.round(loadPercent)}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${loadPercent}%` }}
                className={`h-full ${loadPercent > 80 ? 'bg-error' : 'bg-primary'}`}
              />
           </div>
        </div>

        <motion.button 
          {...buttonSpring}
          className="mt-8 w-full py-4 bg-slate-900 text-white font-bold rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all"
        >
          Open Room Floorplan
        </motion.button>
      </div>
    </motion.div>
  )
}
