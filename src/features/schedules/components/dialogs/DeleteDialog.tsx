import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

function DeleteDialog({
  deleteDialogOpen,
  setDeleteDialogOpen,
  pendingDeleteIds,
  setPendingDeleteIds,
  onSchedulesDelete,
}: {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  pendingDeleteIds: number[];
  setPendingDeleteIds: (ids: number[]) => void;
  onSchedulesDelete?: (ids: number[]) => void;
}) {
  return (
    <Dialog
      open={deleteDialogOpen}
      onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) setPendingDeleteIds([]);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete selected schedules?</DialogTitle>
          <DialogDescription>
            This will remove {pendingDeleteIds.length} schedule
            {pendingDeleteIds.length === 1 ? "" : "s"}. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() => {
              onSchedulesDelete?.(pendingDeleteIds);
              setDeleteDialogOpen(false);
              setPendingDeleteIds([]);
            }}
            disabled={pendingDeleteIds.length === 0}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
