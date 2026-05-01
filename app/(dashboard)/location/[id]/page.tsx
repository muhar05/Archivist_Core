"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { getUnitHierarchyAction, getSubUnitsAction } from "@/actions/locationActions"
import { getReportsByUnitAction } from "@/actions/reportActions"
import { Breadcrumbs } from "@/components/dashboard/locations/Breadcrumbs"
import { LockerView } from "@/components/dashboard/locations/LockerView"
import { ArchitectCanvas } from "@/components/dashboard/locations/ArchitectCanvas"
import { motion } from "framer-motion"

export default function LocationDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const unitId = id as string

  // Fetch Hierarchy for Breadcrumbs
  const { data: unit, isLoading: isLoadingUnit } = useQuery({
    queryKey: ["unit-hierarchy", unitId],
    queryFn: () => getUnitHierarchyAction(unitId)
  })

  // Fetch Sub-units (if any)
  const { data: subUnits } = useQuery({
    queryKey: ["sub-units", unitId],
    queryFn: () => getSubUnitsAction(unitId),
    enabled: !!unit && !unit.is_assignable
  })

  // Fetch Reports (if assignable)
  const { data: reports } = useQuery({
    queryKey: ["reports", unitId],
    queryFn: () => getReportsByUnitAction(unitId),
    enabled: !!unit && unit.is_assignable
  })


  if (isLoadingUnit) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!unit) return <div>Location not found</div>

  const breadcrumbItems = [
    { label: "Warehouse", href: "/locations" },
    { label: unit.room?.name || "Room", href: `/locations?room=${unit.room_id}` },
  ]

  if (unit.parent) {
    breadcrumbItems.push({ label: unit.parent.name, href: `/location/${unit.parent_id}` })
  }

  breadcrumbItems.push({ label: unit.name, href: `/location/${unit.id}` })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-white tracking-tight">{unit.name}</h1>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">qr_code_2</span>
            {unit.id.slice(0, 12)}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {unit.is_assignable ? (
          <LockerView reports={reports || []} unitName={unit.name} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sub-Unit Layout</h2>
              <p className="text-xs text-slate-500 italic">Select a sub-unit on the grid to navigate deeper</p>
            </div>
            <div className="h-[600px]">
              <ArchitectCanvas 
                units={subUnits || []} 
                onUnitSelect={(u) => u && router.push(`/location/${u.id}`)}
                onUnitMove={() => {}} // Read-only for navigation
                gridWidth={unit.room?.grid_width || 50}
                gridHeight={unit.room?.grid_height || 50}
                readOnly={true}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
