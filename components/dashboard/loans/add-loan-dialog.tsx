"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoanSession, LoanStatus } from "../locations/types"

interface AddLoanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (loan: Omit<LoanSession, "id">) => void;
}

export function AddLoanDialog({ isOpen, onClose, onAdd }: AddLoanDialogProps) {
  const [formData, setFormData] = useState({
    recordId: "",
    recordTitle: "",
    recordCode: "",
    borrowerName: "",
    borrowerId: "",
    loanDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      status: "ONGOING" as LoanStatus,
    });
    onClose();
    setFormData({
      recordId: "",
      recordTitle: "",
      recordCode: "",
      borrowerName: "",
      borrowerId: "",
      loanDate: new Date().toISOString().split('T')[0],
      dueDate: "",
      notes: "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                    Registrasi Peminjaman
                  </h2>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Sirkulasi Arsip Terkendali
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
                {/* Record Selection (Mock for now) */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Judul Arsip</label>
                    <input
                      required
                      value={formData.recordTitle}
                      onChange={e => setFormData(p => ({ ...p, recordTitle: e.target.value }))}
                      placeholder="Pilih atau cari arsip..."
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Kode Arsip</label>
                    <input
                      required
                      value={formData.recordCode}
                      onChange={e => setFormData(p => ({ ...p, recordCode: e.target.value }))}
                      placeholder="e.g. ADM-2024-XXX"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                    />
                  </div>
                </div>

                {/* Borrower Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nama Peminjam</label>
                    <input
                      required
                      value={formData.borrowerName}
                      onChange={e => setFormData(p => ({ ...p, borrowerName: e.target.value }))}
                      placeholder="Nama lengkap..."
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">ID Karyawan / Peminjam</label>
                    <input
                      required
                      value={formData.borrowerId}
                      onChange={e => setFormData(p => ({ ...p, borrowerId: e.target.value }))}
                      placeholder="e.g. NIP-12345"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Tanggal Pinjam</label>
                    <input
                      type="date"
                      required
                      value={formData.loanDate}
                      onChange={e => setFormData(p => ({ ...p, loanDate: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Estimasi Pengembalian</label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={e => setFormData(p => ({ ...p, dueDate: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all font-medium text-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Alasan Peminjaman / Catatan</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Tujuan peminjaman..."
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
                    Proses Peminjaman
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
