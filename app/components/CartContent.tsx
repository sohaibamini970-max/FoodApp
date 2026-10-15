"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, formatPKR } from "../../components/CartContext";

export default function CartContent() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    deliveryFee,
    tax,
    total,
  } = useCart();

  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const handleApplyPromo = () => {
    if (promo.trim().toUpperCase() === "FOODIE10") {
      setAppliedPromo("FOODIE10");
    } else {
      setAppliedPromo("invalid");
    }
  };

  const discount = appliedPromo === "FOODIE10" ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, total - discount);

  /* ============ EMPTY CART ============ */
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="relative overflow-hidden pt-40 pb-32">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
            <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-orange-500 blur-3xl opacity-40 animate-pulse" />
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-7xl">
                  🛒
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-black sm:text-5xl">
              Your cart is{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                empty
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-gray-400">
              Looks like you haven't added anything yet. Explore our delicious
              menu and find something you love!
            </p>
            <Link
              href="/menu"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-105"
            >
              Browse Menu →
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* ============ CART WITH ITEMS ============ */
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
            <Link href="/menu" className="transition hover:text-orange-400">
              Menu
            </Link>
            <span>/</span>
            <span className="text-white">Cart</span>
          </nav>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">
                Your{" "}
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Cart
                </span>
              </h1>
              <p className="mt-3 text-gray-400">
                {totalItems} {totalItems === 1 ? "item" : "items"} ready to be
                delivered
              </p>
            </div>

            <button
              onClick={clearCart}
              className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              🗑 Clear Cart
            </button>
          </div>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* ============ CART ITEMS ============ */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 backdrop-blur transition hover:border-orange-500/40 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Image */}
                      <Link
                        href={`/menu/${item.id}`}
                        className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24"
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/menu/${item.id}`}
                              className="text-lg font-bold hover:text-orange-400 transition"
                            >
                              {item.name}
                            </Link>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              <span className="rounded-full bg-white/5 px-2 py-0.5 capitalize">
                                {item.category}
                              </span>
                              <span>⏱ {item.time}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-500/20 hover:text-red-400"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          {/* Quantity */}
                          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold transition hover:bg-white/10"
                              aria-label="Decrease"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold transition hover:bg-white/10"
                              aria-label="Increase"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-black text-orange-400">
                              {formatPKR(item.price * item.quantity)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-gray-500">
                                {formatPKR(item.price)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue shopping */}
              <div className="mt-8">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/10"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* ============ ORDER SUMMARY ============ */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur">
                  <div className="border-b border-white/10 bg-white/[0.02] px-6 py-5">
                    <h2 className="text-xl font-black">Order Summary</h2>
                  </div>

                  <div className="space-y-4 p-6">
                    {/* Promo */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Promo Code
                      </label>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={promo}
                          onChange={(e) => setPromo(e.target.value)}
                          placeholder="Try FOODIE10"
                          className="flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500/50"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-bold transition hover:scale-105"
                        >
                          Apply
                        </button>
                      </div>
                      {appliedPromo === "FOODIE10" && (
                        <p className="mt-2 text-xs text-green-400">
                          ✅ Promo applied — 10% off!
                        </p>
                      )}
                      {appliedPromo === "invalid" && (
                        <p className="mt-2 text-xs text-red-400">
                          ❌ Invalid promo code
                        </p>
                      )}
                    </div>

                    {/* Totals */}
                    <div className="space-y-3 border-t border-white/10 pt-4 text-sm">
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
                      <Row label="Tax (5%)" value={formatPKR(tax)} />

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

                    {/* Free delivery progress */}
                    {deliveryFee > 0 && (
                      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
                        <p className="text-xs text-orange-300">
                          Add{" "}
                          <span className="font-bold">
                            {formatPKR(3000 - subtotal)}
                          </span>{" "}
                          more for FREE delivery 🚚
                        </p>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (subtotal / 3000) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
                        Total
                      </span>
                      <span className="text-2xl font-black text-orange-400">
                        {formatPKR(finalTotal)}
                      </span>
                    </div>

                    {/* Checkout */}
                    <Link
                      href="/checkout"
                      className="group mt-2 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02]"
                    >
                      Proceed to Checkout
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-gray-500">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Row helper */
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