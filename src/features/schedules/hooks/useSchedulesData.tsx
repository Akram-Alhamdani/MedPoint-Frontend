import { useQuery } from "@tanstack/react-query";
import { getSchedulesData } from "../api";
import type { ScheduleResponse } from "../types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useSchedulesData(pageNumber: number, pageSize: number) {
  const { t } = useTranslation();
  return useQuery<ScheduleResponse>({
    queryKey: ["schedules", pageNumber, pageSize],
    queryFn: async () => {
      try {
        const { data, status } = await getSchedulesData(pageNumber, pageSize);
        if (status !== 200) throw new Error(t("schedules.fetch_failed"));
        return data;
      } catch (error: any) {
        toast.error(t("schedules.unexpected_error"));
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
  });
}
