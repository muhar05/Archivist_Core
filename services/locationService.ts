import { db } from "@/db";
import { rooms, storageUnits, reports, lockers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export type StorageUnit = typeof storageUnits.$inferSelect;
export type StorageUnitInsert = typeof storageUnits.$inferInsert;
export type Locker = typeof lockers.$inferSelect;
export type LockerInsert = typeof lockers.$inferInsert;

export const locationService = {
  async getRooms() {
    return await db.query.rooms.findMany({
      orderBy: [desc(rooms.created_at)]
    });
  },

  async createRoom(room: { name: string; floor_number: number; grid_width?: number; grid_height?: number; ceiling_height_cm?: number; width_cm?: number; height_cm?: number; description?: string }) {
    const [newRoom] = await db.insert(rooms).values({
      name: room.name,
      floor_number: room.floor_number,
      grid_width: room.grid_width,
      grid_height: room.grid_height,
      width_cm: room.width_cm || 1500,
      height_cm: room.height_cm || 1000,
      ceiling_height_cm: room.ceiling_height_cm || 300,
      description: room.description,
      is_maintenance: false
    }).returning();
    return newRoom;
  },

  async updateRoom(id: string, updates: Partial<typeof rooms.$inferInsert>) {
    const [updatedRoom] = await db
      .update(rooms)
      .set(updates)
      .where(eq(rooms.id, id))
      .returning();
    return updatedRoom;
  },

  async deleteRoom(id: string) {
    await db.delete(rooms).where(eq(rooms.id, id));
  },

  async getStorageUnits(room_id: string) {
    return await db.query.storageUnits.findMany({
      where: (table, { and, eq, isNull }) => and(
        eq(table.room_id, room_id),
        isNull(table.parent_id)
      )
    });
  },

  async createStorageUnit(unit: StorageUnitInsert) {
    const [newUnit] = await db.insert(storageUnits).values(unit).returning();
    return newUnit;
  },

  async updateStorageUnit(id: string, updates: Partial<StorageUnit>) {
    const [updatedUnit] = await db
      .update(storageUnits)
      .set(updates)
      .where(eq(storageUnits.id, id))
      .returning();
    return updatedUnit;
  },

  async batchUpdateStorageUnits(units: { 
    id: string; 
    x: number; 
    y: number; 
    z?: number; 
    width?: number; 
    height?: number; 
    depth?: number; 
    rotation?: number; 
    name?: string;
    internal_width?: number;
    internal_height?: number;
  }[]) {
    // Basic implementation of a batch update loop
    // In Drizzle, doing multiple individual updates in a transaction is usually fine for a small number of items
    return await db.transaction(async (tx) => {
      const results = [];
      for (const unit of units) {
        const [updatedUnit] = await tx
          .update(storageUnits)
          .set({ 
            x: unit.x, 
            y: unit.y, 
            ...(unit.z !== undefined && { z: unit.z }),
            ...(unit.width !== undefined && { width: unit.width }),
            ...(unit.height !== undefined && { height: unit.height }),
            ...(unit.depth !== undefined && { depth: unit.depth }),
            ...(unit.rotation !== undefined && { rotation: unit.rotation }),
            ...(unit.name !== undefined && { name: unit.name }),
            ...(unit.internal_width !== undefined && unit.internal_width !== null && { internal_width: unit.internal_width }),
            ...(unit.internal_height !== undefined && unit.internal_height !== null && { internal_height: unit.internal_height })
          })
          .where(eq(storageUnits.id, unit.id))
          .returning();
        results.push(updatedUnit);
      }
      return results;
    });
  },

  async deleteStorageUnit(id: string) {
    await db.delete(storageUnits).where(eq(storageUnits.id, id));
  },

  async getUnitById(id: string) {
    return await db.query.storageUnits.findFirst({
      where: eq(storageUnits.id, id),
      with: {
        room: true
      }
    });
  },

  async getSubUnits(parent_id: string) {
    return await db.query.storageUnits.findMany({
      where: eq(storageUnits.parent_id, parent_id)
    });
  },

  async getUnitHierarchy(unit_id: string) {
    return await db.query.storageUnits.findFirst({
      where: eq(storageUnits.id, unit_id),
      with: {
        room: true
      }
    });
  },

  async setRoomMaintenance(room_id: string, is_maintenance: boolean) {
    await db
      .update(rooms)
      .set({ is_maintenance })
      .where(eq(rooms.id, room_id));
  },

  async getAssignableUnits() {
    return await db.query.storageUnits.findMany({
      where: eq(storageUnits.is_assignable, true)
    });
  },

  async relocateAllContent(source_id: string, target_id: string) {
    return await db.transaction(async (tx) => {
      // 1. Move Reports
      await tx
        .update(reports)
        .set({ unit_id: target_id })
        .where(eq(reports.unit_id, source_id));

      // 2. Move Sub-units
      await tx
        .update(storageUnits)
        .set({ parent_id: target_id })
        .where(eq(storageUnits.parent_id, source_id));

      return { success: true };
    });
  },

  async isCircularParent(unit_id: string, proposed_parent_id: string): Promise<boolean> {
    if (unit_id === proposed_parent_id) return true;
    
    let current_parent_id = proposed_parent_id;
    while (current_parent_id) {
      const parent = await db.query.storageUnits.findFirst({
        where: eq(storageUnits.id, current_parent_id)
      });
      if (!parent || !parent.parent_id) break;
      if (parent.parent_id === unit_id) return true;
      current_parent_id = parent.parent_id;
    }
    return false;
  },

  async getLockersByCabinetId(cabinetId: string) {
    return await db.query.lockers.findMany({
      where: eq(lockers.cabinet_id, cabinetId),
      orderBy: [desc(lockers.created_at)]
    });
  },

  async createLocker(locker: LockerInsert) {
    const [newLocker] = await db.insert(lockers).values(locker).returning();
    return newLocker;
  },

  async batchUpdateLockers(updates: { id: string; x: number; y: number; width?: number; height?: number; name?: string }[]) {
    return await db.transaction(async (tx) => {
      const results = [];
      for (const update of updates) {
        const [updated] = await tx
          .update(lockers)
          .set({ 
            x: update.x, 
            y: update.y, 
            ...(update.width !== undefined && { width: update.width }),
            ...(update.height !== undefined && { height: update.height }),
            ...(update.name !== undefined && { name: update.name })
          })
          .where(eq(lockers.id, update.id))
          .returning();
        results.push(updated);
      }
      return results;
    });
  },

  async deleteLocker(id: string) {
    await db.delete(lockers).where(eq(lockers.id, id));
  }
};
