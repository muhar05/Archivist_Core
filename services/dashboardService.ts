import { db } from "@/db";
import { reports, reportLogs } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

export const dashboardService = {
  async getDashboardStats() {
    const [totalRecords] = await db.select({ count: count() }).from(reports);
    const [activeLoans] = await db.select({ count: count() }).from(reports).where(eq(reports.status, "loaned"));
    const [overdueReports] = await db.select({ count: count() }).from(reports).where(eq(reports.status, "loaned")); // Placeholder for overdue logic
    
    const roomsData = await db.query.rooms.findMany({
      with: {
        units: {
          with: {
            reports: true
          }
        }
      }
    });

    // Map rooms to include report counts
    const roomsWithCounts = roomsData.map(room => {
      let reportCount = 0;
      room.units.forEach(unit => {
        reportCount += unit.reports.length;
      });
      return {
        ...room,
        report_count: reportCount
      };
    });

    return {
      totalRecords: totalRecords.count,
      activeLoans: activeLoans.count,
      overdueReports: overdueReports.count,
      rooms: roomsWithCounts
    };
  },

  async getRecentActivity() {
    return await db.query.reportLogs.findMany({
      limit: 5,
      orderBy: [desc(reportLogs.created_at)],
      with: {
        report: true,
        from_user: true
      }
    });
  }
};
