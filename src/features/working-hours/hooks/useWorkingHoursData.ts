import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getWorkingHoursData } from "../api";
import type { WorkingHoursResponse } from "../types";

export function useWorkingHoursData(pageNumber: number, pageSize: number) {
  return useQuery<WorkingHoursResponse>({
    queryKey: ["working-hours", pageNumber, pageSize],
    queryFn: async () => {
      try {
        const { data, status } = await getWorkingHoursData(
          pageNumber,
          pageSize,
        );
        if (status !== 200) throw new Error("Failed to fetch working hours");
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
