"use client"

import React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <Link 
        href="/admin/dashboard" 
        className="flex items-center gap-1 hover:text-blue-400 transition-colors"
      >
        <Home className="w-3 h-3" />
        <span>PRMS</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="text-slate-300 flex items-center gap-1">
              {item.icon}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
