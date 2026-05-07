"use client"

import React, { useState, useEffect, useRef } from "react"
import { Stage, Layer, Rect, Text, Group, Line, Circle } from "react-konva"
import Konva from "konva"

export interface CanvasUnit {
  id: string;
  name: string;
  x: number;
  y: number;
  z?: number;
  width: number;
  height: number;
  depth?: number;
  rotation?: number;
  unit_type?: string;
  status: string;
}

interface ArchitectCanvasProps {
  units: CanvasUnit[]
  onUnitMove: (id: string, x: number, y: number) => void
  onUnitSelect: (unit: CanvasUnit | null) => void
  selectedUnitId?: string
  gridWidth: number
  gridHeight: number
  roomWidthCm: number
  roomHeightCm: number
  ceilingHeight?: number
  readOnly?: boolean
  isElevationMode?: boolean
  backgroundLabel?: string
}

export const ArchitectCanvas: React.FC<ArchitectCanvasProps> = ({
  units,
  onUnitMove,
  onUnitSelect,
  selectedUnitId,
  gridWidth,
  gridHeight,
  roomWidthCm,
  roomHeightCm,
  ceilingHeight = 300,
  readOnly = false,
  isElevationMode = false,
  backgroundLabel
}) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [zoom, setZoom] = useState(0.8)
  const [is3D, setIs3D] = useState(false)
  const [xRayMode, setXRayMode] = useState(false)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [activeTool, setActiveTool] = useState<'SELECT' | 'HAND'>('SELECT')
  const stageRef = useRef<Konva.Stage>(null)

  // Isometric Projection Helper
  const toIso = (x: number, y: number, z: number = 0) => {
    if (!is3D) return { x, y: y - z };
    
    // Isometric projection math
    const angle = Math.PI / 6; // 30 degrees
    return {
      x: (x - y) * Math.cos(angle),
      y: (x + y) * Math.sin(angle) - z
    };
  };


  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("canvas-container")
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: container.offsetHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Draw Grid within room bounds
  const renderGrid = () => {
    const lines = []
    
    // Vertical lines
    for (let i = 0; i <= roomWidthCm; i += gridWidth) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, roomHeightCm]}
          stroke="#334155"
          strokeWidth={i % (gridWidth * 5) === 0 ? 1 : 0.5}
          opacity={0.2}
        />
      )
    }
    // Horizontal lines
    for (let j = 0; j <= roomHeightCm; j += gridHeight) {
      lines.push(
        <Line
          key={`h-${j}`}
          points={[0, j, roomWidthCm, j]}
          stroke="#334155"
          strokeWidth={j % (gridHeight * 5) === 0 ? 1 : 0.5}
          opacity={0.2}
        />
      )
    }
    return lines
  }

  return (
    <div id="canvas-container" className="w-full h-full bg-slate-950 overflow-hidden relative rounded-xl border border-slate-800 shadow-inner">
      <Stage 
        ref={stageRef}
        width={dimensions.width} 
        height={dimensions.height} 
        draggable={activeTool === 'HAND' || is3D}
        x={stagePos.x}
        y={stagePos.y}
        onMouseDown={(e) => {
          // Deselect if clicking on the background (the Stage itself)
          if (e.target === e.target.getStage()) {
            onUnitSelect(null);
          }
        }}
        onDragEnd={(e) => {
          if (e.target.getType() === 'Stage') {
            setStagePos({ x: e.target.x(), y: e.target.y() });
          }
        }}
        style={{ cursor: activeTool === 'HAND' ? 'grab' : 'default' }}
      >
        <Layer 
          scaleX={zoom} 
          scaleY={zoom} 
          x={is3D ? dimensions.width / 2 : dimensions.width / 2 - (roomWidthCm * zoom) / 2} 
          y={is3D ? dimensions.height / 4 : dimensions.height / 2 - (roomHeightCm * zoom) / 2}
        >
          {/* Room Base/Floor */}
          {is3D ? (
            <>
              {/* Back Walls */}
              <Line 
                points={[
                  ...Object.values(toIso(0, 0, ceilingHeight)),
                  ...Object.values(toIso(roomWidthCm, 0, ceilingHeight)),
                  ...Object.values(toIso(roomWidthCm, 0, 0)),
                  ...Object.values(toIso(0, 0, 0)),
                ]}
                closed
                fill="#1e293b"
                stroke="#334155"
                strokeWidth={1}
              />
              <Line 
                points={[
                  ...Object.values(toIso(0, 0, ceilingHeight)),
                  ...Object.values(toIso(0, roomHeightCm, ceilingHeight)),
                  ...Object.values(toIso(0, roomHeightCm, 0)),
                  ...Object.values(toIso(0, 0, 0)),
                ]}
                closed
                fill="#0f172a"
                stroke="#334155"
                strokeWidth={1}
              />
              {/* Floor with Grid */}
              <Line 
                points={[
                  ...Object.values(toIso(0, 0)),
                  ...Object.values(toIso(roomWidthCm, 0)),
                  ...Object.values(toIso(roomWidthCm, roomHeightCm)),
                  ...Object.values(toIso(0, roomHeightCm)),
                ]}
                closed
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: roomWidthCm, y: roomHeightCm }}
                fillLinearGradientColorStops={[0, "#0f172a", 1, "#020617"]}
                stroke="#1e293b"
                strokeWidth={2}
              />
              
              {/* Isometric Grid Lines */}
              {Array.from({ length: Math.floor(roomWidthCm / gridWidth) + 1 }).map((_, i) => (
                <Line
                  key={`iso-v-${i}`}
                  points={[
                    ...Object.values(toIso(i * gridWidth, 0)),
                    ...Object.values(toIso(i * gridWidth, roomHeightCm))
                  ]}
                  stroke="#334155"
                  strokeWidth={0.5}
                  opacity={0.15}
                />
              ))}
              {Array.from({ length: Math.floor(roomHeightCm / gridWidth) + 1 }).map((_, i) => (
                <Line
                  key={`iso-h-${i}`}
                  points={[
                    ...Object.values(toIso(0, i * gridWidth)),
                    ...Object.values(toIso(roomWidthCm, i * gridWidth))
                  ]}
                  stroke="#334155"
                  strokeWidth={0.5}
                  opacity={0.15}
                />
              ))}
            </>
          ) : (
            <Rect 
              width={roomWidthCm}
              height={roomHeightCm}
              fill="#0f172a"
              stroke="#1e293b"
              strokeWidth={1}
            />
          )}
          
          {!is3D && renderGrid()}

          {/* Wall Rendering (2D Only) */}
          {!is3D && (
            <Rect 
              width={roomWidthCm}
              height={roomHeightCm}
              stroke="#475569"
              strokeWidth={10}
              lineJoin="round"
              shadowBlur={20}
              shadowColor="black"
              shadowOpacity={0.5}
            />
          )}

          {backgroundLabel && (
            <Group x={50} y={50}>
              <Text 
                text={backgroundLabel}
                fontSize={80}
                fontStyle="black"
                fill="#3b82f6"
                opacity={0.2}
                listening={false}
              />
              <Text 
                text={`${roomWidthCm}cm x ${roomHeightCm}cm`}
                y={90}
                fontSize={40}
                fontStyle="bold"
                fill="#3b82f6"
                opacity={0.15}
                listening={false}
              />
            </Group>
          )}
        </Layer>
        <Layer
          name="unit-layer"
          scaleX={zoom} 
          scaleY={zoom} 
          x={is3D ? dimensions.width / 2 : dimensions.width / 2 - (roomWidthCm * zoom) / 2} 
          y={is3D ? dimensions.height / 4 : dimensions.height / 2 - (roomHeightCm * zoom) / 2}
        >
          {[...units]
            .sort((a, b) => (Number(a.x) + Number(a.y) + (Number(a.z) || 0)) - (Number(b.x) + Number(b.y) + (Number(b.z) || 0)))
            .map((unit) => {
              const w = (Number(unit.width) || 100);
              const h = (Number(unit.height) || 100);
              const d = (Number(unit.depth) || 40);
              const z = Number(unit.z) || 0;
              const type = unit.unit_type || 'CABINET';
              const iso = toIso(unit.x, unit.y, z);

              const isSelected = selectedUnitId === unit.id;
              const opacity = xRayMode ? 0.3 : 0.85;

              return (
                <Group
                  key={unit.id}
                  x={iso.x}
                  y={iso.y}
                  rotation={!is3D ? (unit.rotation || 0) : 0}
                  draggable={!readOnly && !is3D && activeTool === 'SELECT'}
                  onDragEnd={(e) => {
                    const newX = Math.round(e.target.x() / gridWidth) * gridWidth
                    const newY = Math.round(e.target.y() / gridHeight) * gridHeight
                    const width = (Number(unit.width) || 100);
                    const height = (Number(unit.height) || 100);
                    const finalX = Math.max(0, Math.min(newX, roomWidthCm - width));
                    const finalY = Math.max(0, Math.min(newY, roomHeightCm - height));
                    onUnitMove(unit.id, finalX, finalY)
                  }}
                  onClick={() => activeTool === 'SELECT' && onUnitSelect(unit)}
                >
                  {is3D && type === 'CABINET' ? (
                    <>
                      {/* Shadow / Glow if selected */}
                      {isSelected && (
                        <Line 
                          points={[
                            ...Object.values(toIso(-5, h + 5, 0)),
                            ...Object.values(toIso(w + 5, h + 5, 0)),
                            ...Object.values(toIso(w + 5, -5, 0)),
                            ...Object.values(toIso(-5, -5, 0)),
                          ]}
                          closed
                          fill="rgba(59, 130, 246, 0.4)"
                          shadowBlur={20}
                          shadowColor="#3b82f6"
                        />
                      )}

                      {/* Bottom Base (Solid to ground the unit) */}
                      <Line 
                        points={[
                          ...Object.values(toIso(0, 0, 0)),
                          ...Object.values(toIso(w, 0, 0)),
                          ...Object.values(toIso(w, h, 0)),
                          ...Object.values(toIso(0, h, 0)),
                        ]}
                        closed
                        fill="#1e293b" // Distinct from floor #0f172a
                        stroke="#334155"
                        strokeWidth={1}
                        opacity={1}
                      />

                      {/* Left Face (Darkest) */}
                      <Line 
                        points={[
                          ...Object.values(toIso(0, 0, 0)),
                          ...Object.values(toIso(0, h, 0)),
                          ...Object.values(toIso(0, h, d)),
                          ...Object.values(toIso(0, 0, d)),
                        ]}
                        closed
                        fill={isSelected ? "#2563eb" : "#1e3a8a"} 
                        stroke={isSelected ? "#60a5fa" : "#3b82f6"}
                        strokeWidth={1}
                        opacity={isSelected ? 1 : opacity * 0.8} // Integrated with X-Ray mode
                      />

                      {/* Right Face (Medium) */}
                      <Line 
                        points={[
                          ...Object.values(toIso(0, h, 0)),
                          ...Object.values(toIso(w, h, 0)),
                          ...Object.values(toIso(w, h, d)),
                          ...Object.values(toIso(0, h, d)),
                        ]}
                        closed
                        fill={isSelected ? "#1d4ed8" : "#1e40af"} 
                        stroke={isSelected ? "#60a5fa" : "#3b82f6"}
                        strokeWidth={1}
                        opacity={isSelected ? 1 : opacity * 0.65} // Integrated with X-Ray mode
                      />

                      {/* Top Face (Lightest) */}
                      <Line 
                        points={[
                          ...Object.values(toIso(0, 0, d)),
                          ...Object.values(toIso(w, 0, d)),
                          ...Object.values(toIso(w, h, d)),
                          ...Object.values(toIso(0, h, d)),
                        ]}
                        closed
                        fill={isSelected ? "#3b82f6" : "#3b82f6"} 
                        stroke={isSelected ? "#93c5fd" : "#60a5fa"}
                        strokeWidth={1}
                        opacity={isSelected ? 1 : opacity} // Integrated with X-Ray mode
                      />
                    </>
                ) : is3D && type === 'DOOR' ? (
                  <>
                    {/* Door Frame (The casing) */}
                    <Line 
                      points={[
                        ...Object.values(toIso(-2, 0, 0)),
                        ...Object.values(toIso(w + 2, 0, 0)),
                        ...Object.values(toIso(w + 2, 0, (d || 210) + 2)),
                        ...Object.values(toIso(-2, 0, (d || 210) + 2)),
                      ]}
                      closed
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth={1}
                    />
                    
                    {/* Door Leaf (The actual door) */}
                    {/* Front Face */}
                    <Line 
                      points={[
                        ...Object.values(toIso(0, 0, 0)),
                        ...Object.values(toIso(w, 0, 0)),
                        ...Object.values(toIso(w, 0, d || 210)),
                        ...Object.values(toIso(0, 0, d || 210)),
                      ]}
                      closed
                      fill="#334155"
                      stroke="#64748b"
                      strokeWidth={1}
                    />
                    
                    {/* Side/Thickness (Visible if door is slightly open or from angle) */}
                    <Line 
                      points={[
                        ...Object.values(toIso(w, 0, 0)),
                        ...Object.values(toIso(w, 5, 0)),
                        ...Object.values(toIso(w, 5, d || 210)),
                        ...Object.values(toIso(w, 0, d || 210)),
                      ]}
                      closed
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth={0.5}
                    />

                    {/* Door Handle (Metallic) */}
                    <Group {...toIso(w * 0.8, 0, (d || 210) / 2)}>
                       <Circle 
                         radius={3}
                         fill="#fbbf24"
                         shadowBlur={5}
                         shadowColor="#fbbf24"
                       />
                       <Rect 
                         x={-2}
                         y={-1}
                         width={6}
                         height={2}
                         fill="#f59e0b"
                       />
                    </Group>

                    {/* Exit Sign (Small Detail) */}
                    <Group {...toIso(w / 2 - 10, 0, (d || 210) * 0.8)}>
                       <Rect 
                         width={20}
                         height={8}
                         fill="#10b981"
                         cornerRadius={1}
                       />
                       <Text 
                         text="EXIT"
                         width={20}
                         height={8}
                         align="center"
                         verticalAlign="middle"
                         fill="white"
                         fontSize={4}
                         fontStyle="bold"
                       />
                    </Group>
                  </>
                ) : type === 'DOOR' ? (
                  <>
                    {/* Door Frame/Base */}
                    <Rect 
                      width={w}
                      height={h}
                      fill="rgba(180, 83, 9, 0.1)"
                      stroke="#b45309"
                      strokeWidth={2}
                    />
                    {/* Door Swing Arc */}
                    <Line 
                      points={[0, 0, 0, h]}
                      stroke="#f59e0b"
                      strokeWidth={2}
                    />
                    <Line 
                      points={[0, h, w, h]}
                      stroke="#f59e0b"
                      strokeWidth={1}
                      dash={[5, 5]}
                      opacity={0.5}
                    />
                    {/* Arc Swing */}
                    <Line 
                      points={Array.from({ length: 10 }, (_, i) => {
                        const angle = (i / 9) * (Math.PI / 2);
                        return [w * Math.sin(angle), h - w * Math.cos(angle)];
                      }).flat()}
                      stroke="#f59e0b"
                      strokeWidth={1}
                      dash={[2, 2]}
                    />
                    <Text 
                      text="DOOR"
                      width={w}
                      height={h}
                      align="center"
                      verticalAlign="bottom"
                      padding={5}
                      fill="#f59e0b"
                      fontSize={8}
                      fontStyle="bold"
                    />
                  </>
                ) : (
                  <Rect
                    width={w}
                    height={h}
                    fill={
                      selectedUnitId === unit.id 
                        ? "#3b82f6" 
                        : unit.unit_type === 'WALKWAY'
                        ? "rgba(71, 85, 105, 0.2)"
                        : unit.unit_type === 'STAIRS'
                        ? "rgba(79, 70, 229, 0.4)"
                        : "#1e293b"
                    }
                    stroke={
                      selectedUnitId === unit.id 
                        ? "#60a5fa" 
                        : unit.unit_type === 'WALKWAY'
                        ? "rgba(148, 163, 184, 0.3)"
                        : unit.unit_type === 'STAIRS'
                        ? "rgba(129, 140, 248, 0.6)"
                        : "#334155"
                    }
                    dash={type === 'WALKWAY' || ((unit.z || 0) > 0 && !is3D) ? [10, 5] : undefined}
                    strokeWidth={selectedUnitId === unit.id ? 3 : 1.5}
                    cornerRadius={type === 'CABINET' ? 4 : 0}
                    opacity={!is3D && (unit.z || 0) > 0 ? 0.6 : 1}
                    shadowBlur={type === 'CABINET' && ((unit.z || 0) === 0 || is3D) ? 15 : 0}
                    shadowOffset={{ x: 5, y: 5 }}
                    shadowOpacity={0.4}
                  />
                )}
                
                {!is3D && (
                  <Text
                    text={unit.name}
                    width={w}
                    height={h}
                    align="center"
                    verticalAlign="middle"
                    fill="white"
                    fontSize={10}
                    fontStyle="bold"
                  />
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
      
      {/* Toolbar (Figma Style) */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-2 p-1 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <button 
          onClick={() => setActiveTool('SELECT')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'SELECT' 
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
              : "text-slate-500 hover:text-white hover:bg-white/5"
          }`}
          title="Selection Tool (V)"
        >
          <span className="material-symbols-outlined text-xl">near_me</span>
        </button>
        <button 
          onClick={() => setActiveTool('HAND')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'HAND' 
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
              : "text-slate-500 hover:text-white hover:bg-white/5"
          }`}
          title="Hand Tool (H)"
        >
          <span className="material-symbols-outlined text-xl">pan_tool</span>
        </button>
      </div>

      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-slate-800/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl flex flex-col">
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
            className="p-2 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.2))}
            className="p-2 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
        </div>
        
        {!isElevationMode && (
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setIs3D(!is3D)}
              className={`p-3 rounded-xl backdrop-blur-md border shadow-xl transition-all flex items-center justify-center ${
                is3D 
                  ? "bg-blue-500 text-white border-blue-400" 
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
              title={is3D ? "Switch to 2D Blueprint" : "Switch to 3D Isometric"}
            >
              <span className="material-symbols-outlined text-sm">{is3D ? "view_quilt" : "view_in_ar"}</span>
            </button>
            
            {is3D && (
              <button 
                onClick={() => setXRayMode(!xRayMode)}
                className={`p-3 rounded-xl backdrop-blur-md border shadow-xl transition-all flex items-center justify-center ${
                  xRayMode 
                    ? "bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20" 
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                }`}
                title="Toggle X-Ray (Transparency)"
              >
                <span className="material-symbols-outlined text-sm">visibility_off</span>
              </button>
            )}
          </div>
        )}
      </div>


      <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col gap-3">
        <div className="flex flex-col">
           <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Blueprint Mode</div>
           <div className="text-[9px] text-slate-500 font-mono">
            {roomWidthCm}cm × {roomHeightCm}cm | Grid: {gridWidth}cm
          </div>
        </div>

        <div className="h-px bg-slate-800 w-full" />

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
            <span className="text-[9px] uppercase text-slate-400 font-black">Cabinet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-slate-700 border border-dashed border-slate-500" />
            <span className="text-[9px] uppercase text-slate-400 font-black">Akses</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-600/50 border border-amber-500/50" />
            <span className="text-[9px] uppercase text-slate-400 font-black">Pintu</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-[9px] font-mono text-slate-500">
        Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  )
}
