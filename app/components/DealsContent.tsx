"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, formatPKR } from "../../components/CartContext";
import type { Deal } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DealsContent() {
  const { addItem } = useCart();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [addingId, setAddingId] = useState<number | null>(null);

  /* Modal state */
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalAdding, setModalAdding] = useState(false);

  /* ── Load deals ── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API}/api/deals`);
        if (!res.ok) throw new Error("Failed to load deals");
        const data = await res.json();
        if (!cancelled) setDeals(data.deals || []);
      } catch {
        if (!cancelled) setApiError("Could not load deals. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Countdown ── */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      setTimeLeft({
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Reset qty when opening a deal ── */
  useEffect(() => {
    setModalQty(1);
  }, [selectedDeal]);

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = selectedDeal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedDeal]);

  /* ── Escape closes modal ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDeal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Grab deal (from card) ── */
  const handleGrab = async (deal: Deal, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (addingId) return;
    setAddingId(deal.id);

    const res = await addItem({ deal_id: deal.id, quantity: 1 });

    setAddingId(null);

    if (!res.ok) {
      alert(res.error || "Could not add deal to cart");
    }
  };

  /* ── Add deal from modal ── */
  const handleModalAdd = async () => {
    if (!selectedDeal || modalAdding) return;
    setModalAdding(true);

    const res = await addItem({
      deal_id: selectedDeal.id,
      quantity: modalQty,
    });

    setModalAdding(false);

    if (!res.ok) {
      alert(res.error || "Could not add deal to cart");
      return;
    }

    setSelectedDeal(null);
  };

  /* ── Price helpers ── */
  const savingsOf = (d: Deal) =>
    Math.max(0, Number(d.base_price) - Number(d.deal_price));
  const savingsPercentOf = (d: Deal) => {
    const base = Number(d.base_price);
    if (base <= 0) return 0;
    return Math.round((savingsOf(d) / base) * 100);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden pt-40 pb-16">
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

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur">
            <span className="animate-pulse">🔥</span> Limited Time Offers
          </div>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Sizzling{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Deals
            </span>{" "}
            & Combos
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Save big with our handpicked bundles. Fresh deals drop every day —
            don't miss out!
          </p>

          <div className="mx-auto mt-10 inline-flex flex-col items-center gap-3 rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-8 py-6 backdrop-blur">
            <div className="text-sm font-bold uppercase tracking-widest text-orange-300">
              ⚡ Flash Sale Ends In
            </div>
            <div className="flex items-center gap-3">
              <TimeBox value={timeLeft.h} label="Hours" />
              <span className="text-3xl font-black text-orange-400">:</span>
              <TimeBox value={timeLeft.m} label="Mins" />
              <span className="text-3xl font-black text-orange-400">:</span>
              <TimeBox value={timeLeft.s} label="Secs" />
            </div>
          </div>
        </div>
      </section>

      {/* DEALS GRID */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {apiError && (
            <div className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
              ❌ {apiError}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && deals.length === 0 && !apiError && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
              <div className="text-6xl">🎁</div>
              <h3 className="mt-4 text-2xl font-bold">No deals available</h3>
              <p className="mt-2 text-gray-400">
                Check back soon — new deals drop daily!
              </p>
              <Link
                href="/menu"
                className="mt-6 inline-block rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold transition hover:scale-105"
              >
                Browse Menu
              </Link>
            </div>
          )}

          {/* Deal cards */}
          {!loading && deals.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal, i) => {
                const savings = savingsOf(deal);
                const savingsPercent = savingsPercentOf(deal);
                const isAdding = addingId === deal.id;

                return (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent transition hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={deal.img}
                        alt={deal.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Badge */}
                      {(deal.badge || savingsPercent > 0) && (
                        <span
                          className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${deal.tag_color || "from-orange-500 to-red-500"
                            } px-3 py-1.5 text-xs font-black shadow-lg`}
                        >
                          {deal.badge || `Save ${savingsPercent}%`}
                        </span>
                      )}

                      {/* Ends in */}
                      {deal.ends_in && (
                        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                          ⏳ {deal.ends_in}
                        </span>
                      )}

                      {/* Category */}
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur capitalize">
                        {deal.category}
                      </span>

                      {/* View details hover hint */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                        <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold">
                          👁 View Details
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-black leading-tight">
                        {deal.title}
                      </h3>
                      {deal.subtitle && (
                        <p className="mt-1 text-sm font-medium text-orange-300">
                          {deal.subtitle}
                        </p>
                      )}
                      {deal.description && (
                        <p className="mt-3 text-sm text-gray-400 line-clamp-2">
                          {deal.description}
                        </p>
                      )}

                      {/* What's inside — preview */}
                      {deal.items && deal.items.length > 0 && (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                            What's Inside
                          </div>
                          <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-300">
                            {deal.items.slice(0, 4).map((item, idx) => (
                              <li
                                key={item.id ?? `${item.product_id}-${idx}`}
                                className="flex items-start gap-1.5"
                              >
                                <span className="mt-0.5 text-green-400">✓</span>
                                <span className="flex-1">
                                  {item.quantity}×{" "}
                                  {item.product_name ||
                                    `Product #${item.product_id}`}
                                  {item.variant_label && (
                                    <span className="text-purple-400">
                                      {" "}
                                      ({item.variant_label})
                                    </span>
                                  )}
                                </span>
                              </li>
                            ))}
                            {deal.items.length > 4 && (
                              <li className="col-span-2 text-xs text-gray-500">
                                +{deal.items.length - 4} more items
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Price + CTA */}
                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div>
                          <div className="text-xs text-gray-500">
                            Starting from
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-orange-400">
                              {formatPKR(Number(deal.deal_price))}
                            </span>
                            {Number(deal.base_price) >
                              Number(deal.deal_price) && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPKR(Number(deal.base_price))}
                                </span>
                              )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleGrab(deal, e)}
                          disabled={isAdding}
                          className="group/btn flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-bold shadow-lg shadow-orange-500/30 transition hover:scale-105 disabled:opacity-60"
                        >
                          {isAdding ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          ) : (
                            <>
                              Grab Deal
                              <span className="transition group-hover/btn:translate-x-1">
                                →
                              </span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Delivery + tax hint */}
                      <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
                        <span>🚚 {formatPKR(Number(deal.delivery_fee))}</span>
                        <span>·</span>
                        <span>💰 {Number(deal.tax_percent)}% tax</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 p-10 text-center">
            <h3 className="text-2xl font-black sm:text-3xl">
              Want even more savings?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              Subscribe to our newsletter and unlock exclusive weekly deals,
              birthday surprises, and members-only discounts.
            </p>
            <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 text-sm outline-none transition focus:border-orange-500/50"
              />
              <button className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3.5 text-sm font-bold transition hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DEAL DETAIL MODAL ═══════════════ */}
      {selectedDeal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedDeal(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-2xl"
          >
            <button
              onClick={() => setSelectedDeal(null)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg backdrop-blur transition hover:bg-red-500"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="grid max-h-[92vh] grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">
              {/* LEFT — Image */}
              <div className="relative h-72 lg:h-auto">
                <img
                  src={selectedDeal.img}
                  alt={selectedDeal.title}
                  className="h-full w-full object-cover lg:absolute lg:inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#111]/80" />

                {/* Badge */}
                {selectedDeal.badge && (
                  <span
                    className={`absolute left-4 top-4 rounded-full bg-gradient-to-r ${selectedDeal.tag_color || "from-orange-500 to-red-500"
                      } px-4 py-1.5 text-sm font-black shadow-lg`}
                  >
                    {selectedDeal.badge}
                  </span>
                )}

                {/* Meta pills */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {selectedDeal.ends_in && (
                    <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                      ⏳ {selectedDeal.ends_in}
                    </span>
                  )}
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                    🚚{" "}
                    {Number(selectedDeal.delivery_fee) === 0
                      ? "FREE"
                      : formatPKR(Number(selectedDeal.delivery_fee))}
                  </span>
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                    💰 {Number(selectedDeal.tax_percent)}% tax
                  </span>
                </div>
              </div>

              {/* RIGHT — Details */}
              <div className="overflow-y-auto p-6 sm:p-8 lg:max-h-[92vh]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                    {selectedDeal.category}
                  </span>
                </div>

                <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  {selectedDeal.title}
                </h2>
                {selectedDeal.subtitle && (
                  <p className="mt-1 text-sm font-medium text-orange-300">
                    {selectedDeal.subtitle}
                  </p>
                )}

                {selectedDeal.description && (
                  <p className="mt-4 text-gray-300 leading-relaxed">
                    {selectedDeal.description}
                  </p>
                )}

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl font-black text-orange-400">
                    {formatPKR(Number(selectedDeal.deal_price) * modalQty)}
                  </span>
                  {Number(selectedDeal.base_price) >
                    Number(selectedDeal.deal_price) && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPKR(Number(selectedDeal.base_price) * modalQty)}
                        </span>
                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                          Save{" "}
                          {formatPKR(
                            (Number(selectedDeal.base_price) -
                              Number(selectedDeal.deal_price)) *
                            modalQty
                          )}
                        </span>
                      </>
                    )}
                </div>

                {/* What's inside — detailed */}
                {selectedDeal.items && selectedDeal.items.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      What's Inside
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {selectedDeal.items.map((it, idx) => {
                        const variantPrice = Number(it.variant_price ?? 0);
                        const basePrice = Number(it.product_price ?? 0);
                        const unitPrice = variantPrice || basePrice;
                        const lineTotal = unitPrice * it.quantity;

                        return (
                          <li
                            key={it.id ?? `${it.product_id}-${idx}`}
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2"
                          >
                            {it.product_img && (
                              <img
                                src={it.product_img}
                                alt={it.product_name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-sm font-bold">
                                {it.product_name ||
                                  `Product #${it.product_id}`}
                                {it.variant_label && (
                                  <span className="text-purple-400">
                                    {" "}
                                    · {it.variant_label}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                × {it.quantity} · {formatPKR(unitPrice)} each
                              </div>
                            </div>
                            <div className="text-sm font-bold text-orange-400">
                              {formatPKR(lineTotal)}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Quantity + Add to cart */}
                <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                    <button
                      onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition hover:bg-white/10"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-lg font-bold">
                      {modalQty}
                    </span>
                    <button
                      onClick={() => setModalQty(modalQty + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition hover:bg-white/10"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleModalAdd}
                    disabled={modalAdding}
                    className="group flex flex-1 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02] disabled:opacity-60"
                  >
                    {modalAdding ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <>
                        <span>🛒 Add to Cart</span>
                        <span className="h-4 w-px bg-white/30" />
                        <span>
                          {formatPKR(
                            Number(selectedDeal.deal_price) * modalQty
                          )}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust badges */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl">🚚</div>
                    <div className="mt-1 text-gray-400">Fast delivery</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl">🎁</div>
                    <div className="mt-1 text-gray-400">Bundle deal</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl">✅</div>
                    <div className="mt-1 text-gray-400">Fresh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/50 text-2xl font-black tabular-nums backdrop-blur">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-widest text-gray-500">
        {label}
      </span>
    </div>
  );
}