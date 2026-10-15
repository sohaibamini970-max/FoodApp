"use client";

import { useRef, useState } from "react";
import { formatPKR } from "../CartContext";

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

type Category = {
  id: number;
  name: string;
  icon: string;      // emoji
  iconUrl?: string;  // uploaded image (base64 or URL)
};

const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Double Cheeseburger",
    desc: "Two juicy beef patties, melted cheddar",
    price: 1299,
    oldPrice: 1699,
    category: "burgers",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
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
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
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
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
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
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
    rating: 5.0,
    time: "20 min",
    veg: true,
    available: false,
  },
];

const SEED_CATEGORIES: Category[] = [
  { id: 1, name: "burgers", icon: "🍔" },
  { id: 2, name: "pizza", icon: "🍕" },
  { id: 3, name: "sushi", icon: "🍣" },
  { id: 4, name: "pasta", icon: "🍝" },
  { id: 5, name: "desserts", icon: "🍰" },
  { id: 6, name: "drinks", icon: "🥤" },
  { id: 7, name: "salads", icon: "🥗" },
];

const EMOJI_PRESETS = [
  "🍔", "🍕", "🍣", "🍝", "🍰", "🥤", "🥗",
  "🌯", "🌮", "🍜", "🍱", "🧁", "☕", "🍺",
  "🍦", "🍩", "🥘", "🍟", "🥙", "🍲",
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);

  /* ===== Tabs ===== */
  const [tab, setTab] = useState<"products" | "categories">("products");

  /* ===== Product state ===== */
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const emptyForm = {
    name: "",
    desc: "",
    price: 0,
    oldPrice: undefined as number | undefined,
    category: categories[0]?.name || "burgers",
    img: "",
    rating: 5,
    time: "25 min",
    veg: false,
    spicy: false,
    available: true,
  };

  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm);

  /* ===== Category state ===== */
  const [catForm, setCatForm] = useState<{
    name: string;
    icon: string;
    iconUrl?: string;
  }>({ name: "", icon: "🍽️", iconUrl: undefined });
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [confirmCatDelete, setConfirmCatDelete] = useState<Category | null>(
    null
  );
  const [showCatCreate, setShowCatCreate] = useState(false);
  const [catError, setCatError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ============================================================
     PRODUCT HANDLERS
  ============================================================ */
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

  const handleNew = () => {
    setForm(emptyForm);
    setEditing(null);
    setSelectedId(null);
    setShowCreate(true);
  };

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

  const handleCancel = () => {
    setEditing(null);
    setSelectedId(null);
    setShowCreate(false);
    setForm(emptyForm);
  };

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

  const toggleAvailable = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  /* ============================================================
     CATEGORY HANDLERS
  ============================================================ */
  const handleNewCategory = () => {
    setCatForm({ name: "", icon: "🍽️", iconUrl: undefined });
    setEditingCat(null);
    setCatError("");
    setShowCatCreate(true);
  };

  const handleEditCategory = (cat: Category) => {
    setCatForm({
      name: cat.name,
      icon: cat.icon,
      iconUrl: cat.iconUrl,
    });
    setEditingCat(cat);
    setCatError("");
    setShowCatCreate(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = catForm.name.trim().toLowerCase();
    if (!name) return;

    const isDuplicate = categories.some(
      (c) => c.name === name && c.id !== editingCat?.id
    );
    if (isDuplicate) {
      setCatError("Category already exists");
      return;
    }

    if (editingCat) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCat.id
            ? { ...c, name, icon: catForm.icon, iconUrl: catForm.iconUrl }
            : c
        )
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.category === editingCat.name ? { ...p, category: name } : p
        )
      );
      setEditingCat(null);
    } else {
      const newId = Math.max(0, ...categories.map((c) => c.id)) + 1;
      setCategories((prev) => [
        ...prev,
        {
          id: newId,
          name,
          icon: catForm.icon,
          iconUrl: catForm.iconUrl,
        },
      ]);
    }
    setShowCatCreate(false);
    setCatForm({ name: "", icon: "🍽️", iconUrl: undefined });
    setCatError("");
  };

  const handleCancelCategory = () => {
    setShowCatCreate(false);
    setEditingCat(null);
    setCatForm({ name: "", icon: "🍽️", iconUrl: undefined });
    setCatError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteCategory = () => {
    if (!confirmCatDelete) return;
    const inUse = products.some((p) => p.category === confirmCatDelete.name);
    if (inUse) {
      alert(
        `Cannot delete "${confirmCatDelete.name}" — ${products.filter((p) => p.category === confirmCatDelete.name).length} product(s) still use this category.`
      );
      setConfirmCatDelete(null);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== confirmCatDelete.id));
    setConfirmCatDelete(null);
  };

  /* ===== File upload → base64 ===== */
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to ~2MB to keep it snappy in localStorage
    if (file.size > 2 * 1024 * 1024) {
      setCatError("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCatForm((prev) => ({
        ...prev,
        iconUrl: reader.result as string,
      }));
      setCatError("");
    };
    reader.readAsDataURL(file);
  };

  const clearIconImage = () => {
    setCatForm((prev) => ({ ...prev, iconUrl: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const productCountFor = (catName: string) =>
    products.filter((p) => p.category === catName).length;

  const formOpen = showCreate || editing !== null;
  const catFormOpen = showCatCreate || editingCat !== null;

  const getCategoryIcon = (catName: string) => {
    const cat = categories.find((c) => c.name === catName);
    return cat;
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black sm:text-4xl">Products</h1>
        <p className="mt-2 text-gray-400">
          Manage your menu — {products.length} items in {categories.length}{" "}
          categories
        </p>
      </div>

      {/* ============ TABS ============ */}
      <div className="mb-6 inline-flex gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
        {[
          { id: "products", label: "🍔 Products", count: products.length },
          { id: "categories", label: "🏷️ Categories", count: categories.length },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as "products" | "categories")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                active
                  ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  active ? "bg-white/20" : "bg-white/10"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          PRODUCTS TAB
      ============================================================ */}
      {tab === "products" && (
        <>
          {/* Dropdown bar */}
          <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <label className="shrink-0 text-xs font-bold uppercase tracking-widest text-gray-400">
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

          {/* Edit / Create form */}
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
                      onChange={(e) =>
                        setForm({ ...form, img: e.target.value })
                      }
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
                      {categories.map((c) => (
                        <option
                          key={c.id}
                          value={c.name}
                          className="capitalize bg-[#111]"
                        >
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Delivery Time">
                    <input
                      type="text"
                      value={form.time}
                      onChange={(e) =>
                        setForm({ ...form, time: e.target.value })
                      }
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

          {/* Product grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const cat = getCategoryIcon(p.category);
              return (
                <div
                  key={p.id}
                  onClick={() => setDetailProduct(p)}
                  className={`group cursor-pointer overflow-hidden rounded-3xl border transition ${
                    selectedId === p.id
                      ? "border-orange-500/60 shadow-lg shadow-orange-500/20"
                      : "border-white/10 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/20"
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

                    {/* Hover hint */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                      <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold">
                        👁 View Details
                      </span>
                    </div>
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
                      <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 capitalize">
                        {cat?.iconUrl ? (
                          <img
                            src={cat.iconUrl}
                            alt={cat.name}
                            className="h-4 w-4 rounded-full object-cover"
                          />
                        ) : (
                          cat?.icon
                        )}{" "}
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
                      <div
                        className="flex gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
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
              );
            })}
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
        </>
      )}

      {/* ============================================================
          CATEGORIES TAB
      ============================================================ */}
      {tab === "categories" && (
        <>
          <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black">Manage Categories</h2>
              <p className="mt-1 text-xs text-gray-400">
                {categories.length} categories · used across{" "}
                {products.length} products
              </p>
            </div>
            <button
              onClick={handleNewCategory}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-105"
            >
              ➕ New Category
            </button>
          </div>

          {/* ===== CATEGORY FORM ===== */}
          {catFormOpen && (
            <div className="mb-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent p-6 backdrop-blur animate-[slideDown_0.25s_ease-out]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    {editingCat
                      ? `Edit: ${editingCat.name}`
                      : "Add New Category"}
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    {editingCat
                      ? "Renaming updates all products using this category."
                      : "Give your category a name and an icon."}
                  </p>
                </div>
                <button
                  onClick={handleCancelCategory}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-red-500"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-2">
                  {/* Left: name + preview */}
                  <div className="space-y-5">
                    <Field label="Category Name">
                      <input
                        type="text"
                        value={catForm.name}
                        onChange={(e) => {
                          setCatForm({ ...catForm, name: e.target.value });
                          setCatError("");
                        }}
                        placeholder="e.g. burgers"
                        required
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                      />
                    </Field>

                    <Field label="Live Preview">
                      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                          {catForm.iconUrl ? (
                            <img
                              src={catForm.iconUrl}
                              alt="Icon"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">
                              {catForm.icon || "🍽️"}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold capitalize">
                            {catForm.name || "category-name"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {catForm.iconUrl
                              ? "Custom image icon"
                              : `Emoji: ${catForm.icon}`}
                          </div>
                        </div>
                      </div>
                    </Field>
                  </div>

                  {/* Right: icon picker */}
                  <div className="space-y-5">
                    <Field label="Upload Icon Image">
                      <div className="space-y-3">
                        {catForm.iconUrl ? (
                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-3">
                            <img
                              src={catForm.iconUrl}
                              alt="Uploaded icon"
                              className="h-14 w-14 rounded-xl object-cover"
                            />
                            <div className="flex-1">
                              <div className="text-xs font-bold text-green-400">
                                ✅ Image uploaded
                              </div>
                              <div className="text-xs text-gray-500">
                                Will be used as the category icon
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={clearIconImage}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-xs text-red-400 transition hover:bg-red-500/20"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-black/40 p-6 text-center transition hover:border-orange-500/50 hover:bg-orange-500/5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl transition group-hover:scale-110">
                              📤
                            </div>
                            <div className="text-sm font-bold">
                              Click to upload
                            </div>
                            <div className="text-xs text-gray-500">
                              PNG, JPG, SVG · max 2MB
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleIconUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </Field>

                    <Field label="Or Pick an Emoji">
                      <div className="grid grid-cols-10 gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-3">
                        {EMOJI_PRESETS.map((e) => (
                          <button
                            key={e}
                            type="button"
                            onClick={() => {
                              setCatForm((prev) => ({
                                ...prev,
                                icon: e,
                                iconUrl: undefined,
                              }));
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                            }}
                            className={`flex h-8 items-center justify-center rounded-lg text-xl transition hover:scale-110 ${
                              catForm.icon === e && !catForm.iconUrl
                                ? "bg-orange-500/30 ring-2 ring-orange-500"
                                : "hover:bg-white/10"
                            }`}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                </div>

                {catError && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    ❌ {catError}
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCancelCategory}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
                  >
                    {editingCat ? "✅ Save Changes" : "➕ Create Category"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Category grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => {
              const count = productCountFor(cat.name);
              return (
                <div
                  key={cat.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5 transition hover:-translate-y-1 hover:border-orange-500/40"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/20 blur-2xl transition group-hover:bg-orange-500/30" />

                  <div className="relative flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                      {cat.iconUrl ? (
                        <img
                          src={cat.iconUrl}
                          alt={cat.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">{cat.icon}</span>
                      )}
                    </div>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-gray-300">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="relative mt-4">
                    <div className="text-lg font-black capitalize">
                      {cat.name}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {cat.iconUrl ? "🖼️ Custom icon" : `Emoji: ${cat.icon}`}
                    </div>
                  </div>

                  <div className="relative mt-5 flex gap-2 border-t border-white/5 pt-4">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-2 text-xs font-semibold transition hover:bg-blue-500/20"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setConfirmCatDelete(cat)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {categories.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
              <div className="text-5xl">🏷️</div>
              <h3 className="mt-4 text-xl font-bold">No categories yet</h3>
              <p className="mt-2 text-sm text-gray-400">
                Click "New Category" to create your first category.
              </p>
            </div>
          )}
        </>
      )}

      {/* ============ PRODUCT DETAIL MODAL ============ */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          category={getCategoryIcon(detailProduct.category)}
          onClose={() => setDetailProduct(null)}
          onEdit={() => {
            handleSelect(detailProduct.id);
            setDetailProduct(null);
          }}
          onDelete={() => {
            setConfirmDelete(detailProduct);
            setDetailProduct(null);
          }}
          onToggleAvailable={() => {
            toggleAvailable(detailProduct.id);
            setDetailProduct({
              ...detailProduct,
              available: !detailProduct.available,
            });
          }}
        />
      )}

      {/* ============ PRODUCT DELETE MODAL ============ */}
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
              <h2 className="mt-4 text-2xl font-black">Delete Product?</h2>
              <p className="mt-2 text-sm text-gray-400">
                This action cannot be undone.
              </p>
            </div>
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

      {/* ============ CATEGORY DELETE MODAL ============ */}
      {confirmCatDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setConfirmCatDelete(null)}
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
              <h2 className="mt-4 text-2xl font-black">Delete Category?</h2>
              <p className="mt-2 text-sm text-gray-400">
                This action cannot be undone.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5">
                  {confirmCatDelete.iconUrl ? (
                    <img
                      src={confirmCatDelete.iconUrl}
                      alt={confirmCatDelete.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{confirmCatDelete.icon}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-bold capitalize">
                    {confirmCatDelete.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {productCountFor(confirmCatDelete.name)}{" "}
                    {productCountFor(confirmCatDelete.name) === 1
                      ? "product uses"
                      : "products use"}{" "}
                    this category
                  </div>
                </div>
              </div>

              {productCountFor(confirmCatDelete.name) > 0 && (
                <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-300">
                  ⚠️ Cannot delete — this category is currently in use. Move
                  products to a different category first.
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmCatDelete(null)}
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  disabled={productCountFor(confirmCatDelete.name) > 0}
                  className="flex-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-bold shadow-lg shadow-red-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
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

/* ============================================================
   PRODUCT DETAIL MODAL
============================================================ */
function ProductDetailModal({
  product,
  category,
  onClose,
  onEdit,
  onDelete,
  onToggleAvailable,
}: {
  product: Product;
  category?: Category;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailable: () => void;
}) {
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
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg backdrop-blur transition hover:bg-red-500 hover:scale-110"
        >
          ✕
        </button>

        {/* Hero image */}
        <div className="relative h-64 overflow-hidden sm:h-80">
          <img
            src={product.img}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />

          {/* Status + tags */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-lg ${
                product.available ? "bg-green-500/90" : "bg-red-500/90"
              }`}
            >
              {product.available ? "● Live" : "● Hidden"}
            </span>
            {product.veg && (
              <span className="rounded-full bg-green-500/90 px-3 py-1.5 text-xs font-bold">
                🌱 Veg
              </span>
            )}
            {product.spicy && (
              <span className="rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-bold">
                🌶️ Spicy
              </span>
            )}
          </div>

          {/* Rating badge */}
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-sm backdrop-blur">
            <span className="text-yellow-400">★</span>
            <span className="font-bold">{product.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Category + ID */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {category?.iconUrl ? (
                <img
                  src={category.iconUrl}
                  alt={category.name}
                  className="h-4 w-4 rounded-full object-cover"
                />
              ) : (
                <span>{category?.icon || "🍽️"}</span>
              )}
              <span className="font-semibold capitalize">
                {product.category}
              </span>
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-gray-400">
              ID #{product.id}
            </span>
          </div>

          {/* Name + desc */}
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            {product.name}
          </h2>
          <p className="mt-3 text-gray-300 leading-relaxed">{product.desc}</p>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-black text-orange-400">
              {formatPKR(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  {formatPKR(product.oldPrice)}
                </span>
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                  Save {formatPKR(product.oldPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Info grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoCard icon="⏱" label="Prep Time" value={product.time} />
            <InfoCard
              icon="⭐"
              label="Rating"
              value={`${product.rating} / 5`}
            />
            <InfoCard
              icon="📦"
              label="Status"
              value={product.available ? "Available" : "Hidden"}
            />
            <InfoCard
              icon={category?.iconUrl ? "🖼️" : category?.icon || "🏷️"}
              label="Category"
              value={product.category}
            />
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <button
              onClick={onToggleAvailable}
              className={`flex-1 rounded-full border px-6 py-3.5 font-bold transition hover:scale-[1.02] ${
                product.available
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20"
                  : "border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20"
              }`}
            >
              {product.available ? "👁 Hide Product" : "🚀 Make Available"}
            </button>
            <button
              onClick={onEdit}
              className="flex-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-3.5 font-bold text-blue-300 transition hover:bg-blue-500/20 hover:scale-[1.02]"
            >
              ✏️ Edit Product
            </button>
            <button
              onClick={onDelete}
              className="flex-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3.5 font-bold shadow-lg shadow-red-500/30 transition hover:scale-[1.02]"
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold capitalize">{value}</div>
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