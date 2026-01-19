import { useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  useSchedulesData,
  useScheduleDelete,
  useScheduleCreate,
  useScheduleUpdate,
} from "../hooks";
import Pagination from "@/shared/components/Pagination";
import SchedulesTable from "../components/table/Table";
import CreateDialog from "../components/dialogs/CreateDialog";
import UpdateDialog from "../components/dialogs/UpdateDialog";
import DeleteDialog from "../components/dialogs/DeleteDialog";
import type { CreateSchedulePayload, Schedule } from "../types";

const SchedulesPage = () => {
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form states
  const [form, setForm] = useState<CreateSchedulePayload>({
    day: "",
    start_time: "",
    end_time: "",
    max_patients: 1,
  });

  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);

  // Schedule data fetching and mutations
  const { data, isPending } = useSchedulesData(pageNumber, pageSize);
  const { mutate: deleteSchedules } = useScheduleDelete();
  const { mutate: createSchedule } = useScheduleCreate();
  const { mutate: updateSchedule } = useScheduleUpdate();

  const handleEditRequest = (schedule: Schedule) => {
    setEditId(schedule.id);
    setForm({
      day: schedule.day as CreateSchedulePayload["day"],
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      max_patients: schedule.max_patients,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteRequest = (ids: number[]) => {
    setPendingDeleteIds(ids);
    setDeleteDialogOpen(true);
  };

  return isPending ? (
    <Spinner className="size-10 left-1/2 top-1/2 absolute -translate-x-1/2 -translate-y-1/2" />
  ) : (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <SchedulesTable
        data={data?.results ?? []}
        onCreateClick={() => setCreateDialogOpen(true)}
        onEditClick={handleEditRequest}
        onDeleteRequest={handleDeleteRequest}
      />
      <Pagination
        totalPages={data?.total_pages ?? 1}
        pageSize={pageSize}
        pageNumber={pageNumber}
        onPageChange={setPageNumber}
        onPageSizeChange={setPageSize}
      />

      <CreateDialog
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        form={form}
        setForm={setForm}
        onScheduleCreate={createSchedule}
      />
      <UpdateDialog
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        editId={editId}
        setEditId={setEditId}
        form={form}
        setForm={setForm}
        onScheduleUpdate={(id, data) => updateSchedule({ id: id, data })}
      />
      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        pendingDeleteIds={pendingDeleteIds}
        setPendingDeleteIds={setPendingDeleteIds}
        onSchedulesDelete={deleteSchedules}
      />
    </div>
  );
};

export default SchedulesPage;
