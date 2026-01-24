import { useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";

import AppointmentsTable from "../components/table/Table";
import CreateAppointmentDialog from "../components/dialogs/CreateAppointmentDialog";
import AppointmentsTablePagination from "@/shared/components/Pagination";

import {
  useAppointmentsData,
  useCompleteAppointment,
  useCancelAppointment,
} from "../hooks";

const AppointmentsPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data, isPending } = useAppointmentsData(pageNumber, pageSize);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { mutate: completeAppointment, isPending: isCompletePending } =
    useCompleteAppointment();

  const { mutate: cancelAppointment, isPending: isCancelPending } =
    useCancelAppointment();

  const isActionPending = isCompletePending || isCancelPending;

  if (isPending) {
    return (
      <Spinner className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2" />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <AppointmentsTable
        data={data?.results ?? []}
        isActionPending={isActionPending}
        onComplete={completeAppointment}
        onCancel={cancelAppointment}
        onCreateClick={() => setCreateDialogOpen(true)}
      />
      <AppointmentsTablePagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={data?.total_pages ?? 1}
        onPageChange={setPageNumber}
        onPageSizeChange={setPageSize}
      />
      <CreateAppointmentDialog
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
      />
    </div>
  );
};

export default AppointmentsPage;
