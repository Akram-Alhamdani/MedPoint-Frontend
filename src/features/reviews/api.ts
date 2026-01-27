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
  id?: number;
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

export interface PatientReport {
  id: number;
  doctor: number;
  patient: number;
  reason: string;
  created_at: string;
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

const getDoctorIdFromStorage = (): number | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const doctorId = parsed?.id;
    return doctorId;
  } catch (error) {
    console.error("Failed to parse doctor from localStorage", error);
    return null;
  }
};

export const getReviews = async (page = 1, pageSize = 10) => {
  const doctorId = getDoctorIdFromStorage();
  return api.get<ReviewsResponse>(
    `doctors/${doctorId}/reviews/?page=${page}&page_size=${pageSize}`,
  );
};

export const createReviewComment = async (
  reviewId: number,
  content: string,
) => {
  return api.post<ReviewComment>(`/reviews/${reviewId}/comments/`, {
    content,
  });
};

export const updateReviewComment = async (
  commentId: number,
  content: string,
) => {
  return api.patch<ReviewComment>(`/comments/${commentId}/`, {
    content,
  });
};

export const deleteReviewComment = async (commentId: number) => {
  return api.delete(`/comments/${commentId}/`);
};

export const createPatientReport = async (patient: number, reason: string) => {
  return api.post<PatientReport>(`/patient-reports/`, {
    patient,
    reason,
  });
};
