"use server"

import { locationService, StorageUnitInsert, StorageUnit } from "@/services/locationService";

export async function getRoomsAction() {
  return await locationService.getRooms();
}

export async function createRoomAction(room: { name: string; floor_number: number; grid_width?: number; grid_height?: number }) {
  return await locationService.createRoom(room);
}

export async function updateRoomAction(id: string, updates: Partial<{ name: string; floor_number: number; grid_width: number; grid_height: number; is_maintenance: boolean }>) {
  return await locationService.updateRoom(id, updates);
}

export async function deleteRoomAction(id: string) {
  return await locationService.deleteRoom(id);
}

export async function getStorageUnitsAction(roomId: string) {
  return await locationService.getStorageUnits(roomId);
}

export async function createStorageUnitAction(unit: StorageUnitInsert) {
  return await locationService.createStorageUnit(unit);
}

export async function updateStorageUnitAction(id: string, updates: Partial<StorageUnit>) {
  return await locationService.updateStorageUnit(id, updates);
}

export async function batchUpdateStorageUnitsAction(units: { id: string; x: number; y: number; width?: number; height?: number; name?: string }[]) {
  return await locationService.batchUpdateStorageUnits(units);
}



export async function deleteStorageUnitAction(id: string) {
  return await locationService.deleteStorageUnit(id);
}

export async function getUnitByIdAction(id: string) {
  return await locationService.getUnitById(id);
}

export async function getSubUnitsAction(parentId: string) {
  return await locationService.getSubUnits(parentId);
}

export async function getUnitHierarchyAction(unitId: string) {
  return await locationService.getUnitHierarchy(unitId);
}

export async function setRoomMaintenanceAction(roomId: string, isMaintenance: boolean) {
  return await locationService.setRoomMaintenance(roomId, isMaintenance);
}

export async function getAssignableUnitsAction() {
  return await locationService.getAssignableUnits();
}
