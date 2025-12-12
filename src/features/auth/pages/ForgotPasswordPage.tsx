import { ForgotPasswordForm } from "../components";

export function ForgotPasswordPage() {
  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
