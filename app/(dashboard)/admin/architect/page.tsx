"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getRoomsAction, getStorageUnitsAction, createStorageUnitAction, createRoomAction, batchUpdateStorageUnitsAction, getSubUnitsAction, updateRoomAction, deleteRoomAction, deleteStorageUnitAction } from "@/actions/locationActions"
import { StorageUnit, StorageUnitInsert } from "@/services/locationService"
import { ArchitectCanvas } from "@/components/dashboard/locations/ArchitectCanvas"
import { motion } from "framer-motion"
import { toast } from "sonner"
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
  const queryClient = useQueryClient()
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null)
  
  // Local state for Canvas
  const [localUnits, setLocalUnits] = useState<StorageUnit[]>([])
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  
  // New/Edit Room State
  const [isAddingRoom, setIsAddingRoom] = useState(false)
  const [isEditingRoom, setIsEditingRoom] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)
  const [unitToDelete, setUnitToDelete] = useState<{id: string, type: 'unit' | 'locker'} | null>(null)
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomFloor, setNewRoomFloor] = useState(1)
  const [newRoomGridWidth, setNewRoomGridWidth] = useState(50)
  const [newRoomGridHeight, setNewRoomGridHeight] = useState(50)

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
      // eslint-disable-next-line
      setLocalUnits(units)
      setUnsavedChanges(false)
    }
  }, [units])

  // Fetch sub-units (Lockers) when a unit is selected
  const { data: subUnits } = useQuery({
    queryKey: ["sub-units", selectedUnit?.id],
    queryFn: () => getSubUnitsAction(selectedUnit!.id),
    enabled: !!selectedUnit
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
      setNewRoomName("")
      setNewRoomFloor(1)
      setNewRoomGridWidth(50)
      setNewRoomGridHeight(50)
      if (data && data.id) setSelectedRoomId(data.id)
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
    mutationFn: (id: string) => deleteStorageUnitAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units", selectedRoomId] })
      if (selectedUnit) {
        queryClient.invalidateQueries({ queryKey: ["sub-units", selectedUnit.id] })
      }
      
      if (unitToDelete?.type === 'unit') {
        setSelectedUnit(null)
        toast.success("Unit deleted successfully")
      } else {
        toast.success("Locker deleted successfully")
      }
      setUnitToDelete(null)
    }
  })

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return toast.error("Room name is required")
    if (newRoomGridWidth > 200 || newRoomGridHeight > 200) return toast.error("Maximum grid size is 200px")
    if (newRoomGridWidth < 10 || newRoomGridHeight < 10) return toast.error("Minimum grid size is 10px")
    
    createRoomMutation.mutate({ 
      name: newRoomName, 
      floor_number: newRoomFloor,
      grid_width: newRoomGridWidth,
      grid_height: newRoomGridHeight
    })
  }

  const handleCancelAddRoom = () => {
    if (window.confirm("Batal membuat ruangan baru? Data yang sudah diisi akan hilang.")) {
      setIsAddingRoom(false)
      window.location.href = "/admin/architect"
    }
  }

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
    
    createUnitMutation.mutate({
      room_id: selectedRoomId,
      name: `Unit ${ (units?.length || 0) + 1 }`,
      x: 100,
      y: 100,
      z: 0,
      is_assignable: false,
      status: "available"
    })
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

  const handleSaveLayout = () => {
    const updates = localUnits.map(u => ({ id: u.id, x: u.x, y: u.y, width: u.width, height: u.height, name: u.name }))
    batchUpdateMutation.mutate(updates)
  }

  const handleAddLocker = () => {
    if (!selectedUnit) return;
    createUnitMutation.mutate({
      room_id: selectedUnit.room_id,
      parent_id: selectedUnit.id,
      name: `Locker ${ (subUnits?.length || 0) + 1 }`,
      x: 0, y: 0, z: (subUnits?.length || 0) + 1,
      is_assignable: true,
      status: "available"
    })
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
            onClick={() => {
              setNewRoomName("")
              setNewRoomFloor(1)
              setNewRoomGridWidth(50)
              setNewRoomGridHeight(50)
              setIsAddingRoom(true)
            }}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add_business</span>
            Add Room
          </button>

          <button 
            onClick={handleSaveLayout}
            disabled={!unsavedChanges || batchUpdateMutation.isPending}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              unsavedChanges 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed"
            }`}
          >
            <span className="material-symbols-outlined text-sm">save</span>
            Save Layout
          </button>

          <button 
            onClick={handleAddUnit}
            disabled={!selectedRoomId}
            className="primary-gradient text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Unit
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 min-h-[500px]">
          {!selectedRoomId ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/30 rounded-xl border border-dashed border-slate-800 text-slate-500">
              <span className="material-symbols-outlined text-5xl mb-4 opacity-20">grid_view</span>
              <p>Please select a room to start designing</p>
            </div>
          ) : (
            <ArchitectCanvas 
              units={localUnits} 
              selectedUnitId={selectedUnit?.id}
              onUnitSelect={setSelectedUnit}
              onUnitMove={handleUnitMove}
              gridWidth={rooms?.find(r => r.id === selectedRoomId)?.grid_width || 50}
              gridHeight={rooms?.find(r => r.id === selectedRoomId)?.grid_height || 50}
            />
          )}
        </div>

        {/* Sidebar Info */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-96 bg-slate-900/50 rounded-xl border border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-sm">info</span>
              <span className="text-xs font-bold uppercase tracking-widest">Properties</span>
            </div>
            {selectedUnit && (
              <button 
                onClick={() => setUnitToDelete({ id: selectedUnit.id, type: 'unit' })}
                className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-md transition-colors"
                title="Delete Unit"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            )}
          </div>

          {selectedUnit ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Unit Name</label>
                <input 
                  type="text" 
                  value={selectedUnit.name}
                  onChange={(e) => handleUnitRename(selectedUnit.id, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">X Position</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono">
                    {selectedUnit.x}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Y Position</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono">
                    {selectedUnit.y}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Width (px)</label>
                  <input 
                    type="number" 
                    step={50}
                    value={selectedUnit.width}
                    onChange={(e) => handleUnitResize(selectedUnit.id, parseInt(e.target.value) || 50, selectedUnit.height)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Height (px)</label>
                  <input 
                    type="number" 
                    step={50}
                    value={selectedUnit.height}
                    onChange={(e) => handleUnitResize(selectedUnit.id, selectedUnit.width, parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
              <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10 mb-4">
                <p className="text-[10px] text-blue-400/80 italic">Drag units on the canvas and click &apos;Save Layout&apos; to persist changes.</p>
              </div>

              {/* Sub-Units (Lockers) Section */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Lockers (Sub-units)</label>
                  <button 
                    onClick={handleAddLocker}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-blue-400 bg-primary/10 px-2 py-1 rounded-md"
                  >
                    <span className="material-symbols-outlined text-xs">add</span> Add Locker
                  </button>
                </div>
                
                <div className="space-y-2">
                  {!subUnits || subUnits.length === 0 ? (
                    <div className="p-4 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-500">
                      No lockers in this cabinet.
                    </div>
                  ) : (
                    subUnits.map(locker => (
                      <div key={locker.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-slate-500 text-sm">inventory_2</span>
                          <span className="text-xs font-bold text-slate-300">{locker.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            locker.status === "available" ? "bg-emerald-500/10 text-emerald-500" :
                            locker.status === "full" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {locker.status}
                          </span>
                          <button 
                            onClick={() => setUnitToDelete({ id: locker.id, type: 'locker' })}
                            className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-md transition-colors"
                            title="Delete Locker"
                          >
                            <span className="material-symbols-outlined text-[10px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600">
              <span className="material-symbols-outlined text-4xl mb-2">touch_app</span>
              <p className="text-xs">Select a unit on the grid to view its properties</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Room Modal */}
      {isAddingRoom && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-4">Create New Room</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Room Name</label>
                <input 
                  type="text" 
                  value={newRoomName}
                  onChange={e => setNewRoomName(e.target.value)}
                  placeholder="e.g. Vault A, Main Warehouse"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Floor Number</label>
                <input 
                  type="number" 
                  value={newRoomFloor}
                  onChange={e => setNewRoomFloor(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                />
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
                  onClick={handleCancelAddRoom}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddRoom}
                  className="flex-1 primary-gradient text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all"
                >
                  Create Room
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
