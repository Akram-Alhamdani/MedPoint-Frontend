import api from "@/shared/services/api";
import type {
  DoctorProfile,
  SpecialtyListResponse,
  UpdateDoctorProfilePayload,
} from "./types";

export const getDoctorProfile = async () =>
  await api.get<DoctorProfile>("/auth/me/doctor/");

export const getSpecialties = async () => {
  const response = await api.get<SpecialtyListResponse>("/specialties/");
  return response;
};

export const updateDoctorProfile = async (
  payload: UpdateDoctorProfilePayload | FormData,
) => {
  return await api.put<DoctorProfile>("/auth/me/doctor/", payload);
};

export const uploadDegreeDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("degree_document", file);
  return await api.post("/doctors/degree/upload/", formData);
};
