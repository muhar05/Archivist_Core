"use client"

import React, { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { requestDepositAction, getSopRequirementsAction, getReportCategoriesAction } from "@/actions/reportActions"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { getAssignableUnitsAction, getUnitHierarchyAction } from "@/actions/locationActions"
import { toast } from "sonner"
import { Package, Lock, Info, ClipboardCheck, FileText } from "lucide-react"



interface DepositFormData {
  report_number: string;
  category_id: string;
  client: string;
  unit_id: string;
}
export const DepositForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialUnitId = searchParams.get("unitId") || ""
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const [formData, setFormData] = useState<DepositFormData>({
    report_number: "",
    category_id: "",
    client: "",
    unit_id: initialUnitId
  })
  const [checklist, setChecklist] = useState<string[]>([])

  // Update unit_id if search params change
  React.useEffect(() => {
    if (initialUnitId) {
      setFormData(prev => ({ ...prev, unit_id: initialUnitId }))
    }
  }, [initialUnitId])

  // Fetch SOP Requirements
  const { data: sopRequirements } = useQuery({
    queryKey: ["sop-requirements"],
    queryFn: () => getSopRequirementsAction()
  })

  // Fetch Report Categories
  const { data: categories } = useQuery({
    queryKey: ["report-categories"],
    queryFn: () => getReportCategoriesAction()
  })

  // Fetch assignable units
  const { data: units } = useQuery({
    queryKey: ["assignable-units"],
    queryFn: () => getAssignableUnitsAction()
  })

  // Fetch specific unit if ID is provided
  const { data: specificUnit, isLoading: isUnitLoading } = useQuery({
    queryKey: ["unit-hierarchy", initialUnitId],
    queryFn: () => getUnitHierarchyAction(initialUnitId),
    enabled: !!initialUnitId
  })

  const mutation = useMutation({
    mutationFn: async (data: DepositFormData) => {
      const user = session?.user as { id: string }
      if (!user) throw new Error("Unauthorized")

      const category = categories?.find(c => c.id === data.category_id)
      const fullTitle = category ? `${category.name}${category.sub_category ? ` - ${category.sub_category}` : ''}` : "Unknown Report"
      const isComplete = sopRequirements ? checklist.length === sopRequirements.length : true

      return requestDepositAction({
        report_number: data.report_number,
        category_id: data.category_id,
        title: fullTitle,
        client: data.client,
        unit_id: data.unit_id,
        created_by: user.id,
        metadata: {
          sop_checklist: checklist,
          is_sop_complete: isComplete
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      toast.success("Deposit request submitted successfully!")
      
      // Redirect back to the locker page
      if (formData.unit_id) {
        router.push(`/location/${formData.unit_id}`)
      }
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    }
  })


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const isComplete = sopRequirements ? checklist.length === sopRequirements.length : true
    
    if (!isComplete) {
      toast.info("Submitting with incomplete SOP requirements. Admin will need to verify later.")
    }

    mutation.mutate(formData)
  }

  const toggleChecklist = (item: string) => {
    setChecklist(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-blue-400">
          <FileText className="w-4 h-4" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Report Metadata</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Jenis Laporan</label>
            <select 
              required
              value={formData.category_id}
              onChange={e => setFormData({...formData, category_id: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all appearance-none"
            >
              <option value="" disabled>Pilih Jenis Laporan</option>
              {categories?.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.sub_category ? `(${c.sub_category})` : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Nomor Laporan</label>
            <input 
              required
              value={formData.report_number}
              onChange={e => setFormData({...formData, report_number: e.target.value})}
              placeholder="e.g. REP-2024-001"
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Client / Project</label>
            <input 
              required
              value={formData.client}
              onChange={e => setFormData({...formData, client: e.target.value})}
              placeholder="e.g. PT. Global Solusi"
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Target Locker</label>
          {initialUnitId ? (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-blue-100">
                  {isUnitLoading ? "Scanning location..." : specificUnit?.data?.name || "Locker not found"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest">Locked Location</span>
                <Lock className="w-3 h-3 text-blue-500" />
              </div>
            </div>
          ) : (
            <select 
              required
              value={formData.unit_id}
              onChange={e => setFormData({...formData, unit_id: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
            >
              <option value="" disabled>Select a locker</option>
              {units?.map(u => (
                <option key={u.id} value={u.id}>{u.name} (Status: {u.status})</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-yellow-500">
          <ClipboardCheck className="w-4 h-4" />
          <h3 className="text-sm font-bold uppercase tracking-widest">SOP Checklist</h3>
        </div>
        <p className="text-xs text-slate-500">Verify all physical requirements are met before submission.</p>

        <div className="flex flex-col gap-2 mt-2">
          {sopRequirements?.map((item) => (
            <label 
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                checklist.includes(item.name) 
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-200" 
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <input 
                type="checkbox"
                className="hidden"
                checked={checklist.includes(item.name)}
                onChange={() => toggleChecklist(item.name)}
              />
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                checklist.includes(item.name) ? "bg-blue-500 border-blue-400" : "bg-slate-900 border-slate-700"
              }`}>
                {checklist.includes(item.name) && <ClipboardCheck className="w-3 h-3 text-white" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.name}</span>
                {item.description && <span className="text-[10px] text-slate-500">{item.description}</span>}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-blue-400" />
          <p className="text-xs text-slate-400 max-w-sm">Status will be <span className="text-yellow-500 font-bold uppercase">Pending</span>. An Admin will verify the physical report before archiving.</p>
        </div>
        <button 
          type="submit"
          disabled={mutation.isPending}
          className="primary-gradient text-white px-8 py-3 rounded-lg font-bold shadow-xl shadow-primary/20 scale-100 active:scale-95 transition-all disabled:opacity-50"
        >
          {mutation.isPending ? "Submitting..." : "Submit Deposit Request"}
        </button>
      </div>
    </form>
  )
}
