"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RoomFloor } from "@/components/dashboard/locations/room-floor"
import { CabinetTopView } from "@/components/dashboard/locations/cabinet-top-view"
import { CabinetStackTopView } from "@/components/dashboard/locations/cabinet-stack-top-view"
import { CabinetFrontView } from "@/components/dashboard/locations/cabinet-front-view"
import { RoomCard } from "@/components/dashboard/locations/room-card"
import { WallElement } from "@/components/dashboard/locations/wall-element"
import { AddRoomDialog } from "@/components/dashboard/locations/add-room-dialog"
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
  const [selectedCoords, setSelectedCoords] = useState<{x: number, y: number} | null>(null)
  const [activeFloor, setActiveFloor] = useState(1)
  const [roomSize, setRoomSize] = useState({ width: 14, height: 12 })
  const [activeTool, setActiveTool] = useState<BuilderTool>('SELECT')
  const [toolConfig, setToolConfig] = useState({ width: 2, height: 1, texture: 'METAL' as 'METAL' | 'WOOD' })
  const [viewMode, setViewMode] = useState<'TOP' | 'ISO'>('TOP')
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false)
  const [mouseGridPos, setMouseGridPos] = useState({ x: 0, y: 0 })
  
  const roomRef = React.useRef<HTMLDivElement>(null)

  const activeRoom = useMemo(() => rooms.find(r => r.id === activeRoomId), [rooms, activeRoomId]);
  
  const activeStack = useMemo(() => {
    if (!activeRoom || !selectedCoords) return [];
    return activeRoom.children?.filter(c => c.x === selectedCoords.x && c.y === selectedCoords.y) || [];
  }, [activeRoom, selectedCoords]);

  const handleOpenRoom = (room: StorageUnit) => {
    setActiveRoomId(room.id);
    setNavLevel('ROOM');
  };

  const handleEnterStack = (x: number, y: number) => {
    setSelectedCoords({ x, y });
    setNavLevel('CABINET');
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
      
      // Calculate stack order
      const existingAtCoord = room.children?.filter(c => c.x === x && c.y === y) || [];
      const stackOrder = existingAtCoord.length;

      const newUnit: StorageUnit = {
        id: `${type.toLowerCase()}-${Date.now()}`,
        name: type === 'RACK' ? `Lemari ${x}-${y}` : `Sekat ${x}-${y}`,
        type: type,
        parentId: activeRoomId,
        path: `${room.path}.${type.toLowerCase()}-${Date.now()}`,
        x: x,
        y: y,
        stackOrder: stackOrder,
        width: type === 'RACK' ? toolConfig.width : 1,
        height: type === 'RACK' ? toolConfig.height : 1,
        texture: type === 'RACK' ? toolConfig.texture : undefined,
        children: type === 'RACK' ? [
          { id: `l-${Date.now()}-1`, name: 'Loker 01', type: 'BOX', parentId: '', path: '', capacity: 10, currentLoad: 0 },
          { id: `l-${Date.now()}-2`, name: 'Loker 02', type: 'BOX', parentId: '', path: '', capacity: 10, currentLoad: 0 },
        ] : undefined
      };
      return { ...room, children: [...(room.children || []), newUnit] };
    }));
  };


  const handleBackToOverview = () => {
    setNavLevel('OVERVIEW');
    setActiveRoomId(null);
  };

  const handleBackToRoom = () => {
    setNavLevel('ROOM');
    setSelectedCoords(null);
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
  const handleAddRoom = (config: { name: string; code: string; capacity: number; width: number; height: number }) => {
    const newRoom: StorageUnit = {
      id: `room-${Date.now()}`,
      name: config.name,
      type: 'ROOM',
      parentId: null,
      path: `room-${Date.now()}`,
      code: config.code,
      capacity: config.capacity,
      currentLoad: 0,
      children: []
    };
    
    // Auto-select this room size when opened
    setRoomSize({ width: config.width, height: config.height });
    
    setRooms(prev => [...prev, newRoom]);
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
            {selectedCoords && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  {activeStack[0]?.name || 'Cabinet Stack'}
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
              
              {/* Perspective Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl ml-4">
                {([
                  { id: 'TOP', label: '2D PLAN', icon: 'grid_view' },
                  { id: 'ISO', label: '3D FRONT', icon: 'view_in_ar' }
                ] as const).map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl transition-all ${
                      viewMode === mode.id ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{mode.icon}</span>
                    {mode.label}
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
              
              <button 
                onClick={() => setIsAddRoomOpen(true)}
                className="h-full min-h-[400px] border-4 border-dashed border-outline-variant/10 rounded-4xl flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-primary hover:border-primary/20 transition-all outline-none"
              >
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-current flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">add</span>
                </div>
                <span className="font-heading font-black uppercase tracking-[0.2em] text-sm">Register Facility</span>
              </button>
            </motion.div>
          )}

          {/* Level 2 & 3: ROOM LAYOUT + SIDEBAR INSPECTOR */}
          {(navLevel === 'ROOM' || navLevel === 'CABINET') && (
            <motion.div
              key="room-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex-1 rounded-4xl bg-slate-200 dark:bg-slate-950 overflow-hidden border border-white/10 group flex"
            >
              <RoomFloor 
                gridSize={GRID_SIZE} 
                widthUnits={roomSize.width} 
                heightUnits={roomSize.height}
                viewMode={viewMode}
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
                        width: (activeTool === 'CABINET_TOOL' ? toolConfig.width : 1) * GRID_SIZE - 4,
                        height: (activeTool === 'CABINET_TOOL' ? toolConfig.height : 1) * GRID_SIZE - 4,
                        left: mouseGridPos.x * GRID_SIZE + 2,
                        top: mouseGridPos.y * GRID_SIZE + 2,
                        zIndex: 40
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Render Units with Stacking Logic */}
                {(() => {
                  if (!activeRoom?.children) return null;
                  
                  // Group non-wall units by coordinate
                  const groups: Record<string, StorageUnit[]> = {};
                  const walls: StorageUnit[] = [];
                  
                  activeRoom.children.forEach(unit => {
                    if (unit.type === 'WALL') {
                      walls.push(unit);
                    } else {
                      const key = `${unit.x}-${unit.y}`;
                      if (!groups[key]) groups[key] = [];
                      groups[key].push(unit);
                    }
                  });

                  return (
                    <>
                      {/* Render Walls */}
                      {walls.map(unit => (
                        <WallElement 
                          key={unit.id}
                          unit={unit}
                          siblings={activeRoom?.children || []}
                          containerRef={roomRef as React.RefObject<HTMLDivElement>}
                          onDragUpdate={handleCabinetDrag}
                          onRemove={handleRemoveUnit}
                        />
                      ))}

                      {/* Render Cabinet Stacks or Single Cabinets */}
                      {Object.entries(groups).map(([coord, units]) => {
                        const [x, y] = coord.split('-').map(Number);
                        
                        if (units.length > 1) {
                          return (
                            <CabinetStackTopView 
                              key={coord}
                              units={units}
                              viewMode={viewMode}
                              onClick={() => handleEnterStack(x, y)}
                              onDoubleClick={() => handleEnterStack(x, y)}
                              onDragUpdate={handleCabinetDrag}
                              onRemove={handleRemoveUnit}
                              containerRef={roomRef as React.RefObject<HTMLDivElement>}
                            />
                          );
                        } else {
                          const unit = units[0];
                          return (
                            <CabinetTopView 
                              key={unit.id} 
                              unit={unit} 
                              viewMode={viewMode}
                              onClick={() => handleEnterStack(x, y)}
                              onDoubleClick={() => handleEnterStack(x, y)}
                              onDragUpdate={handleCabinetDrag}
                              onRemove={handleRemoveUnit}
                              containerRef={roomRef as React.RefObject<HTMLDivElement>}
                            />
                          );
                        }
                      })}
                    </>
                  );
                })()}
              </RoomFloor>

              {/* Asset Palette Toolbar */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-2xl">
                <div className="flex gap-1 border-r border-slate-200 dark:border-slate-700 pr-2">
                  {[
                    { id: 'SELECT', icon: 'near_me', label: 'Select' },
                    { id: 'CABINET_TOOL', icon: 'door_sliding', label: 'Lemari' },
                    { id: 'WALL_TOOL', icon: 'view_kanban', label: 'Dinding' },
                  ].map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id as BuilderTool)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                        activeTool === tool.id 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                      <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{tool.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tool Config Section */}
                <AnimatePresence>
                  {activeTool === 'CABINET_TOOL' && (
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="flex items-center gap-4 px-2 overflow-hidden whitespace-nowrap"
                    >
                      {/* Width Stepper */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Lebar</span>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                          <button 
                            onClick={() => setToolConfig(prev => ({ ...prev, width: Math.max(1, prev.width - 1) }))}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-8 text-center text-xs font-black">{toolConfig.width}</span>
                          <button 
                            onClick={() => setToolConfig(prev => ({ ...prev, width: Math.min(8, prev.width + 1) }))}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                      </div>

                      {/* Height Stepper */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Tinggi</span>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                          <button 
                            onClick={() => setToolConfig(prev => ({ ...prev, height: Math.max(1, prev.height - 1) }))}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-8 text-center text-xs font-black">{toolConfig.height}</span>
                          <button 
                            onClick={() => setToolConfig(prev => ({ ...prev, height: Math.min(4, prev.height + 1) }))}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                      </div>

                      {/* Texture Toggle */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Finish</span>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                          {(['METAL', 'WOOD'] as const).map(f => (
                            <button
                              key={f}
                              onClick={() => setToolConfig(prev => ({ ...prev, texture: f }))}
                              className={`px-3 py-1 rounded-md text-[9px] font-black transition-all ${
                                toolConfig.texture === f 
                                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                                  : 'text-slate-400'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
                
                <button 
                  onClick={handleBackToOverview}
                  className="p-2.5 text-slate-400 hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined">delete_forever</span>
                </button>
              </div>


              {/* Sidebar Inspector (Cabinet Front View) */}
              <AnimatePresence>
                {navLevel === 'CABINET' && activeStack.length > 0 && (
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="absolute right-0 inset-y-0 w-full max-w-2xl z-60 shadow-[-20px_0_50px_rgba(0,0,0,0.3)]"
                  >
                    <CabinetFrontView 
                      stack={activeStack}
                      onBack={() => setNavLevel('ROOM')}
                      onLockerClick={(locker) => alert(`Locker ${locker.code}`)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddRoomDialog 
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        onAdd={handleAddRoom}
      />
    </div>
  )
}
