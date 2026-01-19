export interface Schedule {
  id: number;
  start_time: string;
  end_time: string;
  max_patients: number;
  day: string;
}

export type CreateSchedulePayload = {
  day: "SAT" | "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "";
  start_time: string;
  end_time: string;
  max_patients: number;
};

export type SchedulePayload = {
  day: "SAT" | "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "";
  start_time: string;
  end_time: string;
  max_patients: number;
};

export interface ScheduleResponse {
  count: number;
  current: number;
  next: number;
  previous: number;
  page_size: number;
  results: Schedule[];
  total_pages: number;
}
