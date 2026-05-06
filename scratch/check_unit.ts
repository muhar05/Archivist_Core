import { db } from "../db";
import { storageUnits } from "../db/schema";
import { eq } from "drizzle-orm";

async function check() {
  const id = "5ba7339e-99ed-4a33-a083-7daf32308ad4";
  const unit = await db.query.storageUnits.findFirst({
    where: eq(storageUnits.id, id),
    with: {
      room: true,
      parent: true
    }
  });
  console.log("Unit found:", unit);
}

check().catch(console.error);
