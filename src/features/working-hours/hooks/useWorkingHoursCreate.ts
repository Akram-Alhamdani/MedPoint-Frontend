import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createWorkingHour } from "../api";
import type { WorkingHourPayload } from "../types";

export const useWorkingHoursCreate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, WorkingHourPayload>({
    mutationFn: async (payload) => {
      await createWorkingHour(payload);
    },
    onSuccess: () => {
      toast.success("Working hour created successfully");
      queryClient.invalidateQueries({
        queryKey: ["working-hours"],
        exact: false,
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create working hour. Please try again.",
      );
    },
  });
};
