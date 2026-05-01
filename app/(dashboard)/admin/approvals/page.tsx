"use client"

import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getPendingReportsAction, approveReportAction } from "@/actions/reportActions"
import { getRoomsAction, setRoomMaintenanceAction } from "@/actions/locationActions"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function ApprovalsPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()


  // Fetch Pending Reports
  const { data: pendingReports, isLoading: isLoadingReports } = useQuery({
    queryKey: ["reports", "pending"],
    queryFn: () => getPendingReportsAction()
  })

  // Fetch Rooms for Maintenance Mode
  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRoomsAction()
  })

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async (reportId: string) => {
      if (!session?.user) throw new Error("Unauthorized")
      const userId = (session.user as { id: string }).id
      return approveReportAction(reportId, userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      toast.success("Report successfully archived")
    },
    onError: (error: Error) => toast.error(error.message)
  })


  const maintenanceMutation = useMutation({
    mutationFn: ({ roomId, status }: { roomId: string; status: boolean }) =>
      setRoomMaintenanceAction(roomId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      toast.success("Maintenance status updated")
    }
  })


  return (
    <div className="flex flex-col gap-10">
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Admin Operations</h1>
        <p className="text-slate-500">Verify requests and manage system maintenance modes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-yellow-500">
            <span className="material-symbols-outlined">pending_actions</span>
            <h2 className="text-sm font-bold uppercase tracking-widest">Pending Verification</h2>
            <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full text-[10px]">
              {pendingReports?.length || 0}
            </span>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  <th className="px-6 py-4">Report & Staff</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoadingReports ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading requests...</td></tr>
                ) : pendingReports?.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic text-sm">No pending verification requests.</td></tr>
                ) : (
                  pendingReports?.map((report) => {
                    const unit = report.unit as unknown as { name: string; room: { name: string } }
                    return (
                      <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{report.title}</div>
                          <div className="text-[10px] text-slate-500">By {report.creator?.full_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-300">{unit?.name}</div>
                          <div className="text-[10px] text-slate-500">{unit?.room?.name}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(report.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => approveMutation.mutate(report.id)}
                            disabled={approveMutation.isPending}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
                          >
                            {approveMutation.isPending ? "..." : "Approve"}
                          </button>
                        </td>
                      </tr>
                    )
                  })

                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance Control Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-blue-400">
            <span className="material-symbols-outlined">build</span>
            <h2 className="text-sm font-bold uppercase tracking-widest">System Control</h2>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-white font-bold text-sm mb-1">Maintenance Mode</h3>
              <p className="text-[10px] text-slate-500">When active, Staff cannot submit new deposit/loan requests for lockers in these rooms.</p>
            </div>

            <div className="flex flex-col gap-3">
              {rooms?.map((room) => (
                <div key={room.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-white">{room.name}</div>
                    <div className="text-[10px] text-slate-500">Floor {room.floor_number}</div>
                  </div>
                  <button 
                    onClick={() => maintenanceMutation.mutate({ roomId: room.id, status: !room.is_maintenance })}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      room.is_maintenance ? "bg-red-600" : "bg-slate-700"
                    }`}
                  >
                    <span 
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        room.is_maintenance ? "translate-x-6" : "translate-x-1"
                      }`} 
                    />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/10 mt-2">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-yellow-500 text-sm">warning</span>
                <p className="text-[10px] text-slate-400 italic leading-relaxed">
                  Maintenance mode should only be used during layout restructuring or inventory audits to prevent data desynchronization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
