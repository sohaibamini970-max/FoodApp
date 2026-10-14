"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { formatPKR } from "@/components/CartContext";

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

type Stats = {
  users: {
    total: number;
    verified: number;
    admins: number;
    oauth: number;
  };
  products: {
    total: number;
    available: number;
    hidden: number;
    variants: number;
  };
  orders: {
    total: number;
    pending: number;
    delivered: number;
    revenue: number;
  };
  deals: {
    total: number;
    active: number;
    paused: number;
  };
  messages: {
    total: number;
    unread: number;
    replied: number;
  };
};

export default function AdminDashboard() {
  const { user, authFetch } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-PK", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  /* ═══════════════ Load everything in parallel ═══════════════ */
  useEffect(() => {
    (async () => {
      try {
        const [usersRes, productsRes, ordersRes, dealsRes, contactRes] =
          await Promise.all([
            authFetch("/api/admin/users"),
            authFetch("/api/products"),
            authFetch("/api/admin/orders"),
            authFetch("/api/admin/deals"),
            authFetch("/api/admin/contact"),
          ]);

        const [usersData, productsData, ordersData, dealsData, contactData] =
          await Promise.all([
            usersRes.ok ? usersRes.json() : { users: [] },
            productsRes.ok ? productsRes.json() : { products: [] },
            ordersRes.ok ? ordersRes.json() : { orders: [] },
            dealsRes.ok ? dealsRes.json() : { deals: [] },
            contactRes.ok ? contactRes.json() : { messages: [], unread: 0 },
          ]);

        const userList: AdminUser[] = usersData.users || [];
        const productList = productsData.products || [];
        const orderList = ordersData.orders || [];
        const dealList = dealsData.deals || [];
        const messageList = contactData.messages || [];

        setUsers(userList);

        const variantCount = productList.reduce(
          (sum: number, p: any) => sum + (p.variants?.length || 0),
          0
        );

        const pendingOrders = orderList.filter(
          (o: any) =>
            o.status === "pending" || o.status === "confirmed"
        ).length;
        const deliveredOrders = orderList.filter(
          (o: any) => o.status === "delivered"
        ).length;
        const totalRevenue = orderList
          .filter(
            (o: any) =>
              o.status !== "cancelled" && o.payment_status === "paid"
          )
          .reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

        setStats({
          users: {
            total: userList.length,
            verified: userList.filter((u) => u.email_verified).length,
            admins: userList.filter((u) => u.role === "admin").length,
            oauth: userList.filter((u) => u.provider !== "local").length,
          },
          products: {
            total: productList.length,
            available: productList.filter((p: any) => p.available).length,
            hidden: productList.filter((p: any) => !p.available).length,
            variants: variantCount,
          },
          orders: {
            total: orderList.length,
            pending: pendingOrders,
            delivered: deliveredOrders,
            revenue: totalRevenue,
          },
          deals: {
            total: dealList.length,
            active: dealList.filter((d: any) => d.active).length,
            paused: dealList.filter((d: any) => !d.active).length,
          },
          messages: {
            total: messageList.length,
            unread: contactData.unread || 0,
            replied: messageList.filter((m: any) => m.status === "replied")
              .length,
          },
        });
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, [authFetch]);

  /* ═══════════════ Handlers ═══════════════ */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    const res = await authFetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      // Refresh stats
      setStats((s) =>
        s
          ? {
            ...s,
            users: { ...s.users, total: s.users.total - 1 },
          }
          : s
      );
    } else {
      const data = await res.json();
      alert(data.message || "Delete failed");
    }
  };

  const handleToggleRole = async (u: AdminUser) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    const res = await authFetch(`/api/admin/users/${u.id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, role: newRole } : x))
      );
      setStats((s) =>
        s
          ? {
            ...s,
            users: {
              ...s.users,
              admins:
                s.users.admins + (newRole === "admin" ? 1 : -1),
            },
          }
          : s
      );
    }
  };

  /* ═══════════════ Loading ═══════════════ */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
      </div>
    );
  }

  /* ═══════════════ Stat cards ═══════════════ */
  const statCards = stats
    ? [
      {
        label: "Users",
        value: stats.users.total,
        sub: `${stats.users.verified} verified`,
        icon: "👥",
        color: "from-blue-500 to-cyan-500",
        href: "/admin/users",
      },
      {
        label: "Products",
        value: stats.products.total,
        sub: `${stats.products.available} live · ${stats.products.hidden} hidden`,
        icon: "🍔",
        color: "from-orange-500 to-red-500",
        href: "/admin/products",
      },
      {
        label: "Orders",
        value: stats.orders.total,
        sub: `${stats.orders.pending} pending · ${formatPKR(
          stats.orders.revenue
        )}`,
        icon: "🧾",
        color: "from-green-500 to-emerald-500",
        href: "/admin/orders",
      },
      {
        label: "Deals",
        value: stats.deals.total,
        sub: `${stats.deals.active} active · ${stats.deals.paused} paused`,
        icon: "🎁",
        color: "from-purple-500 to-pink-500",
        href: "/admin/deals",
      },
      {
        label: "Messages",
        value: stats.messages.total,
        sub: `${stats.messages.unread} unread`,
        icon: "📬",
        color: "from-yellow-500 to-orange-500",
        href: "/admin/contact",
      },
      {
        label: "Variants",
        value: stats.products.variants,
        sub: "across all products",
        icon: "🎨",
        color: "from-indigo-500 to-blue-500",
        href: "/admin/products",
      },
      {
        label: "Delivered",
        value: stats.orders.delivered,
        sub: "completed orders",
        icon: "✅",
        color: "from-teal-500 to-cyan-500",
        href: "/admin/orders",
      },
      {
        label: "OAuth Users",
        value: stats.users.oauth,
        sub: "Google + Facebook",
        icon: "🔗",
        color: "from-pink-500 to-rose-500",
        href: "/admin/users",
      },
    ]
    : [];

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Welcome back,{" "}
              <span className="font-semibold text-white">{user?.name}</span> 👋
            </p>
          </div>
          <div className="text-xs text-gray-500">{today}</div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            ❌ {error}
          </div>
        )}

        {/* ─────────── Stat cards ─────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className={`group rounded-2xl bg-gradient-to-br ${s.color} p-5 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs opacity-60 transition group-hover:translate-x-1">
                  →
                </span>
              </div>
              <div className="mt-4 text-3xl font-black">{s.value}</div>
              <div className="text-sm font-semibold">{s.label}</div>
              <div className="mt-0.5 text-xs text-white/70">{s.sub}</div>
            </Link>
          ))}
        </div>

        {/* ─────────── Quick actions ─────────── */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Link
              href="/admin/products"
              className="rounded-xl border border-white/10 bg-black/20 p-4 text-center transition hover:border-orange-500/50 hover:bg-orange-500/5"
            >
              <div className="text-2xl">🍔</div>
              <div className="mt-1 text-xs font-semibold">Products</div>
            </Link>
            <Link
              href="/admin/deals"
              className="rounded-xl border border-white/10 bg-black/20 p-4 text-center transition hover:border-purple-500/50 hover:bg-purple-500/5"
            >
              <div className="text-2xl">🎁</div>
              <div className="mt-1 text-xs font-semibold">Deals</div>
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-xl border border-white/10 bg-black/20 p-4 text-center transition hover:border-green-500/50 hover:bg-green-500/5"
            >
              <div className="text-2xl">🧾</div>
              <div className="mt-1 text-xs font-semibold">Orders</div>
            </Link>
            <Link
              href="/admin/contact"
              className="rounded-xl border border-white/10 bg-black/20 p-4 text-center transition hover:border-yellow-500/50 hover:bg-yellow-500/5"
            >
              <div className="text-2xl">📬</div>
              <div className="mt-1 text-xs font-semibold">Messages</div>
            </Link>
            <Link
              href="/admin/users"
              className="rounded-xl border border-white/10 bg-black/20 p-4 text-center transition hover:border-blue-500/50 hover:bg-blue-500/5"
            >
              <div className="text-2xl">👥</div>
              <div className="mt-1 text-xs font-semibold">Users</div>
            </Link>
          </div>
        </div>

        {/* ─────────── Users table ─────────── */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-bold">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-orange-400 hover:text-orange-300"
            >
              View all →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/30 text-left text-xs uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Provider</th>
                  <th className="px-6 py-3">Verified</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Last Login</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((u) => {
                  const isSelf = u.id === user?.id;
                  return (
                    <tr
                      key={u.id}
                      className="border-t border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${u.role === "admin"
                                ? "bg-gradient-to-br from-orange-500 to-red-500"
                                : "bg-gradient-to-br from-blue-500 to-cyan-500"
                              }`}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {u.name}
                              {isSelf && (
                                <span className="ml-2 rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-300">
                                  YOU
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-300">{u.email}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${u.role === "admin"
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-blue-500/20 text-blue-300"
                            }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 capitalize text-gray-400">
                        {u.provider}
                      </td>
                      <td className="px-6 py-3">
                        {u.email_verified ? "✅" : "❌"}
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        {new Date(u.created_at).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        {u.last_login_at
                          ? new Date(u.last_login_at).toLocaleDateString(
                            "en-PK",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )
                          : "—"}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleRole(u)}
                            disabled={isSelf}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                            title={
                              isSelf ? "Cannot change your own role" : undefined
                            }
                          >
                            {u.role === "admin" ? "Demote" : "Promote"}
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            disabled={isSelf}
                            className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300 hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                            title={
                              isSelf ? "Cannot delete yourself" : undefined
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {users.length > 10 && (
            <div className="border-t border-white/10 px-6 py-3 text-center text-xs text-gray-500">
              Showing 10 of {users.length} users ·{" "}
              <Link
                href="/admin/users"
                className="font-semibold text-orange-400 hover:text-orange-300"
              >
                View all
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}