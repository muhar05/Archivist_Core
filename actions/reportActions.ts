"use server"

import { reportService, ReportInsert, Report } from "@/services/reportService";

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

export async function approveReportAction(reportId: string, adminId: string, notes?: string) {
  return await reportService.approveReport(reportId, adminId, notes);
}

export async function rejectReportAction(reportId: string, adminId: string, reason: string) {
  return await reportService.rejectReport(reportId, adminId, reason);
}

export async function searchReportsAction(query: string) {
  return await reportService.searchReports(query);
}

export async function confirmPlacementAction(reportId: string, staffId: string) {
  return await reportService.confirmPlacement(reportId, staffId);
}

export async function getReportsByStaffAction(staffId: string) {
  return await reportService.getReportsByStaff(staffId);
}

export async function getSopRequirementsAction() {
  return await reportService.getSopRequirements();
}

export async function getReportCategoriesAction() {
  return await reportService.getReportCategories();
}

export async function createCategoryAction(data: { name: string; sub_category?: string; description?: string }) {
  return await reportService.createCategory(data);
}

export async function deleteCategoryAction(id: string) {
  return await reportService.deleteCategory(id);
}

export async function updateReportAction(id: string, data: Partial<Report>) {
  return await reportService.updateReport(id, data);
}

export async function deleteReportAction(id: string) {
  return await reportService.deleteReport(id);
}
