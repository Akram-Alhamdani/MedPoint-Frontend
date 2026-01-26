import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { cancelWorkingHour } from "../api";

export const useWorkingHoursCancel = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation<void, Error, number>({
        mutationFn: async (id) => {
            await cancelWorkingHour(id);
        },
        onSuccess: () => {
            toast.success(t("working_hours.cancel_success"));
            queryClient.invalidateQueries({
                queryKey: ["working-hours"],
                exact: false,
            });
        },
        onError: () => {
            toast.error(t("working_hours.cancel_failed"));
        },
    });
};
