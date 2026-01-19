export interface PatientUser {
  full_name: string;
  dob: string; // date of birth in ISO string
  image?: string;
}

export interface Patient {
  user: PatientUser;
}

export type AppointmentStatus = "PE" | "C" | "D"; // PE=Pending, C=Canceled, D=Done

export interface Appointment {
  id: number;
  patient: Patient;
  status: AppointmentStatus;
  datetime: string; // ISO string
  fees: number;
}
export interface AppointmentResponse {
  count: number;
  current: number;
  next: number;
  previous: number;
  page_size: number;
  results: Appointment[];
  total_pages: number;
}
