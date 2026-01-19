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
  const normalizeTime = (time: string) =>
    time.length === 5 ? `${time}:00` : time;

  const dayOptions = [
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
  ];

  const isEditValid =
    !!form.day && !!form.start_time && !!form.end_time && form.max_patients > 0;
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
        <DialogHeader>
          <DialogTitle>Update schedule</DialogTitle>
          <DialogDescription>
            Modify day, time range, or max patients for this schedule.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isEditValid || editId == null) return;
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
              <SelectTrigger id="edit-day">
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
              <Label htmlFor="edit-start_time" className="mb-2">
                Start time
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
                End time
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
              Max patients
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={!isEditValid || editId == null}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default UpdateDialog;
