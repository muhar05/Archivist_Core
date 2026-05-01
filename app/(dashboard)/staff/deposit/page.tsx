"use client"

import React from "react"
import { DepositForm } from "@/components/dashboard/staff/DepositForm"
import { motion } from "framer-motion"

export default function DepositRequestPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <span className="material-symbols-outlined text-primary">archive</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Request Deposit</h1>
            <p className="text-slate-500">Submit a new physical record for archival verification</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DepositForm />
      </motion.div>
    </div>
  )
}
