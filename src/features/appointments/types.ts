export interface PatientUser {
  full_name: string;
  dob: string; // date of birth in ISO string
  image?: string;
}

export interface Patient {
  user: PatientUser;
}

export interface Folder {
  id: number;
  name: string;
  description?: string | null;
  appointment?: number;
  doctor?: string;
  patient?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SharedFolder {
  id?: number;
  folder: Folder;
  sharing_type?: string;
}

export interface FolderFile {
  id: number;
  name: string;
  file: string;
  created_at?: string;
  updated_at?: string;
}

export interface FolderFilesResponse {
  count: number;
  total_pages: number;
  current: number;
  page_size: number;
  previous: number;
  next: number;
  results: FolderFile[];
}

export interface SharedFoldersResponse {
  count: number;
  total_pages: number;
  current: number;
  page_size: number;
  previous: number;
  next: number;
  results: SharedFolder[];
}

export type AppointmentStatus = "PE" | "PA" | "D" | "M" | "C"; // PE=Pending, PA=Paid, D=Done, M=Missed, C=Cancelled

export interface Appointment {
  id: number;
  patient: Patient;
  status: AppointmentStatus;
  datetime: string; // ISO string
  fees: number;
  shared_folders?: SharedFolder[];
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
