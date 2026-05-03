"use server"

import { locationService, LockerInsert } from "@/services/locationService";
import { revalidatePath } from "next/cache";

export async function getLockersByCabinetAction(cabinetId: string) {
  try {
    return await locationService.getLockersByCabinetId(cabinetId);
  } catch (error) {
    console.error("Error fetching lockers:", error);
    throw new Error("Failed to fetch lockers");
  }
}

export async function createLockerAction(locker: LockerInsert) {
  try {
    const newLocker = await locationService.createLocker(locker);
    revalidatePath("/admin/architect");
    return newLocker;
  } catch (error) {
    console.error("Error creating locker:", error);
    throw new Error("Failed to create locker");
  }
}

export async function batchUpdateLockersAction(updates: { id: string; x: number; y: number; width?: number; height?: number; name?: string }[]) {
  try {
    const results = await locationService.batchUpdateLockers(updates);
    revalidatePath("/admin/architect");
    return results;
  } catch (error) {
    console.error("Error batch updating lockers:", error);
    throw new Error("Failed to update lockers");
  }
}

export async function deleteLockerAction(id: string) {
  try {
    await locationService.deleteLocker(id);
    revalidatePath("/admin/architect");
  } catch (error) {
    console.error("Error deleting locker:", error);
    throw new Error("Failed to delete locker");
  }
}
