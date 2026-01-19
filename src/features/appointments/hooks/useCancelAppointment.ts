import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelAppointment } from "../api";

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (appointmentId) => {
      await cancelAppointment(appointmentId);
    },
    onSuccess: () => {
      toast.success("Appointment canceled");
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"], exact: false });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to cancel appointment. Please try again."
      );
    },
  });
};
