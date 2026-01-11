import { useState } from "react";
import { SignupForm } from "../components/SignupForm";
import { OTPForm } from "@/features/auth/components/OTPForm";

type Step = "FORM" | "OTP";

export function SignupPage() {
  const [step, setStep] = useState<Step>("FORM");
  const [email, setEmail] = useState("");

  if (step === "FORM") {
    return (
      <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col">
          <SignupForm
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
          <OTPForm email={email} />
        </div>
      </div>
    );
  }
}
