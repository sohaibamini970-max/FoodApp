"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, formatPKR } from "../../components/CartContext";
import { useAuth } from "../../components/AuthContext";
import { useOrders } from "../../components/OrdersContext";

type PaymentMethod = "card" | "cod" | "wallet";

export default function CheckoutContent() {
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder} = useOrders();
  const router = useRouter();

  /* ===== Steps ===== */
  const [step, setStep] = useState<1 | 2 | 3>(1);

  /* ===== Form ===== */
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "Karachi",
    notes: "",
    payment: "cod" as PaymentMethod,
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  });

  /* ===== Validation ===== */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  /* ===== Redirect if cart is empty ===== */
  useEffect(() => {
    if (items.length === 0 && !placedOrderId) {
      router.replace("/cart");
    }
  }, [items, placedOrderId, router]);

  /* ===== Delivery fee recalc (server-free) ===== */
  const finalDeliveryFee = subtotal >= 3000 ? 0 : 199;
  const finalTax = Math.round(subtotal * 0.05);
  const finalTotal = subtotal + finalDeliveryFee + finalTax;

  /* ===== Step 1 → Step 2 validation ===== */
  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[0-9+\-\s]{10,15}$/.test(form.phone))
      e.phone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ===== Step 2 → Step 3 validation ===== */
  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (form.payment === "card") {
      if (!form.cardName.trim()) e.cardName = "Cardholder name required";
      if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s/g, "")))
        e.cardNumber = "Enter a valid card number";
      if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry))
        e.cardExpiry = "Use MM/YY format";
      if (!/^\d{3,4}$/.test(form.cardCvv))
        e.cardCvv = "CVV must be 3-4 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ===== Place order ===== */
