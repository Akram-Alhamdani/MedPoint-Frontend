import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const isRTL =
    i18n.language === "ar" ||
    (typeof document !== "undefined" && document.dir === "rtl");
  return (
    <Dialog
      open={deleteDialogOpen}
      onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) setPendingDeleteIds([]);
      }}
    >
      <DialogContent>
        <DialogHeader className={isRTL ? "text-right" : ""}>
          <DialogTitle className={isRTL ? "text-right mt-6" : ""}>
            {t("schedules.delete_dialog.title", "Delete selected schedules?")}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : ""}>
            {t("schedules.delete_dialog.description", {
              count: pendingDeleteIds.length,
              plural: pendingDeleteIds.length !== 1,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
          >
            {t("schedules.delete_dialog.cancel", "Cancel")}
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
            {t("schedules.delete_dialog.delete", "Delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
