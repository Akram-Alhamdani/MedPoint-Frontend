import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
  IconCurrencyDollar,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "react-i18next";

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  const config: Record<string, { icon: JSX.Element; label: string }> = {
    PE: {
      icon: <IconLoader />,
      label: t("appointments.status_pending", "Pending"),
    },
    PA: {
      icon: <IconCurrencyDollar className="text-amber-500" />,
      label: t("appointments.status_paid", "Paid"),
    },
    D: {
      icon: <IconCircleCheckFilled className="fill-green-500" />,
      label: t("appointments.status_done", "Done"),
    },
    M: {
      icon: <IconAlertTriangle className="text-orange-500" />,
      label: t("appointments.status_missed", "Missed"),
    },
    C: {
      icon: <IconCircleXFilled className="fill-red-500" />,
      label: t("appointments.status_cancelled", "Cancelled"),
    },
  };

  const current = config[status] ?? config["PE"];

  return (
    <Badge variant="outline" className="px-1.5 gap-1">
      {current.icon}
      {current.label}
    </Badge>
  );
}
