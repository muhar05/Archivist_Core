"use client"

import React, { Suspense } from "react"
import { DepositForm } from "@/components/dashboard/staff/DepositForm"
import { PlacementList } from "@/components/dashboard/staff/PlacementList"
import { motion } from "framer-motion"

export default function DepositRequestPage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <span className="material-symbols-outlined text-primary">archive</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Records Logistics</h1>
            <p className="text-slate-500 text-sm italic font-medium uppercase tracking-widest">Manage physical movement & verification</p>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="h-48 w-full animate-pulse bg-white/5 rounded-2xl" />}>
        <PlacementList />
      </Suspense>

      <div className="h-px bg-white/5 w-full" />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-6 bg-primary rounded-full" />
           <h2 className="text-xl font-bold text-white tracking-tight">Request New Deposit</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={<div className="h-96 w-full animate-pulse bg-white/5 rounded-2xl" />}>
            <DepositForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  )
}
