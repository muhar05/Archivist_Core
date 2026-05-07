"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArchivalRecord } from "../locations/types"
import { RecordStatusBadge } from "./record-badges"

interface RecordTableProps {
  records: ArchivalRecord[];
  onView?: (record: ArchivalRecord) => void;
  onEdit?: (record: ArchivalRecord) => void;
  onDelete?: (recordId: string) => void;
}

export function RecordTable({ records, onView, onEdit, onDelete }: RecordTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const categories = Array.from(new Set(records.map(r => r.category)));

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                         r.code.toLowerCase().includes(search.toLowerCase()) ||
                         r.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    const matchesCategory = filterCategory === "ALL" || r.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExport = () => {
    const headers = ["ID", "Title", "Code", "Category", "Status", "Location", "Registered At"];
    const csvContent = [
      headers.join(","),
      ...filteredRecords.map(r => [
        r.id,
        `"${r.title}"`,
        r.code,
        r.category,
        r.status,
        `"${r.location}"`,
        r.registeredAt
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `archivist_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            search
          </span>
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul, kode, atau kategori..."
            className="w-full bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl pl-12 pr-6 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl p-1.5 shadow-sm">
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none px-3 py-2 cursor-pointer hover:text-primary transition-colors"
             >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="BORROWED">Borrowed</option>
                <option value="PENDING">Pending</option>
             </select>
             <div className="w-px h-4 bg-outline-variant/10" />
             <select 
               value={filterCategory}
               onChange={(e) => setFilterCategory(e.target.value)}
               className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none px-3 py-2 cursor-pointer hover:text-primary transition-colors"
             >
                <option value="ALL">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
             </select>
          </div>

          <button 
            onClick={handleExport}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">file_download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-4xl border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Record Identity</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredRecords.map((record, idx) => (
                  <motion.tr
                    key={record.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors border-b border-outline-variant/5 last:border-none cursor-default"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <span className="material-symbols-outlined text-lg">description</span>
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{record.title}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <RecordStatusBadge status={record.status} />
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => onView?.(record)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all scale-100 active:scale-90"
                        >
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                        {onEdit && (
                          <button 
                            onClick={() => onEdit?.(record)}
                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all scale-100 active:scale-90"
                          >
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                        )}
                        {onDelete && (
                          <button 
                            onClick={() => onDelete?.(record.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all scale-100 active:scale-90"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredRecords.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <span className="material-symbols-outlined text-6xl opacity-20">search_off</span>
              <p className="text-sm font-medium">No records found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Showing {filteredRecords.length} of {records.length} Records
        </p>
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-outline-variant/10 text-slate-400 disabled:opacity-30" disabled>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-black text-xs">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-outline-variant/10 text-slate-400">
            2
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-outline-variant/10 text-slate-400">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
