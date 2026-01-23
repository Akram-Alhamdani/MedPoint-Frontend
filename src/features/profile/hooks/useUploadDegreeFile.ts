import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { uploadDegreeDocument } from "../api";
export function useUploadDegreeFile() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<unknown, Error, File>({
    mutationFn: async (file) => {
      return await uploadDegreeDocument(file);
    },
    onSuccess: () => {
      toast.success(t("profile.verify_account.upload_success"));
      queryClient.invalidateQueries({ queryKey: ["doctor-profile"] });
    },
    onError: (error) => {
      toast.error(error.message || t("profile.verify_account.upload_failed"));
    },
  });
}
