import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
          <p className="text-gray-500">
            Loading...
          </p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}