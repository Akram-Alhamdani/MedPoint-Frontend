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
import { Spinner } from "@/shared/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useResetPasswordConfirm } from "../hooks/useResetPasswordConfirm";
import { toast } from "sonner";

export function ResetPasswordConfirmForm({
  email,
  token,
  t,
}: {
  email: string;
  token: string;
  t: (key: string) => string;
}) {
  const resetPassword = useResetPasswordConfirm();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const complexityRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!complexityRegex.test(password)) {
      toast.error(
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPassword.mutate({
      email: email,
      token: token,
      new_password: password,
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("auth.reset.title")}</CardTitle>
        <CardDescription>{t("auth.reset.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">
                {t("auth.reset.password_label")}
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                {t("auth.reset.confirm_password_label")}
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Field>

            <Field>
              <Button
                type="submit"
                disabled={resetPassword.isPending}
                className="cursor-pointer w-full"
              >
                {resetPassword.isPending ? (
                  <>
                    <Spinner /> {t("auth.reset.resetting")}
                  </>
                ) : (
                  t("auth.reset.reset_button")
                )}
              </Button>

              <FieldDescription className="text-center">
                {t("auth.reset.back_to_login_pre")}{" "}
                <Link to="/doctor/login">
                  {t("auth.reset.back_to_login_link")}
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
