import { db } from "./index";
import * as schema from "./schema";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clean existing data (optional but safer for dev)
  console.log("🧹 Cleaning old data...");
  await db.execute(sql`TRUNCATE TABLE ${schema.profiles}, ${schema.rooms}, ${schema.storageUnits}, ${schema.lockers}, ${schema.reports}, ${schema.reportLogs}, ${schema.loans}, ${schema.sopRequirements}, ${schema.reportCategories} CASCADE`);

  // 2. Profiles
  console.log("👤 Seeding profiles...");
  const adminId = "00000000-0000-0000-0000-000000000001";
  const staffId = "00000000-0000-0000-0000-000000000002";

  const adminPassword = await bcrypt.hash("admin123", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  await db.insert(schema.profiles).values([
    {
      id: adminId,
      employee_id: "ADM-001",
      full_name: "Admin Archivist",
      email: "admin@prms.local",
      password: adminPassword,
      role: "admin",
    },
    {
      id: staffId,
      employee_id: "STF-001",
      full_name: "Staff Operator",
      email: "staff@prms.local",
      password: staffPassword,
      role: "staff",
    },
  ]);

  // 3. Rooms
  console.log("🏠 Seeding rooms...");
  const [mainRoom] = await db.insert(schema.rooms).values([
    {
      name: "Gudang Utama (A)",
      floor_number: 1,
      grid_width: 50,
      grid_height: 50,
      width_cm: 1500,
      height_cm: 1000,
      ceiling_height_cm: 300,
      description: "Gudang penyimpanan utama untuk arsip fisik laporan.",
    },
  ]).returning();

  // 4. Storage Units
  console.log("📦 Seeding storage units...");
  const [cabinetA] = await db.insert(schema.storageUnits).values([
    {
      room_id: mainRoom.id,
      name: "Cabinet Alpha",
      x: 100,
      y: 100,
      z: 0,
      width: 120,
      height: 200,
      depth: 45,
      unit_type: "CABINET",
      is_assignable: false,
    },
    {
      room_id: mainRoom.id,
      name: "Cabinet Beta",
      x: 300,
      y: 100,
      z: 0,
      width: 120,
      height: 200,
      depth: 45,
      unit_type: "CABINET",
      is_assignable: false,
    },
    {
      room_id: mainRoom.id,
      name: "Main Entrance",
      x: 0,
      y: 450,
      z: 0,
      width: 100,
      height: 10,
      depth: 0,
      unit_type: "DOOR",
      is_assignable: false,
    },
  ]).returning();

  // 5. Lockers in Cabinet Alpha
  console.log("🗄️ Seeding lockers...");
  await db.insert(schema.lockers).values([
    {
      cabinet_id: cabinetA.id,
      name: "Drawer A-1",
      x: 0,
      y: 0,
      width: 60,
      height: 40,
      depth: 45,
      is_assignable: true,
      status: "available",
    },
    {
      cabinet_id: cabinetA.id,
      name: "Drawer A-2",
      x: 60,
      y: 0,
      width: 60,
      height: 40,
      depth: 45,
      is_assignable: true,
      status: "available",
    },
    {
      cabinet_id: cabinetA.id,
      name: "Drawer A-3",
      x: 0,
      y: 40,
      width: 120,
      height: 60,
      depth: 45,
      is_assignable: true,
      status: "available",
    },
  ]);

  // 6. Report Categories
  console.log("📂 Seeding report categories...");
  await db.insert(schema.reportCategories).values([
    { name: "Laporan Penilaian", sub_category: "Asset", description: "Laporan terkait penilaian aset fisik." },
    { name: "Laporan Penilaian", sub_category: "Bisnis", description: "Laporan terkait penilaian entitas bisnis." },
    { name: "Laporan Pengawasan", sub_category: "Internal", description: "Laporan hasil pengawasan internal." },
    { name: "Laporan Pengawasan", sub_category: "Eksternal", description: "Laporan hasil pengawasan pihak luar." },
  ]);

  // 7. SOP Requirements
  console.log("📋 Seeding SOP requirements...");
  await db.insert(schema.sopRequirements).values([
    { name: "Narasi", description: "Dokumen narasi laporan lengkap." },
    { name: "Work Paper", description: "Kertas kerja pendukung laporan." },
    { name: "SOP", description: "Standar Operasional Prosedur terkait." },
    { name: "Surat Tugas", description: "Surat penugasan resmi tim." },
    { name: "Surat Persetujuan Kerja", description: "SPK atau kontrak yang sudah ditandatangani." },
  ]);

  console.log("✅ Seeding completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed!");
  console.error(err);
  process.exit(1);
});
