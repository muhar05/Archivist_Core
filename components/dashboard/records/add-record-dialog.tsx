"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArchivalRecord, RecordStatus } from "../locations/types"

interface AddRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { title: string; code: string; status: RecordStatus; description: string; category: string }) => void;
  initialData?: ArchivalRecord | null;
}

export function AddRecordDialog({ isOpen, onClose, onAdd, initialData }: AddRecordDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    category: "General",
    status: "ACTIVE" as RecordStatus,
    description: "",
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        code: initialData.code,
        category: initialData.category,
        status: initialData.status,
        description: initialData.description || "",
      });
    } else {
      setFormData({
        title: "",
        code: "",
        category: "General",
        status: "ACTIVE",
        description: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    if (!initialData) {
      setFormData({
        title: "",
        code: "",
        category: "General",
        status: "ACTIVE",
        description: "",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden"
          >
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
                    {initialData ? "Edit Data Arsip" : "Mendaftarkan Arsip"}
                  </h2>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {initialData ? `MEMPERBARUI ID: ${initialData.id.split('-')[0].toUpperCase()}` : "Sistem Manajemen Presisi"}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Judul Dokumen</label>
                    <input
                      required
                      value={formData.title}
                      onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Laporan Keuangan Q1 2024"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Kode Arsip</label>
                    <input
                      required
                      value={formData.code}
                      onChange={e => setFormData(p => ({ ...p, code: e.target.value }))}
                      placeholder="e.g. ADM-2024-001"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="General">General</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Legal">Legal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData(p => ({ ...p, status: e.target.value as RecordStatus }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="PENDING">Pending</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Deskripsi & Catatan</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Technical notes regarding this archival item..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-8 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="flex-1 primary-gradient px-8 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    {initialData ? "Simpan Perubahan" : "Simpan Arsip"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
