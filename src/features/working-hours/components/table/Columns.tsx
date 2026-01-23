import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { WorkingHour } from "../../types";

import { formatDateTime } from "../../utils/formatDateTime";
import RowActions from "./RowActions";

type BuildColumnsArgs = {
  disableRowActions: boolean;
  onEdit: (workingHour: WorkingHour) => void;
  onDelete: (id: number) => void;
};

const buildColumns = ({
  disableRowActions,
  onEdit,
  onDelete,
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
      />
    ),
  },
];

export default buildColumns;
