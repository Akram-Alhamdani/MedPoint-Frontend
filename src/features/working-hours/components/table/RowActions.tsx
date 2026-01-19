import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";
import type { WorkingHour } from "../../types";

type RowActionsProps = {
  row: { original: WorkingHour };
  disableRowActions: boolean;
  onEdit: (workingHour: WorkingHour) => void;
  onDelete: (id: number) => void;
};

function RowActions({
  row,
  disableRowActions,
  onEdit,
  onDelete,
}: RowActionsProps) {
  const isInvalidId = row.original.id == null;

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer"
        aria-label="Edit working hour"
        disabled={disableRowActions || isInvalidId}
        onClick={() => onEdit(row.original)}
      >
        <IconEdit className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer text-destructive hover:text-destructive"
        aria-label="Delete working hour"
        disabled={disableRowActions || isInvalidId}
        onClick={() => {
          if (row.original.id != null) onDelete(row.original.id);
        }}
      >
        <IconTrash className="size-4" />
      </Button>
    </div>
  );
}

export default RowActions;
