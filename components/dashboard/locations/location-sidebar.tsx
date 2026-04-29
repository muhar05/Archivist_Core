"use client"

import React from "react"
import { motion } from "framer-motion"
import { Plus, Layout, Warehouse, Settings2, Box, Info } from "lucide-react"
import { StorageUnit } from "./types"

interface LocationSidebarProps {
  rooms: StorageUnit[];
  activeRoomId: string | null;
  onRoomSelect: (room: StorageUnit) => void;
  onAddRoom: () => void;
}

export function LocationSidebar({ 
  rooms, 
  activeRoomId, 
  onRoomSelect, 
  onAddRoom 
}: LocationSidebarProps) {
  return (
    <div className="w-80 h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Warehouse className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-black text-lg tracking-tight">Facility Manager</h2>
          </div>
          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archival Core v2.0</p>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        <div className="px-2 mb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Facilities</span>
        </div>
        
        {rooms.map((room) => {
          const isActive = room.id === activeRoomId;
          return (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room)}
              className={`w-full group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 shadow-xl shadow-primary/5 border border-primary/20' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-full" 
                />
              )}
              
              <div className={`mt-1 p-2 rounded-xl transition-colors ${
                isActive ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:text-primary'
              }`}>
                <Layout className="w-4 h-4" />
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-sm truncate ${isActive ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                    {room.name}
                  </h3>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-400">
                    {room.code}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Box className="w-3 h-3" />
                    {room.children?.length || 0} Blocks
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>{room.capacity ? Math.round((room.currentLoad || 0) / room.capacity * 100) : 0}% Cap.</span>
                </div>
              </div>
            </button>
          );
        })}

        <button 
          onClick={onAddRoom}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 mt-4 group"
        >
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span className="font-heading font-black text-xs uppercase tracking-widest">Register Room</span>
        </button>
      </div>

      {/* Sidebar Footer/Stats */}
      <div className="p-6 bg-slate-100 dark:bg-slate-950/50">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Facility Health</span>
          </div>
          <div className="space-y-3">
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-2/3 rounded-full" />
            </div>
            <p className="text-[9px] font-bold text-slate-400">System is operating within optimal capacity parameters.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
