import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../api";
import type { DashboardData } from "../types";
import { toast } from "sonner";

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      try {
        const { data, status } = await getDashboardData();

        if (status !== 200) throw new Error("Failed to fetch dashboard data");
        return data;
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
}
