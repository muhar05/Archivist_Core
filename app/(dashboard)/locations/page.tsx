"use client"

import React from "react"
import { Warehouse, Plus } from "lucide-react"

export default function LocationsPage() {
  return (
    <div className="h-[calc(100vh-100px)] -m-8 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full p-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary">
          <Warehouse className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Setup Facility Layout
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
          Welcome to the Locations Manager. You can now begin designing your warehouse floor plan from scratch.
        </p>

        <button 
          className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create First Room
        </button>
      </div>
    </div>
  )
}
