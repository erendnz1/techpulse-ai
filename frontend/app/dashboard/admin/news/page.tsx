"use client";

import { useEffect, useState } from "react";
import {
  Newspaper,
  Trash2,
  RefreshCcw,
  Search,
} from "lucide-react";

interface News {
  id: number;
  title: string;
  category: string;
  source: string;
  published_at: string;
}

export default function NewsManager() {
  const [news, setNews] = useState<News[]>([]);
  const [search, setSearch] = useState("");

  async function loadNews() {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/news`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setNews(data);
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function deleteNews(id: number) {
    if (!confirm("Delete this article?")) return;

    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/news/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      loadNews();
    }
  }

  async function fetchNews() {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/fetch`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      loadNews();
    }
  }

  const filtered = news.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            News Manager
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all collected articles
          </p>
        </div>

        <button
          onClick={fetchNews}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <RefreshCcw size={18} />
          Fetch News
        </button>

      </div>

      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-3 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search news..."
          className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-blue-500"
        />

      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Title
              </th>

              <th className="px-6 py-4 text-left">
                Category
              </th>

              <th className="px-6 py-4 text-left">
                Source
              </th>

              <th className="px-6 py-4 text-center">
                Delete
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="px-6 py-5">
                  {item.title}
                </td>

                <td className="px-6 py-5">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    {item.category}
                  </span>

                </td>

                <td className="px-6 py-5">
                  {item.source}
                </td>

                <td className="px-6 py-5 text-center">

                  <button
                    onClick={() =>
                      deleteNews(item.id)
                    }
                    className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                  >
                    <Trash2 size={17} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}