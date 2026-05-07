"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllReportsAction, deleteReportAction, updateReportAction, createReportAction } from "@/actions/reportActions"
import { RecordTable } from "@/components/dashboard/records/record-table"
import { AddRecordDialog } from "@/components/dashboard/records/add-record-dialog"
import { ReportDetailDialog } from "@/components/dashboard/records/report-detail-dialog"
import { RecordStatus, RecordPriority, ArchivalRecord } from "@/components/dashboard/locations/types"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { type Report } from "@/services/reportService"

export default function RecordsPage() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ArchivalRecord | null>(null);
  const [selectedReportForView, setSelectedReportForView] = useState<(Report & { creator?: { full_name: string } }) | null>(null);

  const { data: session } = useQuery({ 
    queryKey: ["session"], 
    queryFn: () => fetch("/api/auth/session").then(res => res.json()) 
  });
  const isAdmin = session?.user?.role === "admin";

  // Fetch real data from database
  const { data: rawReports, isLoading } = useQuery({
    queryKey: ["reports", "all"],
    queryFn: () => getAllReportsAction()
  });

  // Transform database reports to UI-friendly format
  const reports = (rawReports || []).map((r) => ({
    id: r.id,
    title: r.title,
    code: r.report_number || r.id.split("-")[0].toUpperCase(),
    category: "General",
    status: (r.status === "archived" ? "ACTIVE" : r.status === "loaned" ? "BORROWED" : r.status === "pending" ? "PENDING" : "ARCHIVED") as RecordStatus,
    priority: "MEDIUM" as RecordPriority,
    location: r.unit ? `${r.unit.room?.name || "Room"} - ${r.unit.name}` : "Unknown",
    registeredAt: new Date(r.created_at).toISOString().split('T')[0],
    description: r.description || undefined,
  }));

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReportAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Arsip berhasil dihapus");
      setIsDeleteOpen(false);
    },
    onError: () => toast.error("Gagal menghapus arsip")
  });

  const upsertMutation = useMutation({
    mutationFn: (data: { title: string; code: string; status: RecordStatus; description: string }) => {
      if (selectedRecord) {
        return updateReportAction(selectedRecord.id, {
          title: data.title,
          report_number: data.code,
          status: data.status.toLowerCase() as "pending" | "pending_placement" | "archived" | "loaned" | "rejected",
          description: data.description
        });
      }
      return createReportAction({
        title: data.title,
        report_number: data.code,
        status: data.status.toLowerCase() as "pending" | "pending_placement" | "archived" | "loaned" | "rejected",
        description: data.description,
        client: "Internal",
        created_by: "system" 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success(selectedRecord ? "Arsip berhasil diperbarui" : "Arsip berhasil didaftarkan");
      setIsAddOpen(false);
      setSelectedRecord(null);
    },
    onError: () => toast.error("Terjadi kesalahan saat menyimpan data")
  });

  const stats = [
    { label: "Total Arsip", value: reports.length, icon: "inventory_2", color: "text-primary bg-primary/10" },
    { label: "Sedang Dipinjam", value: reports.filter(r => r.status === "BORROWED").length, icon: "output", color: "text-amber-500 bg-amber-500/10" },
    { label: "Pending", value: reports.filter(r => r.status === "PENDING").length, icon: "pending", color: "text-rose-500 bg-rose-500/10" },
    { label: "Archived", value: reports.filter(r => r.status === "ACTIVE").length, icon: "verified", color: "text-emerald-500 bg-emerald-500/10" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors">Digital Repository</span>
            <span className="text-slate-300">/</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Document Records</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">
            Records Management
          </h1>
        </div>

        {isAdmin && (
          <button 
            onClick={() => {
              setSelectedRecord(null);
              setIsAddOpen(true);
            }}
            className="flex items-center gap-3 primary-gradient px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-all scale-100 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add_box</span>
            Pendaftaran Arsip Baru
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-outline-variant/10 flex flex-col gap-4 group hover:border-primary/20 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {reports.length > 0 ? (
          <RecordTable 
            records={reports} 
            onView={(record) => {
              const report = rawReports?.find(r => r.id === record.id);
              if (report) {
                setSelectedReportForView(report);
                setIsViewOpen(true);
              }
            }}
            onEdit={isAdmin ? (record) => {
              setSelectedRecord(record);
              setIsAddOpen(true);
            } : undefined}
            onDelete={isAdmin ? (id) => {
              setSelectedRecord(reports.find(r => r.id === id) || null);
              setIsDeleteOpen(true);
            } : undefined}
          />
        ) : (
          <div className="py-24 flex flex-col items-center justify-center bg-slate-900/50 rounded-4xl border border-dashed border-slate-800 text-slate-500 gap-4">
            <span className="material-symbols-outlined text-6xl opacity-20">folder_off</span>
            <div className="text-center">
              <p className="text-sm font-bold text-white mb-1">No Records Found</p>
              <p className="text-xs">Database arsip digital masih kosong.</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Dialogs */}
      <AddRecordDialog 
        isOpen={isAddOpen} 
        onClose={() => {
          setIsAddOpen(false);
          setSelectedRecord(null);
        }} 
        initialData={selectedRecord}
        onAdd={(data) => upsertMutation.mutate(data)} 
      />

      <ReportDetailDialog 
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        report={selectedReportForView}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Arsip Digital?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Menghapus data arsip ini akan menghilangkan catatan digital dari sistem secara permanen.
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Arsip yang akan dihapus:</p>
                <p className="text-sm font-black text-white">{selectedRecord?.title}</p>
                <p className="text-[10px] text-slate-500 font-mono">{selectedRecord?.code}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batalkan</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedRecord && deleteMutation.mutate(selectedRecord.id)} className="bg-rose-500 hover:bg-rose-600">
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
