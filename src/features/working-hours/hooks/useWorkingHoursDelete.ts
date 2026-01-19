import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteWorkingHours } from "../api";

export const useWorkingHoursDelete = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number[]>({
    mutationFn: async (ids) => {
      await deleteWorkingHours(ids);
    },
    onSuccess: () => {
      toast.success("Working hours deleted");
      queryClient.invalidateQueries({
        queryKey: ["working-hours"],
        exact: false,
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to delete working hours. Please try again.",
      );
    },
  });
};
