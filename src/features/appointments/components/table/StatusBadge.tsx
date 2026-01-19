// appointments/components/table/StatusBadge.tsx
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
} from "@tabler/icons-react";
import { Badge } from "@/shared/components/ui/badge";

export default function StatusBadge({ status }: { status: string }) {
  if (status === "PE") {
    return (
      <Badge variant="outline" className="px-1.5">
        <IconLoader />
        Pending
      </Badge>
    );
  }

  if (status === "D") {
    return (
      <Badge variant="outline" className="px-1.5">
        <IconCircleCheckFilled className="fill-green-500" />
        Done
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="px-1.5">
      <IconCircleXFilled className="fill-red-500" />
      Cancelled
    </Badge>
  );
}
