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
  t,
  isRTL,
  ...props
}: React.ComponentProps<typeof Card> & {
  email: string;
  onSuccess?: (data?: unknown) => void;
  mode?: "email" | "password-reset";
  t: (key: string) => string;
  isRTL: boolean;
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
        <CardTitle className={`${isRTL ? "text-right" : "text-left"}`}>
          {mode === "password-reset"
            ? t("auth.otp.title_reset")
            : t("auth.otp.title_verify")}
        </CardTitle>
        <CardDescription className={`${isRTL ? "text-right" : "text-left"}`}>
          {t("auth.otp.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">{t("auth.otp.code_label")}</FieldLabel>
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
              <FieldDescription
                className={`${isRTL ? "text-right" : "text-left"}`}
              >
                {t("auth.otp.code_description")}
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
                    <Spinner /> {t("auth.otp.verifying")}
                  </>
                ) : (
                  t("auth.otp.verify_button")
                )}
              </Button>
              <FieldDescription className="text-center">
                {mode === "password-reset" ? (
                  <button
                    type="button"
                    onClick={() =>
                      resendPasswordReset.mutate(email, {
                        onSuccess: () => {
                          toast.success(t("auth.otp.resent_success"));
                        },
                      })
                    }
                    disabled={resendPasswordReset.isPending}
                    className="underline cursor-pointer"
                  >
                    {resendPasswordReset.isPending
                      ? t("auth.otp.resending")
                      : t("auth.otp.resend")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => resendEmailOtp.mutate(email)}
                    disabled={resendEmailOtp.isPending}
                    className="underline cursor-pointer"
                  >
                    {resendEmailOtp.isPending
                      ? t("auth.otp.resending")
                      : t("auth.otp.resend")}
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
