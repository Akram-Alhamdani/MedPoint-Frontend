import api from "@/shared/services/api";

// Get Appointments Data
export const getAppointmentsData = async (pageNumber = 1, pageSize = 5) =>
  await api.get(`/appointments/?page=${pageNumber}&page_size=${pageSize}`);

export const getAppointmentDetail = async (id: number) =>
  await api.get(`/appointments/${id}/`);

export const getFolderFiles = async (folderId: number, page = 1, pageSize = 10) =>
  await api.get(`/folders/${folderId}/files?page=${page}&page_size=${pageSize}`);

export const getSharedFolders = async (
  pageNumber = 1,
  pageSize = 10,
  sharingType?: string,
) => {
  const params = new URLSearchParams({
    page: String(pageNumber),
    page_size: String(pageSize),
  });
  if (sharingType) params.set("sharing_type", sharingType);
  return api.get(`/shared-folders/?${params.toString()}`);
};

// Cancel Appointment
export const cancelAppointment = async (appointmentId: number) => {
  await api.post(`/appointments/${appointmentId}/cancel/`);
};

// Complete Appointment
export const completeAppointment = async (appointmentId: number) => {
  await api.post(`/appointments/${appointmentId}/complete/`);
};

// Manual Create Appointment by Doctor

export interface ManualCreateAppointmentPayload {
  full_name: string;
  email: string;
  working_hours: number;
}

export const manualCreateAppointment = async (
  payload: ManualCreateAppointmentPayload,
) => {
  return api.post("/appointments/manual-create-by-doctor/", payload);
};
