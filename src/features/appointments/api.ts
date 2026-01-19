import api from "@/shared/services/api";

// Get Appointments Data
export const getAppointmentsData = async (pageNumber = 1, pageSize = 5) =>
  await api.get(`/appointments/?page=${pageNumber}&page_size=${pageSize}`);

// Cancel Appointment
export const cancelAppointment = async (appointmentId: number) => {
  await api.post(`/appointments/${appointmentId}/cancel/`);
};

// Complete Appointment
export const completeAppointment = async (appointmentId: number) => {
  await api.post(`/appointments/${appointmentId}/complete/`);
};
