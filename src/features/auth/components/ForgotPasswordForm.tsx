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
import { Input } from "@/shared/components/ui/input";

import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { Spinner } from "@/shared/components/ui/spinner";
import { Link } from "react-router-dom";

export function ForgotPasswordForm({
  onSuccess,
  t,
}: {
  onSuccess: (email: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}) {
  const [email, setEmail] = useState("");

  const forgotPassword = useForgotPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    forgotPassword.mutate(email, {
      onSuccess: () => {
        onSuccess(email);
      },
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {t("auth.forgot_password.title")}
        </CardTitle>
        <CardDescription>
          {t("auth.forgot_password.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">
                {t("auth.forgot_password.email_label")}
              </FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Button
                type="submit"
                disabled={forgotPassword.isPending}
                className="cursor-pointer"
              >
                {forgotPassword.isPending ? (
                  <>
                    <Spinner /> {t("auth.forgot_password.sending")}
                  </>
                ) : (
                  t("auth.forgot_password.send_button")
                )}
              </Button>
              <FieldDescription className="text-center">
                <Link to="/doctor/login">
                  {t("auth.forgot_password.back_to_login")}
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
