import api from "@/shared/services/api";
import type { WorkingHourPayload } from "./types";

const getDoctorIdFromStorage = (): number | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const doctorId = parsed?.id;
    return doctorId;
  } catch (error) {
    console.error("Failed to parse doctor from localStorage", error);
    return null;
  }
};

// Working Hours
export const getWorkingHoursData = async (pageNumber = 1, pageSize = 5) =>
  await api.get(`/working-hours/?page=${pageNumber}&page_size=${pageSize}`);

export const createWorkingHour = async (payload: WorkingHourPayload) => {
  const doctorId = getDoctorIdFromStorage();
  await api.post(`/working-hours/`, {
    ...payload,
    doctor: doctorId,
  });
};

export const updateWorkingHour = async (
  id: number,
  payload: WorkingHourPayload,
) => {
  await api.patch(`/working-hours/${id}/`, payload);
};

export const deleteWorkingHours = async (ids: number[]) => {
  await api.delete(`/working-hours/bulk-delete/`, { data: { ids } });
};
