import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSchedule } from "../api";
import type { SchedulePayload } from "../types";

export const useScheduleUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; data: SchedulePayload }>({
    mutationFn: async ({ id, data }) => {
      await updateSchedule(id, data);
    },
    onSuccess: () => {
      toast.success("Schedule updated successfully");
      queryClient.invalidateQueries({ queryKey: ["schedules"], exact: false });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to update schedule. Please try again."
      );
    },
  });
};
