import type { Dispatch, SetStateAction } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { CreateSchedulePayload } from "../../types";

function UpdateDialog({
  editDialogOpen,
  setEditDialogOpen,
  editId,
  setEditId,
  form,
  setForm,
  onScheduleUpdate,
}: {
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  editId: number | null;
  setEditId: (id: number | null) => void;
  form: CreateSchedulePayload;
  setForm: Dispatch<SetStateAction<CreateSchedulePayload>>;
  onScheduleUpdate?: (id: number, data: CreateSchedulePayload) => void;
}) {
  const { t, i18n } = useTranslation();
  const normalizeTime = (time: string) =>
    time.length === 5 ? `${time}:00` : time;

  const dayOptions = [
    { value: "SAT", label: t("schedules.days.sat", "Saturday") },
    { value: "SUN", label: t("schedules.days.sun", "Sunday") },
    { value: "MON", label: t("schedules.days.mon", "Monday") },
    { value: "TUE", label: t("schedules.days.tue", "Tuesday") },
    { value: "WED", label: t("schedules.days.wed", "Wednesday") },
    { value: "THU", label: t("schedules.days.thu", "Thursday") },
    { value: "FRI", label: t("schedules.days.fri", "Friday") },
  ];
  const isEditValid =
    !!form.day && !!form.start_time && !!form.end_time && form.max_patients > 0;
  const isRTL =
    i18n.language === "ar" ||
    (typeof document !== "undefined" && document.dir === "rtl");
  return (
    <Dialog
      open={editDialogOpen}
      onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) {
          setEditId(null);
          setForm({
            day: "",
            start_time: "",
            end_time: "",
            max_patients: 1,
          });
        }
      }}
    >
      <DialogContent>
        <DialogHeader className={isRTL ? "text-right" : ""}>
          <DialogTitle className={isRTL ? "text-right mt-6" : ""}>
            {t("schedules.update_dialog.title", "Update schedule")}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : ""}>
            {t(
              "schedules.update_dialog.description",
              "Modify day, time range, or max patients for this schedule.",
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          className={isRTL ? "space-y-5 text-right" : "space-y-5"}
          onSubmit={(e) => {
            e.preventDefault();
            if (!isEditValid || editId == null) return;
            // Check if start_time < end_time
            const start = form.start_time;
            const end = form.end_time;
            if (start && end && start >= end) {
              toast.error(
                t(
                  "schedules.create_dialog.invalid_time",
                  "Start time must be less than end time.",
                ),
              );
              return;
            }
            onScheduleUpdate?.(editId, {
              ...form,
              start_time: normalizeTime(form.start_time),
              end_time: normalizeTime(form.end_time),
            });
            setEditDialogOpen(false);
            setEditId(null);
            setForm({
              day: "",
              start_time: "",
              end_time: "",
              max_patients: 1,
            });
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="edit-day" className="mb-2">
              {t("schedules.day", "Day")}
            </Label>
            <Select
              value={form.day}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  day: value as CreateSchedulePayload["day"],
                }))
              }
            >
              <SelectTrigger id="edit-day">
                <SelectValue
                  placeholder={t(
                    "schedules.update_dialog.select_day",
                    "Select a day",
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className={
              isRTL
                ? "grid grid-cols-1 gap-3 sm:grid-cols-2 text-right"
                : "grid grid-cols-1 gap-3 sm:grid-cols-2"
            }
          >
            <div className="space-y-1">
              <Label htmlFor="edit-start_time" className="mb-2">
                {t("schedules.start_time", "Start time")}
              </Label>
              <Input
                id="edit-start_time"
                type="time"
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
                {t("schedules.end_time", "End time")}
              </Label>
              <Input
                id="edit-end_time"
                type="time"
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
            <Label htmlFor="edit-max_patients" className="mb-2">
              {t("schedules.max_patients", "Max patients")}
            </Label>
            <Input
              id="edit-max_patients"
              type="number"
              min={1}
              value={form.max_patients}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  max_patients: Number(e.target.value) || 0,
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
              {t("schedules.update_dialog.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={!isEditValid || editId == null}
            >
              {t("schedules.update_dialog.save", "Save changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default UpdateDialog;
