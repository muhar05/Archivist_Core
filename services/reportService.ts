import { db } from "@/db";
import { reports, reportLogs, sopRequirements, lockers, reportCategories } from "@/db/schema";
import { eq, desc, ilike, or, asc } from "drizzle-orm";

export type Report = typeof reports.$inferSelect;
export type ReportInsert = typeof reports.$inferInsert;
export type ReportCategory = typeof reportCategories.$inferSelect;

export const reportService = {
  async getAllReports() {
    return await db.query.reports.findMany({
      orderBy: [desc(reports.created_at)],
      with: {
        creator: true,
        category: true,
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
      where: or(eq(reports.unit_id, unit_id), eq(reports.locker_id, unit_id)),
      orderBy: [desc(reports.created_at)],
      with: {
        creator: true,
        category: true,
        unit: {
          with: {
            room: true
          }
        }
      }
    });
  },

  async createReport(report: ReportInsert) {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  },

  async requestDeposit(report: ReportInsert, notes?: string) {
    // 1. Identify if ID is for unit or locker
    let insertData = { ...report, status: "pending" as const };
    
    // If unit_id is provided, check if it's actually a locker_id
    if (report.unit_id) {
      const isLocker = await db.query.lockers.findFirst({
        where: eq(lockers.id, report.unit_id)
      });

      if (isLocker) {
        // Swap unit_id to locker_id if it belongs to lockers table
        insertData = {
          ...insertData,
          locker_id: report.unit_id,
          unit_id: null // Clear unit_id as it's now in locker_id
        };
      }
    }

    // 2. Create Report
    const [newReport] = await db
      .insert(reports)
      .values(insertData)
      .returning();

    // 3. Create Initial Log
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
        category: true,
        unit: {
          with: {
            room: true
          }
        }
      }
    });
  },

  async approveReport(report_id: string, admin_id: string, notes?: string) {
    // 1. Get current metadata
    const currentReport = await db.query.reports.findFirst({
      where: eq(reports.id, report_id)
    });

    // 2. Update status and metadata
    const [updatedReport] = await db
      .update(reports)
      .set({ 
        status: "pending_placement",
        metadata: {
          ...(currentReport?.metadata as object || {}),
          admin_notes: notes || "Verified by Admin",
          verified_at: new Date().toISOString()
        }
      })
      .where(eq(reports.id, report_id))
      .returning();

    // 3. Create Log
    await db.insert(reportLogs).values({
      report_id: report_id,
      action: "APPROVE",
      from_user_id: admin_id,
      notes: notes || "Physical verification completed by Admin. Awaiting staff placement confirmation."
    });

    return updatedReport;
  },

  async rejectReport(report_id: string, admin_id: string, reason: string) {
    // 1. Get current metadata
    const currentReport = await db.query.reports.findFirst({
      where: eq(reports.id, report_id)
    });

    // 2. Update status and metadata
    const [updatedReport] = await db
      .update(reports)
      .set({ 
        status: "rejected",
        metadata: {
          ...(currentReport?.metadata as object || {}),
          rejection_reason: reason,
          rejected_at: new Date().toISOString()
        }
      })
      .where(eq(reports.id, report_id))
      .returning();

    // 3. Create Log
    await db.insert(reportLogs).values({
      report_id: report_id,
      action: "REJECT",
      from_user_id: admin_id,
      notes: `Request rejected: ${reason}`
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

  async updateReport(id: string, data: Partial<Report>) {
    const [updatedReport] = await db
      .update(reports)
      .set(data)
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  },

  async deleteReport(id: string) {
    return await db.delete(reports).where(eq(reports.id, id));
  },

  async getReportsByStaff(staff_id: string) {
    return await db.query.reports.findMany({
      where: eq(reports.created_by, staff_id),
      orderBy: [desc(reports.created_at)],
      with: {
        category: true,
        unit: {
          with: { room: true }
        }
      }
    });
  },

  async getSopRequirements() {
    return await db.query.sopRequirements.findMany({
      orderBy: [desc(sopRequirements.created_at)]
    });
  },

  async getReportCategories() {
    return await db.query.reportCategories.findMany({
      orderBy: [asc(reportCategories.name)]
    });
  },

  async createCategory(data: { name: string; sub_category?: string; description?: string }) {
    const [newCategory] = await db.insert(reportCategories).values(data).returning();
    return newCategory;
  },

  async deleteCategory(id: string) {
    return await db.delete(reportCategories).where(eq(reportCategories.id, id));
  }
};
