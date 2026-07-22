"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setMessage("Verification token not found.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${API_URL}/auth/verify-email?token=${token}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Verification failed.");
        }

        setSuccess(true);
        setMessage("Your email has been verified successfully.");

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error: any) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        {loading ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Verifying Email...
            </h2>

            <p>Please wait...</p>
          </>
        ) : success ? (
          <>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              ✅ Success
            </h2>

            <p>{message}</p>

            <p className="mt-4 text-gray-500">
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Verification Failed
            </h2>

            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}