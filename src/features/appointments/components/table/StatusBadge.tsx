import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
} from "@tabler/icons-react";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "react-i18next";

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  if (status === "PE") {
    return (
      <Badge variant="outline" className="px-1.5">
        <IconLoader />
        {t("appointments.status_pending", "Pending")}
      </Badge>
    );
  }

  if (status === "D") {
    return (
      <Badge variant="outline" className="px-1.5 ">
        <IconCircleCheckFilled className="fill-green-500" />
        {t("appointments.status_done", "Done")}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="px-1.5">
      <IconCircleXFilled className="fill-red-500" />
      {t("appointments.status_cancelled", "Cancelled")}
    </Badge>
  );
}
