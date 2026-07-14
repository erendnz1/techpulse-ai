"use client";
import { ThemeToggle } from "../theme-toggle";
import { useState } from "react";
export default function LoginPage() {
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
  setError(data.detail);
  return;
}

localStorage.setItem(
  "access_token",
  data.access_token
);

console.log(data);

  } catch (error) {
    console.error(error);
  }
};
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 transition-colors dark:bg-gray-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),transparent_45%)]" />
     <a
  href="/"
  className="absolute left-8 top-6 z-10 text-xl font-bold tracking-tight text-gray-900 transition-opacity hover:opacity-80 dark:text-white"
>
  TechPulse <span className="text-blue-600">AI</span>
</a>
<div className="absolute right-8 top-5 z-10">
  <ThemeToggle />
</div>
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back
        </h1>
          <form onSubmit={handleLogin}>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to continue to TechPulse AI.
        </p>
        <div className="mt-8">
  <label
    htmlFor="username"
   className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
  >
    Email or Username
  </label>

  <input
  id="username"
  name="username"
  type="text"
  placeholder="Enter your email or username"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
/>
</div>
<div className="mt-5">
  <label
    htmlFor="password"
    className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
  >
    Password
  </label>

<div className="relative">
  <input
  id="password"
  name="password"
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-16 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
/>
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? "Hide password" : "Show password"}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
>
  {showPassword ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
      <path d="M9.9 4.2A10.5 10.5 0 0112 4c5 0 9 4 10 8a11.8 11.8 0 01-2 3.9" />
      <path d="M6.6 6.6C4.4 8 3 10 2 12c1 4 5 8 10 8a10.7 10.7 0 005.4-1.5" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )}
</button>
</div>
</div>
<button
  type="submit"
  className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
>
  Sign In
</button>
<p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
  Don&apos;t have an account?{" "}
  <a
    href="/register"
    className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
  >
    Create account
  </a>
</p>
</form>
      </div>
    </main>
  );
}