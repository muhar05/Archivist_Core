import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://mac@localhost:5432/prms_db";

// Disable prefetch as it is not supported for "Transaction" mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
