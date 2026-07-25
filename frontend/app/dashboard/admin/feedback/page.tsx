"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

import { getAllFeedbacks, updateFeedback } from "@/lib/api";
import { Feedback } from "@/types/feedback";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadFeedback() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setLoading(false);
          return;
        }

        const data = await getAllFeedbacks(token);
        setFeedbacks(data);
      } catch (error) {
        console.error("Failed to load feedback:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, []);

  async function handleSave(feedback: Feedback) {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      setSavingId(feedback.id);

      await updateFeedback(
        feedback.id,
        {
          status: feedback.status,
          admin_note: feedback.admin_note,
        },
        token
      );

      alert("Feedback updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update feedback.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-cyan-600" />
          <h1 className="text-3xl font-bold text-white">
            User Feedback
          </h1>
        </div>

        <p className="mt-2 text-slate-400">
          Review user feedback, update statuses and respond with admin notes.
        </p>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg">
        <div className="border-b border-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Feedback List
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            All feedback submitted by users.
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-400">
            Loading...
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-3 h-12 w-12 text-slate-500" />

              <p className="text-lg font-medium text-white">
                No feedback found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Users haven't submitted any feedback yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    ID
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Rating
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Message
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Admin Note
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Actions
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.map((feedback) => (
                  <tr
                    key={feedback.id}
                    className="border-t border-slate-700 hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4 text-white">
                      #{feedback.id}
                    </td>

                    <td className="px-6 py-4 text-yellow-400">
                      {"⭐".repeat(feedback.rating)}
                    </td>

                    <td className="max-w-md px-6 py-4 text-slate-200">
                      {feedback.message}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={feedback.status}
                        onChange={(e) =>
                          setFeedbacks((prev) =>
                            prev.map((item) =>
                              item.id === feedback.id
                                ? {
                                    ...item,
                                    status: e.target.value,
                                  }
                                : item
                            )
                          )
                        }
                        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <textarea
                        rows={2}
                        value={feedback.admin_note ?? ""}
                        onChange={(e) =>
                          setFeedbacks((prev) =>
                            prev.map((item) =>
                              item.id === feedback.id
                                ? {
                                    ...item,
                                    admin_note: e.target.value,
                                  }
                                : item
                            )
                          )
                        }
                        className="w-72 rounded-lg border border-slate-600 bg-slate-800 p-2 text-sm text-white"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSave(feedback)}
                        disabled={savingId === feedback.id}
                        className="rounded-lg bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingId === feedback.id
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {new Date(
                        feedback.created_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}