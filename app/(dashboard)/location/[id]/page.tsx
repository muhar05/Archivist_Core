"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { getUnitHierarchyAction, getStorageUnitsAction } from "@/actions/locationActions"
import { getLockersByCabinetAction } from "@/actions/lockerActions"
import { getReportsByUnitAction } from "@/actions/reportActions"
import { Breadcrumbs } from "@/components/dashboard/locations/Breadcrumbs"
import { LockerView } from "@/components/dashboard/locations/LockerView"
import { ArchitectCanvas, CanvasUnit } from "@/components/dashboard/locations/ArchitectCanvas"
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

  // Fetch Sub-units (if it's a room, fetch cabinets; if it's a cabinet, fetch lockers)
  const { data: subUnits } = useQuery({
    queryKey: ["sub-units", unitId, unit?.type],
    queryFn: async () => {
      if (unit?.type === "room") return await getStorageUnitsAction(unitId);
      if (unit?.type === "unit") return await getLockersByCabinetAction(unitId);
      return [];
    },
    enabled: !!unit && (unit.type === "room" || unit.type === "unit")
  })

  // Fetch Reports (if it's a locker)
  const { data: reports } = useQuery({
    queryKey: ["reports", unitId],
    queryFn: () => getReportsByUnitAction(unitId),
    enabled: !!unit && unit.type === "locker"
  })


  if (isLoadingUnit) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!unit) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <span className="material-symbols-outlined text-rose-500 text-6xl">location_off</span>
      <h2 className="text-xl font-bold text-white">Location Not Found</h2>
      <p className="text-slate-500 text-sm">The ID {unitId} does not exist in the database.</p>
    </div>
  )

  const breadcrumbItems = [
    { label: "Warehouse", href: "/locations" },
  ]

  if (unit.type === "room") {
    breadcrumbItems.push({ label: unit.data.name, href: `/location/${unit.data.id}` })
  } else if (unit.type === "locker") {
    // Breadcrumbs for Locker
    const lockerData = unit.data;
    breadcrumbItems.push({ label: lockerData.cabinet?.room?.name || "Room", href: `/location/${lockerData.cabinet?.room_id}` })
    breadcrumbItems.push({ label: lockerData.cabinet?.name || "Cabinet", href: `/location/${lockerData.cabinet_id}` })
    breadcrumbItems.push({ label: unit.data.name, href: `/location/${unit.data.id}` })
  } else if (unit.type === "unit") {
    // Breadcrumbs for Cabinet (Unit)
    const cabinetData = unit.data;
    breadcrumbItems.push({ label: cabinetData.room?.name || "Room", href: `/location/${cabinetData.room_id}` })
    if (cabinetData.parent) {
      breadcrumbItems.push({ label: cabinetData.parent.name, href: `/location/${cabinetData.parent_id}` })
    }
    breadcrumbItems.push({ label: unit.data.name, href: `/location/${unit.data.id}` })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-white tracking-tight">{unit.data.name}</h1>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">qr_code_2</span>
            {unit.data.id.slice(0, 12)}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {unit.type === "locker" ? (
          <LockerView 
            reports={reports || []} 
            unitName={unit.data.name} 
            onDeposit={() => router.push(`/staff/deposit?unitId=${unitId}`)}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {unit.type === "room" ? "Facility Layout" : "Cabinet Elevation"}
              </h2>
              <p className="text-xs text-slate-500 italic">
                {unit.type === "room" ? "Select a cabinet to see elevation" : "Select a locker to see reports"}
              </p>
            </div>
            <div className="h-[600px]">
              <ArchitectCanvas 
                units={(subUnits as unknown as CanvasUnit[]) || []} 
                onUnitSelect={(u) => u && router.push(`/location/${u.id}`)}
                onUnitMove={() => {}} // Read-only for navigation
                gridWidth={unit.type === "room" ? unit.data.grid_width || 50 : 100}
                gridHeight={unit.type === "room" ? unit.data.grid_height || 50 : 50}
                roomWidthCm={unit.type === "room" ? unit.data.width_cm || 1000 : unit.data.width || 120}
                roomHeightCm={unit.type === "room" ? unit.data.height_cm || 1000 : 300}
                readOnly={true}
                isElevationMode={unit.type !== "room"}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
