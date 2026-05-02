import { db } from "@/db";
import { rooms, storageUnits } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export type StorageUnit = typeof storageUnits.$inferSelect;
export type StorageUnitInsert = typeof storageUnits.$inferInsert;

export const locationService = {
  async getRooms() {
    return await db.query.rooms.findMany({
      orderBy: [desc(rooms.created_at)]
    });
  },

  async createRoom(room: { name: string; floor_number: number; grid_width?: number; grid_height?: number }) {
    const [newRoom] = await db.insert(rooms).values({
      name: room.name,
      floor_number: room.floor_number,
      grid_width: room.grid_width || 50,
      grid_height: room.grid_height || 50,
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

  async batchUpdateStorageUnits(units: { id: string; x: number; y: number; width?: number; height?: number; name?: string }[]) {
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
            ...(unit.width !== undefined && { width: unit.width }),
            ...(unit.height !== undefined && { height: unit.height }),
            ...(unit.name !== undefined && { name: unit.name })
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
        room: true,
        parent: true
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
  }
};
