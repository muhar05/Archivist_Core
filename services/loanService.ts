import { db } from "@/db";
import { loans, reports, reportLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const loanService = {
  async getLoans() {
    return await db.query.loans.findMany({
      orderBy: [desc(loans.created_at)],
      with: {
        report: true,
        borrower: true
      }
    });
  },

  async createLoan(loan: {
    report_id: string;
    borrower_id: string;
    due_date: Date;
    notes?: string;
  }) {
    // 1. Create the loan entry
    const [newLoan] = await db.insert(loans).values({
      report_id: loan.report_id,
      borrower_id: loan.borrower_id,
      due_date: loan.due_date,
      notes: loan.notes,
      status: "ONGOING"
    }).returning();

    // 2. Update report status to 'loaned'
    await db
      .update(reports)
      .set({ status: "loaned", current_holder_id: loan.borrower_id })
      .where(eq(reports.id, loan.report_id));

    // 3. Log the action
    await db.insert(reportLogs).values({
      report_id: loan.report_id,
      action: "LOAN",
      to_user_id: loan.borrower_id,
      notes: loan.notes || "Record loaned out"
    });

    return newLoan;
  },

  async returnLoan(loan_id: string, report_id: string) {
    // 1. Update loan entry
    await db
      .update(loans)
      .set({ status: "RETURNED", return_date: new Date() })
      .where(eq(loans.id, loan_id));

    // 2. Update report status back to 'archived'
    await db
      .update(reports)
      .set({ status: "archived", current_holder_id: null })
      .where(eq(reports.id, report_id));

    // 3. Log the action
    await db.insert(reportLogs).values({
      report_id: report_id,
      action: "HANDOVER",
      notes: "Record returned to archive"
    });
  }
};
