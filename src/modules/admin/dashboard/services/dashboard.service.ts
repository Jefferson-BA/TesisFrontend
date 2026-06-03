
import { api } from "@/api/axios";
import type { DashboardStats } from "../interfaces/dashboard.interface";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get<DashboardStats>("/admin/dashboard/stats");
  return data;
};