"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, formatPKR } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";

const ADMIN_PHONE = "0300-1234567";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    deliveryFee,
    tax,
    total,
    loading: cartLoading,
    refresh: refreshCart,
  } = useCart();
  const { user, authFetch } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    customer_name: user?.name || "",
    customer_email: user?.email || "",
    customer_phone: "",
    delivery_address: "",
    delivery_city: "",
    delivery_notes: "",
  });
  const [promo, setPromo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "jazzcash" | "easypaisa"
  >("cod");
  const [txnId, setTxnId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill user info when auth hydrates
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        customer_name: f.customer_name || user.name || "",
        customer_email: f.customer_email || user.email || "",
      }));
    }
  }, [user]);

  const discount =
    promo.trim().toUpperCase() === "FOODIE10" ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, total - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!form.customer_name.trim()) return setError("Please enter your name");
    if (!form.customer_phone.trim())
      return setError("Please enter your phone number");
    if (form.customer_phone.trim().length < 10)
      return setError("Please enter a valid phone number");
    if (!form.delivery_address.trim())
      return setError("Please enter your delivery address");
    if (!form.delivery_city.trim()) return setError("Please enter your city");
    if (
      (paymentMethod === "jazzcash" || paymentMethod === "easypaisa") &&
      !txnId.trim()
    )
      return setError("Please enter the Transaction ID from your payment");

    setSubmitting(true);

    const res = await authFetch("/api/orders/checkout", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        promo_code: promo.trim() || undefined,
        payment_method: paymentMethod,
        payment_txn_id: txnId.trim() || undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSubmitting(false);

    if (!res.ok) {
      setError(data.message || "Could not place order");
      return;
    }

    // Clear local cart state
    await refreshCart();

    // Redirect to tracking page
    router.push(data.tracking_url || `/order/${data.order.order_token}`);
  };

  /* ── Loading ── */
  if (cartLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
          <p className="text-sm text-gray-400">Loading checkout…</p>
        </div>
      </main>
    );
  }

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0a0a0a] px-6 text-white">
        <div className="text-6xl">🛒</div>
        <h1 className="text-2xl font-black">Your cart is empty</h1>
        <p className="text-gray-400">
          Add some items before checking out.
        </p>
        <Link
          href="/menu"
          className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-105"
        >
          Browse Menu →
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HERO */}
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

        <div className="relative mx-auto max-w-6xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-400">
              Home
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-orange-400">
              Cart
            </Link>
            <span>/</span>
            <span className="text-white">Checkout</span>
          </nav>
          <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">
            Check
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              out
            </span>
          </h1>
          <p className="mt-3 text-gray-400">
            {user
              ? `Logged in as ${user.email}`
              : "Ordering as guest — no signup needed"}
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
            {/* LEFT COLUMN */}
            <div className="space-y-6 lg:col-span-2">
              {/* 1. Delivery details */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-lg font-black">
                    1
                  </div>
                  <h2 className="text-xl font-black">Delivery Details</h2>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full Name *">
                    <input
                      type="text"
                      value={form.customer_name}
                      onChange={(e) =>
                        setForm({ ...form, customer_name: e.target.value })
                      }
                      required
                      placeholder="John Doe"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                    />
                  </Field>

                  <Field label="Phone Number *">
                    <input
                      type="tel"
                      value={form.customer_phone}
                      onChange={(e) =>
                        setForm({ ...form, customer_phone: e.target.value })
                      }
                      required
                      placeholder="+92 300 1234567"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                    />
                  </Field>

                  <Field label="Email (optional)">
                    <input
                      type="email"
                      value={form.customer_email}
                      onChange={(e) =>
                        setForm({ ...form, customer_email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                    />
                  </Field>

                  <Field label="City *">
                    <input
                      type="text"
                      value={form.delivery_city}
                      onChange={(e) =>
                        setForm({ ...form, delivery_city: e.target.value })
                      }
                      required
                      placeholder="Karachi"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Delivery Address *">
                      <textarea
                        value={form.delivery_address}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            delivery_address: e.target.value,
                          })
                        }
                        required
                        rows={3}
                        placeholder="House #, street, area…"
                        className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field label="Delivery Notes (optional)">
                      <textarea
                        value={form.delivery_notes}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            delivery_notes: e.target.value,
                          })
                        }
                        rows={2}
                        placeholder="Ring the bell twice, leave at door, etc."
                        className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* 2. Payment method */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-lg font-black">
                    2
                  </div>
                  <h2 className="text-xl font-black">Payment Method</h2>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`rounded-2xl border p-4 text-left transition ${paymentMethod === "cod"
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                  >
                    <div className="text-2xl">💵</div>
                    <div className="mt-2 font-bold">Cash on Delivery</div>
                    <div className="text-xs text-gray-400">
                      Pay when it arrives
                    </div>
                  </button>

                  {/* JazzCash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("jazzcash")}
                    className={`rounded-2xl border p-4 text-left transition ${paymentMethod === "jazzcash"
                        ? "border-red-500 bg-red-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                  >
                    <div className="text-2xl">📱</div>
                    <div className="mt-2 font-bold">JazzCash</div>
                    <div className="text-xs text-gray-400">
                      Manual transfer
                    </div>
                  </button>

                  {/* EasyPaisa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("easypaisa")}
                    className={`rounded-2xl border p-4 text-left transition ${paymentMethod === "easypaisa"
                        ? "border-green-500 bg-green-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                  >
                    <div className="text-2xl">💚</div>
                    <div className="mt-2 font-bold">EasyPaisa</div>
                    <div className="text-xs text-gray-400">
                      Manual transfer
                    </div>
                  </button>
                </div>

                {/* Manual payment instructions */}
                {(paymentMethod === "jazzcash" ||
                  paymentMethod === "easypaisa") && (
                    <div className="mt-6 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5">
                      <div className="text-sm font-bold text-orange-300">
                        📲 Send payment to:
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
                        <div className="font-mono text-xl font-black text-white">
                          {ADMIN_PHONE}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(ADMIN_PHONE);
                            alert("Number copied!");
                          }}
                          className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20"
                        >
                          📋 Copy
                        </button>
                      </div>

                      <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-gray-400">
                        <div className="font-semibold text-white">
                          FoodieHub Official
                        </div>
                        <div>Amount to send: {formatPKR(finalTotal)}</div>
                        <div className="mt-1">
                          Open your{" "}
                          {paymentMethod === "jazzcash"
                            ? "JazzCash"
                            : "EasyPaisa"}{" "}
                          app, send this exact amount, then copy the{" "}
                          <strong className="text-white">
                            Transaction ID (TID)
                          </strong>{" "}
                          from the receipt.
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                          Transaction ID (TID) *
                        </label>
                        <input
                          type="text"
                          value={txnId}
                          onChange={(e) => setTxnId(e.target.value)}
                          placeholder="e.g. 1234567890"
                          required
                          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          You'll find this on your payment receipt screen.
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              {/* Back to cart */}
              <div>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>

            {/* RIGHT — Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur">
                  <div className="border-b border-white/10 bg-white/[0.02] px-6 py-5">
                    <h2 className="text-xl font-black">Order Summary</h2>
                  </div>

                  <div className="space-y-4 p-6">
                    {/* Items */}
                    <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 text-sm">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold">
                              {item.name}
                              {item.variant_label && (
                                <span className="text-purple-400">
                                  {" "}
                                  · {item.variant_label}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.quantity} × {formatPKR(item.price)}
                            </div>
                          </div>
                          <div className="shrink-0 font-bold text-orange-400">
                            {formatPKR(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Promo */}
                    <div className="border-t border-white/10 pt-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Promo Code
                      </label>
                      <input
                        type="text"
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder="FOODIE10"
                        className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none focus:border-orange-500/50"
                      />
                      {promo && (
                        <p className="mt-1 text-xs text-gray-400">
                          {discount > 0
                            ? `✅ ${formatPKR(discount)} off applied`
                            : "❌ Invalid promo code"}
                        </p>
                      )}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 border-t border-white/10 pt-3 text-sm">
                      <Row label="Subtotal" value={formatPKR(subtotal)} />
                      <Row
                        label="Delivery Fee"
                        value={
                          deliveryFee === 0 ? (
                            <span className="text-green-400">FREE</span>
                          ) : (
                            formatPKR(deliveryFee)
                          )
                        }
                      />
                      <Row label="Tax" value={formatPKR(tax)} />
                      {discount > 0 && (
                        <Row
                          label="Discount"
                          value={
                            <span className="text-green-400">
                              −{formatPKR(discount)}
                            </span>
                          }
                        />
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
                        Total
                      </span>
                      <span className="text-2xl font-black text-orange-400">
                        {formatPKR(finalTotal)}
                      </span>
                    </div>

                    {error && (
                      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        ❌ {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02] disabled:opacity-60"
                    >
                      {submitting ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      ) : (
                        <>
                          Place Order · {formatPKR(finalTotal)}
                          <span className="transition group-hover:translate-x-1">
                            →
                          </span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-500">
                      🔒 Secure checkout · No signup required
                    </p>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <div className="text-lg">🔒</div>
                    <div className="mt-1">Secure</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <div className="text-lg">⚡</div>
                    <div className="mt-1">Fast</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <div className="text-lg">✅</div>
                    <div className="mt-1">Fresh</div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

/* ═══════════════ HELPERS ═══════════════ */
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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}