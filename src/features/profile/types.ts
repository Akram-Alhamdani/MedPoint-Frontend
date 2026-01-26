export type Gender = "M" | "F";

export type DoctorStatus = "A" | "U" | "S";

export interface Specialty {
  id: number;
  slug: string;
  name: string;
  name_ar?: string;
  icon?: string;
}

export interface SpecialtyListResponse {
  count: number;
  total_pages: number;
  current: number;
  page_size: number;
  previous: number;
  next: number;
  results: Specialty[];
}

export interface DoctorProfile {
  id: string;
  role: string;
  email: string;
  full_name: string;
  image: string | null;
  gender: Gender;
  dob: string | null;
  specialty: number | Specialty | null;
  fees: string;
  experience: string;
  education: string;
  about: string | null;
  status: DoctorStatus;
  address_line1: string;
  address_line2: string;
  is_verified: boolean;
  degree_document: string | null;
  rating: number;
  reviewers_num: number;
}

export type UpdateDoctorProfilePayload = Partial<{
  full_name: string;
  gender: Gender;
  dob: string | null;
  fees: string;
  experience: string;
  education: string;
  about: string | null;
  specialty: number | null;
  address_line1: string;
  address_line2: string;
  image: File | string | null;
}>;
