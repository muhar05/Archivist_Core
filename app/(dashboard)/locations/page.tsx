"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RoomFloor } from "@/components/dashboard/locations/room-floor"
import { CabinetTopView } from "@/components/dashboard/locations/cabinet-top-view"
import { CabinetFrontView } from "@/components/dashboard/locations/cabinet-front-view"
import { RoomCard } from "@/components/dashboard/locations/room-card"
import { WallElement } from "@/components/dashboard/locations/wall-element"
import { StorageUnit, StorageType } from "@/components/dashboard/locations/types"

const GRID_SIZE = 50; // 50px = 50cm


type NavLevel = 'OVERVIEW' | 'ROOM' | 'CABINET';
type BuilderTool = 'SELECT' | 'CABINET_TOOL' | 'WALL_TOOL';

const INITIAL_DATA: StorageUnit[] = [
  {
    id: 'room-1',
    name: 'Vault Alpha',
    type: 'ROOM',
    parentId: null,
    path: 'room-1',
    code: 'SEC-A-01',
    capacity: 100,
    currentLoad: 45,
    children: []
  },
  {
    id: 'room-2',
    name: 'Sector 7 Storage',
    type: 'ROOM',
    parentId: null,
    path: 'room-2',
    code: 'SEC-B-07',
    capacity: 250,
    currentLoad: 120,
    children: []
  }
];

