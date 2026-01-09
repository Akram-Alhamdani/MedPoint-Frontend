import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "@/features/auth/services/";

interface PrivateRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PrivateRoute({
  children,
  redirectTo = "/doctor/login",
}: PrivateRouteProps) {
  const accessToken = localStorage.getItem("accessToken");

  if (!isTokenValid(accessToken)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
