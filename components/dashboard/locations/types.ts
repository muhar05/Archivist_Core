export type StorageType = 'ROOM' | 'RACK' | 'ROW' | 'BOX' | 'WALL';

export type RecordStatus = 'ACTIVE' | 'BORROWED' | 'ARCHIVED' | 'DISPOSED' | 'PENDING';
export type RecordPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type LoanStatus = 'ONGOING' | 'OVERDUE' | 'RETURNED';

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
  stackOrder?: number;
}

export interface StoredReport {
  id: string;
  title: string;
  code: string;
  registeredAt: string;
  unitId: string;
}

export interface ArchivalRecord {
  id: string;
  title: string;
  code: string;
  category: string;
  status: RecordStatus;
  priority: RecordPriority;
  location: string;
  registeredAt: string;
  lastEditedBy?: string;
  thumbnailUrl?: string;
  description?: string;
  unitId?: string; // Reference to the storage unit
}

export interface LoanSession {
  id: string;
  recordId: string;
  recordTitle: string; // Denormalized for UI
  recordCode: string;  // Denormalized for UI
  borrowerName: string;
  borrowerId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
  notes?: string;
}
