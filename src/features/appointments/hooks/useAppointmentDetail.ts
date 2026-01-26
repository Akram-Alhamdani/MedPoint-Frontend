import { useQuery } from "@tanstack/react-query";
import { getAppointmentDetail } from "../api";
import type { Appointment } from "../types";
import { toast } from "sonner";

export const useAppointmentDetail = (id?: number) => {
    return useQuery<Appointment | null>({
        queryKey: ["appointment", id],
        enabled: Boolean(id),
        queryFn: async () => {
            if (!id) return null;
            try {
                const { data, status } = await getAppointmentDetail(id);
                console.log("Appointment details fetched", data, status);
                if (status !== 200) throw new Error("Failed to fetch appointment");
                return data as Appointment;
            } catch (error: any) {
                toast.error(error.message || "An unexpected error occurred");
                throw error;
            }
        },
        staleTime: 60 * 1000,
    });
};
