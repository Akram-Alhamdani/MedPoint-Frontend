import type { Appointment } from "@/features/appointments/types";

export interface DashboardData {
  total_earnings: number;
  total_patients: number;
  total_appointments: number;
  patients_summary: { date: string; M: number; F: number }[];
  latest_appointments: Appointment[];
}

export interface CardData {
  title: string;
  value: string | number;
  description: string;
  caption: string;
}
export interface SectionCardsProps {
  cards: CardData[];
}
