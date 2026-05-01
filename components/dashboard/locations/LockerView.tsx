"use client"

import React from "react"
import { Report } from "@/services/reportService"

interface LockerViewProps {
  reports: (Report & { creator: { full_name: string } })[]
  unitName: string
}

export const LockerView: React.FC<LockerViewProps> = ({ reports, unitName }) => {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Reports in {unitName}</h2>
          <p className="text-xs text-slate-500">List of physical records archived in this locker</p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all">
            Filter
          </button>
          <button className="primary-gradient text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            Deposit Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <th className="px-6 py-4">Title / ID</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Archived By</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm italic">
                  No reports found in this locker. Start by depositing a new record.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm">{report.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">#{report.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{report.client || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      report.status === "archived" ? "bg-green-500/10 text-green-500" :
                      report.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-blue-500/10 text-blue-500"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {report.creator?.full_name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-sm">assignment_return</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
