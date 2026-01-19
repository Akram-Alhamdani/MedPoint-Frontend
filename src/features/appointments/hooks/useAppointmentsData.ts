import { useQuery } from "@tanstack/react-query";
import { getAppointmentsData } from "../api";
import type { AppointmentResponse } from "../types";
import { toast } from "sonner";

export function useAppointmentsData(pageNumber: number, pageSize: number) {
  return useQuery<AppointmentResponse>({
    queryKey: ["appointments", pageNumber, pageSize],
    queryFn: async () => {
      try {
        const { data, status } = await getAppointmentsData(
          pageNumber,
          pageSize
        );

        if (status !== 200)
          throw new Error("Failed to fetch appointments data");
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
