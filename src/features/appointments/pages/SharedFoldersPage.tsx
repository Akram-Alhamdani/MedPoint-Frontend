import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { useSharedFolders, useFolderFiles } from "../hooks";
import { formatDateTime } from "../utils";
import type { SharedFolder } from "../types";
import AppointmentsTablePagination from "@/shared/components/Pagination";

export default function SharedFoldersPage() {
  const { t } = useTranslation();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openFolderId, setOpenFolderId] = useState<number | null>(null);
  const [filesPage, setFilesPage] = useState(1);
  const sharingType = "DOCTOR";

  const { data, isPending } = useSharedFolders(
    sharingType,
    pageNumber,
    pageSize,
  );
  const { data: filesResponse, isPending: filesPending } = useFolderFiles(
    openFolderId ?? undefined,
    filesPage,
    10,
  );

  const sharedFolders = data?.results ?? [];
  const files = filesResponse?.results ?? [];

  const handleToggleFolder = (folderId: number | null) => {
    setFilesPage(1);
    setOpenFolderId((prev) => (prev === folderId ? null : folderId));
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {t("sharedFolders.title", "Shared folders")}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("sharedFolders.list", "Folders")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isPending ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              {t("sharedFolders.loading", "Loading folders...")}
            </div>
          ) : sharedFolders.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {t("sharedFolders.empty", "No shared folders available")}
            </div>
          ) : (
            <div className="divide-y divide-border rounded-md border">
              {sharedFolders.map((folder: SharedFolder) => (
                <div
                  key={folder.folder?.id ?? folder.id}
                  className="p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">
                      {folder?.folder?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("sharedFolders.created", "Created")}:{" "}
                      {formatDateTime(folder?.folder?.created_at)}
                    </span>
                  </div>
                  {folder?.folder?.description ? (
                    <p className="text-sm text-muted-foreground leading-snug">
                      {folder?.folder?.description}
                    </p>
                  ) : null}
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleToggleFolder(folder.folder?.id || null)
                      }
                    >
                      {openFolderId === folder.folder?.id
                        ? t("sharedFolders.hide_files", "Hide files")
                        : t("sharedFolders.view_files", "View files")}
                    </Button>
                  </div>

                  {openFolderId === folder.folder?.id && (
                    <div className="rounded-md border border-dashed p-3">
                      {filesPending ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Spinner className="size-4" />
                          {t("sharedFolders.loading_files", "Loading files...")}
                        </div>
                      ) : files.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          {t(
                            "sharedFolders.no_files",
                            "No files in this folder",
                          )}
                        </div>
                      ) : (
                        <ul className="space-y-2">
                          {files.map((file) => (
                            <li
                              key={file.id}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <span className="truncate">{file.name}</span>
                              <Button asChild size="sm" variant="ghost">
                                <a
                                  href={file.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={file.name || true}
                                >
                                  {t("sharedFolders.open_file", "Open")}
                                </a>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AppointmentsTablePagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={data?.total_pages ?? 1}
        onPageChange={setPageNumber}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
