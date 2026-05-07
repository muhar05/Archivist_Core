"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { User, Mail, Badge, ShieldCheck, Lock, Key, AlertTriangle, CheckCircle2, ChevronRight, X } from "lucide-react"
import { changePasswordAction } from "@/actions/userActions"
import { toast } from "sonner"

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  employee_id?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const user = session?.user as SessionUser

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  const [isChanging, setIsChanging] = useState(false)

  const accountInfo = [
    { label: "Full Name", value: user?.name || "Loading...", icon: User, color: "text-blue-500 bg-blue-500/10" },
    { label: "Email Address", value: user?.email || "Loading...", icon: Mail, color: "text-purple-500 bg-purple-500/10" },
    { label: "Employee ID", value: user?.employee_id || "STF-001", icon: Badge, color: "text-amber-500 bg-amber-500/10" },
    { label: "Role", value: user?.role === "admin" ? "Super Administrator" : "Warehouse Staff", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) {
      toast.error("Konfirmasi password baru tidak cocok")
      return
    }

    if (passwordData.new.length < 6) {
      toast.error("Password baru minimal 6 karakter")
      return
    }

    setIsChanging(true)
    try {
      await changePasswordAction(user.id, passwordData.current, passwordData.new)
      toast.success("Password berhasil diubah")
      setIsPasswordModalOpen(false)
      setPasswordData({ current: "", new: "", confirm: "" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal mengubah password"
      toast.error(message)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">My Profile</h1>
          <p className="text-slate-500 text-sm font-medium italic">Manage your personal information and account security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {/* Profile Card & Info */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-[2.5rem] border border-slate-800/50 p-10 backdrop-blur-md"
          >
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-white/5 pb-12">
              <div className="w-32 h-32 rounded-3xl primary-gradient p-1 shadow-2xl shadow-primary/20">
                <div className="w-full h-full rounded-[1.4rem] bg-slate-950 flex items-center justify-center">
                  <span className="text-5xl font-black text-white">{user?.name?.charAt(0) || "?"}</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-white tracking-tighter mb-1">{user?.name || "User Name"}</h2>
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {user?.role || "Staff"} Active Status
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {accountInfo.map((info, idx) => (
                <div key={idx} className="space-y-2 group">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{info.label}</div>
                  <div className="flex items-center gap-4 p-5 bg-white/3 border border-white/5 rounded-3xl group-hover:border-white/10 transition-all">
                    <div className={`p-3 rounded-2xl ${info.color}`}>
                      <info.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-200">{info.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Security Side Card */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            
            <h2 className="text-xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" />
              Security
            </h2>

            <div className="space-y-4">
              <div className="p-6 bg-white/3 rounded-[1.8rem] border border-white/5 group hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Password</div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-white">Sudah dikonfigurasi</div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="p-6 bg-white/3 rounded-[1.8rem] border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Access</div>
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm font-bold text-slate-300">Level: {user?.role === "admin" ? "High Security" : "Standard"}</div>
              </div>
            </div>

            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="mt-10 w-full py-5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
              Ubah Password
            </button>
          </motion.div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[3rem] p-12 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">Ganti Password</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Keamanan Akun Personel</p>
                </div>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Password Saat Ini</label>
                  <div className="relative">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="password" 
                      required
                      value={passwordData.current}
                      onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Password Baru</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="password" 
                      required
                      value={passwordData.new}
                      onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="password" 
                      required
                      value={passwordData.confirm}
                      onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 rounded-2xl flex items-start gap-3 border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-amber-200/70 leading-relaxed uppercase tracking-wider">
                    Pastikan password baru Anda kuat dan belum pernah digunakan sebelumnya.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={isChanging}
                  className="w-full primary-gradient py-5 rounded-4xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isChanging ? "Memproses..." : "Konfirmasi Perubahan"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
