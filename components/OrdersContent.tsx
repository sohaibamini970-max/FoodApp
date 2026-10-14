"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPKR } from "./CartContext";
import { useAuth } from "./AuthContext";
import {
  useOrders,
  STATUS_META,
  ORDER_STEPS,
  type Order,
  type OrderStatus,
} from "./OrdersContext";

const FILTERS = [
  { id: "all", label: "All Orders", icon: "📦" },
  { id: "active", label: "Active", icon: "🚀" },
  { id: "delivered", label: "Delivered", icon: "🎉" },
  { id: "cancelled", label: "Cancelled", icon: "❌" },
];

export default function OrdersContent() {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  // ✅ Only this user's orders
  const myOrders = user ? getOrdersByUser(user.email) : [];

  const filtered = useMemo(() => {
    let list = [...myOrders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (filter === "active")
      list = list.filter((o) =>
        ["pending", "confirmed", "preparing", "on-the-way"].includes(o.status)
      );
    else if (filter === "delivered")
      list = list.filter((o) => o.status === "delivered");
    else if (filter === "cancelled")
      list = list.filter((o) => o.status === "cancelled");

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    return list;
  }, [myOrders, filter, search]);

  // If not logged in → prompt
  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="relative overflow-hidden pt-40 pb-32">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
            <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div className="text-6xl">🔒</div>
            <h1 className="mt-6 text-4xl font-black sm:text-5xl">
              Sign in to view orders
            </h1>
            <p className="mx-auto mt-4 max-w-md text-gray-400">
              Log in to your account to track your orders and view order
              history.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-105"
              >
                Sign In →
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ...rest of the JSX identical to before, but replace:
  // - `orders.filter(...)` in the stats with `myOrders`
  // - `STATUS_META` and `STEPS` imports come from OrdersContext now
  // - use `ORDER_STEPS` instead of local `STEPS`