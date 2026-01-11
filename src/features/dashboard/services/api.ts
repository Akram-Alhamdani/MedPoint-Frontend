import api from "@/shared/services/api";
import type { DashboardData } from "../types";

// Get Dashboard Data
export const getDashboardData = () =>
  api.get<DashboardData>("/doctors/dashboard/");
