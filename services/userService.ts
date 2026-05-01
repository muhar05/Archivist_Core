import { db } from "@/db";
import { profiles } from "@/db/schema";
import { desc } from "drizzle-orm";

export const userService = {
  async getAllUsers() {
    return await db.query.profiles.findMany({
      orderBy: [desc(profiles.created_at)],
    });
  }
};
