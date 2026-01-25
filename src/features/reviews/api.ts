import api from "@/shared/services/api";

export interface User {
  id: string;
  role: string;
  email: string;
  image: string | undefined;
  full_name: string;
  gender: string;
  dob: string | null;
  is_verified_doctor: boolean;
}

export interface Patient {
  user: User;
}

export interface ReviewComment {
  id: number;
  review: number;
  type: string;
  user: User;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  patient: Patient;
  rating: number;
  content: string;
  doctor: string;
  comments: ReviewComment[];
  created_at: string;
  updated_at: string;
}

export interface ReviewsResponse {
  count: number;
  total_pages: number;
  current: number;
  page_size: number;
  previous: number;
  next: number;
  results: Review[];
}

export const getReviews = async (page = 1, pageSize = 10) => {
  return api.get<ReviewsResponse>(
    `/reviews/?page=${page}&page_size=${pageSize}`,
  );
};
