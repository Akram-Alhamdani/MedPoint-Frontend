import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { isTokenValid } from "@/features/auth/services/";

interface PrivateRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PrivateRoute({
  children,
  redirectTo = "/login",
}: PrivateRouteProps) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  if (!isTokenValid(accessToken)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
