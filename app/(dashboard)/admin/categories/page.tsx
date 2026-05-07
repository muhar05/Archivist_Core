"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getReportCategoriesAction, createCategoryAction, deleteCategoryAction } from "@/actions/reportActions"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Plus, Trash2, Tag, BookOpen, Layers, Search, X, Info, AlertTriangle } from "lucide-react"
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

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string, name: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({ name: "", sub_category: "", description: "" })

  const { data: categories, isLoading } = useQuery({
    queryKey: ["report-categories"],
    queryFn: () => getReportCategoriesAction()
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => createCategoryAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-categories"] })
      toast.success("Kategori laporan berhasil ditambahkan")
      setIsAddOpen(false)
      setFormData({ name: "", sub_category: "", description: "" })
    },
    onError: (err: Error) => toast.error(err.message)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategoryAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-categories"] })
      toast.success("Kategori berhasil dihapus")
      setDeleteConfirmOpen(false)
      setCategoryToDelete(null)
    }
  })

  const filteredCategories = categories?.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.sub_category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
            Master Laporan
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Kelola daftar judul dan jenis laporan yang dapat dipilih oleh Staff.
          </p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="primary-gradient px-6 py-3 rounded-2xl text-white font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Tambah Jenis Baru
        </button>
      </div>

      {/* Search and Filters */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text" 
          placeholder="Cari jenis laporan atau sub-kategori..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl pl-14 pr-6 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Judul Utama</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sub-Kategori</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Keterangan</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-4 h-16 bg-slate-100/50 dark:bg-slate-800/20 m-2 rounded-xl"></td>
                </tr>
              ))
            ) : filteredCategories?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium">
                  Belum ada data jenis laporan.
                </td>
              </tr>
            ) : (
              filteredCategories?.map((category) => (
                <tr key={category.id} className="group border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {category.sub_category ? (
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {category.sub_category}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">-</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{category.description || "Tidak ada deskripsi"}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => {
                        setCategoryToDelete({ id: category.id, name: category.name })
                        setDeleteConfirmOpen(true)
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white mb-1">
                      Tambah Jenis Laporan
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Input Master Data
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAddOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault()
                  createMutation.mutate(formData)
                }}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Judul Utama
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Laporan Penilaian"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex items-center gap-2">
                      <Layers className="w-3 h-3" /> Sub-Kategori (Opsional)
                    </label>
                    <input
                      value={formData.sub_category}
                      onChange={e => setFormData({...formData, sub_category: e.target.value})}
                      placeholder="e.g. Asset / Pengawasan"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex items-center gap-2">
                      <Info className="w-3 h-3" /> Deskripsi
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Keterangan singkat..."
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full primary-gradient py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 mt-4"
                  >
                    {createMutation.isPending ? "Menyimpan..." : "Simpan Kategori"}
                  </button>
                </form>
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
              <AlertTriangle className="w-6 h-6" />
              <AlertDialogTitle>Hapus Kategori Laporan?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori <span className="font-bold text-slate-900 dark:text-white">&quot;{categoryToDelete?.name}&quot;</span>? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batalkan</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => categoryToDelete && deleteMutation.mutate(categoryToDelete.id)}
              className="bg-rose-500 hover:bg-rose-600 text-white border-none"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
