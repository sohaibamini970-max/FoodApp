"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function AdminDashboard() {
  const { users } = useAuth();

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: "👥",
      color: "from-blue-500 to-cyan-500",
      change: "+12%",
    },
    {
      label: "Products",
      value: 12,
      icon: "🍔",
      color: "from-orange-500 to-red-500",
      change: "+3",
    },
    {
      label: "Active Deals",
      value: 6,
      icon: "🎁",
      color: "from-pink-500 to-purple-500",
      change: "+2",
    },
    {
      label: "Revenue (mo.)",
      value: "Rs 842K",
      icon: "💰",
      color: "from-green-500 to-emerald-500",
      change: "+18%",
    },
  ];

  const recent = [
    { user: "John Doe", action: "placed an order", time: "2 min ago", amount: "Rs 2,499", type: "order" },
    { user: "Sarah Smith", action: "registered", time: "1 hour ago", amount: "", type: "user" },
    { user: "Ahmed Khan", action: "placed an order", time: "3 hours ago", amount: "Rs 1,899", type: "order" },
    { user: "Fatima Ali", action: "left a review", time: "5 hours ago", amount: "", type: "review" },
    { user: "Zara Ahmed", action: "placed an order", time: "8 hours ago", amount: "Rs 3,299", type: "order" },
  ];

  const quickActions = [
    { href: "/admin/products", label: "Add Product", icon: "➕", desc: "Create a new dish" },
    { href: "/admin/deals", label: "Add Deal", icon: "🎁", desc: "Launch a new combo" },
    { href: "/admin/users", label: "Manage Users", icon: "👥", desc: "View & edit accounts" },
    { href: "/menu", label: "View Menu", icon: "🌐", desc: "Preview live site" },
  ];

  const topProducts = [
    { name: "Double Cheeseburger", sales: 342, revenue: "Rs 44,400", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80" },
    { name: "Pepperoni Pizza", sales: 289, revenue: "Rs 46,200", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80" },
    { name: "Chocolate Lava Cake", sales: 421, revenue: "Rs 37,800", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&q=80" },
    { name: "Salmon Sushi Set", sales: 198, revenue: "Rs 45,500", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&q=80" },
  ];

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-gray-400">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-400">
              ● Live
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-orange-500/40"
          >
            <div
              className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl transition group-hover:opacity-40`}
            />
            <div className="relative flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-2xl`}
              >
                {s.icon}
              </div>
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
                {s.change}
              </span>
            </div>
            <div className="relative mt-4 text-3xl font-black">{s.value}</div>
            <div className="relative mt-1 text-xs text-gray-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5 transition hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-2xl shadow-lg shadow-orange-500/30 transition group-hover:scale-110">
                {a.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold">{a.label}</div>
                <div className="truncate text-xs text-gray-500">{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity + Top Products */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <button className="text-xs font-semibold text-orange-400 hover:text-orange-300">
              View All →
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {recent.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-orange-500/30"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                      r.type === "order"
                        ? "bg-orange-500/20"
                        : r.type === "user"
                        ? "bg-blue-500/20"
                        : "bg-pink-500/20"
                    }`}
                  >
                    {r.type === "order" ? "🛒" : r.type === "user" ? "👤" : "⭐"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      {r.user}{" "}
                      <span className="font-normal text-gray-400">
                        {r.action}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{r.time}</div>
                  </div>
                </div>
                {r.amount && (
                  <div className="text-sm font-bold text-orange-400">
                    {r.amount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold">Top Products</h2>
          <div className="mt-4 space-y-3">
            {topProducts.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 transition hover:border-orange-500/30"
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {p.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {p.sales} sales
                  </div>
                </div>
                <div className="text-right text-xs font-bold text-orange-400">
                  {p.revenue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}