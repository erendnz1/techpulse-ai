import { Suspense } from "react";
import VerifyEmailForm from "./VerifyEmailForm";

export default function VerifyEmailPage() {
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
      <VerifyEmailForm />
    </Suspense>
  );
}