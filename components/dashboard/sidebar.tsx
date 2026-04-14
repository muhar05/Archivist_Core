"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard", fillIcon: true },
  { name: "Records", href: "/dashboard/records", icon: "inventory_2" },
  { name: "Locations", href: "/dashboard/locations", icon: "location_on" },
  { name: "Loans", href: "/dashboard/loans", icon: "assignment_return" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "analytics" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col fixed left-0 top-0 pt-16 z-40 bg-slate-50 dark:bg-slate-950 h-screen w-64 font-heading font-medium text-sm border-r border-outline-variant/10">
      <div className="px-6 py-8 flex flex-col gap-2 h-full">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 primary-gradient rounded-lg flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div>
            <div className="text-lg font-black tracking-tighter text-primary dark:text-white leading-tight">The Archivist</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Precision Records</div>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 scale-100 active:scale-[0.98] rounded-lg ${
                  isActive
                    ? "text-primary dark:text-blue-300 font-bold border-r-2 border-primary dark:border-blue-400 bg-slate-200/50 dark:bg-slate-800/50"
                    : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <span 
                  className="material-symbols-outlined"
                  style={item.fillIcon ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto pb-4">
          <button className="w-full primary-gradient text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/10 hover:opacity-90 transition-all scale-100 active:scale-[0.98]">
            <span className="material-symbols-outlined text-sm">add</span>
            New Record
          </button>
        </div>
      </div>
    </aside>
  )
}
