"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getRoomsAction, getStorageUnitsAction, createStorageUnitAction, createRoomAction, batchUpdateStorageUnitsAction, getSubUnitsAction, updateRoomAction, deleteRoomAction, deleteStorageUnitAction } from "@/actions/locationActions"
import { getReportsByUnitAction, requestDepositAction } from "@/actions/reportActions"
import type { StorageUnit as DBStorageUnit, StorageUnitInsert } from "@/services/locationService"
import { ArchitectCanvas } from "@/components/dashboard/locations/ArchitectCanvas"
import { AddRoomDialog } from "@/components/dashboard/locations/add-room-dialog"
import { LockerView } from "@/components/dashboard/locations/LockerView"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Box, Layout, Save, Plus, Trash2, Settings2, LogIn, Grid } from "lucide-react"
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

export default function ArchitectPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<DBStorageUnit | null>(null)
  
  // Local state for Canvas
  const [localUnits, setLocalUnits] = useState<DBStorageUnit[]>([])
  const [localSubUnits, setLocalSubUnits] = useState<DBStorageUnit[]>([])
  const [selectedSubUnit, setSelectedSubUnit] = useState<DBStorageUnit | null>(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  
  // New/Edit Room State
  const [isAddingRoom, setIsAddingRoom] = useState(false)
  const [isEditingRoom, setIsEditingRoom] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [viewMode, setViewMode] = useState<'GRID' | 'ELEVATION' | 'LOCKER_DETAILS'>('GRID')
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)
  const [unitToDelete, setUnitToDelete] = useState<{id: string, type: 'unit' | 'locker'} | null>(null)
  const [newRoomGridWidth, setNewRoomGridWidth] = useState(50)
  const [newRoomGridHeight, setNewRoomGridHeight] = useState(50)
  const [showControls, setShowControls] = useState(true)
  const [isDepositing, setIsDepositing] = useState(false)
  const [depositData, setDepositData] = useState({ title: '', client: '', thickness: '' })
  const [checklist, setChecklist] = useState<string[]>([])

  // Fetch Rooms
  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRoomsAction()
  })

  // Fetch Units for selected room
  const { data: units } = useQuery({
    queryKey: ["units", selectedRoomId],
    queryFn: () => getStorageUnitsAction(selectedRoomId!),
    enabled: !!selectedRoomId
  })

  // Sync db units to local state
  useEffect(() => {
    if (units) {
      const timer = setTimeout(() => {
        setLocalUnits(units)
        setUnsavedChanges(false)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [units])

  // Fetch sub-units (Lockers) when a unit is selected
  const { data: subUnits } = useQuery({
    queryKey: ["sub-units", selectedUnit?.id],
    queryFn: () => getSubUnitsAction(selectedUnit!.id),
    enabled: !!selectedUnit && !selectedUnit.id.startsWith('temp-')
  })

  // Sync sub-units to local state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (subUnits) {
        setLocalSubUnits(subUnits)
      } else {
        setLocalSubUnits([])
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [subUnits])

  const handleEnterCabinet = useCallback(() => {
    if (!selectedUnit) return;
    setSelectedSubUnit(null); // Clear sub-unit selection when entering
    setViewMode('ELEVATION');
  }, [selectedUnit]);

  // Handle Double Click from Canvas
  useEffect(() => {
    const handleDblClick = () => {
      if (viewMode === 'GRID') {
        handleEnterCabinet();
      } else if (viewMode === 'ELEVATION') {
        setViewMode('LOCKER_DETAILS');
      }
    };
    window.addEventListener('canvas-dblclick', handleDblClick);
    return () => window.removeEventListener('canvas-dblclick', handleDblClick);
  }, [viewMode, handleEnterCabinet]);

  // Fetch reports for selected locker
  const { data: reports } = useQuery({
    queryKey: ["reports", selectedSubUnit?.id],
    queryFn: () => getReportsByUnitAction(selectedSubUnit!.id),
    enabled: !!selectedSubUnit && viewMode === 'LOCKER_DETAILS'
  })

  // Mutations
  const batchUpdateMutation = useMutation({
    mutationFn: (updates: { id: string; x: number; y: number; width: number; height: number; name: string }[]) =>
      batchUpdateStorageUnitsAction(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units", selectedRoomId] })
      toast.success("Layout saved successfully")
      setUnsavedChanges(false)
    }
  })

  const createUnitMutation = useMutation({
    mutationFn: (unit: StorageUnitInsert) => createStorageUnitAction(unit),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["units", selectedRoomId] })
      if (variables.parent_id) {
        queryClient.invalidateQueries({ queryKey: ["sub-units", variables.parent_id] })
        toast.success("New locker added")
      } else {
        toast.success("New unit added")
      }
    }
  })

  const createRoomMutation = useMutation({
    mutationFn: (room: { name: string; floor_number: number; grid_width: number; grid_height: number }) => createRoomAction(room),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      toast.success("New room created")
      setIsAddingRoom(false)
      const res = data as { id: string } | null
      if (res?.id) setSelectedRoomId(res.id)
    }
  })

  const updateRoomMutation = useMutation({
    mutationFn: (updates: { id: string; grid_width: number; grid_height: number }) => updateRoomAction(updates.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      toast.success("Room grid updated")
      setIsEditingRoom(false)
    }
  })

  const deleteRoomMutation = useMutation({
    mutationFn: (id: string) => deleteRoomAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      toast.success("Room deleted successfully")
      window.location.href = "/admin/architect"
    }
  })

  const deleteUnitMutation = useMutation({
    mutationFn: async (id: string) => {
      // If it's a temporary ID, we don't need to call the server
      if (id.startsWith('temp-')) return;
      await deleteStorageUnitAction(id);
    },
    onSuccess: (_, id) => {
      // 1. Remove from local states
      setLocalUnits(prev => prev.filter(u => u.id !== id));
      setLocalSubUnits(prev => prev.filter(u => u.id !== id));
      
      // 2. Invalidate queries for DB items
      queryClient.invalidateQueries({ queryKey: ["units", selectedRoomId] })
      if (selectedUnit) {
        queryClient.invalidateQueries({ queryKey: ["sub-units", selectedUnit.id] })
      }
      
      if (unitToDelete?.type === 'unit') {
        setSelectedUnit(null)
        toast.success("Unit deleted successfully")
      } else {
        setSelectedSubUnit(null)
        toast.success("Locker deleted successfully")
      }
      setUnitToDelete(null)
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`)
      setUnitToDelete(null)
    }
  })


  const depositMutation = useMutation({
    mutationFn: async () => {
      const user = session?.user as { id: string }
      if (!user || !selectedSubUnit) throw new Error("Unauthorized or no locker selected")

      return requestDepositAction({
        title: depositData.title,
        client: depositData.client,
        unit_id: selectedSubUnit.id,
        created_by: user.id,
        metadata: {
          thickness_cm: depositData.thickness,
          sop_checklist: checklist
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", selectedSubUnit?.id] })
      toast.success("Deposit request submitted!")
      setIsDepositing(false)
      setDepositData({ title: '', client: '', thickness: '' })
      setChecklist([])
    },
    onError: (err: Error) => toast.error(err.message)
  })

  const handleEditRoom = () => {
    if (newRoomGridWidth > 200 || newRoomGridHeight > 200) return toast.error("Maximum grid size is 200px")
    if (newRoomGridWidth < 10 || newRoomGridHeight < 10) return toast.error("Minimum grid size is 10px")
    
    updateRoomMutation.mutate({
      id: selectedRoomId!,
      grid_width: newRoomGridWidth,
      grid_height: newRoomGridHeight
    })
  }

  const openEditRoomModal = () => {
    const currentRoom = rooms?.find(r => r.id === selectedRoomId)
    if (currentRoom) {
      setNewRoomGridWidth(currentRoom.grid_width || 50)
      setNewRoomGridHeight(currentRoom.grid_height || 50)
      setIsEditingRoom(true)
    }
  }

  const handleDeleteRoom = () => {
    if (!selectedRoomId) return
    setRoomToDelete(selectedRoomId)
  }

  const confirmDeleteRoom = () => {
    if (roomToDelete) {
      deleteRoomMutation.mutate(roomToDelete)
      setRoomToDelete(null)
    }
  }

  const handleAddUnit = () => {
    if (!selectedRoomId) return toast.error("Please select a room first")
    
    const newUnit: DBStorageUnit = {
      id: `temp-${Date.now()}`,
      room_id: selectedRoomId,
      parent_id: null,
      name: `Unit ${ (localUnits.length || 0) + 1 }`,
      x: 100,
      y: 100,
      z: 0,
      width: 100,
      height: 100,
      is_assignable: false,
      status: "available",
      created_at: new Date()
    }

    setLocalUnits(prev => [...prev, newUnit])
    setSelectedUnit(newUnit)
    setUnsavedChanges(true)
  }

  const handleUnitMove = (id: string, x: number, y: number) => {
    setLocalUnits(prev => prev.map(u => u.id === id ? { ...u, x, y } : u))
    setUnsavedChanges(true)
    if (selectedUnit?.id === id) {
      setSelectedUnit(prev => prev ? { ...prev, x, y } : null)
    }
  }

  const handleUnitResize = (id: string, width: number, height: number) => {
    setLocalUnits(prev => prev.map(u => u.id === id ? { ...u, width, height } : u))
    setUnsavedChanges(true)
    if (selectedUnit?.id === id) {
      setSelectedUnit(prev => prev ? { ...prev, width, height } : null)
    }
  }

  const handleUnitRename = (id: string, name: string) => {
    setLocalUnits(prev => prev.map(u => u.id === id ? { ...u, name } : u))
    setUnsavedChanges(true)
    if (selectedUnit?.id === id) {
      setSelectedUnit(prev => prev ? { ...prev, name } : null)
    }
  }

  const handleSubUnitMove = (id: string, x: number, y: number) => {
    setLocalSubUnits(prev => prev.map(u => u.id === id ? { ...u, x, y } : u))
    setUnsavedChanges(true)
  }

  const handleSubUnitResize = (id: string, width: number, height: number) => {
    setLocalSubUnits(prev => prev.map(u => u.id === id ? { ...u, width, height } : u))
    setUnsavedChanges(true)
    if (selectedSubUnit?.id === id) {
      setSelectedSubUnit(prev => prev ? { ...prev, width, height } : null)
    }
  }

  const handleSubUnitRename = (id: string, name: string) => {
    setLocalSubUnits(prev => prev.map(u => u.id === id ? { ...u, name } : u))
    setUnsavedChanges(true)
    if (selectedSubUnit?.id === id) {
      setSelectedSubUnit(prev => prev ? { ...prev, name } : null)
    }
  }

  const handleSaveLayout = async () => {
    // Separate into updates and creations
    const toUpdate = localUnits.filter(u => !u.id.startsWith('temp-')).map(u => ({ 
      id: u.id, 
      x: u.x, 
      y: u.y, 
      width: Number(u.width), 
      height: Number(u.height), 
      name: u.name 
    }))

    const subUnitsToUpdate = localSubUnits.filter(u => !u.id.startsWith('temp-')).map(u => ({
      id: u.id,
      x: u.x,
      y: u.y,
      width: Number(u.width),
      height: Number(u.height),
      name: u.name
    }))

    const toCreate = localUnits.filter(u => u.id.startsWith('temp-'))
    const lockersToCreate = localSubUnits.filter(u => u.id.startsWith('temp-'))

    try {
      if (toUpdate.length > 0) {
        await batchUpdateMutation.mutateAsync(toUpdate)
      }

      if (subUnitsToUpdate.length > 0) {
        await batchUpdateMutation.mutateAsync(subUnitsToUpdate)
      }

      // Create Units
      const tempToRealIdMap: Record<string, string> = {}
      if (toCreate.length > 0) {
        for (const unit of toCreate) {
          const created = await createUnitMutation.mutateAsync({
            room_id: unit.room_id,
            name: unit.name,
            x: unit.x,
            y: unit.y,
            z: unit.z,
            width: unit.width,
            height: unit.height,
            is_assignable: unit.is_assignable,
            status: unit.status
          }) as { id: string } | null
          if (created?.id) tempToRealIdMap[unit.id] = created.id
        }
      }

      // Create Lockers
      if (lockersToCreate.length > 0) {
        for (const locker of lockersToCreate) {
          // Resolve parent_id if it was a temp ID
          const parentId = locker.parent_id?.startsWith('temp-') 
            ? tempToRealIdMap[locker.parent_id] 
            : locker.parent_id

          if (parentId) {
            await createUnitMutation.mutateAsync({
              room_id: locker.room_id,
              parent_id: parentId,
              name: locker.name,
              x: locker.x,
              y: locker.y,
              z: locker.z,
              width: locker.width,
              height: locker.height,
              is_assignable: locker.is_assignable,
              status: locker.status
            })
          }
        }
      }
      
      toast.success("Changes saved successfully")
      setUnsavedChanges(false)
      queryClient.invalidateQueries({ queryKey: ["units", selectedRoomId] })
      if (selectedUnit) queryClient.invalidateQueries({ queryKey: ["sub-units", selectedUnit.id] })
    } catch {
      toast.error("Failed to save changes")
    }
  }

  const handleAddLocker = () => {
    if (!selectedUnit) return;
    
    const newLocker: DBStorageUnit = {
      id: `temp-locker-${Date.now()}`,
      room_id: selectedUnit.room_id,
      parent_id: selectedUnit.id,
      name: `Locker ${ (localSubUnits.length || 0) + 1 }`,
      x: 0, y: 0, z: (localSubUnits.length || 0) + 1,
      width: 50,
      height: 50,
      is_assignable: true,
      status: "available",
      created_at: new Date()
    }

    setLocalSubUnits(prev => [...prev, newLocker])
    setUnsavedChanges(true)
  }


  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-180px)]">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <span className="material-symbols-outlined text-blue-500">architecture</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Layout Architect</h1>
            <p className="text-xs text-slate-400">Design and manage warehouse grid positions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={selectedRoomId || ""} 
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="bg-slate-800 text-white text-sm px-4 py-2 rounded-lg border border-slate-700 outline-none focus:border-blue-500 transition-all"
          >
            <option value="" disabled>Select Room</option>
            {rooms?.map(room => (
              <option key={room.id} value={room.id}>{room.name} (Floor {room.floor_number})</option>
            ))}
          </select>

          <button 
            onClick={() => setIsLocked(!isLocked)}
            className={`p-2 rounded-lg transition-all flex items-center gap-2 px-3 ${
              isLocked 
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
            }`}
            title={isLocked ? "Unlock Grid to Move Units" : "Lock Grid to Prevent Movement"}
          >
            <span className="material-symbols-outlined text-sm">
              {isLocked ? "lock" : "lock_open"}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isLocked ? "Grid Locked" : "Grid Editable"}
            </span>
          </button>

          <button 
            onClick={openEditRoomModal}
            disabled={!selectedRoomId}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all disabled:opacity-50"
            title="Edit Grid Size"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
          </button>

          <button 
            onClick={handleDeleteRoom}
            disabled={!selectedRoomId}
            className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50"
            title="Delete Room"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>

          <button 
            onClick={() => setIsAddingRoom(true)}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </button>

          <button 
            onClick={handleSaveLayout}
            disabled={!unsavedChanges || batchUpdateMutation.isPending || viewMode === 'ELEVATION'}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              unsavedChanges && viewMode === 'GRID'
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            Save Layout
          </button>

          <button 
            onClick={handleAddUnit}
            disabled={!selectedRoomId || viewMode === 'ELEVATION'}
            className="primary-gradient text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Unit
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden relative">
        {/* Canvas Area */}
        <div className="flex-1 min-h-[500px] relative">
          <AnimatePresence mode="wait">
            {!selectedRoomId ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center bg-slate-900/30 rounded-xl border border-dashed border-slate-800 text-slate-500"
              >
                <Layout className="w-12 h-12 mb-4 opacity-20" />
                <p>Please select a room to start designing</p>
              </motion.div>
            ) : viewMode === 'GRID' ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="w-full h-full"
              >
                <ArchitectCanvas 
                  units={localUnits} 
                  selectedUnitId={selectedUnit?.id}
                  onUnitSelect={setSelectedUnit}
                  onUnitMove={handleUnitMove}
                  gridWidth={rooms?.find(r => r.id === selectedRoomId)?.grid_width || 50}
                  gridHeight={rooms?.find(r => r.id === selectedRoomId)?.grid_height || 50}
                  readOnly={isLocked}
                />
              </motion.div>
            ) : viewMode === 'ELEVATION' ? (
              <motion.div 
                key="elevation"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="w-full h-full relative"
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-950/40 rounded-xl overflow-hidden">
                  <ArchitectCanvas 
                    units={localSubUnits} 
                    selectedUnitId={selectedSubUnit?.id}
                    onUnitSelect={setSelectedSubUnit} 
                    onUnitMove={handleSubUnitMove}
                    onUnitResize={handleSubUnitResize}
                    gridWidth={25} // Smaller grid for internal cabinet
                    gridHeight={25}
                    readOnly={isLocked}
                    backgroundLabel={`INSIDE: ${selectedUnit?.name}`}
                  />
                </div>

                {/* Elevation Navigation & Actions */}
                <AnimatePresence>
                  {showControls && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-6 left-6 z-50 flex items-center gap-4"
                      >
                         <button 
                           onClick={() => setViewMode('GRID')}
                           className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:bg-white/20 transition-all border border-white/10"
                         >
                           <span className="material-symbols-outlined text-sm">arrow_back</span>
                           Back to Room View
                         </button>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute top-6 right-20 z-50 flex flex-col items-end gap-2"
                      >
                         <button 
                           onClick={handleAddLocker}
                           className="primary-gradient text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                         >
                           <Plus className="w-4 h-4" />
                           Add Locker to {selectedUnit?.name}
                         </button>
                         {unsavedChanges && (
                            <div className="bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-xl backdrop-blur-md">
                              <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest">Unsaved changes in cabinet</p>
                            </div>
                         )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Toggle Visibility Button */}
                <button 
                  onClick={() => setShowControls(!showControls)}
                  className={`absolute top-6 right-6 z-50 w-12 h-12 rounded-2xl backdrop-blur-md flex items-center justify-center transition-all border shadow-2xl ${
                    showControls 
                      ? "bg-white/10 text-white border-white/10 hover:bg-white/20" 
                      : "bg-primary text-white border-primary shadow-primary/20 hover:scale-110"
                  }`}
                  title={showControls ? "Hide Controls" : "Show Controls"}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showControls ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="locker-details"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setViewMode('ELEVATION')}
                      className="p-3 bg-slate-800 text-white rounded-xl border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      Back to Elevation
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedSubUnit?.name}</h2>
                      <p className="text-xs text-slate-500">Managing reports in this locker slot</p>
                    </div>
                  </div>
                </div>

                <LockerView 
                  unitName={selectedSubUnit?.name || ""}
                  reports={(reports || []) as Parameters<typeof LockerView>[0]['reports']}
                  onDeposit={() => setIsDepositing(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Deposit Modal */}
        <AnimatePresence>
          {isDepositing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDepositing(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Taro Laporan Baru</h2>
                    <p className="text-xs text-slate-500 mt-1">Loker Target: <span className="text-blue-400 font-bold">{selectedSubUnit?.name}</span></p>
                  </div>
                  <button onClick={() => setIsDepositing(false)} className="w-10 h-10 rounded-xl hover:bg-white/5 text-slate-500 transition-all">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="p-8 flex flex-col gap-8 overflow-y-auto max-h-[70vh]">
                  {/* Metadata */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Judul Laporan</label>
                      <input 
                        type="text" 
                        value={depositData.title}
                        onChange={e => setDepositData({...depositData, title: e.target.value})}
                        placeholder="Masukkan judul laporan..."
                        className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Klien / Proyek</label>
                        <input 
                          type="text" 
                          value={depositData.client}
                          onChange={e => setDepositData({...depositData, client: e.target.value})}
                          placeholder="Nama klien..."
                          className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Ketebalan (cm)</label>
                        <input 
                          type="number" 
                          value={depositData.thickness}
                          onChange={e => setDepositData({...depositData, thickness: e.target.value})}
                          placeholder="Contoh: 5"
                          className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-amber-500 rounded-full" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">SOP Verification</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      {["Halaman Lengkap", "Tanda Tangan & Cap", "Standard Cover", "Kondisi Fisik Baik"].map(item => (
                        <label key={item} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          checklist.includes(item) ? "bg-blue-500/10 border-blue-500/20 text-blue-300" : "bg-slate-800/30 border-white/5 text-slate-500 hover:bg-white/5"
                        }`}>
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={checklist.includes(item)}
                            onChange={() => setChecklist(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])}
                          />
                          <span className="material-symbols-outlined text-sm">{checklist.includes(item) ? 'check_circle' : 'radio_button_unchecked'}</span>
                          <span className="text-sm font-medium">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white/5 border-t border-white/5 flex gap-3">
                  <button 
                    onClick={() => setIsDepositing(false)}
                    className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => depositMutation.mutate()}
                    disabled={depositMutation.isPending || checklist.length < 4 || !depositData.title}
                    className="flex-1 py-4 rounded-2xl primary-gradient text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    {depositMutation.isPending ? "Memproses..." : "Taro Laporan Sekarang"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Sidebar Info */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-96 bg-slate-900/50 rounded-xl border border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Settings2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Properties</span>
            </div>
            {selectedUnit && (
              <button 
                onClick={() => setUnitToDelete({ id: selectedUnit.id, type: 'unit' })}
                className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-md transition-colors"
                title="Delete Unit"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedUnit || selectedSubUnit ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-3">
                   <Box className="w-4 h-4 text-blue-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                     {selectedSubUnit ? 'Locker Properties' : 'Cabinet Properties'}
                   </span>
                </div>
                <button 
                  onClick={() => setUnitToDelete({ 
                    id: (selectedSubUnit?.id || selectedUnit?.id)!, 
                    type: selectedSubUnit ? 'locker' : 'unit' 
                  })}
                  className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all"
                >
                   <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Name</label>
                <input 
                  type="text" 
                  value={selectedSubUnit ? selectedSubUnit.name : (selectedUnit?.name || '')}
                  onChange={(e) => {
                    if (selectedSubUnit) handleSubUnitRename(selectedSubUnit.id, e.target.value)
                    else if (selectedUnit) handleUnitRename(selectedUnit.id, e.target.value)
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {viewMode === 'GRID' && selectedUnit && (
                <button 
                  onClick={handleEnterCabinet}
                  className="w-full py-4 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-3 group"
                >
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Enter Cabinet Elevation
                </button>
              )}

              {viewMode === 'ELEVATION' && selectedSubUnit && (
                <button 
                  onClick={() => setViewMode('LOCKER_DETAILS')}
                  className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">inventory_2</span>
                  Open Locker Details
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">X Position</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono">
                    {selectedSubUnit ? selectedSubUnit.x : (selectedUnit?.x || 0)}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Y Position</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono">
                    {selectedSubUnit ? selectedSubUnit.y : (selectedUnit?.y || 0)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Width (px)</label>
                  <input 
                    type="number" 
                    step={25}
                    value={(selectedSubUnit ? selectedSubUnit.width : selectedUnit?.width) || 100}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      if (selectedSubUnit) handleSubUnitResize(selectedSubUnit.id, val, selectedSubUnit.height)
                      else if (selectedUnit) handleUnitResize(selectedUnit.id, val, selectedUnit.height)
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Height (px)</label>
                  <input 
                    type="number" 
                    step={25}
                    value={(selectedSubUnit ? selectedSubUnit.height : selectedUnit?.height) || 100}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      if (selectedSubUnit) handleSubUnitResize(selectedSubUnit.id, selectedSubUnit.width, val)
                      else if (selectedUnit) handleUnitResize(selectedUnit.id, selectedUnit.width, val)
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
              
              {viewMode === 'GRID' && (
                <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10 mb-4">
                  <p className="text-[10px] text-blue-400/80 italic">Drag units on the canvas and click &apos;Save Layout&apos; to persist changes.</p>
                </div>
              )}

              {/* Sub-Units (Lockers) Section - Quick View */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Lockers Matrix</label>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {subUnits?.length || 0} Slots
                  </span>
                </div>
                
                <div className="space-y-2">
                  {!localSubUnits || localSubUnits.length === 0 ? (
                    <div className="p-4 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-500">
                      No lockers in this cabinet.
                    </div>
                  ) : (
                    localSubUnits.map(locker => (
                      <div key={locker.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <Box className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-bold text-slate-300">{locker.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            locker.status === "available" ? "bg-emerald-500/10 text-emerald-500" :
                            locker.status === "full" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {locker.status}
                          </span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => {
                                setSelectedSubUnit(locker);
                                setViewMode('LOCKER_DETAILS');
                              }}
                              className="p-1 hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 rounded-md transition-colors"
                              title="View Reports"
                            >
                              <LogIn className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => setUnitToDelete({ id: locker.id, type: 'locker' })}
                              className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-md transition-colors"
                              title="Delete Locker"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600">
              <Grid className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-xs">Select a unit on the grid to view its properties</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Room Modal */}
      <AddRoomDialog 
        isOpen={isAddingRoom}
        onClose={() => setIsAddingRoom(false)}
        onAdd={(config) => createRoomMutation.mutate(config)}
      />

      {/* Edit Room Grid Modal */}
      {isEditingRoom && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-4">Edit Room Grid</h2>
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 mb-4">
                <p className="text-[10px] text-amber-500 italic">Changing the grid size will not automatically move existing units. You may need to readjust them to fit the new grid snapping.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Grid Width (10-200px)</label>
                  <input 
                    type="number" 
                    value={newRoomGridWidth}
                    onChange={e => setNewRoomGridWidth(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Grid Height (10-200px)</label>
                  <input 
                    type="number" 
                    value={newRoomGridHeight}
                    onChange={e => setNewRoomGridHeight(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsEditingRoom(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditRoom}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
                >
                  Save Grid Size
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Room Alert Dialog */}
      <AlertDialog open={!!roomToDelete} onOpenChange={(open) => !open && setRoomToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">warning</span>
              Delete Room Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete the room, all storage units, lockers, and related layout configurations inside it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteRoom}
              className="bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-lg shadow-rose-500/20"
            >
              Yes, delete room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Unit/Locker Alert Dialog */}
      <AlertDialog open={!!unitToDelete} onOpenChange={(open) => !open && setUnitToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">warning</span>
              Delete {unitToDelete?.type === 'unit' ? 'Cabinet Unit' : 'Locker'}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this {unitToDelete?.type === 'unit' ? 'unit and all lockers inside it' : 'locker'}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (unitToDelete) deleteUnitMutation.mutate(unitToDelete.id)
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-lg shadow-rose-500/20"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
