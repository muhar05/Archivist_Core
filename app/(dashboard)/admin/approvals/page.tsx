"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getPendingReportsAction, approveReportAction } from "@/actions/reportActions"
import { getRoomsAction, setRoomMaintenanceAction } from "@/actions/locationActions"
import { getSOPRequirementsAction } from "@/actions/sopActions"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { ShieldCheck, Check, Info, FileText } from "lucide-react"

interface Report {
  id: string;
  title: string;
  created_at: string | Date;
  creator?: { full_name: string };
  unit?: { name: string; room?: { name: string } };
}

interface Room {
  id: string;
  name: string;
  floor_number: number;
  is_maintenance: boolean;
}

interface SOPRequirement {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
}

export default function ApprovalsPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  // 1. Fetch Pending Reports
  const { data: pendingReports, isLoading: isLoadingReports } = useQuery<Report[]>({
    queryKey: ["reports", "pending"],
    queryFn: () => getPendingReportsAction()
  })

  // 2. Fetch Rooms for Maintenance Mode
  const { data: rooms } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: () => getRoomsAction()
  })

  // 3. Fetch SOP Requirements
  const { data: sopRequirements } = useQuery({
    queryKey: ["sop-requirements"],
    queryFn: () => getSOPRequirementsAction()
  })

  // State to track checked SOPs per report
  const [verifications, setVerifications] = useState<Record<string, string[]>>({})

  const toggleSOP = (reportId: string, sopId: string) => {
    setVerifications(prev => {
      const current = prev[reportId] || []
      const updated = current.includes(sopId)
        ? current.filter(id => id !== sopId)
        : [...current, sopId]
      return { ...prev, [reportId]: updated }
    })
  }

  const isAllSOPChecked = (reportId: string) => {
    if (!sopRequirements || sopRequirements.length === 0) return true
    const current = verifications[reportId] || []
    return sopRequirements.every(sop => current.includes(sop.id))
  }

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async (reportId: string) => {
      if (!session?.user) throw new Error("Unauthorized")
      if (!isAllSOPChecked(reportId)) throw new Error("Please complete all SOP checks first")
      const userId = (session.user as { id: string }).id
      return approveReportAction(reportId, userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      toast.success("Report successfully verified and archived")
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
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Physical Verification</h1>
        <p className="text-slate-500 text-sm">Verify physical document completeness before final archiving</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals Section */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-amber-500">
            <FileText className="w-4 h-4" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Pending Archive Requests</h2>
            <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-[10px] font-black">
              {pendingReports?.length || 0}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {isLoadingReports ? (
              <div className="bg-slate-900/50 p-12 rounded-3xl border border-slate-800 text-center text-slate-500 italic">
                Scanning pending requests...
              </div>
            ) : pendingReports?.length === 0 ? (
              <div className="bg-slate-900/50 p-12 rounded-3xl border border-slate-800 text-center text-slate-500 italic">
                No reports waiting for verification.
              </div>
            ) : (
              pendingReports?.map((report) => {
                const isReady = isAllSOPChecked(report.id)

                return (
                  <div key={report.id} className="bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden transition-all hover:border-white/10 shadow-xl">
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 text-sm font-bold">
                          DOC
                        </div>
                        <div>
                          <h3 className="font-black text-white text-lg tracking-tight">{report.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Requested by {report.creator?.full_name}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-300">{report.unit?.name}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">{report.unit?.room?.name}</div>
                        </div>
                        
                        <button 
                          onClick={() => approveMutation.mutate(report.id)}
                          disabled={approveMutation.isPending || !isReady}
                          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                            isReady 
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95" 
                              : "bg-slate-800 text-slate-600 cursor-not-allowed opacity-50"
                          }`}
                        >
                          {approveMutation.isPending ? "Archiving..." : "Verify & Archive"}
                        </button>
                      </div>
                    </div>

                    {/* SOP Checklist Section */}
                    <div className="bg-slate-950/50 p-6 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Physical SOP Verification Checklist</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sopRequirements?.map((sop: SOPRequirement) => (
                          <button
                            key={sop.id}
                            onClick={() => toggleSOP(report.id, sop.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                              (verifications[report.id] || []).includes(sop.id)
                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/5"
                                : "bg-slate-900 border-white/5 text-slate-500 hover:bg-slate-800"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                              (verifications[report.id] || []).includes(sop.id)
                                ? "bg-emerald-500 border-emerald-500"
                                : "bg-transparent border-slate-700"
                            }`}>
                              {(verifications[report.id] || []).includes(sop.id) && <Check className="w-3 h-3 text-slate-900 stroke-[4px]" />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{sop.name}</span>
                          </button>
                        ))}
                      </div>
                      
                      {!isReady && sopRequirements && sopRequirements.length > 0 && (
                        <p className="mt-4 text-[10px] text-amber-500/70 italic flex items-center gap-2">
                          <Info className="w-3 h-3" />
                          All physical documents must be verified before this report can be officially archived.
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Maintenance Control Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-blue-400">
            <ShieldCheck className="w-4 h-4" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">System Control</h2>
          </div>

          <div className="bg-slate-900/50 rounded-4xl border border-white/5 p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-white font-black text-sm mb-1 uppercase italic tracking-wider">Maintenance Mode</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed">Prevent new requests in specific rooms during layout auditing.</p>
            </div>

            <div className="flex flex-col gap-3">
              {rooms?.map((room) => (
                <div key={room.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white">{room.name}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">Level 0{room.floor_number}</div>
                  </div>
                  <button 
                    onClick={() => maintenanceMutation.mutate({ roomId: room.id, status: !room.is_maintenance })}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      room.is_maintenance ? "bg-red-600 shadow-lg shadow-red-600/20" : "bg-slate-800"
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
          </div>
        </div>
      </div>
    </div>
  )
}
