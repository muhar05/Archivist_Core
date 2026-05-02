"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { getRoomsAction } from "@/actions/locationActions"
import { motion } from "framer-motion"
import { Warehouse, MapPin, ChevronRight, Layout } from "lucide-react"
import Link from "next/link"

export default function LocationsPage() {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRoomsAction()
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="max-w-md w-full p-12 bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary">
            <Warehouse className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">No Rooms Yet</h1>
          <p className="text-slate-400 mb-10 leading-relaxed font-medium">
            There are no storage facilities configured in the system yet. Please ask an Administrator to setup the layout in the Architect module.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Warehouse Locations</h1>
        <p className="text-slate-500 text-sm">Browse and explore available storage facilities across all floors</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, idx) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              href={`/location/${room.id}`}
              className="group flex flex-col bg-slate-900/50 border border-white/5 rounded-4xl p-8 hover:border-primary/50 transition-all hover:bg-slate-900 shadow-xl hover:shadow-primary/5"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                  <Layout className="w-7 h-7 text-slate-500 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">Level</span>
                  <span className="text-2xl font-black text-white italic">0{room.floor_number}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors">{room.name}</h3>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Main Facility Area</span>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary/40 animate-pulse" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Monitoring</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
