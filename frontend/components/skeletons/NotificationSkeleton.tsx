export default function NotificationSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-4">

        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />

        <div className="flex-1">

          <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />

          <div className="mt-3 h-4 rounded bg-gray-200 dark:bg-gray-700" />

          <div className="mt-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

          <div className="mt-4 h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />

        </div>

      </div>
    </div>
  );
}