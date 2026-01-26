import { useMemo, useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Spinner } from "@/shared/components/ui/spinner";
import { calculateAge, formatDateTime } from "../utils";
import {
  useAppointmentDetail,
  useCancelAppointment,
  useCompleteAppointment,
} from "../hooks";
import { useFolderFiles } from "../hooks";
import StatusBadge from "../components/table/StatusBadge";
import type { FolderFile } from "../types";
import { toast } from "sonner";

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const numericId = useMemo(() => (id ? Number(id) : undefined), [id]);
  const { data, isPending } = useAppointmentDetail(numericId);
  const [openFolderId, setOpenFolderId] = useState<number | null>(null);
  const [filesPage, setFilesPage] = useState(1);
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
    null,
  );
  const { data: filesResponse, isPending: filesPending } = useFolderFiles(
    openFolderId ?? undefined,
    filesPage,
    10,
  );

  const { mutate: cancelAppointment, isPending: isCancelPending } =
    useCancelAppointment();
  const { mutate: completeAppointment, isPending: isCompletePending } =
    useCompleteAppointment();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!numericId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            {t("appointments.invalid_id", "Invalid appointment id")}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            {t("appointments.not_found", "Appointment not found")}
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = data.patient?.user;
  const initials =
    user?.full_name
      ?.split(" ")
      .slice(0, 2)
      .map((p) => p[0])
      .join("") || "?";

  const sharedFolders = data.shared_folders ?? [];
  const files = filesResponse?.results ?? [];
  console.log("Rendering appointment detail for ID:", numericId, sharedFolders);
  const isActionPending = isCancelPending || isCompletePending;

  const resolveFileUrl = (fileUrl: string) => {
    try {
      const url = new URL(fileUrl, window.location.origin);
      if (window.location.protocol === "https:" && url.protocol === "http:") {
        url.protocol = "https:";
      }
      return url.toString();
    } catch {
      return fileUrl;
    }
  };

  const handleDownload = async (file: FolderFile) => {
    setDownloadingFileId(file.id);
    try {
      const downloadUrl = resolveFileUrl(file.file);
      const downloadOrigin = new URL(downloadUrl).origin;
      const sameOrigin = downloadOrigin === window.location.origin;

      if (!sameOrigin) {
        const opened = window.open(downloadUrl, "_blank", "noopener");
        if (!opened) {
          throw new Error("Popup blocked. Please allow popups for this site.");
        }
        return;
      }

      const response = await fetch(downloadUrl, { credentials: "include" });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name || "file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Download failed";
      toast.error(message);
    } finally {
      setDownloadingFileId(null);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            {t("appointments.go_back", "Back")}
          </Button>
          <h1 className="text-xl font-semibold">
            {t("appointments.detail_title", "Appointment Details")}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={isActionPending}
            onClick={() => completeAppointment(data.id)}
          >
            {t("appointments.complete", "Complete")}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={isActionPending}
            onClick={() => cancelAppointment(data.id)}
          >
            {t("appointments.cancel", "Cancel")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("appointments.patient_info", "Patient Info")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="font-medium">{user?.full_name || "-"}</div>
              <div className="text-sm text-muted-foreground">
                {t("appointments.age", "Age")}: {calculateAge(user?.dob) ?? "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("appointments.appointment_info", "Appointment Info")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <InfoRow
            label={t("appointments.date_time", "Date & Time")}
            value={formatDateTime(data.datetime)}
          />
          <InfoRow
            label={t("appointments.status", "Status")}
            value={<StatusBadge status={data.status} />}
          />
          <InfoRow
            label={t("appointments.fees", "Fees")}
            value={`$${data.fees}`}
          />
          <InfoRow label={t("appointments.id", "ID")} value={data.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("appointments.shared_folders", "Shared folders")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sharedFolders.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {t(
                "appointments.shared_folders_empty",
                "No shared folders for this appointment",
              )}
            </div>
          ) : (
            <div className="divide-y divide-border rounded-md border">
              {sharedFolders.map((folder) => (
                <div
                  key={folder.folder?.id ?? folder.id}
                  className="p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">
                      {folder?.folder?.name}
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
                      onClick={() => {
                        setFilesPage(1);
                        setOpenFolderId((prev) =>
                          prev === folder.folder?.id
                            ? null
                            : folder.folder?.id || null,
                        );
                      }}
                    >
                      {openFolderId === folder.folder?.id
                        ? t("appointments.hide_files", "Hide files")
                        : t("appointments.view_files", "View files")}
                    </Button>
                  </div>

                  {openFolderId === folder.folder?.id && (
                    <div className="rounded-md border border-dashed p-3">
                      {filesPending ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Spinner className="size-4" />
                          {t("appointments.loading_files", "Loading files...")}
                        </div>
                      ) : files.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          {t(
                            "appointments.no_files",
                            "No files in this folder",
                          )}
                        </div>
                      ) : (
                        <>
                          <ul className="space-y-2">
                            {files.map((file) => (
                              <li
                                key={file.id}
                                className="flex items-center justify-between gap-3 text-sm"
                              >
                                <span className="truncate">{file.name}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  disabled={downloadingFileId === file.id}
                                  onClick={() => handleDownload(file)}
                                >
                                  {downloadingFileId === file.id ? (
                                    <div className="flex items-center gap-1">
                                      <Spinner className="size-3" />
                                      {t(
                                        "appointments.downloading",
                                        "Downloading...",
                                      )}
                                    </div>
                                  ) : (
                                    t("appointments.open_file", "Open")
                                  )}
                                </Button>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                            <span>
                              {t(
                                "appointments.page",
                                "Page {{page}} of {{total}}",
                                {
                                  page: filesResponse?.current ?? 1,
                                  total: filesResponse?.total_pages ?? 1,
                                },
                              )}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={
                                  !filesResponse ||
                                  filesResponse.previous === -1
                                }
                                onClick={() =>
                                  setFilesPage((p) => Math.max(1, p - 1))
                                }
                              >
                                {t("appointments.prev", "Prev")}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={
                                  !filesResponse || filesResponse.next === -1
                                }
                                onClick={() => setFilesPage((p) => p + 1)}
                              >
                                {t("appointments.next", "Next")}
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
