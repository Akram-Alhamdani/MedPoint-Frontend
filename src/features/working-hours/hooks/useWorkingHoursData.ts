import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getWorkingHoursData } from "../api";
import type { WorkingHoursResponse } from "../types";
import { useTranslation } from "react-i18next";

export function useWorkingHoursData(pageNumber: number, pageSize: number) {
  const { t } = useTranslation();
  return useQuery<WorkingHoursResponse>({
    queryKey: ["working-hours", pageNumber, pageSize],
    queryFn: async () => {
      try {
        const { data, status } = await getWorkingHoursData(
          pageNumber,
          pageSize,
        );
        if (status !== 200) throw new Error(t("working_hours.fetch_failed"));
        return data;
      } catch (error: any) {
        toast.error(t("working_hours.unexpected_error"));
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
}
