export default function ProfilePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage your account information and preferences.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">

          <div className="flex items-center gap-6">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold text-white">
              TP
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Current User
              </h2>

              <p className="text-gray-500 dark:text-gray-400">
                TechPulse Member
              </p>
            </div>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <div>
              <label className="text-sm font-medium text-gray-500">
                Username
              </label>

              <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                Coming Soon
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Email
              </label>

              <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                Coming Soon
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}