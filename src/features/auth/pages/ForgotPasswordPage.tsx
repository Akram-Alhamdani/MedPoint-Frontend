import { useState } from "react";
import { ForgotPasswordForm, ResetPasswordConfirmForm } from "../components";
import { OTPForm } from "@/features/auth/components/OTPForm";
import { useTranslation } from "react-i18next";

type Step = "FORM" | "OTP" | "RESET";

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("FORM");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  if (step === "FORM") {
    return (
      <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col">
          <ForgotPasswordForm
            onSuccess={(email) => {
              setEmail(email);
              setStep("OTP");
            }}
            isRTL={isRTL}
            t={t}
          />
        </div>
      </div>
    );
  }
  if (step === "OTP") {
    return (
      <div className="bg-muted flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-xs">
          <OTPForm
            email={email}
            mode="password-reset"
            onSuccess={(data) => {
              const nextToken = (data as any)?.token;
              setToken(nextToken);
              setStep("RESET");
            }}
            t={t}
            isRTL={isRTL}
          />
        </div>
      </div>
    );
  }
  if (step === "RESET") {
    return (
      <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col">
          <ResetPasswordConfirmForm email={email} token={token} t={t} />
        </div>
      </div>
    );
  }
}
