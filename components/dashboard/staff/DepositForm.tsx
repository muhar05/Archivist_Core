"use client"

import React, { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { reportService } from "@/services/reportService"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

const SOP_CHECKLIST = [
  "Halaman Lengkap (Sesuai Daftar Isi)",
  "Tanda Tangan & Cap Basah Tersedia",
  "Hardcover/Softcover Sesuai Standard",
  "Tidak Ada Coretan/Kerusakan Fisik",
  "Metadata Digital Sesuai Fisik"
]

interface DepositFormData {
  title: string;
  client: string;
  unit_id: string;
  thickness: string;
}

export const DepositForm = () => {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const [formData, setFormData] = useState<DepositFormData>({
    title: "",
    client: "",
    unit_id: "",
    thickness: ""
  })
  const [checklist, setChecklist] = useState<string[]>([])

  // Fetch assignable units
  const { data: units } = useQuery({
    queryKey: ["assignable-units"],
    queryFn: async () => {
      const { data } = await supabase
        .from("storage_units")
        .select("*")
        .eq("is_assignable", true)
      return data || []
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: DepositFormData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Unauthorized")

      return reportService.requestDeposit({
        title: data.title,
        client: data.client,
        unit_id: data.unit_id,
        created_by: user.id,
        metadata: {
          thickness_cm: data.thickness,
          sop_checklist: checklist
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      toast.success("Deposit request submitted successfully!")
      setFormData({ title: "", client: "", unit_id: "", thickness: "" })
      setChecklist([])
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    }
  })


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (checklist.length < SOP_CHECKLIST.length) {
      return toast.error("Please complete all SOP checklist items")
    }
    mutation.mutate(formData)
  }

  const toggleChecklist = (item: string) => {
    setChecklist(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-blue-400">
          <span className="material-symbols-outlined">description</span>
          <h3 className="text-sm font-bold uppercase tracking-widest">Report Metadata</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Report Title</label>
            <input 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Laporan Keuangan Q1 2024"
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Target Locker</label>
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
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Estimated Thickness (cm)</label>
            <input 
              required
              type="number"
              value={formData.thickness}
              onChange={e => setFormData({...formData, thickness: e.target.value})}
              placeholder="e.g. 5"
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-yellow-500">
          <span className="material-symbols-outlined">rule</span>
          <h3 className="text-sm font-bold uppercase tracking-widest">SOP Checklist</h3>
        </div>
        <p className="text-xs text-slate-500">Verify all physical requirements are met before submission.</p>

        <div className="flex flex-col gap-2 mt-2">
          {SOP_CHECKLIST.map((item) => (
            <label 
              key={item}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                checklist.includes(item) 
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-200" 
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <input 
                type="checkbox"
                className="hidden"
                checked={checklist.includes(item)}
                onChange={() => toggleChecklist(item)}
              />
              <span className={`material-symbols-outlined text-sm ${checklist.includes(item) ? "text-blue-400" : "text-slate-600"}`}>
                {checklist.includes(item) ? "check_circle" : "radio_button_unchecked"}
              </span>
              <span className="text-sm font-medium">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-400">info</span>
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
