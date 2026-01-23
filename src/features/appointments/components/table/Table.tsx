import {
  flexRender,
  getCoreRowModel,
  useReactTable,
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react";
import type { Appointment } from "../../types";
import { appointmentColumns } from "./Columns";
import { useTranslation } from "react-i18next";

type Props = {
  data: Appointment[];
  isActionPending: boolean;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
};

export default function AppointmentsTable({
  data,
  isActionPending,
  onComplete,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const table = useReactTable({
    data,
    columns: appointmentColumns(isActionPending, onComplete, onCancel),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">
                {t("appointments.customize_columns", "Customize Columns")}
              </span>
              <span className="lg:hidden">
                {t("appointments.columns", "Columns")}
              </span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(Boolean(value))
                  }
                >
                  {typeof column.columnDef.header === "string"
                    ? t(
                        `appointments.${column.columnDef.header.toLowerCase()}`,
                        column.columnDef.header,
                      )
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t(
                      "appointments.no_appointments_found",
                      "No appointments found",
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
