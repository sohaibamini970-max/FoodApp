"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  provider: string;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
};

export default function AdminUsers() {
  const { user: me, authFetch } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<"all" | "admin" | "user">("all");
  const [search, setSearch] = useState("");

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  };
  const [form, setForm] = useState(emptyForm);

  /* ============ LOAD USERS ============ */
  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch("/api/admin/users");
        if (!res.ok) {
          setError("Failed to load users");
          return;
        }
        const data = await res.json();
        setUsers(data.users || []);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, [authFetch]);

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

  /* ============ SELECT FROM DROPDOWN ============ */
  const handleSelect = (id: number) => {
    setSelectedId(id);
    const u = users.find((x) => x.id === id);
    if (u) {
      setForm({
        name: u.name,
        email: u.email,
        password: "",
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

  /* ============ CREATE / UPDATE ============ */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    if (editing) {
      // Update name + role (email/password update = separate concern)
      const res = await authFetch(`/api/admin/users/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name,
          role: form.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Update failed");
        return;
      }

      const data = await res.json();
      setUsers((prev) =>
        prev.map((x) => (x.id === editing.id ? { ...x, ...data.user } : x))
      );
      setEditing(null);
      setSelectedId(null);
    } else {
      // Create via register endpoint (creates new user)
      if (!form.password) {
        alert("Password is required");
        return;
      }
      const res = await authFetch(`/api/admin/users`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Create failed");
        return;
      }

      const data = await res.json();
      setUsers((prev) => [data.user, ...prev]);
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

  /* ============ DELETE ============ */
  const handleDelete = async () => {
    if (!confirmDelete) return;
    if (confirmDelete.id === me?.id) {
      alert("You cannot delete yourself");
      setConfirmDelete(null);
      return;
    }

    const res = await authFetch(`/api/admin/users/${confirmDelete.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "Delete failed");
      setConfirmDelete(null);
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== confirmDelete.id));
    if (selectedId === confirmDelete.id) {
      setSelectedId(null);
      setEditing(null);
      setForm(emptyForm);
    }
    setConfirmDelete(null);
  };

  const formOpen = showCreate || editing !== null;
  const isSelf = (u: AdminUser) => u.id === me?.id;

  /* ============ LOADING / ERROR ============ */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
      </div>
    );
  }

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

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          ❌ {error}
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={users.length} icon="👥" color="from-blue-500 to-cyan-500" />
        <StatCard label="Admins" value={users.filter((u) => u.role === "admin").length} icon="🛡️" color="from-orange-500 to-red-500" />
        <StatCard label="Customers" value={users.filter((u) => u.role === "user").length} icon="🙋" color="from-green-500 to-emerald-500" />
        <StatCard
          label="New (7d)"
          value={users.filter((u) => new Date(u.created_at).getTime() > Date.now() - 604800000).length}
          icon="✨"
          color="from-pink-500 to-purple-500"
        />
      </div>

      {/* Dropdown */}
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">
            Select User
          </label>
          <div className="relative flex-1">
            <select
              value={selectedId ?? ""}
              onChange={(e) =>
                e.target.value ? handleSelect(Number(e.target.value)) : null
              }
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

      {/* Form */}
      {formOpen && (
        <div className="mb-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent p-6 backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                {editing ? `Edit: ${editing.name}` : "Add New User"}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {editing ? "Update the fields and click Save." : "Create a new account."}
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
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={!!editing}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50 disabled:opacity-50"
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {!editing && (
                <Field label="Password">
                  <input
                    type="text"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                  />
                </Field>
              )}

              <Field label="Role">
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as "admin" | "user" })
                  }
                  disabled={editing ? isSelf(editing) : false}
                  className="w-full cursor-pointer rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none disabled:opacity-50"
                >
                  <option value="user" className="bg-[#111]">👤 Customer</option>
                  <option value="admin" className="bg-[#111]">🛡️ Admin</option>
                </select>
              </Field>
            </div>

            {editing && isSelf(editing) && (
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-xs text-yellow-300">
                ⚠️ You cannot demote or delete your own admin account.
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
                className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
              >
                {editing ? "✅ Save Changes" : "➕ Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3 focus-within:border-orange-500/50">
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
          {(["all", "admin", "user"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${filter === f
                  ? "bg-gradient-to-r from-orange-500 to-red-500"
                  : "border border-white/10 hover:bg-white/10"
                }`}
            >
              {f === "all" ? "All" : f === "admin" ? "Admins" : "Customers"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Verified</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className={`border-b border-white/5 transition hover:bg-white/[0.03] ${selectedId === u.id ? "bg-orange-500/5" : ""
                    }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${u.role === "admin"
                            ? "bg-gradient-to-br from-orange-500 to-red-500"
                            : "bg-gradient-to-br from-blue-500 to-cyan-500"
                          }`}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {u.name}
                          {isSelf(u) && (
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
                      className={`rounded-full px-3 py-1 text-xs font-bold ${u.role === "admin"
                          ? "bg-orange-500/20 text-orange-300"
                          : "bg-blue-500/20 text-blue-300"
                        }`}
                    >
                      {u.role === "admin" ? "🛡️ Admin" : "👤 Customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {u.email_verified ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(u.created_at).toLocaleDateString("en-PK", {
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
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setConfirmDelete(u)}
                        disabled={isSelf(u)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 transition hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No users match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-2xl"
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
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold ${confirmDelete.role === "admin"
                      ? "bg-gradient-to-br from-orange-500 to-red-500"
                      : "bg-gradient-to-br from-blue-500 to-cyan-500"
                    }`}
                >
                  {confirmDelete.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-bold">{confirmDelete.name}</div>
                  <div className="truncate text-xs text-gray-500">
                    {confirmDelete.email}
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