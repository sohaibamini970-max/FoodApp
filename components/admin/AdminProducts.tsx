"use client";

import { useState } from "react";
import { formatPKR } from "../../app/components/CartContext";

type Product = {
  id: number;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  category: string;
  img: string;
  rating: number;
  time: string;
  veg?: boolean;
  spicy?: boolean;
  available: boolean;
};

const SEED: Product[] = [
  {
    id: 1,
    name: "Double Cheeseburger",
    desc: "Two juicy beef patties, melted cheddar",
    price: 1299,
    oldPrice: 1699,
    category: "burgers",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80",
    rating: 4.9,
    time: "25 min",
    available: true,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    desc: "Wood-fired crust, premium pepperoni",
    price: 1599,
    oldPrice: 1999,
    category: "pizza",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80",
    rating: 4.8,
    time: "30 min",
    spicy: true,
    available: true,
  },
  {
    id: 3,
    name: "Salmon Sushi Set",
    desc: "Fresh salmon nigiri, maki rolls",
    price: 2299,
    oldPrice: 2899,
    category: "sushi",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80",
    rating: 4.9,
    time: "35 min",
    available: true,
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    desc: "Warm molten chocolate center",
    price: 899,
    oldPrice: 1199,
    category: "desserts",
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80",
    rating: 5.0,
    time: "20 min",
    veg: true,
    available: false,
  },
];

