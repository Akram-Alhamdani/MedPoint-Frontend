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
import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "../hooks/useRegister"; // your custom hook
import { toast } from "sonner";
import { Spinner } from "@/shared/components/ui/spinner";
import { useTranslation } from "react-i18next";

export function SignupForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const irRTL = i18n.language === "ar";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const register = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const complexityRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (password.length < 8) {
      toast.error(t("auth.signup.password_min_length"));
      return;
    }
    if (!complexityRegex.test(password)) {
      toast.error(t("auth.signup.password_complexity"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("auth.signup.passwords_no_match"));
      return;
    }

    register.mutate(
      { full_name: fullName, email, password, password2: confirmPassword },
      {
        onSuccess: () => {
          onSuccess(email);
        },
      },
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("auth.signup.title")}</CardTitle>
        <CardDescription>{t("auth.signup.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="name">
                {t("auth.signup.full_name_label")}
              </FieldLabel>
              <Input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">
                {t("auth.signup.email_label")}
              </FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="password">
                  {t("auth.signup.password_label")}
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
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
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
                <FieldLabel htmlFor="confirm-password">
                  {t("auth.signup.confirm_password_label")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
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
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
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
            </Field>

            <FieldDescription className={irRTL ? "text-right" : "text-left"}>
              {t("auth.signup.password_hint")}
            </FieldDescription>
            <Field>
              <Button
                type="submit"
                disabled={register.isPending}
                className="cursor-pointer"
              >
                {register.isPending ? (
                  <>
                    <Spinner /> {t("auth.signup.creating_account")}
                  </>
                ) : (
                  t("auth.signup.create_account_button")
                )}
              </Button>
              <FieldDescription className="text-center">
                {t("auth.signup.already_have_account")}{" "}
                <Link to="/doctor/login">{t("auth.signup.login_link")}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
