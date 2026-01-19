import { Button } from "@/shared/components/ui/button";
import { Check, X } from "lucide-react";
import type { Appointment } from "../../types";

type Props = {
  appointment: Appointment;
  disabled: boolean;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
};

export default function RowActions({
  appointment,
  disabled,
  onComplete,
  onCancel,
}: Props) {
  if (appointment.status !== "PE") return null;

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant="secondary"
        disabled={disabled}
        onClick={() => onComplete(appointment.id)}
      >
        <Check />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        disabled={disabled}
        onClick={() => onCancel(appointment.id)}
      >
        <X />
      </Button>
    </div>
  );
}
