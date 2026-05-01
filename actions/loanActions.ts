"use server"

import { loanService } from "@/services/loanService";

export async function getLoansAction() {
  return await loanService.getLoans();
}

export async function createLoanAction(loan: {
  report_id: string;
  borrower_id: string;
  due_date: Date;
  notes?: string;
}) {
  return await loanService.createLoan(loan);
}

export async function returnLoanAction(loanId: string, reportId: string) {
  return await loanService.returnLoan(loanId, reportId);
}
