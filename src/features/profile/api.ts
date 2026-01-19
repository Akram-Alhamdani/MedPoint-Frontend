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
