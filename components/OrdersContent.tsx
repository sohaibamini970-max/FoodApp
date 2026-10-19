"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPKR } from "@/components/CartContext";
import {
  useOrders,
  STATUS_META,
  ORDER_STEPS,
  type Order,
} from "@/components/OrdersContext";

const FILTERS = [
  { id: "all", label: "All Orders", icon: "📦" },
  { id: "active", label: "Active", icon: "🚀" },
  { id: "delivered", label: "Delivered", icon: "🎉" },
  { id: "cancelled", label: "Cancelled", icon: "❌" },
];

export default function OrdersContent({ initialToken }: { initialToken?: string }) {
  const { orders, loading, cancelOrder } = useOrders();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const myOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [orders]
  );

  const filtered = useMemo(() => {
    let list = [...myOrders];
    if (filter === "active")
      list = list.filter((o) =>
        ["pending", "confirmed", "preparing", "out_for_delivery"].includes(o.status)
      );
    else if (filter === "delivered")
      list = list.filter((o) => o.status === "delivered");
    else if (filter === "cancelled")
      list = list.filter((o) => o.status === "cancelled");

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.order_token.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [myOrders, filter, search]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCancel = async (id: number) => {
    const res = await cancelOrder(id);
    if (!res.ok) {
      alert(res.error || "Cancel failed");
      return;
    }
    showToast("Order cancelled");
    setSelected(null);
  };

  const activeCount = myOrders.filter((o) =>
    ["pending", "confirmed", "preparing", "out_for_delivery"].includes(o.status)
  ).length;

  const totalSpent = myOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total), 0);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="relative overflow-hidden pt-40 pb-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
          <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-400">Home</Link>
            <span>/</span>
            <span className="text-white">Orders</span>
          </nav>
          <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">
            My{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Orders
            </span>
          </h1>
          <p className="mt-3 text-gray-400">
            Track all your orders and their live status here.
          </p>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
              <div className="text-6xl">{myOrders.length === 0 ? "🍽️" : "🔍"}</div>
              <h3 className="mt-4 text-2xl font-bold">
                {myOrders.length === 0
                  ? "No orders yet"
                  : "No orders match your filter"}
              </h3>
              <Link
                href="/menu"
                className="mt-6 inline-flex rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold"
              >
                Browse Menu →
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="pb-24">
          <div className="mx-auto max-w-7xl space-y-4 px-6">
            {filtered.map((order) => {
              const meta = STATUS_META[order.status];
              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs text-orange-400">
                        {order.order_token.slice(0, 14)}…
                      </div>
                      <div className="mt-1 text-lg font-bold">
                        {order.customer_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleString("en-PK")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-orange-400">
                        {formatPKR(Number(order.total))}
                      </div>
                      <div className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.color}`}>
                        {meta.icon} {meta.label}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                    <Link
                      href={`/orders/${order.order_token}`}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10"
                    >
                      👁 View Details
                    </Link>
                    {["pending", "confirmed"].includes(order.status) && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                      >
                        ❌ Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-green-500/30 bg-green-500/20 px-6 py-3 text-sm font-bold text-green-300 backdrop-blur">
          ✅ {toast}
        </div>
      )}
    </main>
  );
}
