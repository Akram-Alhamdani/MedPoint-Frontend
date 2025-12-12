import { ResetPasswordConfirmForm } from "../components";

export function ResetPasswordConfirmPage() {
  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <ResetPasswordConfirmForm />
      </div>
    </div>
  );
}
