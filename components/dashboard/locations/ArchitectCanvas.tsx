"use client"

import React, { useState, useEffect } from "react"
import { Stage, Layer, Rect, Text, Group, Line } from "react-konva"
import { StorageUnit } from "@/services/locationService"

interface ArchitectCanvasProps {
  units: StorageUnit[]
  onUnitMove: (id: string, x: number, y: number) => void
  onUnitSelect: (unit: StorageUnit | null) => void
  onUnitResize?: (id: string, width: number, height: number) => void
  selectedUnitId?: string
  gridWidth: number
  gridHeight: number
  readOnly?: boolean
  backgroundLabel?: string
}

export const ArchitectCanvas: React.FC<ArchitectCanvasProps> = ({
  units,
  onUnitMove,
  onUnitSelect,
  selectedUnitId,
  gridWidth,
  gridHeight,
  readOnly = false,
  backgroundLabel
}) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

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

  // Draw Grid - Render more lines to cover zoomed out areas
  const renderGrid = () => {
    const lines = []
    // Expand grid rendering beyond initial dimensions to support panning
    const maxGridLinesX = Math.max(100, (dimensions.width / gridWidth) * 3);
    const maxGridLinesY = Math.max(100, (dimensions.height / gridHeight) * 3);
    
    // Draw negative and positive coordinates for infinite-feel panning
    for (let i = -maxGridLinesX; i < maxGridLinesX; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * gridWidth, -maxGridLinesY * gridHeight, i * gridWidth, maxGridLinesY * gridHeight]}
          stroke="#e2e8f0"
          strokeWidth={0.5}
          opacity={0.3}
        />
      )
    }
    for (let j = -maxGridLinesY; j < maxGridLinesY; j++) {
      lines.push(
        <Line
          key={`h-${j}`}
          points={[-maxGridLinesX * gridWidth, j * gridHeight, maxGridLinesX * gridWidth, j * gridHeight]}
          stroke="#e2e8f0"
          strokeWidth={0.5}
          opacity={0.3}
        />
      )
    }
    return lines
  }

  return (
    <div id="canvas-container" className="w-full h-full bg-slate-900 overflow-hidden relative rounded-xl border border-slate-800">
      <Stage 
        width={dimensions.width} 
        height={dimensions.height} 
      >
        <Layer>
          {renderGrid()}
          {backgroundLabel && (
            <Text 
              text={backgroundLabel}
              fontSize={100}
              fontStyle="black"
              fill="#1e293b"
              opacity={0.3}
              x={50}
              y={50}
              listening={false}
            />
          )}
        </Layer>
        <Layer>
          {units.map((unit) => (
            <Group
              key={unit.id}
              x={unit.x}
              y={unit.y}
              draggable={!readOnly}
              dragBoundFunc={(pos) => {
                const width = Number(unit.width) || 100;
                const height = Number(unit.height) || 100;
                return {
                  x: Math.max(0, Math.min(pos.x, dimensions.width - width)),
                  y: Math.max(0, Math.min(pos.y, dimensions.height - height))
                };
              }}
              onDragEnd={(e) => {
                const width = Number(unit.width) || 100;
                const height = Number(unit.height) || 100;
                const rawX = Math.round(e.target.x() / gridWidth) * gridWidth
                const rawY = Math.round(e.target.y() / gridHeight) * gridHeight
                
                // Clamp snapped coordinates
                const newX = Math.max(0, Math.min(rawX, dimensions.width - width))
                const newY = Math.max(0, Math.min(rawY, dimensions.height - height))
                
                onUnitMove(unit.id, newX, newY)
              }}
              onClick={() => onUnitSelect(unit)}
              onDblClick={() => {
                onUnitSelect(unit);
                // Trigger parent's enter action if applicable
                const event = new CustomEvent('canvas-dblclick', { detail: unit });
                window.dispatchEvent(event);
              }}
              onTap={() => onUnitSelect(unit)}
            >
              <Rect
                width={Number(unit.width) || 100}
                height={Number(unit.height) || 100}
                fill={selectedUnitId === unit.id ? "#3b82f6" : "#1e293b"}
                stroke={selectedUnitId === unit.id ? "#60a5fa" : "#334155"}
                strokeWidth={2}
                cornerRadius={8}
                shadowBlur={10}
                shadowOpacity={0.3}
              />
              <Text
                text={unit.name}
                width={Number(unit.width) || 100}
                height={Number(unit.height) || 100}
                align="center"
                verticalAlign="middle"
                fill="white"
                fontSize={12}
                fontStyle="bold"
              />
            </Group>
          ))}
        </Layer>
      </Stage>
      
      {/* Canvas Controls */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 shadow-xl">
        <div className="text-[10px] text-slate-400 font-mono">
          Grid: {gridWidth}x{gridHeight}px | Drag to Pan
        </div>
      </div>
    </div>
  )
}
