import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";

type Props = {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function AppointmentsTablePagination({
  pageNumber,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4">
      <div className="hidden flex-1 text-sm text-muted-foreground lg:flex" />

      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label>Rows per page</Label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
              onPageChange(1); // correct reset
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm">
          Page {pageNumber} of {totalPages}
        </div>

        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onPageChange(1)}
            disabled={pageNumber === 1}
          >
            <IconChevronsLeft />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => onPageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            <IconChevronLeft />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => onPageChange(pageNumber + 1)}
            disabled={pageNumber === totalPages}
          >
            <IconChevronRight />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            disabled={pageNumber === totalPages}
          >
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
