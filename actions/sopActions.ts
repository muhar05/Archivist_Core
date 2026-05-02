"use server"

import { db } from "@/db";
import { sopRequirements } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSOPRequirementsAction() {
  return await db.select().from(sopRequirements).orderBy(sopRequirements.created_at);
}

export async function createSOPRequirementAction(name: string, description?: string) {
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Document name cannot be empty");
  
  const result = await db.insert(sopRequirements).values({ name: trimmedName, description }).returning();
  revalidatePath("/admin/architect");
  return result[0];
}

export async function deleteSOPRequirementAction(id: string) {
  await db.delete(sopRequirements).where(eq(sopRequirements.id, id));
  revalidatePath("/admin/architect");
}
