// src/features/dashboard/types.ts

export interface PatientUser {
  full_name: string;
  dob: string; // date of birth in ISO string
  image?: string;
}

export interface Patient {
  user: PatientUser;
}

export type AppointmentStatus = "P" | "C" | "D"; // P=Paid, C=Canceled, D=Done

export interface Appointment {
  id: number;
  patient: Patient;
  status: AppointmentStatus;
  datetime: string; // ISO string
  fees: number;
}

export interface DashboardData {
  total_earnings: number;
  total_patients: number;
  total_appointments: number;
  latest_appointments: Appointment[];
}

export interface CardData {
  title: string;
  value: string | number;
  description: string;
  trend: number;
  caption: string;
}
export interface SectionCardsProps {
  cards: CardData[];
}
