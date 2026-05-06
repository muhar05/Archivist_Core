import { db } from "../db";

async function list() {
  const allUnits = await db.query.storageUnits.findMany({
    limit: 5,
    with: { room: true }
  });
  console.log("Valid Storage Unit IDs:");
  allUnits.forEach(u => console.log(`- ${u.name}: ${u.id} (Room: ${u.room?.name})`));
  
  const allRooms = await db.query.rooms.findMany({ limit: 5 });
  console.log("\nValid Room IDs:");
  allRooms.forEach(r => console.log(`- ${r.name}: ${r.id}`));
}

list().catch(console.error);
