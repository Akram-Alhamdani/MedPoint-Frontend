import { useState } from "react";
import { ForgotPasswordForm, ResetPasswordConfirmForm } from "../components";
import { OTPForm } from "@/features/auth/components/OTPForm";

type Step = "FORM" | "OTP" | "RESET";

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("FORM");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  if (step === "FORM") {
    return (
      <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col">
          <ForgotPasswordForm
            onSuccess={(email) => {
              setEmail(email);
              setStep("OTP");
            }}
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
          />
        </div>
      </div>
    );
  }
  if (step === "RESET") {
    return (
      <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col">
          <ResetPasswordConfirmForm email={email} token={token} />
        </div>
      </div>
    );
  }
}
