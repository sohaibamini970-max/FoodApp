"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPKR } from "../CartContext";
import {
  useOrders,
  STATUS_META,
  type Order,
  type OrderStatus,
} from "../OrdersContext";

const FILTERS = [
  { id: "all", label: "All", icon: "📦" },
  { id: "pending", label: "Pending", icon: "⏳" },
  { id: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { id: "on-the-way", label: "On the Way", icon: "🛵" },
  { id: "delivered", label: "Delivered", icon: "🎉" },
  { id: "cancelled", label: "Cancelled", icon: "❌" },
];

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "on-the-way",
  "delivered",
  "cancelled",
];

export default function AdminOrders() {
  const { orders, updateStatus } = useOrders();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Order | null>(null);
  const [localOrders, setLocalOrders] = useState<Order[] | null>(null);

  // Use context orders, or locally-filtered copy for delete
  const displayOrders = localOrders ?? orders;

  const filtered = useMemo(() => {
    let list = [...displayOrders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (filter !== "all") list = list.filter((o) => o.status === filter);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q) ||
          o.userEmail.toLowerCase().includes(q)
      );
    }
    return list;
  }, [displayOrders, filter, search]);

  const revenue = displayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  const handleDelete = () => {
    if (!confirmDelete) return;
    // Remove from local copy
    const next = (localOrders ?? orders).filter(
      (o) => o.id !== confirmDelete.id
    );
    setLocalOrders(next);
    if (selected?.id === confirmDelete.id) setSelected(null);
    setConfirmDelete(null);
  };

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateStatus(id, status);
    if (localOrders) {
      setLocalOrders((prev) =>
        prev ? prev.map((o) => (o.id === id ? { ...o, status } : o)) : prev
      );
    }
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black sm:text-4xl">All Orders</h1>
          <p className="mt-2 text-gray-400">
            Manage every order — {displayOrders.length} total
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Orders" value={displayOrders.length} icon="📦" color="from-blue-500 to-cyan-500" />
        <StatCard label="Pending" value={displayOrders.filter((o) => o.status === "pending").length} icon="⏳" color="from-yellow-500 to-orange-500" />
        <StatCard label="In Progress" value={displayOrders.filter((o) => ["confirmed", "preparing", "on-the-way"].includes(o.status)).length} icon="🚀" color="from-cyan-500 to-blue-500" />
        <StatCard label="Revenue" value={formatPKR(revenue)} icon="💰" color="from-green-500 to-emerald-500" />
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3 transition focus-within:border-orange-500/50">
          <span>🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, customer name or email..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
        </div>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
                filter === f.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                  : "border border-white/10 hover:bg-white/10"
              }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table (desktop) */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
          <div className="text-5xl">📭</div>
          <h3 className="mt-4 text-xl font-bold">No orders found</h3>
          <p className="mt-2 text-sm text-gray-400">
            Try a different filter or search term.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const meta = STATUS_META[o.status];
                    const count = o.items.reduce((s, i) => s + i.quantity, 0);
                    return (
                      <tr
                        key={o.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.03]"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-orange-400">
                            {o.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {count} {count === 1 ? "item" : "items"} ·{" "}
                            {new Date(o.createdAt).toLocaleString("en-PK", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold">
                            {o.userName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {o.userEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-orange-400">
                          {formatPKR(o.total)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleStatusChange(
                                o.id,
                                e.target.value as OrderStatus
                              )
                            }
                            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold outline-none ${meta.bg} ${meta.color}`}
                          >
                            {ALL_STATUSES.map((s) => (
                              <option
                                key={s}
                                value={s}
                                className="bg-[#111] text-white"
                              >
                                {STATUS_META[s].icon} {STATUS_META[s].label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelected(o)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs transition hover:bg-white/10"
                              title="View"
                            >
                              👁
                            </button>
                            <button
                              onClick={() => setConfirmDelete(o)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 transition hover:bg-red-500/20"
                              title="Delete"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 lg:hidden">
            {filtered.map((o) => {
              const meta = STATUS_META[o.status];
              const count = o.items.reduce((s, i) => s + i.quantity, 0);
              return (
                <div
                  key={o.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-orange-400">{o.id}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(o.createdAt).toLocaleString("en-PK", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${meta.bg} ${meta.color}`}
                    >
                      {meta.icon} {meta.label}
                    </span>
                  </div>

                  <div className="mt-3 rounded-2xl border border-white/5 bg-white/5 p-3">
                    <div className="text-xs text-gray-500">Customer</div>
                    <div className="text-sm font-semibold">{o.userName}</div>
                    <div className="text-xs text-gray-500">{o.userEmail}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                    <span className="font-bold text-orange-400">
                      {formatPKR(o.total)}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleStatusChange(o.id, e.target.value as OrderStatus)
                      }
                      className={`flex-1 cursor-pointer rounded-full border px-3 py-2 text-xs font-bold outline-none ${meta.bg} ${meta.color}`}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-[#111] text-white">
                          {STATUS_META[s].icon} {STATUS_META[s].label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setSelected(o)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs transition hover:bg-white/10"
                    >
                      👁
                    </button>
                    <button
                      onClick={() => setConfirmDelete(o)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 transition hover:bg-red-500/20"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111] shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111] p-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-orange-400">
                  Order
                </div>
                <div className="mt-1 text-2xl font-black">{selected.id}</div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg transition hover:bg-red-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Customer
                </div>
                <div className="mt-2 text-lg font-bold">
                  {selected.userName}
                </div>
                <div className="text-sm text-gray-400">
                  {selected.userEmail}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Items ({selected.items.length})
                </h3>
                <div className="space-y-3">
                  {selected.items.map((item) => (
                    <div
                      key={item.id}
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
                          {item.category}
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
                <InfoBox icon="📍" label="Delivery Address" value={selected.address} />
                <InfoBox icon="💳" label="Payment Method" value={selected.paymentMethod} />
              </div>

              <div className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
                <Row label="Subtotal" value={formatPKR(selected.subtotal)} />
                <Row
                  label="Delivery Fee"
                  value={
                    selected.deliveryFee === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      formatPKR(selected.deliveryFee)
                    )
                  }
                />
                <Row label="Tax" value={formatPKR(selected.tax)} />
                {selected.discount > 0 && (
                  <Row
                    label="Discount"
                    value={
                      <span className="text-green-400">
                        −{formatPKR(selected.discount)}
                      </span>
                    }
                  />
                )}
                <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-bold uppercase tracking-widest text-gray-400">
                    Total
                  </span>
                  <span className="text-2xl font-black text-orange-400">
                    {formatPKR(selected.total)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Update Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map((s) => {
                    const m = STATUS_META[s];
                    const active = selected.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selected.id, s)}
                        className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                          active
                            ? `${m.bg} ${m.color} scale-105`
                            : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {m.icon} {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 border-t border-white/10 pt-5">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(selected);
                    setSelected(null);
                  }}
                  className="flex-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-bold shadow-lg shadow-red-500/30 transition hover:scale-[1.02]"
                >
                  🗑 Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
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
              <h2 className="mt-4 text-2xl font-black">Delete Order?</h2>
              <p className="mt-2 text-sm text-gray-400">
                This will permanently remove this order.
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-orange-400">
                    {confirmDelete.id}
                  </div>
                  <div className="text-sm font-bold text-orange-400">
                    {formatPKR(confirmDelete.total)}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {confirmDelete.userName} · {confirmDelete.userEmail}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {confirmDelete.items.length} items
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