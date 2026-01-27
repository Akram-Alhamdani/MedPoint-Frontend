import { useQuery } from "@tanstack/react-query";
import { getFolderFiles } from "../api";
import type { FolderFilesResponse } from "../types";
import { toast } from "sonner";

export const useFolderFiles = (folderId?: number, page = 1, pageSize = 10) => {
  return useQuery<FolderFilesResponse | null>({
    queryKey: ["folder-files", folderId, page, pageSize],
    enabled: Boolean(folderId),
    queryFn: async () => {
      if (!folderId) return null;
      try {
        const { data, status } = await getFolderFiles(folderId, page, pageSize);
        console.log("Folder files fetched", data, status);
        if (status !== 200) throw new Error("Failed to fetch files");
        return data as FolderFilesResponse;
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
        throw error;
      }
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
    placeholderData: (previousData) => previousData,
  });
};
