import { Button } from "@/shared/components/ui/button";
import { Check, Eye, X } from "lucide-react";
import type { Appointment } from "../../types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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

  return (
    <div className="flex gap-2">
      <Button
        asChild
        size="icon"
        variant="ghost"
        title={t("appointments.view_details", "View details")}
        aria-label={t("appointments.view_details", "View details")}
      >
        <Link to={`/doctor/dashboard/appointments/${appointment.id}`}>
          <Eye />
        </Link>
      </Button>
      {appointment.status === "PE" && (
        <>
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
        </>
      )}
    </div>
  );
}
