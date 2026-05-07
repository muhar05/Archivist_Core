"use server"

import { userService } from "@/services/userService";

import { revalidatePath } from "next/cache";

export async function getAllUsersAction() {
  return await userService.getAllUsers();
}

export async function createUserAction(user: { full_name: string; email: string; role: "admin" | "staff" }) {
  const newUser = await userService.createUser(user);
  revalidatePath("/admin/users");
  return newUser;
}

export async function updateUserAction(id: string, data: Partial<{ full_name: string; email: string; role: "admin" | "staff" }>) {
  const updatedUser = await userService.updateUser(id, data);
  revalidatePath("/admin/users");
  return updatedUser;
}

export async function deleteUserAction(id: string) {
  await userService.deleteUser(id);
  revalidatePath("/admin/users");
}

export async function changePasswordAction(id: string, currentPass: string, newPass: string) {
  return await userService.verifyAndChangePassword(id, currentPass, newPass);
}
