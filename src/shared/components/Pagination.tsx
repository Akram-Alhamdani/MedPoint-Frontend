import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { SelectContent } from "@/shared/components/ui/select";
import { SelectItem } from "@/shared/components/ui/select";
import { SelectTrigger } from "@/shared/components/ui/select";
import { SelectValue } from "@/shared/components/ui/select";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { IconChevronsLeft } from "@tabler/icons-react";
import { IconChevronsRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const isRTL =
    i18n.language === "ar" ||
    (typeof document !== "undefined" && document.dir === "rtl");

  return (
    <div className="flex items-center justify-between px-4">
      <div className="hidden flex-1 text-sm text-muted-foreground lg:flex" />
      <div
        className={`flex w-full items-center gap-8 lg:w-fit${isRTL ? " flex-row-reverse" : ""}`}
      >
        <div
          className={`hidden items-center gap-2 lg:flex${isRTL ? " flex-row-reverse" : ""}`}
        >
          <Label>{t("pagination.rows_per_page")}</Label>
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
          {t("pagination.page", { page: pageNumber, total: totalPages })}
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onPageChange(1)}
            disabled={pageNumber === 1}
          >
            {isRTL ? <IconChevronsRight /> : <IconChevronsLeft />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onPageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            {isRTL ? <IconChevronRight /> : <IconChevronLeft />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onPageChange(pageNumber + 1)}
            disabled={pageNumber === totalPages}
          >
            {isRTL ? <IconChevronLeft /> : <IconChevronRight />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            disabled={pageNumber === totalPages}
          >
            {isRTL ? <IconChevronsLeft /> : <IconChevronsRight />}
          </Button>
        </div>
      </div>
    </div>
  );
}
