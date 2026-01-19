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
  const isCreateValid =
    !!form.day && !!form.start_time && !!form.end_time && form.max_patients > 0;

  const dayOptions = [
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
  ];
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
          <DialogTitle>Create schedule</DialogTitle>
          <DialogDescription>
            Set the day, working hours, and maximum patients for this schedule.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isCreateValid) return;
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
              Day
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
                <SelectValue placeholder="Select a day" />
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="start_time" className="mb-2">
                Start time
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
                End time
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
              Max patients
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={!isCreateValid}
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDialog;
