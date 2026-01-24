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
import { useState, useEffect } from "react";

import { useManualCreateAppointment } from "../../hooks";
import { getWorkingHoursData } from "../../../working-hours/api";
import type { WorkingHour } from "../../../working-hours/types";
import { formatDateTime } from "@/features/working-hours/utils/formatDateTime";

interface CreateAppointmentDialogProps {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
}

const initialForm = {
  full_name: "",
  email: "",
  working_hours: "",
};

export default function CreateAppointmentDialog({
  createDialogOpen,
  setCreateDialogOpen,
}: CreateAppointmentDialogProps) {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const { mutate, isPending } = useManualCreateAppointment();
  const isRTL =
    i18n.language === "ar" ||
    (typeof document !== "undefined" && document.dir === "rtl");

  useEffect(() => {
    if (createDialogOpen) {
      getWorkingHoursData(1, 100)
        .then(({ data }) => setWorkingHours(data.results))
        .catch(() => setWorkingHours([]));
    }
  }, [createDialogOpen]);

  const isCreateValid =
    !!form.full_name && !!form.email && !!form.working_hours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCreateValid) return;
    mutate(
      {
        full_name: form.full_name,
        email: form.email,
        working_hours: Number(form.working_hours),
      },
      {
        onSuccess: () => {
          setCreateDialogOpen(false);
          setForm(initialForm);
        },
      },
    );
  };

  return (
    <Dialog
      open={createDialogOpen}
      onOpenChange={(open) => {
        setCreateDialogOpen(open);
        if (!open) setForm(initialForm);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right mt-6" : ""}>
            {t("appointments.create_dialog.title")}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : ""}>
            {t("appointments.create_dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <form
          className={isRTL ? "space-y-5 text-right" : "space-y-5"}
          onSubmit={handleSubmit}
        >
          <div className="space-y-1">
            <Label htmlFor="full_name" className="mb-2">
              {t("appointments.create_dialog.full_name")}
            </Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, full_name: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="mb-2">
              {t("appointments.create_dialog.email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="working_hour" className="mb-2">
              {t("appointments.create_dialog.working_hour")}
            </Label>
            <Select
              value={form.working_hours}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, working_hours: value }))
              }
            >
              <SelectTrigger id="working_hour">
                <SelectValue
                  placeholder={t(
                    "appointments.create_dialog.select_working_hour",
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {workingHours.map((wh) => (
                  <SelectItem key={wh.id} value={String(wh.id)}>
                    {formatDateTime(wh.start_time)} -{" "}
                    {formatDateTime(wh.end_time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setCreateDialogOpen(false)}
            >
              {t("appointments.create_dialog.cancel")}
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={!isCreateValid || isPending}
            >
              {t("appointments.create_dialog.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
