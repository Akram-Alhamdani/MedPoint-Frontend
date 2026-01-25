import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPatientReport } from "../api";

interface CreatePatientReportPayload {
    patientId: number;
    reason: string;
}

export const useCreatePatientReport = () => {
    return useMutation({
        mutationFn: async ({ patientId, reason }: CreatePatientReportPayload) => {
            const { data, status } = await createPatientReport(patientId, reason);
            if (status !== 201) throw new Error("Failed to submit report");
            return data;
        },
        onSuccess: () => {
            toast.success("Report submitted");
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.non_field_errors?.[0] || error.message;
            toast.error(message || "Could not submit report");
        },
    });
};
