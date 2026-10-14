"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { formatPKR } from "../CartContext";
import { ImageUploader } from "../ImageUploader";
import type { Deal, Product } from "@/lib/types";

type FormItem = {
  product_id: number;
  variant_id?: number | null;
  quantity: number;
};

export default function AdminDeals() {
  const { authFetch } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState<Deal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Deal | null>(null);

  /* Picker state */
  const [pickerValue, setPickerValue] = useState<number>(0);
  const [pickerVariantId, setPickerVariantId] = useState<number | null>(null);

  /* ── Form state ── */
  const emptyForm = {
    title: "",
    subtitle: "",
    description: "",
    img: "",
    badge: "",
    tag_color: "from-orange-500 to-red-500",
    ends_in: "2 days",
    category: "Combo",
    deal_price: 0,
    delivery_fee: 199,
    tax_percent: 5,
    active: true,
    items: [] as FormItem[],
  };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  /* ── Load deals + products ── */
  const loadAll = async () => {
    setLoading(true);
    try {
      const [dRes, pRes] = await Promise.all([
        authFetch("/api/admin/deals"),
        authFetch("/api/products"),
      ]);
      const dData = await dRes.json();
      const pData = await pRes.json();
      setDeals(dData.deals || []);
      setProducts(pData.products || []);
    } catch {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ── Picker product info ── */
  const pickerProduct = products.find((p) => p.id === pickerValue);
  const pickerHasVariants = (pickerProduct?.variants?.length || 0) > 0;

  /* ── Base price auto-calc (uses variant price when set) ── */
  const computedBasePrice = form.items.reduce((sum, it) => {
    const p = products.find((x) => x.id === it.product_id);
    if (!p) return sum;
    const variant = it.variant_id
      ? p.variants?.find((v) => v.id === it.variant_id)
      : null;
    const unitPrice = variant ? Number(variant.price) : Number(p.price);
    return sum + unitPrice * it.quantity;
  }, 0);

  const computedSavings = Math.max(0, computedBasePrice - form.deal_price);
  const computedSavingsPercent =
    computedBasePrice > 0
      ? Math.round((computedSavings / computedBasePrice) * 100)
      : 0;

  /* ── Item helpers ── */
  const addProductToDeal = (
    productId: number,
    variantId?: number | null
  ) => {
    if (!productId) return;
    const vId = variantId ?? null;

    const exists = form.items.find(
      (i) => i.product_id === productId && (i.variant_id ?? null) === vId
    );

    if (exists) {
      setForm({
        ...form,
        items: form.items.map((i) =>
          i.product_id === productId && (i.variant_id ?? null) === vId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else {
      setForm({
        ...form,
        items: [
          ...form.items,
          { product_id: productId, variant_id: vId, quantity: 1 },
        ],
      });
    }
  };

  const updateItemQty = (
    productId: number,
    variantId: number | null | undefined,
    qty: number
  ) => {
    const vId = variantId ?? null;

    if (qty <= 0) {
      setForm({
        ...form,
        items: form.items.filter(
          (i) =>
            !(i.product_id === productId && (i.variant_id ?? null) === vId)
        ),
      });
    } else {
      setForm({
        ...form,
        items: form.items.map((i) =>
          i.product_id === productId && (i.variant_id ?? null) === vId
            ? { ...i, quantity: qty }
            : i
        ),
      });
    }
  };

  const removeItem = (productId: number, variantId: number | null | undefined) => {
    const vId = variantId ?? null;
    setForm({
      ...form,
      items: form.items.filter(
        (i) =>
          !(i.product_id === productId && (i.variant_id ?? null) === vId)
      ),
    });
  };

  /* ── Open create / edit ── */
  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
    setError("");
    setPickerValue(0);
    setPickerVariantId(null);
  };

  const openEdit = (d: Deal) => {
    setForm({
      title: d.title,
      subtitle: d.subtitle,
      description: d.description,
      img: d.img,
      badge: d.badge,
      tag_color: d.tag_color,
      ends_in: d.ends_in,
      category: d.category,
      deal_price: Number(d.deal_price),
      delivery_fee: Number(d.delivery_fee),
      tax_percent: Number(d.tax_percent),
      active: d.active,
      items: (d.items || []).map((i) => ({
        product_id: i.product_id,
        variant_id: i.variant_id ?? null,
        quantity: i.quantity,
      })),
    });
    setEditing(d);
    setShowForm(true);
    setError("");
    setPickerValue(0);
    setPickerVariantId(null);
  };

  /* ── Save ── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Title required");
    if (!form.img) return setError("Image required");
    if (form.items.length === 0) return setError("Add at least one product");
    if (form.deal_price <= 0) return setError("Deal price must be > 0");

    setSaving(true);

    const url = editing
      ? `/api/admin/deals/${editing.id}`
      : "/api/admin/deals";
    const method = editing ? "PATCH" : "POST";

    // Clean items — drop variant_id when null so backend stores NULL cleanly
    const payload = {
      ...form,
      items: form.items.map((i) => ({
        product_id: i.product_id,
        variant_id: i.variant_id ?? null,
        quantity: i.quantity,
      })),
    };

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.message || "Save failed");
      return;
    }

    setShowForm(false);
    setEditing(null);
    loadAll();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const res = await authFetch(`/api/admin/deals/${confirmDelete.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setConfirmDelete(null);
      loadAll();
    }
  };

  const toggleActive = async (id: number) => {
    const res = await authFetch(`/api/admin/deals/${id}/toggle`, {
      method: "PATCH",
    });
    if (res.ok) loadAll();
  };

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
      </div>
    );

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black sm:text-4xl">Deals & Combos</h1>
          <p className="mt-2 text-gray-400">
            {deals.length} deals · {products.length} products available
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-105"
        >
          ➕ New Deal
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          ❌ {error}
        </div>
      )}

      {/* ═══════════════ FORM ═══════════════ */}
      {showForm && (
        <div className="mb-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent p-6 backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black">
              {editing ? `Edit: ${editing.title}` : "New Deal"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-red-500"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Basic info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title *">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
              <Field label="Subtitle">
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm({ ...form, subtitle: e.target.value })
                  }
                  placeholder="Perfect for 2 people"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
              />
            </Field>

            <ImageUploader
              label="Deal Image *"
              kind="products"
              value={form.img}
              onChange={(url) => setForm({ ...form, img: url || "" })}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Badge">
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="Save 30%"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
              <Field label="Ends In">
                <input
                  type="text"
                  value={form.ends_in}
                  onChange={(e) =>
                    setForm({ ...form, ends_in: e.target.value })
                  }
                  placeholder="2 days"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
              <Field label="Category">
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="Combo"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
            </div>

            {/* ═══════════ PRODUCT + VARIANT PICKER ═══════════ */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Products in this deal
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Pick products — if a product has sizes, pick one too.
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                  {form.items.length} selected
                </span>
              </div>

              {/* Picker row: product, [variant], add */}
              <div className="mt-4 flex flex-wrap gap-2">
                <select
                  value={pickerValue}
                  onChange={(e) => {
                    setPickerValue(Number(e.target.value));
                    setPickerVariantId(null);
                  }}
                  className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/50"
                >
                  <option value={0} className="bg-[#111]">
                    — Pick a product —
                  </option>
                  {products.map((p) => {
                    const hasV = (p.variants?.length || 0) > 0;
                    return (
                      <option key={p.id} value={p.id} className="bg-[#111]">
                        {p.name} · {formatPKR(Number(p.price))}
                        {hasV ? ` (${p.variants!.length} sizes)` : ""}
                      </option>
                    );
                  })}
                </select>

                {pickerHasVariants && (
                  <select
                    value={pickerVariantId ?? ""}
                    onChange={(e) =>
                      setPickerVariantId(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="min-w-[160px] rounded-xl border border-purple-500/30 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500/50"
                  >
                    <option value="" className="bg-[#111]">
                      — Pick size —
                    </option>
                    {pickerProduct!.variants!.map((v) => (
                      <option key={v.id} value={v.id} className="bg-[#111]">
                        {v.label} · {formatPKR(Number(v.price))}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (!pickerValue) return;
                    if (pickerHasVariants && !pickerVariantId) return;
                    addProductToDeal(pickerValue, pickerVariantId);
                    setPickerValue(0);
                    setPickerVariantId(null);
                  }}
                  disabled={!pickerValue || (pickerHasVariants && !pickerVariantId)}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-bold disabled:opacity-40"
                >
                  ➕ Add
                </button>
              </div>

              {/* Selected items list */}
              {form.items.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/30 p-6 text-center text-xs text-gray-500">
                  No products yet — pick one above
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {form.items.map((it) => {
                    const prod = products.find((p) => p.id === it.product_id);
                    if (!prod) return null;
                    const variant = it.variant_id
                      ? prod.variants?.find((v) => v.id === it.variant_id)
                      : null;
                    const unitPrice = variant
                      ? Number(variant.price)
                      : Number(prod.price);
                    const lineTotal = unitPrice * it.quantity;
                    const key = `${it.product_id}-${it.variant_id ?? "base"}`;

                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-2"
                      >
                        {prod.img && (
                          <img
                            src={prod.img}
                            alt={prod.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-sm font-bold">
                            {prod.name}
                            {variant && (
                              <span className="text-purple-400">
                                {" "}
                                · {variant.label}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatPKR(unitPrice)} each ·{" "}
                            <span className="text-orange-400 font-bold">
                              {formatPKR(lineTotal)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 p-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateItemQty(
                                it.product_id,
                                it.variant_id,
                                it.quantity - 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-sm font-bold">
                            {it.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateItemQty(
                                it.product_id,
                                it.variant_id,
                                it.quantity + 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(it.product_id, it.variant_id)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 hover:bg-red-500/20"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Auto-sum summary */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    Auto-computed base price:
                  </span>
                  <span className="font-black text-white">
                    {formatPKR(computedBasePrice)}
                  </span>
                </div>
                {form.deal_price > 0 && computedBasePrice > 0 && (
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Customer saves:</span>
                    <span className="font-bold text-green-400">
                      {formatPKR(computedSavings)} ({computedSavingsPercent}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ═══════════ PRICING ═══════════ */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Deal Price (PKR) *">
                <input
                  type="number"
                  min={0}
                  value={form.deal_price || ""}
                  onChange={(e) =>
                    setForm({ ...form, deal_price: Number(e.target.value) })
                  }
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  What the customer pays
                </p>
              </Field>
              <Field label="Delivery Fee (PKR) *">
                <input
                  type="number"
                  min={0}
                  value={form.delivery_fee}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      delivery_fee: Number(e.target.value),
                    })
                  }
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
              <Field label="Tax Percent (%) *">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={form.tax_percent}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tax_percent: Number(e.target.value),
                    })
                  }
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
                className="accent-orange-500"
              />
              ✅ Active (visible to customers)
            </label>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                ❌ {error}
              </div>
            )}

            <div className="flex gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 disabled:opacity-60"
              >
                {saving ? "Saving…" : editing ? "✅ Save" : "➕ Create Deal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════════ DEALS GRID ═══════════════ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => {
          const dealItems = d.items || [];
          const basePrice = Number(d.base_price) || 0;
          const dealPrice = Number(d.deal_price) || 0;
          const savings = Math.max(0, basePrice - dealPrice);
          const savingsPercent =
            basePrice > 0 ? Math.round((savings / basePrice) * 100) : 0;

          return (
            <div
              key={d.id}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent transition hover:border-orange-500/40"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={d.img}
                  alt={d.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {d.badge && (
                  <span
                    className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${d.tag_color} px-3 py-1 text-xs font-bold`}
                  >
                    {d.badge}
                  </span>
                )}
                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${d.active ? "bg-green-500/90" : "bg-red-500/90"
                    }`}
                >
                  {d.active ? "● Live" : "● Paused"}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-black">{d.title}</h3>
                {d.subtitle && (
                  <p className="text-xs text-orange-300">{d.subtitle}</p>
                )}
                {d.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-gray-400">
                    {d.description}
                  </p>
                )}

                {/* Deal items list — show variant label */}
                {dealItems.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {dealItems.slice(0, 4).map((it, idx) => (
                      <span
                        key={it.id ?? `${it.product_id}-${it.variant_id ?? "b"}-${idx}`}
                        className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-gray-400"
                      >
                        {it.quantity}× {it.product_name}
                        {it.variant_label && ` (${it.variant_label})`}
                      </span>
                    ))}
                    {dealItems.length > 4 && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-300">
                        +{dealItems.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Pricing */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <div className="text-lg font-black text-orange-400">
                      {formatPKR(dealPrice)}
                    </div>
                    {basePrice > dealPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatPKR(basePrice)}
                      </div>
                    )}
                    {savings > 0 && (
                      <div className="text-[10px] font-bold text-green-400">
                        Save {savingsPercent}%
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleActive(d.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs transition hover:bg-white/10"
                      title={d.active ? "Pause" : "Activate"}
                    >
                      {d.active ? "⏸" : "▶"}
                    </button>
                    <button
                      onClick={() => openEdit(d)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs transition hover:bg-blue-500/20"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setConfirmDelete(d)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 transition hover:bg-red-500/20"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                  <span>🚚 {formatPKR(d.delivery_fee)}</span>
                  <span>·</span>
                  <span>💰 {Number(d.tax_percent)}% tax</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {deals.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
          <div className="text-5xl">🎁</div>
          <h3 className="mt-4 text-xl font-bold">No deals yet</h3>
          <p className="mt-2 text-sm text-gray-400">
            Click "New Deal" to create your first bundle.
          </p>
        </div>
      )}

      {/* ═══════════════ DELETE MODAL ═══════════════ */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-2xl"
          >
            <div className="border-b border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-4xl">
                ⚠️
              </div>
              <h2 className="mt-4 text-2xl font-black">Delete Deal?</h2>
              <p className="mt-2 text-sm text-gray-400">
                This will remove the deal from all active carts.
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                <img
                  src={confirmDelete.img}
                  alt={confirmDelete.title}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-bold">
                    {confirmDelete.title}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {confirmDelete.category}
                  </div>
                  <div className="mt-1 text-sm font-bold text-orange-400">
                    {formatPKR(confirmDelete.deal_price)}
                  </div>
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