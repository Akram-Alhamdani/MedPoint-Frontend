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

export const appointmentColumns = (
  isActionPending: boolean,
  onComplete: (id: number) => void,
  onCancel: (id: number) => void
): ColumnDef<Appointment>[] => [
  {
    header: "Patient",
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
    header: "Age",
    cell: ({ row }) => calculateAge(row.original.patient?.user?.dob),
  },
  {
    header: "Date & Time",
    cell: ({ row }) => formatDateTime(row.original.datetime),
  },
  {
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    header: "Payment",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.status === "PE" ? "Online" : "Cash"}
      </span>
    ),
  },
  {
    header: "Fees",
    enableHiding: true,
    cell: ({ row }) => `$${row.original.fees}`,
  },
  {
    id: "actions",
    header: "Actions",
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
