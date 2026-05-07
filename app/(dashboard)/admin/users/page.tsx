"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllUsersAction, createUserAction, updateUserAction, deleteUserAction } from "@/actions/userActions"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, UserPlus, Mail, ShieldCheck, Edit2, Trash2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "staff";
  created_at: string | Date;
}

export default function UsersPage() {
  const { data: session } = useSession()
  const currentUserId = (session?.user as { id?: string })?.id

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null)

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
      closeModal()
      toast.success("Personel berhasil didaftarkan")
    },
    onError: () => toast.error("Gagal membuat user baru")
  })

  const updateUserMutation = useMutation({
    mutationFn: (data: { id: string; data: Partial<typeof formData> }) => updateUserAction(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] })
      closeModal()
      toast.success("Data personel berhasil diperbarui")
    },
    onError: () => toast.error("Gagal memperbarui data user")
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUserAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] })
      setDeleteConfirmOpen(false)
      setUserToDelete(null)
      toast.success("User berhasil dihapus")
    },
    onError: () => toast.error("Gagal menghapus user")
  })

  const openAddModal = () => {
    setIsEditMode(false)
    setFormData({ full_name: "", email: "", role: "staff" })
    setIsModalOpen(true)
  }

  const openEditModal = (user: UserProfile) => {
    setIsEditMode(true)
    setEditingUserId(user.id)
    setFormData({ 
      full_name: user.full_name, 
      email: user.email, 
      role: user.role 
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUserId(null)
    setFormData({ full_name: "", email: "", role: "staff" })
  }

  const handleAction = () => {
    if (isEditMode && editingUserId) {
      updateUserMutation.mutate({ id: editingUserId, data: formData })
    } else {
      createUserMutation.mutate(formData)
    }
  }

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
          <h1 className="text-3xl font-black text-white tracking-tight">Personnel Management</h1>
          <p className="text-slate-500 text-sm font-medium">Manage system access and roles for all warehouse staff</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Add Personnel
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
            className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 backdrop-blur-md"
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
      <div className="bg-slate-900/50 rounded-4xl border border-slate-800/50 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 font-black border-b border-slate-800/50">
                <th className="px-8 py-6">User Details</th>
                <th className="px-6 py-6">Role</th>
                <th className="px-6 py-6">Registration Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {!users || users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-500 font-medium italic text-sm">No personnel found.</td>
                </tr>
              ) : (
                users.map((user: UserProfile) => (
                  <tr key={user.id} className="group hover:bg-white/2 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {user.full_name}
                            {user.id === currentUserId && (
                              <span className="ml-2 text-[8px] bg-white/10 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">You</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        user.role === "admin" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-slate-500 font-medium">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user.id !== currentUserId && (
                          <>
                            <button 
                              onClick={() => openEditModal(user)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setUserToDelete(user)
                                setDeleteConfirmOpen(true)
                              }}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 w-full max-w-md rounded-4xl p-10 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">
                    {isEditMode ? "Update Personnel" : "Register Personnel"}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Management System Access</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nama Lengkap</label>
                  <div className="relative group">
                    <UserPlus className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Alamat Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Hak Akses (Role)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFormData({ ...formData, role: 'staff' })}
                      className={`py-4 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 ${
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
                      className={`py-4 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 ${
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
                  onClick={handleAction}
                  disabled={createUserMutation.isPending || updateUserMutation.isPending || !formData.full_name || !formData.email}
                  className="w-full primary-gradient py-5 rounded-4xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale mt-4"
                >
                  {isEditMode 
                    ? (updateUserMutation.isPending ? "Updating..." : "Update Account") 
                    : (createUserMutation.isPending ? "Creating..." : "Create Account")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-rose-500 mb-2">
              <AlertCircle className="w-6 h-6" />
              <AlertDialogTitle>Hapus Akun Personel?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus akun <span className="font-bold text-slate-900 dark:text-white">&quot;{userToDelete?.full_name}&quot;</span>? 
              Akses ke sistem akan langsung dicabut dan tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batalkan</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => userToDelete && deleteUserMutation.mutate(userToDelete.id)}
              className="bg-rose-500 hover:bg-rose-600 text-white border-none"
            >
              Ya, Hapus Akun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
