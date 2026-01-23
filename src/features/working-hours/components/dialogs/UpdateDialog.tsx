import { type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";

import type { WorkingHourPayload } from "../../types";

function UpdateDialog({
  editDialogOpen,
  setEditDialogOpen,
  editId,
  setEditId,
  form,
  setForm,
  onWorkingHourUpdate,
}: {
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  editId: number | null;
  setEditId: (id: number | null) => void;
  form: WorkingHourPayload;
  setForm: Dispatch<SetStateAction<WorkingHourPayload>>;
  onWorkingHourUpdate?: (id: number, data: WorkingHourPayload) => void;
  baseStartDate?: string | null;
  baseEndDate?: string | null;
}) {
  const { t, i18n } = useTranslation();
  const isRTL =
    i18n.language === "ar" ||
    (typeof document !== "undefined" && document.dir === "rtl");

  const isEditValid =
    !!form.start_time && !!form.end_time && form.patient_left > 0;

  return (
    <Dialog
      open={editDialogOpen}
      onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) {
          setEditId(null);
          setForm({
            start_time: "",
            end_time: "",
            patient_left: 1,
          });
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right mt-4" : ""}>
            {t("working_hours.update_dialog.title", "Update working hour")}
          </DialogTitle>
          <DialogDescription className={`${isRTL ? "text-right" : ""} mb-3`}>
            {t(
              "working_hours.update_dialog.description",
              "Modify date, time range, or patients left for this working hour.",
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isEditValid || editId == null) return;

            if (
              form.start_time &&
              form.end_time &&
              form.start_time >= form.end_time
            ) {
              toast.error(
                t(
                  "working_hours.create_dialog.invalid_time",
                  "Start time must be less than end time.",
                ),
              );
              return;
            }

            onWorkingHourUpdate?.(editId, {
              ...form,
            });
            setEditDialogOpen(false);
            setEditId(null);
            setForm({
              start_time: "",
              end_time: "",
              patient_left: 1,
            });
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="edit-start_time" className="mb-2">
                {t(
                  "working_hours.create_dialog.start_time",
                  "Start date & time",
                )}
              </Label>
              <Input
                id="edit-start_time"
                type="datetime-local"
                value={form.start_time}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    start_time: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-end_time" className="mb-2">
                {t("working_hours.create_dialog.end_time", "End date & time")}
              </Label>
              <Input
                id="edit-end_time"
                type="datetime-local"
                value={form.end_time}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    end_time: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-patient_left" className="mb-2">
              {t("working_hours.create_dialog.patient_left", "Patients left")}
            </Label>
            <Input
              id="edit-patient_left"
              type="number"
              min={1}
              value={form.patient_left}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  patient_left: Number(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setEditDialogOpen(false)}
            >
              {t("working_hours.update_dialog.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={!isEditValid || editId == null}
            >
              {t("working_hours.update_dialog.save", "Save changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default UpdateDialog;
