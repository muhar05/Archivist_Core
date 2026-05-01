"use server"

import { reportService, ReportInsert } from "@/services/reportService";

export async function getReportsByUnitAction(unitId: string) {
  return await reportService.getReportsByUnit(unitId);
}

export async function createReportAction(report: ReportInsert) {
  return await reportService.createReport(report);
}

export async function requestDepositAction(report: ReportInsert, notes?: string) {
  return await reportService.requestDeposit(report, notes);
}

export async function getAllReportsAction() {
  return await reportService.getAllReports();
}

export async function getPendingReportsAction() {
  return await reportService.getPendingReports();
}

export async function approveReportAction(reportId: string, adminId: string) {
  return await reportService.approveReport(reportId, adminId);
}

export async function searchReportsAction(query: string) {
  return await reportService.searchReports(query);
}
