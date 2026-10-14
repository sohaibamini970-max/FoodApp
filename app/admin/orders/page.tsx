"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { formatPKR } from "@/components/CartContext";

type AdminOrder = {
  id: number;
  order_token: string;
  customer_name: string;
  customer_phone: string;
  delivery_city: string;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_txn_id: string | null;
  created_at: string;
};

export default function AdminOrdersPage() {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const q = filter !== "all" ? `?status=${filter}` : "";
      const res = await authFetch(`/api/admin/orders${q}`);
      if (!res.ok) {
        setError("Failed to load orders");
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const markPaid = async (id: number) => {
    if (!confirm("Confirm payment received?")) return;
    const res = await authFetch(`/api/admin/orders/${id}/payment`, {
      method: "PATCH",
      body: JSON.stringify({ payment_status: "paid" }),
    });
    if (res.ok) load();
  };

  const setStatus = async (id: number, status: string) => {
    const res = await authFetch(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="mb-2 text-3xl font-black">Orders</h1>
      <p className="mb-6 text-sm text-gray-400">
        {orders.length} order{orders.length !== 1 ? "s" : ""} · Verify payments,
        update status
      </p>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          ❌ {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          "all",
          "pending",
          "confirmed",
          "preparing",
          "out_for_delivery",
          "delivered",
          "cancelled",
        ].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
              filter === f
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : "border border-white/10 hover:bg-white/10"
            }`}
          >
            {f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-mono text-sm text-orange-400">
                  {o.order_token.slice(0, 14)}…
                </div>
                <div className="mt-1 text-lg font-bold">{o.customer_name}</div>
                <div className="text-xs text-gray-500">
                  {o.customer_phone} · {o.delivery_city}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 font-bold text-blue-300">
                    {o.status}
                  </span>
                  <span className="rounded-full bg-orange-500/20 px-2 py-0.5 font-bold text-orange-300">
                    {o.payment_method}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-bold ${
                      o.payment_status === "paid"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {o.payment_status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-orange-400">
                  {formatPKR(o.total)}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(o.created_at).toLocaleString("en-PK")}
                </div>
              </div>
            </div>

            {/* Manual payment verification */}
            {o.payment_method !== "cod" && o.payment_status !== "paid" && (
              <div className="mt-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
                <div className="text-xs font-bold uppercase text-orange-300">
                  ⚠️ Awaiting payment verification
                </div>
                <div className="mt-2 text-sm">
                  TID:{" "}
                  <span className="rounded-md bg-black/40 px-2 py-1 font-mono font-bold text-white">
                    {o.payment_txn_id || "(none)"}
                  </span>
                </div>
                <button
                  onClick={() => markPaid(o.id)}
                  className="mt-3 rounded-full bg-green-500/20 px-4 py-2 text-xs font-bold text-green-300 hover:bg-green-500/30"
                >
                  ✅ Confirm Payment
                </button>
              </div>
            )}

            {/* Status control */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
              {[
                "pending",
                "confirmed",
                "preparing",
                "out_for_delivery",
                "delivered",
                "cancelled",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(o.id, s)}
                  disabled={o.status === s}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold hover:bg-white/10 disabled:opacity-30"
                >
                  {s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center text-gray-500">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
}