const handlePlaceOrder = () => {
  if (form.payment === "card" && !validateStep2()) return;
  if (items.length === 0) return;

  setPlacing(true);

  const paymentLabel =
    form.payment === "cod"
      ? "Cash on Delivery"
      : form.payment === "card"
      ? `Card •••• ${form.cardNumber.replace(/\s/g, "").slice(-4)}`
      : "Mobile Wallet";

  const order = addOrder({
    userName: user?.name || form.fullName || "Guest",
    items,
    subtotal,
    deliveryFee: finalDeliveryFee,
    tax: finalTax,
    discount: 0,
    total: finalTotal,
    address: `${form.address}, ${form.city}`,
    paymentMethod: paymentLabel,
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  });

  clearCart();
  setPlacedOrderId(order.id);

  setTimeout(() => {
    router.push(`/orders?id=${order.id}`);
  }, 2500);
};

  /* ============================================================
     SUCCESS SCREEN
  ============================================================ */
  if (placedOrderId) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-green-500/20 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-lg text-center">
            <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-green-500/30" />
              <div className="absolute inset-4 animate-pulse rounded-full bg-green-500/40" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-5xl shadow-2xl shadow-green-500/50">
                ✓
              </div>
            </div>

            <h1 className="text-4xl font-black sm:text-5xl">
              Order{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Confirmed!
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-gray-400">
              Thank you for your order. We're preparing your delicious meal
              right now.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Order ID
              </div>
              <div className="mt-2 text-2xl font-black text-orange-400">
                {placedOrderId}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="font-bold">{formatPKR(finalTotal)}</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="text-xs text-gray-500">ETA</div>
                  <div className="font-bold">~30 min</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              Redirecting to track your order...
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     MAIN CHECKOUT
  ============================================================ */
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-orange-400 transition">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-orange-400 transition">Cart</Link>
          <span>/</span>
          <span className="text-white">Checkout</span>
        </nav>

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">
            Secure{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Checkout
            </span>
          </h1>
          <p className="mt-3 text-gray-400">
            {!user && (
              <span className="mr-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                👤 Guest checkout
              </span>
            )}
            {user && (
              <span className="mr-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                ✅ Signed in as {user.name}
              </span>
            )}
            Complete the steps below to place your order.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="mb-10 flex items-center justify-center gap-4 sm:gap-8">
          <StepIndicator step={1} current={step} label="Delivery" icon="📍" />
          <StepLine active={step > 1} />
          <StepIndicator step={2} current={step} label="Payment" icon="💳" />
          <StepLine active={step > 2} />
          <StepIndicator step={3} current={step} label="Review" icon="✅" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT — Form */}
          <div className="lg:col-span-2">
            {/* ============ STEP 1: DELIVERY ============ */}
            {step === 1 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8 animate-[slideDown_0.25s_ease-out]">
                <h2 className="text-2xl font-black">Delivery Details</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Where should we send your order?
                </p>

                <div className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name" error={errors.fullName}>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                      />
                    </Field>
                    <Field label="Phone Number" error={errors.phone}>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+92 300 1234567"
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                      />
                    </Field>
                  </div>

                  <Field label="Email (optional)">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                    />
                  </Field>

                  <Field label="Delivery Address" error={errors.address}>
                    <textarea
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="House 12, Street 5, Block A..."
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="City" error={errors.city}>
                      <select
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                        className="w-full cursor-pointer rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
                      >
                        <option className="bg-[#111]">Karachi</option>
                        <option className="bg-[#111]">Lahore</option>
                        <option className="bg-[#111]">Islamabad</option>
                        <option className="bg-[#111]">Rawalpindi</option>
                        <option className="bg-[#111]">Faisalabad</option>
                        <option className="bg-[#111]">Multan</option>
                      </select>
                    </Field>
                    <Field label="Delivery Notes (optional)">
                      <input
                        type="text"
                        value={form.notes}
                        onChange={(e) =>
                          setForm({ ...form, notes: e.target.value })
                        }
                        placeholder="Ring the bell twice"
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                      />
                    </Field>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/cart"
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-center font-semibold transition hover:bg-white/10"
                  >
                    ← Back to Cart
                  </Link>
                  <button
                    onClick={() => validateStep1() && setStep(2)}
                    className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3.5 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* ============ STEP 2: PAYMENT ============ */}
            {step === 2 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8 animate-[slideDown_0.25s_ease-out]">
                <h2 className="text-2xl font-black">Payment Method</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Choose how you'd like to pay.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { id: "cod", icon: "💵", title: "Cash on Delivery", desc: "Pay when it arrives" },
                    { id: "card", icon: "💳", title: "Credit/Debit Card", desc: "Visa, Mastercard" },
                    { id: "wallet", icon: "📱", title: "Mobile Wallet", desc: "JazzCash, EasyPaisa" },
                  ].map((p) => {
                    const active = form.payment === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() =>
                          setForm({ ...form, payment: p.id as PaymentMethod })
                        }
                        className={`group rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-orange-500 bg-gradient-to-br from-orange-500/20 to-red-500/10 shadow-lg shadow-orange-500/20"
                            : "border-white/10 bg-white/5 hover:border-orange-500/40 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-3xl">{p.icon}</div>
                        <div className="mt-3 text-sm font-bold">{p.title}</div>
                        <div className="mt-0.5 text-[10px] text-gray-500">
                          {p.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Card form */}
                {form.payment === "card" && (
                  <div className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-black/40 p-6 animate-[slideDown_0.2s_ease-out]">
                    <Field label="Cardholder Name" error={errors.cardName}>
                      <input
                        type="text"
                        value={form.cardName}
                        onChange={(e) =>
                          setForm({ ...form, cardName: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                      />
                    </Field>
                    <Field label="Card Number" error={errors.cardNumber}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={form.cardNumber}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            cardNumber: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 19)
                              .replace(/(.{4})/g, "$1 ")
                              .trim(),
                          })
                        }
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Expiry" error={errors.cardExpiry}>
                        <input
                          type="text"
                          value={form.cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4);
                            if (v.length > 2)
                              v = v.slice(0, 2) + "/" + v.slice(2);
                            setForm({ ...form, cardExpiry: v });
                          }}
                          placeholder="MM/YY"
                          className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                        />
                      </Field>
                      <Field label="CVV" error={errors.cardCvv}>
                        <input
                          type="password"
                          value={form.cardCvv}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              cardCvv: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4),
                            })
                          }
                          placeholder="•••"
                          className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                        />
                      </Field>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      🔒 Your payment information is encrypted and secure.
                    </div>
                  </div>
                )}

                {form.payment === "wallet" && (
                  <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-6 text-center animate-[slideDown_0.2s_ease-out]">
                    <div className="text-4xl">📱</div>
                    <div className="mt-3 font-bold">Mobile Wallet</div>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">
                      You'll receive a payment request on your phone after
                      placing the order. Approve it to confirm.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 font-semibold transition hover:bg-white/10"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => validateStep2() && setStep(3)}
                    className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3.5 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* ============ STEP 3: REVIEW ============ */}
            {step === 3 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8 animate-[slideDown_0.25s_ease-out]">
                <h2 className="text-2xl font-black">Review Your Order</h2>
                <p className="mt-1 text-sm text-gray-400">
                  One last check before we start cooking.
                </p>

                {/* Items */}
                <div className="mt-6 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-3"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-bold">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          Qty {item.quantity} × {formatPKR(item.price)}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-orange-400">
                        {formatPKR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery summary */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      📍 Deliver To
                    </div>
                    <div className="mt-2 text-sm font-bold">{form.fullName}</div>
                    <div className="text-xs text-gray-400">
                      {form.address}, {form.city}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {form.phone}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      💳 Payment
                    </div>
                    <div className="mt-2 text-sm font-bold">
                      {form.payment === "cod"
                        ? "Cash on Delivery"
                        : form.payment === "card"
                        ? `Card •••• ${form.cardNumber.slice(-4)}`
                        : "Mobile Wallet"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Estimated delivery in 30 min
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 font-semibold transition hover:bg-white/10"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="group flex flex-1 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 font-bold shadow-lg shadow-green-500/30 transition hover:scale-[1.02] disabled:opacity-60"
                  >
                    {placing ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        ✅ Place Order · {formatPKR(finalTotal)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-xl font-black">Order Summary</h2>
              <div className="mt-5 space-y-3 border-b border-white/10 pb-4 text-sm">
                <Row
                  label={`Subtotal (${items.reduce((s, i) => s + i.quantity, 0)} items)`}
                  value={formatPKR(subtotal)}
                />
                <Row
                  label="Delivery"
                  value={
                    finalDeliveryFee === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      formatPKR(finalDeliveryFee)
                    )
                  }
                />
                <Row label="Tax (5%)" value={formatPKR(finalTax)} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
                  Total
                </span>
                <span className="text-2xl font-black text-orange-400">
                  {formatPKR(finalTotal)}
                </span>
              </div>

              {/* Free delivery hint */}
              {finalDeliveryFee > 0 && (
                <div className="mt-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs text-orange-300">
                  Add{" "}
                  <span className="font-bold">
                    {formatPKR(3000 - subtotal)}
                  </span>{" "}
                  more for free delivery 🚚
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500">
                <div className="rounded-xl border border-white/10 bg-black/30 p-2">
                  <div className="text-lg">🔒</div>
                  <div className="mt-1">Secure</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-2">
                  <div className="text-lg">⚡</div>
                  <div className="mt-1">30 min</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-2">
                  <div className="text-lg">🔄</div>
                  <div className="mt-1">Easy refund</div>
                </div>
              </div>

              {/* Guest hint */}
              {!user && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-400">
                  💡 <span className="font-semibold text-white">Tip:</span>{" "}
                  Sign in at checkout to save your address for future orders.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============ Helpers ============ */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1.5 text-xs text-red-400">❌ {error}</p>}
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function StepIndicator({
  step,
  current,
  label,
  icon,
}: {
  step: number;
  current: number;
  label: string;
  icon: string;
}) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg transition ${
          done
            ? "border-green-500 bg-green-500/20"
            : active
            ? "border-orange-500 bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/40"
            : "border-white/10 bg-white/5 opacity-50"
        }`}
      >
        {done ? "✓" : icon}
      </div>
      <span
        className={`text-xs font-bold uppercase tracking-widest ${
          active ? "text-white" : done ? "text-green-400" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function StepLine({ active }: { active: boolean }) {
  return (
    <div className="mb-7 hidden h-0.5 w-12 overflow-hidden rounded-full bg-white/10 sm:block">
      <div
        className={`h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500 ${
          active ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}