export default function LocationsPage() {
  const [navLevel, setNavLevel] = useState<NavLevel>('OVERVIEW')
  const [rooms, setRooms] = useState<StorageUnit[]>(INITIAL_DATA)
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [selectedCabinetId, setSelectedCabinetId] = useState<string | null>(null)
  const [activeFloor, setActiveFloor] = useState(1)
  const [roomSize, setRoomSize] = useState({ width: 14, height: 12 })
  const [activeTool, setActiveTool] = useState<BuilderTool>('SELECT')
  const [mouseGridPos, setMouseGridPos] = useState({ x: 0, y: 0 })
  
  const roomRef = React.useRef<HTMLDivElement>(null)

  const activeRoom = useMemo(() => rooms.find(r => r.id === activeRoomId), [rooms, activeRoomId]);
  const activeCabinet = useMemo(() => activeRoom?.children?.find(c => c.id === selectedCabinetId), [activeRoom, selectedCabinetId]);

  const handleOpenRoom = (room: StorageUnit) => {
    setActiveRoomId(room.id);
    setNavLevel('ROOM');
  };

  const handleFloorMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (navLevel !== 'ROOM' || activeTool === 'SELECT') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = Math.floor((e.clientY - rect.top) / GRID_SIZE);
    setMouseGridPos({ x, y });
  };

  const handleFloorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (navLevel !== 'ROOM' || e.target !== e.currentTarget) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = Math.floor((e.clientY - rect.top) / GRID_SIZE);

    if (activeTool === 'CABINET_TOOL') {
      spawnUnit('RACK', x, y);
    } else if (activeTool === 'WALL_TOOL') {
      spawnUnit('WALL', x, y);
    }
  };

  const spawnUnit = (type: StorageType, x: number, y: number) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== activeRoomId) return room;
      const newUnit: StorageUnit = {
        id: `${type.toLowerCase()}-${Date.now()}`,
        name: type === 'RACK' ? `Lemari ${x}-${y}` : `Sekat ${x}-${y}`,
        type: type,
        parentId: activeRoomId,
        path: `${room.path}.${type.toLowerCase()}-${Date.now()}`,
        x: x,
        y: y,
        width: type === 'RACK' ? 2 : 1,
        height: 1,
        texture: type === 'RACK' ? 'METAL' : undefined,
        children: type === 'RACK' ? [
          { id: `l-${Date.now()}-1`, name: 'Loker 01', type: 'BOX', parentId: '', path: '', capacity: 10, currentLoad: 0 },
          { id: `l-${Date.now()}-2`, name: 'Loker 02', type: 'BOX', parentId: '', path: '', capacity: 10, currentLoad: 0 },
        ] : undefined
      };
      return { ...room, children: [...(room.children || []), newUnit] };
    }));
  };

  const handleEnterCabinet = (cabinet: StorageUnit) => {
    setSelectedCabinetId(cabinet.id);
    setNavLevel('CABINET');
  };

  const handleBackToOverview = () => {
    setNavLevel('OVERVIEW');
    setActiveRoomId(null);
  };

  const handleBackToRoom = () => {
    setNavLevel('ROOM');
    setSelectedCabinetId(null);
  };

  const handleCabinetDrag = (id: string, newX: number, newY: number) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== activeRoomId) return room;
      return {
        ...room,
        children: room.children?.map(child => 
          child.id === id ? { ...child, x: newX, y: newY } : child
        )
      };
    }));
  };

  const handleRemoveUnit = (id: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== activeRoomId) return room;
      return {
        ...room,
        children: room.children?.filter(child => child.id !== id)
      };
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-8">
      {/* Dynamic Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBackToOverview}
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                navLevel === 'OVERVIEW' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Warehouse
            </button>
            {activeRoomId && (
              <>
                <span className="text-slate-300">/</span>
                <button 
                  onClick={handleBackToRoom}
                  className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    navLevel === 'ROOM' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {activeRoom?.name}
                </button>
              </>
            )}
            {selectedCabinetId && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  {activeCabinet?.name}
                </span>
              </>
            )}
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">
            {navLevel === 'OVERVIEW' ? 'Inventory Facilities' : 
             navLevel === 'ROOM' ? 'Floorplan Designer' : 'Internal Assets'}
          </h1>
        </div>

        {/* Level-Specific Controls */}
        <AnimatePresence mode="wait">
          {navLevel === 'ROOM' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3"
            >
              {/* Floor Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
                {[1, 2].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFloor(f)}
                    className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${
                      activeFloor === f ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-slate-400'
                    }`}
                  >
                    LANTAI {f}
                  </button>
                ))}
              </div>
              
              {/* Size Config */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-outline-variant/10">
                <input 
                  type="number" 
                  value={roomSize.width} 
                  onChange={(e) => setRoomSize(prev => ({ ...prev, width: Number(e.target.value) }))}
                  className="bg-transparent border-none text-sm font-black text-slate-900 dark:text-white w-10 text-center outline-none"
                />
                <span className="text-slate-300">×</span>
                <input 
                  type="number" 
                  value={roomSize.height} 
                  onChange={(e) => setRoomSize(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="bg-transparent border-none text-sm font-black text-slate-900 dark:text-white w-10 text-center outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {/* Level 1: OVERVIEW */}
          {navLevel === 'OVERVIEW' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto pr-2 scrollbar-thin"
            >
              {rooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onClick={() => handleOpenRoom(room)} 
                />
              ))}
              
              <button className="h-full min-h-[400px] border-4 border-dashed border-outline-variant/10 rounded-4xl flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-primary hover:border-primary/20 transition-all">
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-current flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">add</span>
                </div>
                <span className="font-heading font-black uppercase tracking-[0.2em] text-sm">Register Facility</span>
              </button>
            </motion.div>
          )}

          {/* Level 2: ROOM LAYOUT (Construction Mode) */}
          {navLevel === 'ROOM' && (
            <motion.div
              key="room-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full relative"
            >
              <RoomFloor 
                gridSize={GRID_SIZE} 
                widthUnits={roomSize.width} 
                heightUnits={roomSize.height}
              >
                <div 
                  ref={roomRef}
                  className="absolute inset-0 z-10" 
                  onMouseMove={handleFloorMouseMove}
                  onClick={handleFloorClick}
                  style={{ cursor: activeTool === 'SELECT' ? 'default' : 'crosshair' }}
                />
                
                {/* Ghost Preview */}
                <AnimatePresence>
                  {activeTool !== 'SELECT' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      className={`absolute pointer-events-none rounded border-2 border-dashed border-primary bg-primary/20 transition-all duration-100`}
                      style={{
                        width: (activeTool === 'CABINET_TOOL' ? 2 : 1) * GRID_SIZE - 4,
                        height: 1 * GRID_SIZE - 4,
                        left: mouseGridPos.x * GRID_SIZE + 2,
                        top: mouseGridPos.y * GRID_SIZE + 2,
                        zIndex: 40
                      }}
                    />
                  )}
                </AnimatePresence>

                {activeRoom?.children?.map(unit => (
                  unit.type === 'WALL' ? (
                    <WallElement 
                      key={unit.id}
                      unit={unit}
                      siblings={activeRoom?.children || []}
                      containerRef={roomRef as React.RefObject<HTMLDivElement>}
                      onDragUpdate={handleCabinetDrag}
                      onRemove={handleRemoveUnit}
                    />
                  ) : (
                    <CabinetTopView 
                      key={unit.id} 
                      unit={unit} 
                      onClick={() => handleEnterCabinet(unit)}
                      onDoubleClick={() => handleEnterCabinet(unit)}
                      onDragUpdate={handleCabinetDrag}
                      onRemove={handleRemoveUnit}
                      containerRef={roomRef as React.RefObject<HTMLDivElement>}
                    />
                  )
                ))}
              </RoomFloor>

              {/* Asset Palette Toolbar */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-2xl">
                {[
                  { id: 'SELECT', icon: 'near_me', label: 'Select' },
                  { id: 'CABINET_TOOL', icon: 'door_sliding', label: 'Lemari' },
                  { id: 'WALL_TOOL', icon: 'view_kanban', label: 'Dinding' },
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id as BuilderTool)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                      activeTool === tool.id 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{tool.label}</span>
                  </button>
                ))}
                
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
                
                <button 
                  onClick={handleBackToOverview}
                  className="p-2.5 text-slate-400 hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined">delete_forever</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Level 3: CABINET INTERNALS */}
          {navLevel === 'CABINET' && activeCabinet && (
            <motion.div key="cabinet-view" className="h-full">
               <CabinetFrontView 
                 cabinet={activeCabinet}
                 onBack={handleBackToRoom}
                 onLockerClick={(locker) => alert(`Locker ${locker.code}`)}
               />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
