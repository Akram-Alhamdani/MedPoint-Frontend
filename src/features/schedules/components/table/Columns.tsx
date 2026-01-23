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

type BuildColumnsArgsWithT = BuildColumnsArgs & { t: (key: string) => string };
const buildColumns = ({
  disableRowActions,
  onEdit,
  onDelete,
  t,
}: BuildColumnsArgsWithT): ColumnDef<Schedule>[] => [
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
          aria-label={t("schedules.select_all")}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("schedules.select_row")}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: t("schedules.day"),
    enableHiding: false,
    cell: ({ row }) => {
      const dayKey = row.original.day?.toLowerCase();
      // Map SAT/SUN/... to schedules.days.sat, etc.
      const dayMap: Record<string, string> = {
        sat: t("schedules.days.sat"),
        sun: t("schedules.days.sun"),
        mon: t("schedules.days.mon"),
        tue: t("schedules.days.tue"),
        wed: t("schedules.days.wed"),
        thu: t("schedules.days.thu"),
        fri: t("schedules.days.fri"),
      };
      return dayMap[dayKey] || row.original.day;
    },
  },
  {
    header: t("schedules.start_time"),
    enableHiding: false,
    cell: ({ row }) => formatTime(row.original.start_time),
  },
  {
    header: t("schedules.end_time"),
    enableHiding: false,
    cell: ({ row }) => formatTime(row.original.end_time),
  },
  {
    header: t("schedules.max_patients"),
    enableHiding: true,
    cell: ({ row }) => row.original.max_patients,
  },
  {
    header: t("schedules.actions"),
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
