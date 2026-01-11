import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";

import { Spinner } from "@/shared/components/ui/spinner";
import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useVerifyEmailOTP } from "../hooks/useVerifyEmailOTP";
import { useVerifyPasswordResetOTP } from "../hooks/useVerifyPasswordResetOTP";
import { useResendEmailOTP } from "../hooks/useResendEmailOTP";
import { toast } from "sonner";

export function OTPForm({
  email,
  onSuccess,
  mode = "email",
  ...props
}: React.ComponentProps<typeof Card> & {
  email: string;
  onSuccess?: (data?: unknown) => void;
  mode?: "email" | "password-reset";
}) {
  const [otp, setOtp] = useState("");
  const verifyEmailOtp = useVerifyEmailOTP();
  const verifyPasswordResetOtp = useVerifyPasswordResetOTP();
  const resendPasswordReset = useForgotPassword();
  const resendEmailOtp = useResendEmailOTP();

  const activeMutation =
    mode === "password-reset" ? verifyPasswordResetOtp : verifyEmailOtp;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const opts =
      mode === "password-reset" && onSuccess ? { onSuccess } : undefined;

    activeMutation.mutate({ email, otp }, opts);
  };
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>
          {mode === "password-reset"
            ? "Reset your password"
            : "Verify your email"}
        </CardTitle>
        <CardDescription>We sent a 6-digit code to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                id="otp"
                required
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Button
                type="submit"
                disabled={activeMutation.isPending}
                className="cursor-pointer"
              >
                {activeMutation.isPending ? (
                  <>
                    <Spinner /> Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
              <FieldDescription className="text-center">
                {mode === "password-reset" ? (
                  <button
                    type="button"
                    onClick={() =>
                      resendPasswordReset.mutate(email, {
                        onSuccess: () => {
                          toast.success("OTP resent successfully.");
                        },
                      })
                    }
                    disabled={resendPasswordReset.isPending}
                    className="underline cursor-pointer"
                  >
                    {resendPasswordReset.isPending ? "Resending..." : "Resend"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => resendEmailOtp.mutate(email)}
                    disabled={resendEmailOtp.isPending}
                    className="underline cursor-pointer"
                  >
                    {resendEmailOtp.isPending ? "Resending..." : "Resend"}
                  </button>
                )}
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
