import { useQuery } from "@tanstack/react-query";
import { getReviews, type ReviewsResponse } from "../api";
import { toast } from "sonner";

export function useReviews(page: number, pageSize: number) {
  return useQuery<ReviewsResponse>({
    queryKey: ["reviews", page, pageSize],
    queryFn: async () => {
      try {
        const { data, status } = await getReviews(page, pageSize);
        if (status !== 200) throw new Error("Failed to fetch reviews");
        return data;
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
  });
}
