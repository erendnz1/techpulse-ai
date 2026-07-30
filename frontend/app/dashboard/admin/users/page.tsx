"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Trash2,
  Shield,
  User,
  Users,
  Calendar,
  Eye,
} from "lucide-react";

interface IUser {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const userCount = totalUsers - adminCount;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const newUsersThisMonth = users.filter((user) => {
    const created = new Date(user.created_at);

    return (
      created.getMonth() === currentMonth &&
      created.getFullYear() === currentYear
    );
  }).length;

  async function loadUsers() {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return;

    const data = await res.json();
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function deleteUser(id: number) {
    if (!confirm("Delete this user?")) return;

    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      loadUsers();
    }
  }
async function updateRole(
  id: number,
  role: string
) {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/role?role=${role}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.detail || "Role update failed"
      );
    }

    toast.success("User role updated.");

    loadUsers();

    if (selectedUser?.id === id) {
      setSelectedUser(null);
    }

  } catch(error) {

    toast.error(
      error instanceof Error
        ? error.message
        : "Role update failed."
    );

  }
}


    return (
<div className="space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-10 lg:py-10">
  <div>
    <h1 className="text-3xl font-bold text-white">
      User Management
    </h1>

    <p className="mt-2 text-gray-400">
      Manage platform users
    </p>
  </div>

 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Total Users
        </p>

        <Users className="text-blue-400" size={22} />
      </div>

      <h2 className="mt-3 text-3xl font-bold text-white">
        {totalUsers}
      </h2>
    </div>

    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Admins
        </p>

        <Shield className="text-violet-400" size={22} />
      </div>

      <h2 className="mt-3 text-3xl font-bold text-violet-400">
        {adminCount}
      </h2>
    </div>

    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Users
        </p>

        <User className="text-blue-400" size={22} />
      </div>

      <h2 className="mt-3 text-3xl font-bold text-blue-400">
        {userCount}
      </h2>
    </div>

    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          New This Month
        </p>

        <Calendar className="text-green-400" size={22} />
      </div>

      <h2 className="mt-3 text-3xl font-bold text-green-400">
        {newUsersThisMonth}
      </h2>
    </div>

  </div>

<div className="flex justify-stretch sm:justify-end">

    <input
      type="text"
      placeholder="Search username or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="
w-full
sm:max-w-sm
rounded-xl
border
border-white/10
bg-slate-900/60
px-4
py-2
text-white
placeholder:text-gray-500
outline-none
backdrop-blur-xl
focus:border-violet-500
"
    />

  </div>

  <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">

   <table className="min-w-[900px] w-full">

      <thead className="bg-white/5">

        <tr>

          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
            Username
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
            Email
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
            Role
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
            Created
          </th>

          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {filteredUsers.length === 0 ? (

          <tr>
            <td
              colSpan={5}
              className="py-12 text-center text-gray-400"
            >
              No users found.
            </td>
          </tr>

        ) : (

          filteredUsers.map((user) => (

            <tr
              key={user.id}
              className="border-t border-white/10 transition hover:bg-white/5"
            >

              <td className="px-6 py-5 font-semibold text-white">
                {user.username}
              </td>

              <td className="px-6 py-5 text-gray-400">
                {user.email}
              </td>

              <td className="px-6 py-5">

                {user.role === "admin" ? (

                  <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-sm font-medium text-violet-300">
                    <Shield size={15} />
                    Admin
                  </span>

                ) : (

                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-700 px-3 py-1 text-sm font-medium text-gray-300">
                    <User size={15} />
                    User
                  </span>

                )}

              </td>

              <td className="px-6 py-5 text-gray-400">
                {new Date(user.created_at).toLocaleDateString()}
              </td>

              <td className="px-6 py-5">

                <div className="flex flex-wrap items-center justify-center gap-2">

                  <button
                    onClick={() => setSelectedUser(user)}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-500/20"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
  onClick={() =>
    updateRole(
      user.id,
      user.role === "admin"
        ? "user"
        : "admin"
    )
  }
  className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300 transition hover:bg-violet-500/20"
>
  <Shield size={16} />

  {user.role === "admin"
    ? "Remove Admin"
    : "Make Admin"}
</button>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}

                </div>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>
        {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl sm:p-8">

            <h2 className="mb-6 text-2xl font-bold text-white">
              User Details
            </h2>

            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 text-3xl font-bold text-cyan-300">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-4">

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Username
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedUser.username}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Email
                </p>

                <p className="mt-2 break-all text-lg font-semibold text-white">
                  {selectedUser.email}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Role
                </p>

                <div className="mt-3">

                  {selectedUser.role === "admin" ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-sm font-medium text-violet-300">
                      <Shield size={15} />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-700 px-3 py-1 text-sm font-medium text-gray-300">
                      <User size={15} />
                      User
                    </span>
                  )}

                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Created
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {new Date(selectedUser.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

            </div>

            <div className="mt-8 flex justify-end">

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl bg-cyan-500 px-5 py-2 font-medium text-white transition hover:bg-cyan-600"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
      
    