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
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { Spinner } from "@/shared/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isRTL = i18n.language === "ar";

  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error(t("auth.login.password_min_length"));
      return;
    }

    login.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/doctor/dashboard"),
      },
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("auth.login.title")}</CardTitle>
        <CardDescription>{t("auth.login.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">
                {t("auth.login.email_label")}
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
              <div
                className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <FieldLabel htmlFor="password">
                  {t("auth.login.password_label")}
                </FieldLabel>
                <Link
                  to="/doctor/forgot-password"
                  className="text-sm underline-offset-4 hover:underline"
                  tabIndex={-1}
                >
                  {t("auth.login.forgot_password")}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 " />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Field>
            <Field>
              <Button
                type="submit"
                disabled={login.isPending}
                className="cursor-pointer"
              >
                {login.isPending ? (
                  <>
                    <Spinner /> {t("auth.login.logging_in")}
                  </>
                ) : (
                  t("auth.login.login_button")
                )}
              </Button>
              <FieldDescription className="text-center">
                {t("auth.login.no_account")}{" "}
                <Link to="/doctor/signup">{t("auth.login.signup_link")}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
