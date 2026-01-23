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

function CreateDialog({
  createDialogOpen,
  setCreateDialogOpen,
  form,
  setForm,
  onWorkingHourCreate,
}: {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  form: WorkingHourPayload;
  setForm: Dispatch<SetStateAction<WorkingHourPayload>>;
  onWorkingHourCreate?: (payload: WorkingHourPayload) => void;
}) {
  const { t, i18n } = useTranslation();
  const isCreateValid =
    !!form.start_time && !!form.end_time && form.patient_left > 0;
  const isRTL =
    i18n.language === "ar" ||
    (typeof document !== "undefined" && document.dir === "rtl");

  return (
    <Dialog
      open={createDialogOpen}
      onOpenChange={(open) => {
        setCreateDialogOpen(open);
        if (!open) {
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
            {t("working_hours.create_dialog.title", "Create working hour")}
          </DialogTitle>
          <DialogDescription className={`${isRTL ? "text-right" : ""} mb-3`}>
            {t(
              "working_hours.create_dialog.description",
              "Add a new working hour with date, time range, and patient capacity.",
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isCreateValid) return;

            const start = form.start_time;
            const end = form.end_time;
            if (start && end && start >= end) {
              toast.error(
                t(
                  "working_hours.create_dialog.invalid_time",
                  "Start time must be less than end time.",
                ),
              );
              return;
            }

            onWorkingHourCreate?.({
              ...form,
            });
            setCreateDialogOpen(false);
            setForm({
              start_time: "",
              end_time: "",
              patient_left: 1,
            });
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="start_time" className="mb-2">
                {t(
                  "working_hours.create_dialog.start_time",
                  "Start date & time",
                )}
              </Label>
              <Input
                id="start_time"
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
              <Label htmlFor="end_time" className="mb-2">
                {t("working_hours.create_dialog.end_time", "End date & time")}
              </Label>
              <Input
                id="end_time"
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
            <Label htmlFor="patient_left" className="mb-2">
              {t("working_hours.create_dialog.patient_left", "Patients left")}
            </Label>
            <Input
              id="patient_left"
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setCreateDialogOpen(false)}
            >
              {t("working_hours.create_dialog.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={!isCreateValid}
            >
              {t("working_hours.create_dialog.create", "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDialog;
