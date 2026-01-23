import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateDoctorProfile } from "../api";
import type { DoctorProfile, UpdateDoctorProfilePayload } from "../types";
import { useTranslation } from "react-i18next";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const normalizePayload = (payload: UpdateDoctorProfilePayload) => {
    const normalized: UpdateDoctorProfilePayload = {};

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (value instanceof File) {
        normalized[key as keyof UpdateDoctorProfilePayload] = value as never;
        return;
      }

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "") return;
        normalized[key as keyof UpdateDoctorProfilePayload] = trimmed as never;
        return;
      }

      normalized[key as keyof UpdateDoctorProfilePayload] = value as never;
    });

    return normalized;
  };

  return useMutation<DoctorProfile, Error, UpdateDoctorProfilePayload>({
    mutationFn: async (payload) => {
      try {
        const safePayload = normalizePayload(payload);

        let response;

        if (safePayload.image instanceof File) {
          const formData = new FormData();

          Object.entries(safePayload).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            if (value instanceof File) {
              formData.append(key, value);
              return;
            }

            formData.append(key, String(value));
          });

          response = await updateDoctorProfile(formData);
        } else {
          response = await updateDoctorProfile(safePayload);
        }

        const { data, status } = response;

        if (![200, 201].includes(status)) {
          throw new Error(t("error.failed_to_update_profile"));
        }

        return data;
      } catch (error: any) {
        const message =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          t("error.failed_to_update_profile");

        throw new Error(message);
      }
    },

    onSuccess: (profile) => {
      queryClient.setQueryData(["doctor-profile"], profile);

      toast.success(t("profile.update_success"));
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
}
