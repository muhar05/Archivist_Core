"use server"

import { userService } from "@/services/userService";

export async function getAllUsersAction() {
  return await userService.getAllUsers();
}
