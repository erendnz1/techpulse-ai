"use client";

import { MessageSquare } from "lucide-react";

export default function AdminFeedbackPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-cyan-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              User Feedback
            </h1>
          </div>

          <p className="mt-2 text-gray-600">
            Review user feedback, update statuses, and respond with admin notes.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Feedback List
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            All feedback submitted by users will appear here.
          </p>
        </div>

        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <MessageSquare className="mx-auto mb-3 h-12 w-12 text-gray-300" />

            <p className="text-lg font-medium text-gray-700">
              No feedback loaded
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Feedback records will be displayed here after connecting the API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}