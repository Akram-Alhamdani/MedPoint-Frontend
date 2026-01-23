import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteWorkingHours } from "../api";
import { useTranslation } from "react-i18next";

export const useWorkingHoursDelete = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, number[]>({
    mutationFn: async (ids) => {
      await deleteWorkingHours(ids);
    },
    onSuccess: () => {
      toast.success(t("working_hours.delete_success"));
      queryClient.invalidateQueries({
        queryKey: ["working-hours"],
        exact: false,
      });
    },
    onError: () => {
      toast.error(t("working_hours.delete_failed"));
    },
  });
};