const CATEGORIES = [
  "burgers",
  "pizza",
  "sushi",
  "pasta",
  "desserts",
  "drinks",
  "salads",
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(SEED);

  // Currently selected product (for edit/delete)
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const emptyForm = {
    name: "",
    desc: "",
    price: 0,
    oldPrice: undefined as number | undefined,
    category: "burgers",
    img: "",
    rating: 5,
    time: "25 min",
    veg: false,
    spicy: false,
    available: true,
  };

  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm);

  const selectedProduct =
    selectedId !== null ? products.find((p) => p.id === selectedId) : null;

  /* ============ SELECT FROM DROPDOWN ============ */
  const handleSelect = (id: number) => {
    setSelectedId(id);
    const p = products.find((x) => x.id === id);
    if (p) {
      const { id: _id, ...rest } = p;
      setForm(rest);
      setEditing(p);
      setShowCreate(false);
    }
  };

  /* ============ CREATE NEW ============ */
  const handleNew = () => {
    setForm(emptyForm);
    setEditing(null);
    setSelectedId(null);
    setShowCreate(true);
  };

  /* ============ SAVE (create or update) ============ */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.img) return;

    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...form, id: editing.id } : p))
      );
      setEditing(null);
      setSelectedId(null);
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { ...form, id: newId }]);
      setShowCreate(false);
    }
    setForm(emptyForm);
  };

  /* ============ CANCEL ============ */
  const handleCancel = () => {
    setEditing(null);
    setSelectedId(null);
    setShowCreate(false);
    setForm(emptyForm);
  };

  /* ============ DELETE ============ */
  const handleDelete = () => {
    if (!confirmDelete) return;
    setProducts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
    if (selectedId === confirmDelete.id) {
      setSelectedId(null);
      setEditing(null);
      setForm(emptyForm);
    }
    setConfirmDelete(null);
  };

  /* ============ TOGGLE AVAILABILITY ============ */
  const toggleAvailable = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  const formOpen = showCreate || editing !== null;

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black sm:text-4xl">Products</h1>
        <p className="mt-2 text-gray-400">
          Manage your menu — {products.length} items
        </p>
      </div>

      {/* ============ DROPDOWN CONTROL BAR ============ */}
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">
            Select Product
          </label>
          <div className="relative flex-1">
            <select
              value={selectedId ?? ""}
              onChange={(e) =>
                e.target.value ? handleSelect(Number(e.target.value)) : null
              }
              className="w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-black/40 px-5 py-3 pr-10 text-sm font-medium text-white outline-none transition hover:bg-white/10 focus:border-orange-500/50"
            >
              <option value="" className="bg-[#111]">
                — Choose a product —
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#111]">
                  {p.available ? "🟢" : "🔴"} {p.name} · {formatPKR(p.price)}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              ▼
            </span>
          </div>
        </div>

        <button
          onClick={handleNew}
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-105"
        >
          ➕ New Product
        </button>
      </div>

      {/* ============ EDIT / CREATE FORM ============ */}
      {formOpen && (
        <div className="mb-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent p-6 backdrop-blur animate-[slideDown_0.25s_ease-out]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                {editing ? `Edit: ${editing.name}` : "Add New Product"}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {editing
                  ? "Update the fields below and click Save."
                  : "Fill in the details below to create a new product."}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-red-500"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <Field label="Product Name">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Double Cheeseburger"
                required
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Short description..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
              />
            </Field>

            <Field label="Image URL">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="url"
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  placeholder="https://..."
                  required
                  className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                />
                {form.img && (
                  <img
                    src={form.img}
                    alt="Preview"
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                )}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (PKR)">
                <input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  placeholder="1299"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                />
              </Field>
              <Field label="Old Price (optional)">
                <input
                  type="number"
                  value={form.oldPrice || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      oldPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="1699"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full cursor-pointer rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize bg-[#111]">
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Delivery Time">
                <input
                  type="text"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="25 min"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-4">
              <Checkbox
                checked={!!form.veg}
                onChange={(v) => setForm({ ...form, veg: v })}
                label="🌱 Vegetarian"
              />
              <Checkbox
                checked={!!form.spicy}
                onChange={(v) => setForm({ ...form, spicy: v })}
                label="🌶️ Spicy"
              />
              <Checkbox
                checked={form.available}
                onChange={(v) => setForm({ ...form, available: v })}
                label="✅ Available"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
              >
                {editing ? "✅ Save Changes" : "➕ Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============ PRODUCTS LIST ============ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className={`group overflow-hidden rounded-3xl border transition ${
              selectedId === p.id
                ? "border-orange-500/60 shadow-lg shadow-orange-500/20"
                : "border-white/10 hover:border-orange-500/40"
            } bg-gradient-to-b from-white/5 to-transparent`}
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={p.img}
                alt={p.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span
                className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                  p.available ? "bg-green-500/90" : "bg-red-500/90"
                }`}
              >
                {p.available ? "● Live" : "● Hidden"}
              </span>
              {p.veg && (
                <span className="absolute right-3 top-3 rounded-full bg-green-500/90 px-2 py-1 text-xs">
                  🌱
                </span>
              )}
              {p.spicy && (
                <span className="absolute right-3 top-3 rounded-full bg-red-500/90 px-2 py-1 text-xs">
                  🌶️
                </span>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold leading-tight">{p.name}</h3>
                <span className="shrink-0 text-xs text-yellow-400">
                  ★ {p.rating}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                {p.desc}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-white/5 px-2 py-0.5 capitalize">
                  {p.category}
                </span>
                <span>⏱ {p.time}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <div className="text-lg font-black text-orange-400">
                    {formatPKR(p.price)}
                  </div>
                  {p.oldPrice && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPKR(p.oldPrice)}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleAvailable(p.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs transition hover:bg-white/10"
                    title={p.available ? "Hide" : "Show"}
                  >
                    {p.available ? "👁" : "🚫"}
                  </button>
                  <button
                    onClick={() => handleSelect(p.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs transition hover:bg-blue-500/20"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setConfirmDelete(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 transition hover:bg-red-500/20"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
          <div className="text-5xl">🍽️</div>
          <h3 className="mt-4 text-xl font-bold">No products yet</h3>
          <p className="mt-2 text-sm text-gray-400">
            Click "New Product" to add your first item.
          </p>
        </div>
      )}

      {/* ============ DELETE CONFIRM MODAL ============ */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-2xl animate-[scaleIn_0.25s_ease-out]"
          >
            {/* Warning header */}
            <div className="border-b border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-4xl">
                ⚠️
              </div>
              <h2 className="mt-4 text-2xl font-black">Delete Product?</h2>
              <p className="mt-2 text-sm text-gray-400">
                This action cannot be undone.
              </p>
            </div>

            {/* Product preview */}
            <div className="p-6">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                <img
                  src={confirmDelete.img}
                  alt={confirmDelete.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-bold">
                    {confirmDelete.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {confirmDelete.category}
                  </div>
                  <div className="mt-1 text-sm font-bold text-orange-400">
                    {formatPKR(confirmDelete.price)}
                  </div>
                </div>
              </div>

              {/* Actions */}
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

/* ============ Helpers ============ */
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