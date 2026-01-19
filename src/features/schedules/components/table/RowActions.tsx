import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";
import type { Schedule } from "../../types";

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
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer"
        aria-label="Edit schedule"
        disabled={disableRowActions}
        onClick={() => onEdit(row.original)}
      >
        <IconEdit className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer text-destructive hover:text-destructive"
        aria-label="Delete schedule"
        disabled={disableRowActions}
        onClick={() => onDelete(row.original.id)}
      >
        <IconTrash className="size-4" />
      </Button>
    </div>
  );
}

export default RowActions;
