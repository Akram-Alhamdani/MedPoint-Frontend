import { useAppDispatch } from "@/store/hooks";
import { clearAuth } from "../slice";
import { toast } from "sonner";

/* ---------------------------------- */
/* LOGOUT                             */
/* ---------------------------------- */
export const useLogout = () => {
  const dispatch = useAppDispatch();

  return () => {
    dispatch(clearAuth());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast.success("Logged out successfully");
  };
};
