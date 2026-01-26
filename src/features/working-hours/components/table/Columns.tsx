import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { WorkingHour } from "../../types";

import { formatDateTime } from "../../utils/formatDateTime";
import RowActions from "./RowActions";

type BuildColumnsArgs = {
  disableRowActions: boolean;
  onEdit: (workingHour: WorkingHour) => void;
  onDelete: (id: number) => void;
  onCancel: (id: number) => void;
  isCancelPending?: boolean;
};

const buildColumns = ({
  disableRowActions,
  onEdit,
  onDelete,
  onCancel,
  isCancelPending,
  t,
}: BuildColumnsArgs & {
  t: (key: string) => string;
}): ColumnDef<WorkingHour>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center ">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("working_hours.select_all")}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("working_hours.select_row")}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: t("working_hours.start_time"),
    enableHiding: false,
    cell: ({ row }) => formatDateTime(row.original.start_time),
  },
  {
    header: t("working_hours.end_time"),
    enableHiding: false,
    cell: ({ row }) => formatDateTime(row.original.end_time),
  },
  {
    header: t("working_hours.status"),
    enableHiding: true,
    cell: ({ row }) => {
      const status = row.original.status;
      if (!status) return "-";

      const labelMap: Record<string, string> = {
        C: t("working_hours.status_cancelled", "Cancelled"),
        D: t("working_hours.status_done", "Done"),
        U: t("working_hours.status_upcoming", "Upcoming"),
      };

      const colorMap: Record<string, string> = {
        C: "bg-destructive/10 text-destructive",
        D: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
        U: "bg-primary/10 text-primary",
      };

      return (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[status] || "bg-muted text-foreground"}`}
        >
          {labelMap[status] ?? status}
        </span>
      );
    },
  },
  {
    header: t("working_hours.patient_left"),
    enableHiding: true,
    cell: ({ row }) => row.original.patient_left,
  },
  {
    header: t("working_hours.actions"),
    enableHiding: false,
    cell: ({ row }) => (
      <RowActions
        row={row}
        disableRowActions={disableRowActions}
        onEdit={onEdit}
        onDelete={onDelete}
        onCancel={onCancel}
        isCancelPending={isCancelPending}
      />
    ),
  },
];

export default buildColumns;
