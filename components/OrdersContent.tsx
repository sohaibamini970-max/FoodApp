"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPKR } from "../app/components/CartContext";
import {
  useOrders,
  STATUS_META,
  ORDER_STEPS,
  type Order,
} from "./OrdersContext";
const FILTERS = [
  { id: "all", label: "All Orders", icon: "📦" },
  { id: "active", label: "Active", icon: "🚀" },
  { id: "delivered", label: "Delivered", icon: "🎉" },
  { id: "cancelled", label: "Cancelled", icon: "❌" },
];

export default function OrdersContent() {
  const { orders, updateStatus } = useOrders();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* ✅ Show ALL orders on this device */
  const myOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  const filtered = useMemo(() => {
    let list = [...myOrders];

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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCancel = (orderId: string) => {
    updateStatus(orderId, "cancelled");
    if (selected?.id === orderId) {
      setSelected({ ...selected, status: "cancelled" });
    }
    showToast("Order cancelled successfully");
  };

  const activeCount = myOrders.filter((o) =>
    ["pending", "confirmed", "preparing", "on-the-way"].includes(o.status)
  ).length;

  const totalSpent = myOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-40 pb-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
          <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="transition hover:text-orange-400">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Orders</span>
          </nav>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
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

            <Link
              href="/menu"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/10"
            >
              + New Order
            </Link>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="relative pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              label="Total Orders"
              value={myOrders.length}
              icon="📦"
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              label="Active"
              value={activeCount}
              icon="🚀"
              color="from-orange-500 to-red-500"
            />
            <StatCard
              label="Delivered"
              value={myOrders.filter((o) => o.status === "delivered").length}
              icon="🎉"
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              label="Total Spent"
              value={formatPKR(totalSpent)}
              icon="💰"
              color="from-pink-500 to-purple-500"
            />
          </div>
        </div>
      </section>

      {/* ============ TOOLBAR ============ */}
      <section className="relative pb-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3 transition focus-within:border-orange-500/50">
              <span>🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID or dish name..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              {FILTERS.map((f) => {
                const count =
                  f.id === "all"
                    ? myOrders.length
                    : f.id === "active"
                    ? activeCount
                    : f.id === "delivered"
                    ? myOrders.filter((o) => o.status === "delivered").length
                    : myOrders.filter((o) => o.status === "cancelled").length;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                      filter === f.id
                        ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                        : "border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span>{f.icon}</span>
                    {f.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        filter === f.id ? "bg-white/20" : "bg-white/10"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ORDERS LIST ============ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
              <div className="text-6xl">
                {myOrders.length === 0 ? "🍽️" : "🔍"}
              </div>
              <h3 className="mt-4 text-2xl font-bold">
                {myOrders.length === 0
                  ? "No orders yet"
                  : "No orders match your filter"}
              </h3>
              <p className="mt-2 text-gray-400">
                {myOrders.length === 0
                  ? "Place your first order and it'll appear here."
                  : "Try a different filter or search term."}
              </p>
              <Link
                href="/menu"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold transition hover:scale-105"
              >
                Browse Menu →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={() => setSelected(order)}
                  onCancel={() => handleCancel(order.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ DETAIL MODAL ============ */}
      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onCancel={() => handleCancel(selected.id)}
        />
      )}

      {/* ============ TOAST ============ */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-[slideUp_0.3s_ease-out]">
          <div className="rounded-full border border-green-500/30 bg-green-500/20 px-6 py-3 text-sm font-bold text-green-300 backdrop-blur-xl shadow-2xl">
            ✅ {toast}
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   ORDER CARD
============================================================ */
function OrderCard({
  order,
  onView,
  onCancel,
}: {
  order: Order;
  onView: () => void;
  onCancel: () => void;
}) {
  const meta = STATUS_META[order.status];
  const stepIndex = ORDER_STEPS.indexOf(order.status);
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const isActive = ["pending", "confirmed", "preparing", "on-the-way"].includes(
    order.status
  );

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5 backdrop-blur transition hover:border-orange-500/40 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0">
            {order.items.slice(0, 3).map((item, idx) => (
              <img
                key={item.id + "-" + idx}
                src={item.img}
                alt={item.name}
                className="absolute h-10 w-10 rounded-full border-2 border-[#0a0a0a] object-cover"
                style={{
                  top: idx === 0 ? 0 : idx === 1 ? 24 : 0,
                  left: idx === 0 ? 0 : idx === 1 ? 0 : 24,
                  zIndex: 10 - idx,
                }}
              />
            ))}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-black tracking-wide text-orange-400">
                {order.id}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.color}`}
              >
                {meta.icon} {meta.label}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleString("en-PK", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="mt-2 text-sm text-gray-300">
              {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
              {order.items
                .slice(0, 2)
                .map((i) => i.name)
                .join(", ")}
              {order.items.length > 2 &&
                ` +${order.items.length - 2} more`}
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-2xl font-black text-orange-400">
            {formatPKR(order.total)}
          </div>
          <div className="text-xs text-gray-500">{order.paymentMethod}</div>
        </div>
      </div>

      {isActive && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-white">
              {meta.icon} {meta.label}
            </span>
            <span className="text-gray-400">
              ETA{" "}
              {new Date(order.estimatedDelivery).toLocaleTimeString("en-PK", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {ORDER_STEPS.map((step, i) => {
              const done = i <= stepIndex;
              return (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    done
                      ? "bg-gradient-to-r from-orange-500 to-red-500"
                      : "bg-white/10"
                  }`}
                />
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
            {ORDER_STEPS.map((step, i) => (
              <span
                key={step}
                className={i <= stepIndex ? "text-orange-400" : ""}
              >
                {STATUS_META[step].label}
              </span>
            ))}
          </div>
        </div>
      )}

      {order.status === "delivered" && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/5 p-3 text-xs text-green-300">
          🎉 Delivered on{" "}
          {new Date(order.estimatedDelivery).toLocaleString("en-PK", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
      {order.status === "cancelled" && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
          ❌ This order was cancelled
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/5 pt-4">
        <button
          onClick={onView}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold transition hover:bg-white/10"
        >
          👁 View Details
        </button>

        {order.status === "delivered" && (
          <Link
            href="/menu"
            className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-xs font-bold transition hover:scale-105"
          >
            🔁 Reorder
          </Link>
        )}

        {["pending", "confirmed"].includes(order.status) && (
          <button
            onClick={onCancel}
            className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            ❌ Cancel Order
          </button>
        )}

        {["preparing", "on-the-way"].includes(order.status) && (
          <button className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20">
            🛵 Track Live
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL MODAL
============================================================ */
function OrderDetailModal({
  order,
  onClose,
  onCancel,
}: {
  order: Order;
  onClose: () => void;
  onCancel: () => void;
}) {
  const meta = STATUS_META[order.status];
  const stepIndex = ORDER_STEPS.indexOf(order.status);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111] shadow-2xl animate-[scaleIn_0.25s_ease-out]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111] p-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Order
            </div>
            <div className="mt-1 text-2xl font-black">{order.id}</div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg transition hover:bg-red-500"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className={`rounded-2xl border p-5 ${meta.bg}`}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{meta.icon}</span>
              <div className="flex-1">
                <div className={`text-lg font-black ${meta.color}`}>
                  {meta.label}
                </div>
                <div className="text-xs text-gray-400">
                  {order.status === "delivered"
                    ? "Delivered successfully"
                    : order.status === "cancelled"
                    ? "This order was cancelled"
                    : `Expected by ${new Date(
                        order.estimatedDelivery
                      ).toLocaleTimeString("en-PK", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                </div>
              </div>
            </div>

            {order.status !== "cancelled" && (
              <div className="mt-4 flex items-center gap-1">
                {ORDER_STEPS.map((step, i) => {
                  const done = i <= stepIndex;
                  return (
                    <div
                      key={step}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        done
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : "bg-white/10"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={item.id + "-" + idx}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-3"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {item.category} · ⏱ {item.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-400">
                      {formatPKR(item.price * item.quantity)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.quantity} × {formatPKR(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBox icon="📍" label="Delivery Address" value={order.address} />
            <InfoBox
              icon="💳"
              label="Payment Method"
              value={order.paymentMethod}
            />
            <InfoBox
              icon="📅"
              label="Ordered On"
              value={new Date(order.createdAt).toLocaleString("en-PK", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <InfoBox
              icon="⏱"
              label={order.status === "delivered" ? "Delivered At" : "Estimated"}
              value={new Date(order.estimatedDelivery).toLocaleString("en-PK", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              Payment Summary
            </h3>
            <div className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
              <Row label="Subtotal" value={formatPKR(order.subtotal)} />
              <Row
                label="Delivery Fee"
                value={
                  order.deliveryFee === 0 ? (
                    <span className="text-green-400">FREE</span>
                  ) : (
                    formatPKR(order.deliveryFee)
                  )
                }
              />
              <Row label="Tax (5%)" value={formatPKR(order.tax)} />
              {order.discount > 0 && (
                <Row
                  label={`Discount ${order.promoCode ? `(${order.promoCode})` : ""}`}
                  value={
                    <span className="text-green-400">
                      −{formatPKR(order.discount)}
                    </span>
                  }
                />
              )}
              <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-bold uppercase tracking-widest text-gray-400">
                  Total
                </span>
                <span className="text-2xl font-black text-orange-400">
                  {formatPKR(order.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {order.status === "delivered" && (
              <Link
                href="/menu"
                className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-center font-bold shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
              >
                🔁 Reorder
              </Link>
            )}
            {["pending", "confirmed"].includes(order.status) && (
              <button
                onClick={onCancel}
                className="flex-1 rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 font-bold text-red-300 transition hover:bg-red-500/20"
              >
                ❌ Cancel Order
              </button>
            )}
            {["preparing", "on-the-way"].includes(order.status) && (
              <button className="flex-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold shadow-lg shadow-cyan-500/30 transition hover:scale-[1.02]">
                🛵 Track Live
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
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
      <div className="relative mt-4 text-2xl font-black">{value}</div>
      <div className="relative mt-1 text-xs text-gray-500">{label}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
        <span>{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-sm text-gray-200">{value}</div>
    </div>
  );
}
