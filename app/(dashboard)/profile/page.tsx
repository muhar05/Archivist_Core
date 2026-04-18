"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const accountInfo = [
    { label: "Full Name", value: "Administrator Archivist", icon: "person" },
    { label: "Email Address", value: "admin@archivist.core", icon: "mail" },
    { label: "Staff ID", value: "ADM-99201", icon: "badge" },
    { label: "Role", value: "Super Administrator", icon: "verified_user" },
  ];

  const systemPreferences = [
    { label: "Interface Language", value: "Bahasa Indonesia", icon: "language" },
    { label: "Appearance Mode", value: "Adaptive (Dark/Light)", icon: "palette" },
    { label: "Data Refresh Rate", value: "Real-time (5s)", icon: "sync" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-80 w-full rounded-[3rem] overflow-hidden group shadow-2xl shadow-primary/10"
      >
        <div className="absolute inset-0 primary-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        {/* Decorative Elements */}
        <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-sky-400/20 rounded-full blur-3xl" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 mt-10">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 p-1 relative overflow-hidden transition-transform group-hover:scale-105">
              <Image 
                alt="Profile" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOW-1IqVwBzIOa0YJpcyGGRtFecljvKcAKGG-rH4e5tekuFOnNfE8qOze9R4NVd4GkRmA077fX5JH6Pu_atjwAyjmOyXnNpgKG0nTJHTaYXDOJ4HkYqpdo0e13LI8i9cT8B6oJbBq6qOuAbnbyQvDu7PeHut2wReFFe7B9I4VKjvbntW3SA-HK-V7wGixBruohwGXw5OujITz6dA94z8G3KpmIBLW76zz2-bQ7QAVdUiV7uDqk2c4Sm3fznZ_yzVA3JK7bWNVdj-JQ"
                fill
                className="object-cover rounded-full"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined">photo_camera</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-black mt-4 tracking-tighter">Administrator</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">System Controller & Archivist</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Personal Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-10"
        >
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-xl shadow-slate-200/50">
            <h2 className="text-xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">person</span>
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {accountInfo.map((info, idx) => (
                <div key={idx} className="space-y-1 group">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{info.label}</div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent group-hover:border-primary/20 transition-all">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">{info.icon}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{info.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-10 px-8 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
              Edit Profile Details
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-xl shadow-slate-200/50">
            <h2 className="text-xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">settings_applications</span>
              System Preferences
            </h2>
            
            <div className="space-y-6">
              {systemPreferences.map((pref, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">{pref.icon}</span>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">{pref.label}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{pref.value}</div>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Change</button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Security & Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-10"
        >
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            
            <h2 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-3 relative z-10">
              <span className="material-symbols-outlined text-primary">lock</span>
              Security
            </h2>
            
            <div className="space-y-6 relative z-10">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 group hover:border-primary/40 transition-all">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Passcode</div>
                <div className="text-sm font-bold flex justify-between items-center">
                  <span>Last changed 2 months ago</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 group hover:border-primary/40 transition-all">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Two-Factor Auth</div>
                <div className="text-sm font-bold flex justify-between items-center text-emerald-500">
                  <span>Activated</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">verified_user</span>
                </div>
              </div>
            </div>

            <button className="mt-10 w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 border border-white/10">
              Update Security Keys
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-xl shadow-slate-200/50">
            <h2 className="text-xl font-black mb-6 text-slate-900 dark:text-white uppercase tracking-tight">Recent Activity</h2>
            <div className="space-y-6">
              {[
                { activity: "Updated Storage Unit A-02", time: "2 hours ago" },
                { activity: "Registered 48 new records", time: "6 hours ago" },
                { activity: "Bulk login from Web Access", time: "Yesterday" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.activity}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
