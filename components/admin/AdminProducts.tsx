"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { formatPKR } from "../CartContext";
import { ImageUploader } from "../ImageUploader";
import type { Category, Product } from "@/lib/types";

const EMOJI_PRESETS = [
  "🍔", "🍕", "🍣", "🍝", "🍰", "🥤", "🥗", "🌯", "🌮", "🍜",
  "🍱", "🧁", "☕", "🍺", "🍦", "🍩", "🥘", "🍟", "🥙", "🍲",
];

type FormVariant = {
  label: string;
  price: number;
  is_default?: boolean;
};

export default function AdminProducts() {
  const { authFetch } = useAuth();
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        authFetch("/api/products"),
        authFetch("/api/categories"),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      setProducts(pData.products || []);
      setCategories(cData.categories || []);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
      </div>
    );

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black sm:text-4xl">Products</h1>
        <p className="mt-2 text-gray-400">
          Manage your menu — {products.length} items in {categories.length}{" "}
          categories
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          ❌ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 inline-flex gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
        {[
          { id: "products", label: "🍔 Products", count: products.length },
          { id: "categories", label: "🏷️ Categories", count: categories.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as "products" | "categories")}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${tab === t.id
                ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                : "text-gray-400 hover:text-white"
              }`}
          >
            {t.label}
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${tab === t.id ? "bg-white/20" : "bg-white/10"
                }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "products" ? (
        <ProductsTab
          products={products}
          categories={categories}
          authFetch={authFetch}
          onReload={loadAll}
        />
      ) : (
        <CategoriesTab
          categories={categories}
          authFetch={authFetch}
          onReload={loadAll}
        />
      )}
    </div>
  );
}

/* ============================================================
   PRODUCTS TAB
============================================================ */
function ProductsTab({
  products,
  categories,
  authFetch,
  onReload,
}: {
  products: Product[];
  categories: Category[];
  authFetch: (p: string, o?: RequestInit) => Promise<Response>;
  onReload: () => void;
}) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const emptyForm = {
    name: "",
    description: "",
    long_desc: "",
    price: 0,
    old_price: null as number | null,
    category_id: categories[0]?.id ?? 0,
    img: "",
    rating: 5,
    reviews: 0,
    time: "25 min",
    calories: 0,
    serves: "1 person",
    ingredients: [] as string[],
    veg: false,
    spicy: false,
    popular: false,
    available: true,
    variants: [] as FormVariant[],
    delivery_fee: 199,
    tax_percent: 5, 
  };

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? 0 });
    setEditing(null);
    setShowCreate(true);
    setError("");
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description,
      long_desc: p.long_desc,
      price: p.price,
      old_price: p.old_price,
      category_id: p.category_id,
      img: p.img,
      rating: p.rating,
      reviews: p.reviews,
      time: p.time,
      calories: p.calories,
      delivery_fee: p.delivery_fee ?? 199,
      tax_percent: Number(p.tax_percent ?? 5),
      serves: p.serves,
      ingredients: p.ingredients || [],
      veg: p.veg,
      spicy: p.spicy,
      popular: p.popular,
      available: p.available,
      variants: (p.variants || []).map((v) => ({
        label: v.label,
        price: v.price,
        is_default: v.is_default,
      })),
    });
    setEditing(p);
    setShowCreate(true);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Clean variants: drop empty labels, ensure numeric price
    const cleanedVariants = form.variants
      .filter((v) => v.label.trim() !== "")
      .map((v) => ({
        label: v.label.trim(),
        price: Number(v.price) || 0,
        is_default: !!v.is_default,
      }));

    const payload = { ...form, variants: cleanedVariants };

    const url = editing
      ? `/api/admin/products/${editing.id}`
      : "/api/admin/products";
    const method = editing ? "PATCH" : "POST";

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.message || "Save failed");
      setSaving(false);
      return;
    }

    setSaving(false);
    setShowCreate(false);
    setEditing(null);
    onReload();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const res = await authFetch(`/api/admin/products/${confirmDelete.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setConfirmDelete(null);
      onReload();
    } else {
      alert("Delete failed");
    }
  };

  const toggle = async (id: number) => {
    const res = await authFetch(`/api/admin/products/${id}/toggle`, {
      method: "PATCH",
    });
    if (res.ok) onReload();
  };

  /* ── Variant helpers ── */
  const addVariant = () => {
    setForm((f) => ({
      ...f,
      variants: [
        ...f.variants,
        {
          label: "",
          price: f.price || 0,
          is_default: f.variants.length === 0,
        },
      ],
    }));
  };

  const updateVariant = (idx: number, patch: Partial<FormVariant>) => {
    setForm((f) => {
      const updated = [...f.variants];
      updated[idx] = { ...updated[idx], ...patch };
      return { ...f, variants: updated };
    });
  };

  const removeVariant = (idx: number) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.filter((_, i) => i !== idx),
    }));
  };

  const setDefaultVariant = (idx: number) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => ({
        ...v,
        is_default: i === idx,
      })),
    }));
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-gray-400">
          {products.length} products total
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-105"
        >
          ➕ New Product
        </button>
      </div>

      {/* Form */}
      {showCreate && (
        <div className="mb-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent p-6 backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black">
              {editing ? `Edit: ${editing.name}` : "Add New Product"}
            </h2>
            <button
              onClick={() => {
                setShowCreate(false);
                setEditing(null);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-red-500"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <Field label="Product Name *">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Double Cheeseburger"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
              />
            </Field>

            <Field label="Short Description">
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
              />
            </Field>

            <Field label="Long Description">
              <textarea
                value={form.long_desc}
                onChange={(e) =>
                  setForm({ ...form, long_desc: e.target.value })
                }
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
              />
            </Field>

            <ImageUploader
              label="Product Image *"
              kind="products"
              value={form.img}
              onChange={(url) => setForm({ ...form, img: url || "" })}
            />

            <Field label="Or paste an image URL">
              <input
                type="url"
                value={form.img}
                onChange={(e) => setForm({ ...form, img: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Base Price (PKR) *">
                <input
                  type="number"
                  min={0}
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
              <Field label="Old Price (optional)">
                <input
                  type="number"
                  min={0}
                  value={form.old_price ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      old_price: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
            </div>

            {/* //Delivery and tax code */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Delivery Fee (PKR) *">
                <input
                  type="number"
                  min={0}
                  value={form.delivery_fee ?? 199}
                  onChange={(e) =>
                    setForm({ ...form, delivery_fee: Number(e.target.value) })
                  }
                  required
                  placeholder="199"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Added once per order (highest value across items wins)
                </p>
              </Field>
              <Field label="Tax Percent (%) *">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={form.tax_percent ?? 5}
                  onChange={(e) =>
                    setForm({ ...form, tax_percent: Number(e.target.value) })
                  }
                  required
                  placeholder="5"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Applied to this item's line total
                </p>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category *">
                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#111]">
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Delivery Time">
                <input
                  type="text"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Rating (0-5)">
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
              <Field label="Reviews">
                <input
                  type="number"
                  min={0}
                  value={form.reviews}
                  onChange={(e) =>
                    setForm({ ...form, reviews: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
              <Field label="Calories">
                <input
                  type="number"
                  min={0}
                  value={form.calories}
                  onChange={(e) =>
                    setForm({ ...form, calories: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                />
              </Field>
            </div>

            <Field label="Ingredients (comma-separated)">
              <input
                type="text"
                value={form.ingredients.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ingredients: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Beef, Cheddar, Lettuce"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
              />
            </Field>

            {/* ═══════════ VARIANTS ═══════════ */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Variants (optional)
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Add size options like Small / Medium / Large with different
                    prices. Leave empty for a simple product.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20"
                >
                  ➕ Add Variant
                </button>
              </div>

              {form.variants.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/30 p-4 text-center text-xs text-gray-500">
                  No variants — this product has a single price.
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {form.variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2"
                    >
                      <input
                        type="text"
                        value={v.label}
                        onChange={(e) =>
                          updateVariant(idx, { label: e.target.value })
                        }
                        placeholder="e.g. Small"
                        className="col-span-5 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm outline-none focus:border-orange-500/50"
                      />
                      <input
                        type="number"
                        min={0}
                        value={v.price || ""}
                        onChange={(e) =>
                          updateVariant(idx, { price: Number(e.target.value) })
                        }
                        placeholder="Price"
                        className="col-span-3 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm outline-none focus:border-orange-500/50"
                      />
                      <label className="col-span-2 flex items-center gap-1 text-xs text-gray-400">
                        <input
                          type="radio"
                          name="default_variant"
                          checked={!!v.is_default}
                          onChange={() => setDefaultVariant(idx)}
                          className="accent-orange-500"
                        />
                        Default
                      </label>
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="col-span-2 flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 hover:bg-red-500/20"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Checkbox
                checked={form.veg}
                onChange={(v) => setForm({ ...form, veg: v })}
                label="🌱 Vegetarian"
              />
              <Checkbox
                checked={form.spicy}
                onChange={(v) => setForm({ ...form, spicy: v })}
                label="🌶️ Spicy"
              />
              <Checkbox
                checked={form.popular}
                onChange={(v) => setForm({ ...form, popular: v })}
                label="🔥 Popular"
              />
              <Checkbox
                checked={form.available}
                onChange={(v) => setForm({ ...form, available: v })}
                label="✅ Available"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                ❌ {error}
              </div>
            )}

            <div className="flex gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setEditing(null);
                }}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 disabled:opacity-60"
              >
                {saving ? "Saving…" : editing ? "✅ Save" : "➕ Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={p.img}
                alt={p.name}
                className="h-full w-full object-cover"
              />
              <span
                className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${p.available ? "bg-green-500/90" : "bg-red-500/90"
                  }`}
              >
                {p.available ? "● Live" : "● Hidden"}
              </span>
              {p.variants && p.variants.length > 0 && (
                <span className="absolute right-3 top-3 rounded-full bg-purple-500/90 px-2 py-1 text-[10px] font-bold">
                  {p.variants.length} variant
                  {p.variants.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-bold leading-tight">{p.name}</h3>
                <span className="text-xs text-yellow-400">★ {p.rating}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                {p.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-white/5 px-2 py-0.5 capitalize">
                  {p.category_icon} {p.category_name}
                </span>
                <span>⏱ {p.time}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <div className="text-lg font-black text-orange-400">
                    {formatPKR(p.price)}
                  </div>
                  {p.old_price && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPKR(p.old_price)}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggle(p.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs hover:bg-white/10"
                  >
                    {p.available ? "👁" : "🚫"}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs hover:bg-blue-500/20"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setConfirmDelete(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 hover:bg-red-500/20"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-6 text-center"
          >
            <div className="text-4xl">⚠️</div>
            <h2 className="mt-3 text-2xl font-black">Delete Product?</h2>
            <p className="mt-2 text-sm text-gray-400">{confirmDelete.name}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-bold"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   CATEGORIES TAB — CLEANED UP
============================================================ */
function CategoriesTab({
  categories,
  authFetch,
  onReload,
}: {
  categories: Category[];
  authFetch: (p: string, o?: RequestInit) => Promise<Response>;
  onReload: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirmDel, setConfirmDel] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({
    name: "",
    icon: "🍽️",
    icon_url: null as string | null,
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setCatForm({ name: "", icon: "🍽️", icon_url: null });
    setEditing(null);
    setShowForm(true);
    setErr("");
  };

  /* ✅ FIXED — uses catForm/setEditing/setShowForm, not the product ones */
  const openEdit = (c: Category) => {
    setCatForm({
      name: c.name,
      icon: c.icon,
      icon_url: c.icon_url,
    });
    setEditing(c);
    setShowForm(true);
    setErr("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaving(true);

    const url = editing
      ? `/api/admin/categories/${editing.id}`
      : "/api/admin/categories";
    const method = editing ? "PATCH" : "POST";

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(catForm),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setErr(data.message || "Save failed");
      return;
    }

    setShowForm(false);
    setEditing(null);
    onReload();
  };

  const del = async () => {
    if (!confirmDel) return;
    const res = await authFetch(`/api/admin/categories/${confirmDel.id}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message || "Delete failed");
      return;
    }
    setConfirmDel(null);
    onReload();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div>
          <h2 className="text-lg font-black">Categories</h2>
          <p className="mt-1 text-xs text-gray-400">
            {categories.length} categories
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30"
        >
          ➕ New Category
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent p-6 backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black">
              {editing ? `Edit: ${editing.name}` : "Add Category"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-red-500"
            >
              ✕
            </button>
          </div>

          <form onSubmit={save} className="space-y-5">
            <Field label="Category Name *">
              <input
                type="text"
                value={catForm.name}
                onChange={(e) =>
                  setCatForm({ ...catForm, name: e.target.value })
                }
                required
                placeholder="e.g. Burgers"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
              />
            </Field>

            <ImageUploader
              label="Category Icon (optional)"
              kind="categories"
              value={catForm.icon_url}
              onChange={(url) => setCatForm({ ...catForm, icon_url: url })}
              square
              hint="Square image works best · max 5MB"
            />

            <Field label="Or pick an emoji">
              <div className="grid grid-cols-10 gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-3">
                {EMOJI_PRESETS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() =>
                      setCatForm({ ...catForm, icon: e, icon_url: null })
                    }
                    className={`flex h-8 items-center justify-center rounded-lg text-xl hover:scale-110 ${catForm.icon === e && !catForm.icon_url
                        ? "bg-orange-500/30 ring-2 ring-orange-500"
                        : "hover:bg-white/10"
                      }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </Field>

            {err && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                ❌ {err}
              </div>
            )}

            <div className="flex gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold disabled:opacity-60"
              >
                {saving ? "Saving…" : editing ? "✅ Save" : "➕ Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                {c.icon_url ? (
                  <img
                    src={c.icon_url}
                    alt={c.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">{c.icon}</span>
                )}
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-gray-300">
                {c.product_count ?? 0} items
              </span>
            </div>
            <div className="mt-4 text-lg font-black capitalize">{c.name}</div>
            <div className="mt-1 text-xs text-gray-500">
              {c.icon_url ? "🖼️ Custom icon" : `Emoji: ${c.icon}`}
            </div>
            <div className="mt-4 flex gap-2 border-t border-white/5 pt-4">
              <button
                onClick={() => openEdit(c)}
                className="flex-1 rounded-full border border-white/10 bg-white/5 py-2 text-xs font-semibold hover:bg-blue-500/20"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setConfirmDel(c)}
                className="flex-1 rounded-full border border-red-500/30 bg-red-500/10 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmDel && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setConfirmDel(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-6 text-center"
          >
            <div className="text-4xl">⚠️</div>
            <h2 className="mt-3 text-2xl font-black">Delete Category?</h2>
            <p className="mt-2 text-sm text-gray-400">
              {confirmDel.name} · {confirmDel.product_count ?? 0} products use
              this
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDel(null)}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={del}
                disabled={(confirmDel.product_count ?? 0) > 0}
                className="flex-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-bold disabled:opacity-40"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= shared ================= */
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

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-orange-500"
      />
      {label}
    </label>
  );
}