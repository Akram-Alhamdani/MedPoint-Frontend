import { useQuery } from "@tanstack/react-query";
import { getSchedulesData } from "../api";
import type { ScheduleResponse } from "../types";
import { toast } from "sonner";

export function useSchedulesData(pageNumber: number, pageSize: number) {
  return useQuery<ScheduleResponse>({
    queryKey: ["schedules", pageNumber, pageSize],
    queryFn: async () => {
      try {
        const { data, status } = await getSchedulesData(pageNumber, pageSize);

        if (status !== 200) throw new Error("Failed to fetch schedules data");
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
