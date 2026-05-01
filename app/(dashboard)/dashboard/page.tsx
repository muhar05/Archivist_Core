"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { getDashboardStatsAction, getRecentActivityAction } from "@/actions/dashboardActions"
import { motion } from "framer-motion"

export default function DashboardPage() {
  // Fetch Dashboard Stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStatsAction()
  })

  // Fetch Recent Activity
  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => getRecentActivityAction()
  })


  const kpiStyles: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    red: "bg-red-500/10 text-red-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
  }

  if (isLoadingStats || isLoadingActivity) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight font-heading">System Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Overview of archival movements and physical health metrics.</p>
      </header>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-body">
        {[
          { label: "Total Records", value: stats?.totalRecords, icon: "database", color: "blue" },
          { label: "Active Loans", value: stats?.activeLoans, icon: "outbox", color: "purple" },
          { label: "Overdue Reports", value: stats?.overdueReports, icon: "warning", color: "red" },
          { label: "Archive Density", value: "Optimal", icon: "warehouse", color: "emerald" },
        ].map((kpi, i) => (
          <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl transition-all group-hover:scale-110 ${kpiStyles[kpi.color]}`}>
                <span className="material-symbols-outlined">{kpi.icon}</span>
              </div>
            </div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{kpi.label}</div>
            <div className="text-2xl font-black text-white mt-1 font-heading">
              {typeof kpi.value === "number" ? kpi.value.toLocaleString() : kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-12 gap-8 font-body">
        <div className="col-span-12 space-y-8">
          
          {/* Room Distribution */}
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading mb-8">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Report Distribution by Room
            </h3>
            
            {!stats?.rooms || stats.rooms.length === 0 ? (
              <div className="py-12 text-center text-slate-600 italic text-sm">No rooms configured yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.rooms.map((room) => {
                  const count = room.report_count || 0
                  return (
                    <div key={room.id} className="bg-slate-950/50 p-5 rounded-xl border border-slate-800/50 hover:bg-slate-950 transition-colors">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">{room.name}</span>
                        <span className="text-sm font-black text-white">{count.toLocaleString()} <span className="text-[10px] text-slate-500 font-medium italic">Items</span></span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                        <div className="primary-gradient h-full transition-all duration-1000" style={{ width: `${Math.min(count / 100, 100)}%` }}></div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">Floor {room.floor_number}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Activity Table */}
          <div className="bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm border border-slate-800">
            <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-heading">Recent Activity Feed</h3>
              <button className="text-xs font-bold text-primary px-3 py-1.5 hover:bg-white/5 transition-colors rounded-lg">View All Logs</button>
            </div>
            <div className="divide-y divide-slate-800">
              {!activity || activity.length === 0 ? (
                <div className="px-8 py-12 text-center text-slate-600 italic text-sm">No recent activity found.</div>
              ) : (
                activity.map((log) => (
                  <div key={log.id} className="px-8 py-4 flex items-center gap-6 hover:bg-white/5 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-sm">
                        {log.action === "DEPOSIT" ? "add_circle" : log.action === "LOAN" ? "outbox" : "verified"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-200">
                        <span className="font-bold text-white">{log.from_user?.full_name}</span> {log.action.toLowerCase()}ed <span className="text-primary font-medium">{log.report?.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{log.notes}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-medium text-slate-400">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-600">{new Date(log.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
