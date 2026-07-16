export default function NewsCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white/70 p-6 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-5 h-48 rounded-xl bg-gray-300 dark:bg-gray-700" />

      <div className="space-y-3">
        <div className="h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />

        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />

        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />

        <div className="mt-6 flex justify-between">
          <div className="h-8 w-24 rounded-full bg-gray-300 dark:bg-gray-700" />

          <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}