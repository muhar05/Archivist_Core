"use server"

import { dashboardService } from "@/services/dashboardService";

export async function getDashboardStatsAction() {
  return await dashboardService.getDashboardStats();
}

export async function getRecentActivityAction() {
  return await dashboardService.getRecentActivity();
}
