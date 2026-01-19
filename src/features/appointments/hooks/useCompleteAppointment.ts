import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { completeAppointment } from "../api";

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (appointmentId) => {
      await completeAppointment(appointmentId);
    },
    onSuccess: () => {
      toast.success("Appointment marked as completed");
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"], exact: false });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to complete appointment. Please try again."
      );
    },
  });
};
