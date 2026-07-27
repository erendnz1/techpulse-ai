"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquareText, Send } from "lucide-react";
import { createFeedback, getMyFeedback } from "@/lib/api";

interface Feedback {
  id: number;
  user_id: number;
  rating: number;
  message: string;
  created_at: string;
}

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFeedback = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      const data = await getMyFeedback(token);

      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      if (message.trim().length < 5) {
        alert("Feedback must contain at least 5 characters.");
        return;
      }

      setLoading(true);

      await createFeedback(token, {
        rating,
        message,
      });

      await loadFeedback();

      setMessage("");
      setRating(5);

      alert("🎉 Thank you for your feedback!");

    } catch (error: any) {
      console.error(error);

      alert(error.message || "Something went wrong.");

    } finally {
      setLoading(false);
    }
  };
  return (
  <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="mb-8">
      <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
        <MessageSquareText className="h-8 w-8 text-blue-400 sm:h-10 sm:w-10" />
        Feedback
      </h1>

      <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
        Help us improve TechPulse AI by sharing your ideas,
        suggestions, or reporting any issues.
      </p>
    </div>

    {/* Feedback Form */}
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-white/5 sm:p-8">

      <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
        Rate your experience
      </h2>

      <div className="mb-8 flex flex-wrap gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="transition duration-200 hover:scale-125"
          >
            <Star
              size={36}
              className={
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-500"
              }
            />
          </button>
        ))}
      </div>

      <label className="mb-3 block text-lg font-semibold text-gray-900 dark:text-white">
        Your Feedback
      </label>

      <textarea
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us what you liked, what should be improved or report a bug..."
        className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
      />

      <p className="mt-2 text-sm text-gray-500">
        Minimum 5 characters ({message.length}/1000)
      </p>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className={`mt-8 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-lg font-semibold text-white transition

        ${
          loading
            ? "cursor-not-allowed bg-gray-600"
            : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30"
        }`}
      >
        <Send size={20} />

        {loading ? "Sending..." : "Send Feedback"}
      </button>
    </div>

    {/* Previous Feedback */}

    <div className="mt-12">

      <div className="mb-6 flex items-center justify-between">

       <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Previous Feedback
        </h2>

        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {feedbacks.length} Feedback
        </span>

      </div>

      {feedbacks.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center">

          <MessageSquareText
            size={42}
            className="mx-auto mb-4 text-gray-500"
          />

          <p className="text-gray-600 dark:text-gray-400">
            You haven't submitted any feedback yet.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {feedbacks.map((item) => (

            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-blue-400 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
            >

              <div className="mb-3 flex items-center justify-between">

                <div className="flex">

                  {Array.from({ length: item.rating }).map((_, index) => (

                    <Star
                      key={index}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />

                  ))}

                </div>

                <span className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>

              </div>

              <p className="leading-7 text-gray-700 dark:text-gray-200">
                {item.message}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  </div>
); 
}