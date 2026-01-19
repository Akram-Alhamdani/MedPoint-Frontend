import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateWorkingHour } from "../api";
import type { WorkingHourPayload } from "../types";

export const useWorkingHoursUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; data: WorkingHourPayload }>({
    mutationFn: async ({ id, data }) => {
      await updateWorkingHour(id, data);
    },
    onSuccess: () => {
      toast.success("Working hour updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["working-hours"],
        exact: false,
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to update working hour. Please try again.",
      );
    },
  });
};
