import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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
import { buildUtcDateTime } from "../../utils";

function UpdateDialog({
  editDialogOpen,
  setEditDialogOpen,
  editId,
  setEditId,
  form,
  setForm,
  onWorkingHourUpdate,
  baseStartDate,
  baseEndDate,
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
  const normalizeTime = (time: string) =>
    time.length === 5 ? `${time}:00` : time;

  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(baseStartDate || today);
  const [endDate, setEndDate] = useState(baseEndDate || today);

  useEffect(() => {
    setStartDate(baseStartDate || today);
    setEndDate(baseEndDate || today);
  }, [baseStartDate, baseEndDate, editDialogOpen, today]);

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
          <DialogTitle>Update working hour</DialogTitle>
          <DialogDescription>
            Modify time range, or patients left for this working hour.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isEditValid || editId == null) return;

            const startIso = buildUtcDateTime(
              startDate,
              normalizeTime(form.start_time),
            );
            const endIso = buildUtcDateTime(
              endDate,
              normalizeTime(form.end_time),
            );
            const now = new Date();

            if (new Date(startIso) < now || new Date(endIso) < now) {
              toast.error("Start and end times must be in the future.");
              return;
            }

            onWorkingHourUpdate?.(editId, {
              ...form,
              start_time: startIso,
              end_time: endIso,
            });
            setEditDialogOpen(false);
            setEditId(null);
            setForm({
              start_time: "",
              end_time: "",
              patient_left: 1,
            });
            setStartDate(today);
            setEndDate(today);
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="edit-start_date" className="mb-2">
                Start date
              </Label>
              <Input
                id="edit-start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-end_date" className="mb-2">
                End date
              </Label>
              <Input
                id="edit-end_date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
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
            <Label htmlFor="edit-patient_left" className="mb-2">
              Patients left
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
