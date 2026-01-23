import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";
import type { Schedule } from "../../types";
import { useTranslation } from "react-i18next";

type RowActionsProps = {
  row: { original: Schedule };
  disableRowActions: boolean;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: number) => void;
};

function RowActions({
  row,
  disableRowActions,
  onEdit,
  onDelete,
}: RowActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer"
        aria-label={t("schedules.edit_schedule")}
        disabled={disableRowActions}
        onClick={() => onEdit(row.original)}
      >
        <IconEdit className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer text-destructive hover:text-destructive"
        aria-label={t("schedules.delete_schedule")}
        disabled={disableRowActions}
        onClick={() => onDelete(row.original.id)}
      >
        <IconTrash className="size-4" />
      </Button>
    </div>
  );
}

export default RowActions;
