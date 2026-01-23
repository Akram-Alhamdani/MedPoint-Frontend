import { useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  useWorkingHoursData,
  useWorkingHoursCreate,
  useWorkingHoursDelete,
  useWorkingHoursUpdate,
} from "../hooks";
import WorkingHoursTable from "../components/table/Table";
import Pagination from "@/shared/components/Pagination";
import CreateDialog from "../components/dialogs/CreateDialog";
import UpdateDialog from "../components/dialogs/UpdateDialog";
import DeleteDialog from "../components/dialogs/DeleteDialog";
import type { WorkingHourPayload, WorkingHour } from "../types";
import { extractDatePart, toInputDateTime } from "../utils";

const WorkingHoursPage = () => {
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form states
  const [form, setForm] = useState<WorkingHourPayload>({
    start_time: "",
    end_time: "",
    patient_left: 1,
  });

  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editStartDate, setEditStartDate] = useState<string | null>(null);
  const [editEndDate, setEditEndDate] = useState<string | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);

  // Schedule data fetching and mutations
  const { data, isPending } = useWorkingHoursData(pageNumber, pageSize);
  const { mutate: deleteWorkingHours } = useWorkingHoursDelete();
  const { mutate: createWorkingHour } = useWorkingHoursCreate();
  const { mutate: updateWorkingHour } = useWorkingHoursUpdate();

  const handleEditRequest = (workingHour: WorkingHour) => {
    setEditId(workingHour.id);
    setForm({
      start_time: toInputDateTime(workingHour.start_time),
      end_time: toInputDateTime(workingHour.end_time),
      patient_left: workingHour.patient_left,
    });
    setEditStartDate(extractDatePart(workingHour.start_time));
    setEditEndDate(extractDatePart(workingHour.end_time));
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
      <WorkingHoursTable
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
        onWorkingHourCreate={createWorkingHour}
      />
      <UpdateDialog
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        editId={editId}
        setEditId={setEditId}
        form={form}
        setForm={setForm}
        onWorkingHourUpdate={(id, data) => updateWorkingHour({ id: id, data })}
        baseStartDate={editStartDate}
        baseEndDate={editEndDate}
      />
      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        pendingDeleteIds={pendingDeleteIds}
        setPendingDeleteIds={setPendingDeleteIds}
        onWorkingHoursDelete={deleteWorkingHours}
      />
    </div>
  );
};

export default WorkingHoursPage;
