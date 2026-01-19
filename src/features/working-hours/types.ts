export interface WorkingHour {
  id: number | null;
  start_time: string;
  end_time: string;
  patient_left: number;
}

export type WorkingHourPayload = {
  start_time: string;
  end_time: string;
  patient_left: number;
};

export interface WorkingHoursResponse {
  count: number;
  current: number;
  next: number | null;
  previous: number | null;
  page_size: number;
  results: WorkingHour[];
  total_pages: number;
}
