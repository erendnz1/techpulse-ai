export default function NotificationSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white/60 p-5 dark:border-gray-700 dark:bg-gray-800/40">
      <div className="flex justify-between">
        <div className="space-y-3 w-full">
          <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />

          <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="h-6 w-14 rounded-full bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}