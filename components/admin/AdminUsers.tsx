"use client";

import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function AdminUsers() {
  const { users, removeUser, addUser } = useAuth();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<typeof users[0] | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<typeof users[0] | null>(
    null
  );
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  };
  const [form, setForm] = useState(emptyForm);

  const selected =
    selectedId !== null ? users.find((u) => u.id === selectedId) : null;

  const filtered = users.filter((u) => {
    if (filter === "admin" && u.role !== "admin") return false;
    if (filter === "user" && u.role !== "user") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  /* ===== SELECT FROM DROPDOWN ===== */
  const handleSelect = (id: string) => {
    setSelectedId(id);
    const u = users.find((x) => x.id === id);
    if (u) {
      setForm({
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
      });
      setEditing(u);
      setShowCreate(false);
    }
  };

  const handleNew = () => {
    setForm(emptyForm);
    setEditing(null);
    setSelectedId(null);
    setShowCreate(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    if (editing) {
      // Update — we can't use AuthContext.removeUser to "update", so
      // we simulate by removing + adding. In a real app you'd have updateUser().
      if (editing.email !== "admin") {
        // Prevent updating the seeded admin's credentials inadvertently
        removeUser(editing.id);
        addUser({
          name: form.name,
          email: form.email.toLowerCase(),
          password: form.password,
          role: form.role,
        });
      } else {
        alert("Cannot modify the admin account");
      }
      setEditing(null);
      setSelectedId(null);
    } else {
      if (users.some((u) => u.email === form.email.toLowerCase())) {
        alert("Email already exists");
        return;
      }
      addUser({
        name: form.name,
        email: form.email.toLowerCase(),
        password: form.password,
        role: form.role,
      });
      setShowCreate(false);
    }
    setForm(emptyForm);
  };

  const handleCancel = () => {
    setEditing(null);
    setSelectedId(null);
    setShowCreate(false);
    setForm(emptyForm);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.email === "admin") {
      alert("Cannot delete the admin account");
      setConfirmDelete(null);
      return;
    }
    removeUser(confirmDelete.id);
    if (selectedId === confirmDelete.id) {
      setSelectedId(null);
      setEditing(null);
      setForm(emptyForm);
    }
    setConfirmDelete(null);
  };

  const formOpen = showCreate || editing !== null;

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black sm:text-4xl">Users</h1>
          <p className="mt-2 text-gray-400">
            Manage accounts — {users.length} total
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-105"
        >
          ➕ New User
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={users.length} icon="👥" color="from-blue-500 to-cyan-500" />
        <StatCard label="Admins" value={users.filter((u) => u.role === "admin").length} icon="🛡️" color="from-orange-500 to-red-500" />
        <StatCard label="Customers" value={users.filter((u) => u.role === "user").length} icon="🙋" color="from-green-500 to-emerald-500" />
        <StatCard label="New (7d)" value={users.filter((u) => new Date(u.joinedAt).getTime() > Date.now() - 604800000).length} icon="✨" color="from-pink-500 to-purple-500" />
      </div>

      {/* ===== DROPDOWN CONTROL BAR ===== */}
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">
            Select User
          </label>
          <div className="relative flex-1">
            <select
              value={selectedId ?? ""}
              onChange={(e) => (e.target.value ? handleSelect(e.target.value) : null)}
              className="w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-black/40 px-5 py-3 pr-10 text-sm font-medium text-white outline-none transition hover:bg-white/10 focus:border-orange-500/50"
            >
              <option value="" className="bg-[#111]">
                — Choose a user —
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#111]">
                  {u.role === "admin" ? "🛡️" : "👤"} {u.name} · {u.email}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* ===== EDIT / CREATE FORM ===== */}
      {formOpen && (
        <div className="mb-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent p-6 backdrop-blur animate-[slideDown_0.25s_ease-out]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                {editing ? `Edit: ${editing.name}` : "Add New User"}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {editing
                  ? "Update the fields and click Save."
                  : "Create a new account."}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-red-500"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={editing?.email === "admin"}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50 disabled:opacity-50"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={editing?.email === "admin"}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50 disabled:opacity-50"
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Password">
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={editing?.email === "admin"}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50 disabled:opacity-50"
                />
              </Field>

              <Field label="Role">
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as "admin" | "user" })
                  }
                  disabled={editing?.email === "admin"}
                  className="w-full cursor-pointer rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none disabled:opacity-50"
                >
                  <option value="user" className="bg-[#111]">👤 Customer</option>
                  <option value="admin" className="bg-[#111]">🛡️ Admin</option>
                </select>
              </Field>
            </div>

            {editing?.email === "admin" && (
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-xs text-yellow-300">
                ⚠️ The admin account cannot be modified or deleted.
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editing?.email === "admin"}
                className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editing ? "✅ Save Changes" : "➕ Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== FILTERS ===== */}
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3 transition focus-within:border-orange-500/50">
          <span>🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All" },
            { id: "admin", label: "Admins" },
            { id: "user", label: "Customers" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                filter === f.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500"
                  : "border border-white/10 hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className={`border-b border-white/5 transition hover:bg-white/[0.03] ${
                    selectedId === u.id ? "bg-orange-500/5" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                          u.role === "admin"
                            ? "bg-gradient-to-br from-orange-500 to-red-500"
                            : "bg-gradient-to-br from-blue-500 to-cyan-500"
                        }`}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {u.name}
                          {u.email === "admin" && (
                            <span className="ml-2 rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-300">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        u.role === "admin"
                          ? "bg-orange-500/20 text-orange-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {u.role === "admin" ? "🛡️ Admin" : "👤 Customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(u.joinedAt).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSelect(u.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs transition hover:bg-blue-500/20"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setConfirmDelete(u)}
                        disabled={u.email === "admin"}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 transition hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-2xl animate-[scaleIn_0.25s_ease-out]"
          >
            <div className="border-b border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-4xl">
                ⚠️
              </div>
              <h2 className="mt-4 text-2xl font-black">Delete User?</h2>
              <p className="mt-2 text-sm text-gray-400">
                This action cannot be undone.
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                    confirmDelete.role === "admin"
                      ? "bg-gradient-to-br from-orange-500 to-red-500"
                      : "bg-gradient-to-br from-blue-500 to-cyan-500"
                  }`}
                >
                  {confirmDelete.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-bold">
                    {confirmDelete.name}
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {confirmDelete.email}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {confirmDelete.role === "admin" ? "🛡️ Admin" : "👤 Customer"}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-bold shadow-lg shadow-red-500/30 transition hover:scale-[1.02]"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-orange-500/40">
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl transition group-hover:opacity-40`}
      />
      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-2xl`}
      >
        {icon}
      </div>
      <div className="relative mt-4 text-3xl font-black">{value}</div>
      <div className="relative mt-1 text-xs text-gray-500">{label}</div>
    </div>
  );
}