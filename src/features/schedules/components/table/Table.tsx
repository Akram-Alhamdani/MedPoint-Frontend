import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Table as TableInstance,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import {
  IconLayoutColumns,
  IconChevronDown,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";

import { Button } from "@/shared/components/ui/button";
import type { Schedule } from "../../types";
import buildColumns from "./Columns";

const SchedulesTable = ({
  data,
  onCreateClick,
  onEditClick,
  onDeleteRequest,
}: {
  data: Schedule[];
  onCreateClick?: () => void;
  onEditClick?: (schedule: Schedule) => void;
  onDeleteRequest?: (ids: number[]) => void;
}) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const selectionCount = Object.values(rowSelection).filter(Boolean).length;
  const disableRowActions: boolean = selectionCount > 1;
  const { t, i18n } = useTranslation();
  const LTR = i18n.dir() === "ltr";

  const columns: ColumnDef<Schedule>[] = useMemo(
    () =>
      buildColumns({
        disableRowActions,
        onEdit: (schedule) => onEditClick?.(schedule),
        onDelete: (id) => onDeleteRequest?.([id]),
        t,
      }),
    [disableRowActions, onDeleteRequest, onEditClick, t],
  );

  const table: TableInstance<Schedule> = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getRowId: (row) => String(row.id),
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  const selectedIds: number[] = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);
  const hasSelection = selectedIds.length > 0;

  return (
    <>
      <div className="flex justify-end gap-2">
        <div className={`${LTR ? "mr-auto" : "ml-auto"}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <span className="hidden lg:inline">
                  {t("schedules.actions_menu", "Actions")}
                </span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={LTR ? "start" : "end"} className="w-56">
              <DropdownMenuItem
                className="cursor-pointer"
                variant="destructive"
                disabled={!hasSelection}
                onClick={() => {
                  onDeleteRequest?.(selectedIds);
                }}
              >
                <IconTrash />
                <span>{t("schedules.delete_selected", "Delete Selected")}</span>
                {hasSelection ? (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {selectedIds.length} {t("schedules.selected", "selected")}
                  </span>
                ) : null}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <IconLayoutColumns />
              <span className="hidden lg:inline">
                {t("schedules.customize_columns", "Customize Columns")}
              </span>
              <span className="lg:hidden">
                {t("schedules.columns", "Columns")}
              </span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align={LTR ? "start" : "end"} className="w-56">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize cursor-pointer"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : t("schedules.column", "Column")}{" "}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" className="cursor-pointer" onClick={onCreateClick}>
          <IconPlus />
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <div className="px-6 py-2">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t("schedules.no_schedules_found", "No schedules found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default SchedulesTable;
