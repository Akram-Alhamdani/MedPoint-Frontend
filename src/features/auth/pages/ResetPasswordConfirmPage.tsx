import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ResetPasswordConfirmForm } from "../components";

export function ResetPasswordConfirmPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <ResetPasswordConfirmForm email={email} token={token} t={t} />
      </div>
    </div>
  );
}
