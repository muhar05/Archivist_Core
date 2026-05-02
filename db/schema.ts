import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, pgEnum, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "staff"]);
export const unitStatusEnum = pgEnum("unit_status", ["available", "low_space", "full"]);
export const reportStatusEnum = pgEnum("report_status", ["pending", "archived", "loaned"]);
export const loanStatusEnum = pgEnum("loan_status", ["ONGOING", "RETURNED", "OVERDUE"]);

// Profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  full_name: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").$type<"admin" | "staff">().default("staff").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Rooms
export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  floor_number: integer("floor_number").default(1).notNull(),
  grid_width: integer("grid_width").default(50).notNull(),
  grid_height: integer("grid_height").default(50).notNull(),
  description: text("description"),
  is_maintenance: boolean("is_maintenance").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Storage Units
export const storageUnits = pgTable("storage_units", {
  id: uuid("id").primaryKey().defaultRandom(),
  room_id: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  parent_id: uuid("parent_id"),
  name: text("name").notNull(),
  x: integer("x").default(0).notNull(),
  y: integer("y").default(0).notNull(),
  z: integer("z").default(0).notNull(),
  width: integer("width").default(100).notNull(),
  height: integer("height").default(100).notNull(),
  is_assignable: boolean("is_assignable").default(false).notNull(),
  status: text("status").$type<"available" | "low_space" | "full">().default("available").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  parentReference: foreignKey({
    columns: [table.parent_id],
    foreignColumns: [table.id],
    name: "storage_units_parent_id_fkey"
  }).onDelete("cascade")
}));


// Reports
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  unit_id: uuid("unit_id").references(() => storageUnits.id).notNull(),
  title: text("title").notNull(),
  client: text("client"),
  metadata: jsonb("metadata").default({}).notNull(),
  status: text("status").$type<"pending" | "archived" | "loaned">().default("pending").notNull(),
  created_by: uuid("created_by").references(() => profiles.id).notNull(),
  current_holder_id: uuid("current_holder_id").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Report Logs
export const reportLogs = pgTable("report_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  report_id: uuid("report_id").references(() => reports.id, { onDelete: "cascade" }).notNull(),
  action: text("action").notNull(), // DEPOSIT, APPROVE, LOAN, RETURN, HANDOVER
  from_user_id: uuid("from_user_id").references(() => profiles.id),
  to_user_id: uuid("to_user_id").references(() => profiles.id),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Loans
export const loans = pgTable("loans", {
  id: uuid("id").primaryKey().defaultRandom(),
  report_id: uuid("report_id").references(() => reports.id, { onDelete: "cascade" }).notNull(),
  borrower_id: uuid("borrower_id").references(() => profiles.id).notNull(),
  loan_date: timestamp("loan_date").defaultNow().notNull(),
  due_date: timestamp("due_date").notNull(),
  return_date: timestamp("return_date"),
  status: text("status").$type<"ONGOING" | "RETURNED" | "OVERDUE">().default("ONGOING").notNull(),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const roomsRelations = relations(rooms, ({ many }) => ({
  units: many(storageUnits),
}));

export const storageUnitsRelations = relations(storageUnits, ({ one, many }) => ({
  room: one(rooms, { fields: [storageUnits.room_id], references: [rooms.id] }),
  parent: one(storageUnits, { fields: [storageUnits.parent_id], references: [storageUnits.id], relationName: "sub_units" }),
  subUnits: many(storageUnits, { relationName: "sub_units" }),
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  unit: one(storageUnits, { fields: [reports.unit_id], references: [storageUnits.id] }),
  creator: one(profiles, { fields: [reports.created_by], references: [profiles.id], relationName: "creator" }),
  holder: one(profiles, { fields: [reports.current_holder_id], references: [profiles.id], relationName: "holder" }),
  logs: many(reportLogs),
  loans: many(loans),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  createdReports: many(reports, { relationName: "creator" }),
  heldReports: many(reports, { relationName: "holder" }),
  loans: many(loans),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  report: one(reports, { fields: [loans.report_id], references: [reports.id] }),
  borrower: one(profiles, { fields: [loans.borrower_id], references: [profiles.id] }),
}));

export const reportLogsRelations = relations(reportLogs, ({ one }) => ({
  report: one(reports, { fields: [reportLogs.report_id], references: [reports.id] }),
  from_user: one(profiles, { fields: [reportLogs.from_user_id], references: [profiles.id] }),
  to_user: one(profiles, { fields: [reportLogs.to_user_id], references: [profiles.id] }),
}));


