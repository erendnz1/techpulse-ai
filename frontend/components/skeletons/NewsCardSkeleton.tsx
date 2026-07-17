export default function NewsCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="h-52 rounded-xl bg-gray-200 dark:bg-gray-700" />

      <div className="mt-5 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />

      <div className="mt-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

      <div className="mt-3 space-y-2">
        <div className="h-4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="mt-6 flex justify-between">
        <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />

        <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}