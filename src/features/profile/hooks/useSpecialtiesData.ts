import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSpecialties } from "../api";
import type { Specialty } from "../types";

export function useSpecialtiesData() {
  return useQuery<Specialty[]>({
    queryKey: ["specialties"],
    queryFn: async () => {
      try {
        const { data, status } = await getSpecialties();
        if (status !== 200) throw new Error("Failed to load specialties");

        if (Array.isArray(data)) return data; // fallback if API ever returns array

        if (data && Array.isArray(data.results)) {
          return data.results;
        }

        return [];
      } catch (error: any) {
        toast.error(error?.message || "Unable to load specialties");
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
  });
}
