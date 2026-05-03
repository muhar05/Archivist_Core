import { db } from "@/db";
import { reports, reportLogs } from "@/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";

export type Report = typeof reports.$inferSelect;
export type ReportInsert = typeof reports.$inferInsert;

export const reportService = {
  async getAllReports() {
    return await db.query.reports.findMany({
      orderBy: [desc(reports.created_at)],
      with: {
        creator: true,
        unit: {
          with: {
            room: true
          }
        }
      }
    });
  },
  async getReportsByUnit(unit_id: string) {
    return await db.query.reports.findMany({
      where: eq(reports.unit_id, unit_id),
      orderBy: [desc(reports.created_at)],
      with: {
        creator: true
      }
    });
  },

  async createReport(report: ReportInsert) {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  },

  async requestDeposit(report: ReportInsert, notes?: string) {
    // 1. Create Report
    const [newReport] = await db
      .insert(reports)
      .values({ ...report, status: "pending" })
      .returning();

    // 2. Create Initial Log
    await db.insert(reportLogs).values({
      report_id: newReport.id,
      action: "DEPOSIT",
      from_user_id: report.created_by,
      notes: notes || "Initial deposit request"
    });

    return newReport;
  },

  async getPendingReports() {
    return await db.query.reports.findMany({
      where: eq(reports.status, "pending"),
      orderBy: [desc(reports.created_at)],
      with: {
        creator: true,
        unit: {
          with: {
            room: true
          }
        }
      }
    });
  },

  async approveReport(report_id: string, admin_id: string) {
    // 1. Update status
    const [updatedReport] = await db
      .update(reports)
      .set({ status: "pending_placement" })
      .where(eq(reports.id, report_id))
      .returning();

    // 2. Create Log
    await db.insert(reportLogs).values({
      report_id: report_id,
      action: "VERIFICATION",
      from_user_id: admin_id,
      notes: "Physical verification completed. Awaiting staff placement confirmation."
    });

    return updatedReport;
  },

  async searchReports(query: string) {
    // Fallback for Semantic Search using ILIKE
    return await db.query.reports.findMany({
      where: or(
        ilike(reports.title, `%${query}%`),
        ilike(reports.client, `%${query}%`)
      ),
      with: {
        unit: true,
        creator: true
      }
    });
  },
  async confirmPlacement(report_id: string, staff_id: string) {
    // 1. Update status to archived
    const [updatedReport] = await db
      .update(reports)
      .set({ 
        status: "archived",
        placement_confirmed_at: new Date(),
        placement_confirmed_by: staff_id
      })
      .where(eq(reports.id, report_id))
      .returning();

    // 2. Create Log
    await db.insert(reportLogs).values({
      report_id: report_id,
      action: "PLACEMENT_CONFIRMATION",
      from_user_id: staff_id,
      notes: "Staff confirmed physical placement in the designated locker slot."
    });

    return updatedReport;
  },

  async getReportsByStaff(staff_id: string) {
    return await db.query.reports.findMany({
      where: eq(reports.created_by, staff_id),
      orderBy: [desc(reports.created_at)],
      with: {
        unit: {
          with: { room: true }
        }
      }
    });
  }
};
