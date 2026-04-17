export type StorageType = 'ROOM' | 'RACK' | 'ROW' | 'BOX' | 'WALL';

export interface StorageUnit {
  id: string;
  name: string;
  type: StorageType;
  parentId: string | null;
  path: string; // LTree path (e.g. "RoomA.LemariB")
  capacity?: number;
  currentLoad?: number;
  code?: string;
  children?: StorageUnit[];
  
  // Spatial Data for 2D Floorplan (Grid units)
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  texture?: 'METAL' | 'WOOD' | 'GLASS';
}

export interface StoredReport {
  id: string;
  title: string;
  code: string;
  registeredAt: string;
  unitId: string;
}
