import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteSchedule } from "../api";

export const useScheduleDelete = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number[]>({
    mutationFn: async (scheduleIds) => {
      await deleteSchedule(scheduleIds);
    },
    onSuccess: () => {
      toast.success("Schedule deleted");
      queryClient.invalidateQueries({ queryKey: ["schedules"], exact: false });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to delete schedule. Please try again."
      );
    },
  });
};
