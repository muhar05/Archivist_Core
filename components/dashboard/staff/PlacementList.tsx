"use client"

import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getReportsByStaffAction, confirmPlacementAction } from "@/actions/reportActions"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { CheckCircle2, MapPin, Box, Loader2 } from "lucide-react"

export const PlacementList = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const staffId = (session?.user as { id: string })?.id

  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports", "staff", staffId],
    queryFn: () => getReportsByStaffAction(staffId!),
    enabled: !!staffId
  })

  const confirmMutation = useMutation({
    mutationFn: (reportId: string) => confirmPlacementAction(reportId, staffId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      toast.success("Penempatan fisik berhasil dikonfirmasi!")
    },
    onError: (err: Error) => toast.error(err.message)
  })

  const pendingPlacement = reports?.filter(r => r.status === 'pending_placement') || []

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse uppercase tracking-widest text-[10px] font-black">Scanning your tasks...</div>

  if (pendingPlacement.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-emerald-500">
        <MapPin className="w-4 h-4" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Konfirmasi Penempatan Fisik</h2>
        <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[10px] font-black">
          {pendingPlacement.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingPlacement.map((report) => (
          <div key={report.id} className="bg-slate-900/50 rounded-2xl border border-emerald-500/20 p-6 flex flex-col gap-4 shadow-xl shadow-emerald-500/5 group hover:border-emerald-500/40 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{report.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">#{report.report_number}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/2 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Locker Target</span>
                <span className="text-[10px] font-bold text-blue-400">{report.unit?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lokasi Ruangan</span>
                <span className="text-[10px] font-bold text-slate-300">{report.unit?.room?.name}</span>
              </div>
            </div>

            <button
              onClick={() => confirmMutation.mutate(report.id)}
              disabled={confirmMutation.isPending}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              {confirmMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Saya Sudah Menaruh Laporan
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
