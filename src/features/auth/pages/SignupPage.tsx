import { SignupForm } from "../components/SignupForm";

export function SignupPage() {
  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <SignupForm />
      </div>
    </div>
  );
}
