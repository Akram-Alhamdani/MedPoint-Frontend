import { OTPForm } from "@/features/auth/components/OTPForm";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function VerifyEmailPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const email = location.state?.email || "";
  const isRTL = i18n.dir() === "rtl";
  return (
    <div className="bg-muted flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <OTPForm email={email} t={t} isRTL={isRTL} />
      </div>
    </div>
  );
}
