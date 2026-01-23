import { Button } from "@/shared/components/ui/button";
import { Check, X } from "lucide-react";
import type { Appointment } from "../../types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  if (appointment.status !== "PE") return null;

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant="secondary"
        disabled={disabled}
        onClick={() => onComplete(appointment.id)}
        title={t("appointments.complete")}
        aria-label={t("appointments.complete")}
      >
        <Check />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        disabled={disabled}
        onClick={() => onCancel(appointment.id)}
        title={t("appointments.cancel")}
        aria-label={t("appointments.cancel")}
      >
        <X />
      </Button>
    </div>
  );
}
