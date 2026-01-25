import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  SignupPage,
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordConfirmPage,
} from "@/features/auth/pages";
import DashboardLayout from "@/shared/components/table/DashboardLayout";
import { PrivateRoute } from "@/shared/components/PrivateRoute";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import AppointmentsPage from "@/features/appointments/pages/AppointmentsPage";
import SchedulesPage from "@/features/schedules/pages/SchedulesPage";
import WorkingHoursPage from "@/features/working-hours/pages/WorkingHoursPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import { ReviewPage } from "@/features/reviews";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/doctor/login" replace />,
  },
  {
    path: "/doctor/login",
    element: <LoginPage />,
  },
  {
    path: "/doctor/signup",
    element: <SignupPage />,
  },
  {
    path: "/doctor/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/doctor/reset-password-confirm/:uid/:token",
    element: <ResetPasswordConfirmPage />,
  },
  {
    path: "/doctor/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "appointments", element: <AppointmentsPage /> },
      { path: "reviews", element: <ReviewPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "schedule", element: <SchedulesPage /> },
      { path: "working-hours", element: <WorkingHoursPage /> },
    ],
  },
]);
