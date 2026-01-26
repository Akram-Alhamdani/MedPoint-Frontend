import { useQuery } from "@tanstack/react-query";
import { getSharedFolders } from "../api";
import type { SharedFoldersResponse } from "../types";
import { toast } from "sonner";

export const useSharedFolders = (
    sharingType = "DOCTOR",
    page = 1,
    pageSize = 10,
) => {
    return useQuery<SharedFoldersResponse>({
        queryKey: ["shared-folders", sharingType, page, pageSize],
        queryFn: async () => {
            const { data, status } = await getSharedFolders(
                page,
                pageSize,
                sharingType,
            );
            if (status !== 200) {
                throw new Error("Failed to fetch shared folders");
            }
            return data as SharedFoldersResponse;
        },
        staleTime: 5 * 60 * 1000,
        keepPreviousData: true,
        onError: (error: any) => {
            const message = error?.message || "An unexpected error occurred";
            toast.error(message);
        },
    });
};
