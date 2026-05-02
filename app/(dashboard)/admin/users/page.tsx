"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllUsersAction, createUserAction } from "@/actions/userActions"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, UserPlus, Mail, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "staff";
  created_at: string | Date;
}

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "staff" as "admin" | "staff"
  })

  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery<UserProfile[]>({
    queryKey: ["users", "all"],
    queryFn: () => getAllUsersAction()
  })

  const createUserMutation = useMutation({
    mutationFn: (data: typeof formData) => createUserAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] })
      setIsModalOpen(false)
      setFormData({ full_name: "", email: "", role: "staff" })
      toast.success("User created successfully")
    },
    onError: () => {
      toast.error("Failed to create user")
    }
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
    { label: "Admins", value: users?.filter((u: UserProfile) => u.role === "admin").length || 0, icon: "admin_panel_settings", color: "text-purple-500 bg-purple-500/10" },
    { label: "Staff", value: users?.filter((u: UserProfile) => u.role === "staff").length || 0, icon: "badge", color: "text-emerald-500 bg-emerald-500/10" },
  ]

  return (
    <div className="space-y-10 pb-20 relative">
      <header className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm">Manage system access and roles for all personnel</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
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
                users.map((user: UserProfile) => (
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Register Personnel</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
                  <div className="relative group">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Assigned Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setFormData({ ...formData, role: 'staff' })}
                      className={`py-3 rounded-2xl border transition-all text-xs font-bold flex items-center justify-center gap-2 ${
                        formData.role === 'staff' 
                          ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                          : 'bg-slate-800/50 border-white/5 text-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      Staff
                    </button>
                    <button 
                      onClick={() => setFormData({ ...formData, role: 'admin' })}
                      className={`py-3 rounded-2xl border transition-all text-xs font-bold flex items-center justify-center gap-2 ${
                        formData.role === 'admin' 
                          ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
                          : 'bg-slate-800/50 border-white/5 text-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => createUserMutation.mutate(formData)}
                  disabled={createUserMutation.isPending || !formData.full_name || !formData.email}
                  className="w-full bg-primary py-4 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {createUserMutation.isPending ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
