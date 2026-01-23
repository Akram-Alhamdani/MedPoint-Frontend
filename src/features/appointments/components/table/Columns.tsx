import type { ColumnDef } from "@tanstack/react-table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { calculateAge, formatDateTime } from "../../utils";
import type { Appointment } from "../../types";
import StatusBadge from "./StatusBadge";
import RowActions from "./RowActions";
import { useTranslation } from "react-i18next";

export const appointmentColumns = (
  isActionPending: boolean,
  onComplete: (id: number) => void,
  onCancel: (id: number) => void,
): ColumnDef<Appointment>[] => {
  const { t } = useTranslation();
  return [
    {
      header: t("appointments.patient"),
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original.patient?.user;
        const initials =
          user?.full_name
            ?.split(" ")
            .slice(0, 2)
            .map((p) => p[0])
            .join("") ?? "?";

        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.image} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {user?.full_name ?? "-"}
          </div>
        );
      },
    },
    {
      header: t("appointments.age"),
      cell: ({ row }) => calculateAge(row.original.patient?.user?.dob),
    },
    {
      header: t("appointments.date_time"),
      cell: ({ row }) => formatDateTime(row.original.datetime),
    },
    {
      header: t("appointments.status"),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: t("appointments.payment"),
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.status === "PE"
            ? t("appointments.online")
            : t("appointments.cash")}
        </span>
      ),
    },
    {
      header: t("appointments.fees"),
      enableHiding: true,
      cell: ({ row }) => `$${row.original.fees}`,
    },
    {
      id: "actions",
      header: t("appointments.actions"),
      enableHiding: false,
      cell: ({ row }) => (
        <RowActions
          appointment={row.original}
          disabled={isActionPending}
          onComplete={onComplete}
          onCancel={onCancel}
        />
      ),
    },
  ];
};
