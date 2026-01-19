import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createSchedule } from "../api";
import type { SchedulePayload } from "../types";

export const useScheduleCreate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SchedulePayload>({
    mutationFn: async (scheduleData) => {
      await createSchedule(scheduleData);
    },
    onSuccess: () => {
      toast.success("Schedule created successfully");
      queryClient.invalidateQueries({ queryKey: ["schedules"], exact: false });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create schedule. Please try again."
      );
    },
  });
};
