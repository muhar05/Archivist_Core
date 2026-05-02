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
