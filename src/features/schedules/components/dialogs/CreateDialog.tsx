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

function CreateDialog({
  createDialogOpen,
  setCreateDialogOpen,
  form,
  setForm,
  onScheduleCreate,
}: {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  form: CreateSchedulePayload;
  setForm: Dispatch<SetStateAction<CreateSchedulePayload>>;
  onScheduleCreate?: (payload: CreateSchedulePayload) => void;
}) {
  const { t, i18n } = useTranslation();
  const isCreateValid =
    !!form.day && !!form.start_time && !!form.end_time && form.max_patients > 0;

  const dayOptions = [
    { value: "SAT", label: t("schedules.days.sat", "Saturday") },
    { value: "SUN", label: t("schedules.days.sun", "Sunday") },
    { value: "MON", label: t("schedules.days.mon", "Monday") },
    { value: "TUE", label: t("schedules.days.tue", "Tuesday") },
    { value: "WED", label: t("schedules.days.wed", "Wednesday") },
    { value: "THU", label: t("schedules.days.thu", "Thursday") },
    { value: "FRI", label: t("schedules.days.fri", "Friday") },
  ];
  const isRTL =
    i18n.language === "ar" ||
    (typeof document !== "undefined" && document.dir === "rtl");
  return (
    <Dialog
      open={createDialogOpen}
      onOpenChange={(open) => {
        setCreateDialogOpen(open);
        if (!open)
          setForm({
            day: "",
            start_time: "",
            end_time: "",
            max_patients: 1,
          });
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right mt-6" : ""}>
            {t("schedules.create_dialog.title", "Create schedule")}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : ""}>
            {t(
              "schedules.create_dialog.description",
              "Set the day, working hours, and maximum patients for this schedule.",
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          className={isRTL ? "space-y-5 text-right" : "space-y-5"}
          onSubmit={(e) => {
            e.preventDefault();
            if (!isCreateValid) return;
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
            onScheduleCreate?.(form);
            setCreateDialogOpen(false);
            setForm({
              day: "",
              start_time: "",
              end_time: "",
              max_patients: 1,
            });
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="day" className="mb-2">
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
              <SelectTrigger id="day">
                <SelectValue
                  placeholder={t(
                    "schedules.create_dialog.select_day",
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
              <Label htmlFor="start_time" className="mb-2">
                {t("schedules.start_time", "Start time")}
              </Label>
              <Input
                id="start_time"
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
              <Label htmlFor="end_time" className="mb-2">
                {t("schedules.end_time", "End time")}
              </Label>
              <Input
                id="end_time"
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
            <Label htmlFor="max_patients" className="mb-2">
              {t("schedules.max_patients", "Max patients")}
            </Label>
            <Input
              id="max_patients"
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
              onClick={() => setCreateDialogOpen(false)}
            >
              {t("schedules.create_dialog.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={!isCreateValid}
            >
              {t("schedules.create_dialog.create", "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDialog;
