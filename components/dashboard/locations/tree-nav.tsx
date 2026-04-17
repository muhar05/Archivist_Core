"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronDown, Plus, Folder, Layers, Database, Box } from "lucide-react"
import { StorageUnit, StorageType } from "./types"

interface TreeNavProps {
  units: StorageUnit[];
  onSelect: (unit: StorageUnit) => void;
  selectedId?: string;
}

const TypeIcon = ({ type }: { type: StorageType }) => {
  switch (type) {
    case 'ROOM': return <Folder className="w-4 h-4 text-blue-500" />;
    case 'RACK': return <Layers className="w-4 h-4 text-amber-500" />;
    case 'ROW': return <Database className="w-4 h-4 text-emerald-500" />;
    case 'BOX': return <Box className="w-4 h-4 text-primary" />;
    default: return null;
  }
}

const TreeNode = ({ unit, onSelect, selectedId, level = 0 }: { 
  unit: StorageUnit; 
  onSelect: (unit: StorageUnit) => void; 
  selectedId?: string;
  level?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = unit.children && unit.children.length > 0;
  const isSelected = selectedId === unit.id;

  return (
    <div className="select-none">
      <div 
        className={`group flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(unit);
          if (hasChildren) setIsOpen(!isOpen);
        }}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {hasChildren ? (
            <div className="w-4 h-4 flex items-center justify-center">
              {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
          ) : (
            <div className="w-4" />
          )}
          <TypeIcon type={unit.type} />
          <span className="text-xs font-semibold truncate whitespace-nowrap">
            {unit.name}
          </span>
        </div>

        <button 
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // Handle Add Logic here
          }}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {unit.children?.map(child => (
              <TreeNode 
                key={child.id} 
                unit={child} 
                onSelect={onSelect} 
                selectedId={selectedId} 
                level={level + 1} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function TreeNav({ units, onSelect, selectedId }: TreeNavProps) {
  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="flex items-center justify-between px-2 py-4 border-b border-outline-variant/10 mb-2">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Tree</h3>
        <button className="text-primary hover:bg-primary/5 p-1 rounded transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-thin">
        {units.map(unit => (
          <TreeNode 
            key={unit.id} 
            unit={unit} 
            onSelect={onSelect} 
            selectedId={selectedId} 
          />
        ))}
      </div>
    </div>
  )
}
