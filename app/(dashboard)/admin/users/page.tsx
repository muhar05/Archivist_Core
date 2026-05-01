"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllUsersAction } from "@/actions/userActions"
import { motion } from "framer-motion"

export default function UsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users", "all"],
    queryFn: () => getAllUsersAction()
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = [
    { label: "Total Users", value: users?.length || 0, icon: "group", color: "text-blue-500 bg-blue-500/10" },
    { label: "Admins", value: users?.filter(u => u.role === "admin").length || 0, icon: "admin_panel_settings", color: "text-purple-500 bg-purple-500/10" },
    { label: "Staff", value: users?.filter(u => u.role === "staff").length || 0, icon: "badge", color: "text-emerald-500 bg-emerald-500/10" },
  ]

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">User Management</h1>
        <p className="text-slate-500 text-sm">Manage system access and roles for all personnel</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined text-xl">{stat.icon}</span>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-800">
                <th className="px-8 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {!users || users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-500 italic text-sm">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-4">
                      <div className="font-bold text-white text-sm">{user.full_name}</div>
                      <div className="text-[10px] text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        user.role === "admin" ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
