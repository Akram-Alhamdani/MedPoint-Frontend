import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { Schedule } from "../../types";
import { formatTime } from "../../utils";
import RowActions from "./RowActions";

type BuildColumnsArgs = {
  disableRowActions: boolean;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: number) => void;
};

const buildColumns = ({
  disableRowActions,
  onEdit,
  onDelete,
}: BuildColumnsArgs): ColumnDef<Schedule>[] => [
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
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Day",
    enableHiding: false,
    cell: ({ row }) => row.original.day,
  },
  {
    header: "Start Time",
    enableHiding: false,
    cell: ({ row }) => formatTime(row.original.start_time),
  },
  {
    header: "End Time",
    enableHiding: false,
    cell: ({ row }) => formatTime(row.original.end_time),
  },
  {
    header: "Max Patients",
    enableHiding: true,
    cell: ({ row }) => row.original.max_patients,
  },
  {
    header: "Actions",
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
