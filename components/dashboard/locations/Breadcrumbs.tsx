"use client"

import React from "react"
import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href?: string
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm font-medium">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="material-symbols-outlined text-[14px] text-slate-500">chevron_right</span>
          )}
          {item.href && index < items.length - 1 ? (
            <Link 
              href={item.href}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
