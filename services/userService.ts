import { db } from "@/db";
import { profiles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const userService = {
  async getAllUsers() {
    return await db.query.profiles.findMany({
      orderBy: [desc(profiles.created_at)],
    });
  },

  async createUser(user: { full_name: string; email: string; role: "admin" | "staff" }) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const [newUser] = await db.insert(profiles).values({
      ...user,
      password: hashedPassword,
      employee_id: `STF-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` // Default fallback ID
    }).returning();
    return newUser;
  },

  async updateUser(id: string, data: Partial<{ full_name: string; email: string; role: "admin" | "staff" }>) {
    const [updatedUser] = await db.update(profiles).set(data).where(eq(profiles.id, id)).returning();
    return updatedUser;
  },

  async deleteUser(id: string) {
    return await db.delete(profiles).where(eq(profiles.id, id));
  },

  async verifyAndChangePassword(id: string, currentPass: string, newPass: string) {
    const user = await db.query.profiles.findFirst({
      where: eq(profiles.id, id)
    });

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) throw new Error("Password saat ini salah");

    const hashedNewPass = await bcrypt.hash(newPass, 10);
    return await db.update(profiles).set({ password: hashedNewPass }).where(eq(profiles.id, id));
  }
};
