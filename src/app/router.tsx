import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  SignupPage,
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordConfirmPage,
} from "@/features/auth/pages";
import DashboardLayout from "@/features/dashboard/layouts/DashboardLayout";
import { DashboardPage } from "@/features/dashboard/pages";

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
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "appointments", element: <div>Appointments Page</div> },
      { path: "schedule", element: <div>Schedule Page</div> },
      { path: "settings", element: <div>Settings Page</div> },
    ],
  },
]);
