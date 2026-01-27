import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDoctorProfile } from "../api";
import type { DoctorProfile } from "../types";

export function useProfileData() {
  return useQuery<DoctorProfile>({
    queryKey: ["doctor-profile"],
    queryFn: async () => {
      try {
        const { data, status } = await getDoctorProfile();

        if (status !== 200) throw new Error("Failed to fetch profile");
        return data;
      } catch (error: any) {
        toast.error(error?.message || "Unable to load profile");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
  });
}
