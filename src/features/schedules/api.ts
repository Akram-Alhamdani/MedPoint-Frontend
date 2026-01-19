import api from "@/shared/services/api";
import type { SchedulePayload } from "./types";

// Get Schedules Data
export const getSchedulesData = async (pageNumber = 1, pageSize = 5) =>
  await api.get(`/schedules/?page=${pageNumber}&page_size=${pageSize}`);

// Delete Schedule
export const deleteSchedule = async (scheduleIds: number[]) => {
  await api.delete(`/schedules/bulk-delete/`, { data: { ids: scheduleIds } });
};

// Create Schedule

export const createSchedule = async (scheduleData: SchedulePayload) => {
  await api.post(`/schedules/`, scheduleData);
};

// Update Schedule
export const updateSchedule = async (
  scheduleId: number,
  scheduleData: SchedulePayload
) => {
  await api.patch(`/schedules/${scheduleId}/`, scheduleData);
};
