"use client";

import { useState } from "react";
import { formatPKR } from "../CartContext";

type Deal = {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  price: number;
  oldPrice: number;
  img: string;
  items: string[];
  badge: string;
  endsIn: string;
  category: string;
  active: boolean;
};

const SEED: Deal[] = [
  { id: 101, title: "Family Feast", subtitle: "Perfect for 4 people", desc: "2 large pizzas, 4 burgers, garlic bread, and a 1.5L drink.", price: 3499, oldPrice: 5200, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80", items: ["2 Large Pizzas", "4 Burgers", "Garlic Bread", "1.5L Drink"], badge: "Save 32%", endsIn: "2 days", category: "Family", active: true },
  { id: 102, title: "Solo Combo", subtitle: "One-person meal", desc: "Any burger + fries + soft drink.", price: 1199, oldPrice: 1650, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80", items: ["Any Burger", "Fries", "Soft Drink"], badge: "Save 27%", endsIn: "5 hours", category: "Solo", active: true },
  { id: 103, title: "Pizza Party", subtitle: "Great for sharing", desc: "3 medium pizzas + 2 sides + 1L drink.", price: 2699, oldPrice: 3999, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80", items: ["3 Medium Pizzas", "2 Sides", "1L Drink"], badge: "Save 32%", endsIn: "1 day", category: "Sharing", active: true },
];

export default function AdminDeals() {
  const [deals, setDeals] = useState<Deal[]>(SEED);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Deal | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const emptyForm = {
    title: "",
    subtitle: "",
    desc: "",
    price: 0,
    oldPrice: 0,
    img: "",
    items: [] as string[],
    badge: "",
    endsIn: "1 day",
    category: "Family",
    active: true,
  };

  const [form, setForm] = useState<Omit<Deal, "id">>(emptyForm);
  const [itemsInput, setItemsInput] = useState("");

  /* ===== SELECT FROM DROPDOWN ===== */
  const handleSelect = (id: number) => {
    setSelectedId(id);
    const d = deals.find((x) => x.id === id);
    if (d) {
      const { id: _id, ...rest } = d;
      setForm(rest);
      setItemsInput(rest.items.join(", "));
      setEditing(d);
      setShowCreate(false);
    }
  };

  const handleNew = () => {
    setForm(emptyForm);
    setItemsInput("");
    setEditing(null);
    setSelectedId(null);
    setShowCreate(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const items = itemsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = { ...form, items };

    if (editing) {
      setDeals((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...payload, id: editing.id } : d))
      );
      setEditing(null);
      setSelectedId(null);
    } else {
      const newId = Math.max(0, ...deals.map((d) => d.id)) + 1;
      setDeals((prev) => [...prev, { ...payload, id: newId }]);
      setShowCreate(false);
    }
    setForm(emptyForm);
    setItemsInput("");
  };

  const handleCancel = () => {
    setEditing(null);
    setSelectedId(null);
    setShowCreate(false);
    setForm(emptyForm);
    setItemsInput("");
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    setDeals((prev) => prev.filter((d) => d.id !== confirmDelete.id));
    if (selectedId === confirmDelete.id) {
      setSelectedId(null);
      setEditing(null);
      setForm(emptyForm);
      setItemsInput("");
    }
    setConfirmDelete(null);
  };

  const toggleActive = (id: number) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const formOpen = showCreate || editing !== null;

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black sm:text-4xl">Deals & Combos</h1>
        <p className="mt-2 text-gray-400">
          Manage promotional bundles — {deals.length} total
        </p>
      </div>

      {/* ===== DROPDOWN CONTROL BAR ===== */}
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">
            Select Deal
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
                — Choose a deal —
              </option>
              {deals.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#111]">
                  {d.active ? "🟢" : "🔴"} {d.title} · {formatPKR(d.price)}
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
          ➕ New Deal
        </button>
      </div>

      {/* ===== EDIT / CREATE FORM ===== */}
      {formOpen && (
        <div className="mb-8 rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent p-6 backdrop-blur animate-[slideDown_0.25s_ease-out]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                {editing ? `Edit: ${editing.title}` : "Add New Deal"}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {editing
                  ? "Update the fields and click Save."
                  : "Fill in the details below to create a new deal."}
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
            <Field label="Deal Title">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
              />
            </Field>

            <Field label="Subtitle">
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
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

            <Field label="What's Inside (comma-separated)">
              <input
                type="text"
                value={itemsInput}
                onChange={(e) => setItemsInput(e.target.value)}
                placeholder="2 Pizzas, 4 Burgers, Garlic Bread"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (PKR)">
                <input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                />
              </Field>
              <Field label="Old Price (PKR)">
                <input
                  type="number"
                  value={form.oldPrice || ""}
                  onChange={(e) => setForm({ ...form, oldPrice: Number(e.target.value) })}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Badge">
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="Save 30%"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                />
              </Field>
              <Field label="Ends In">
                <input
                  type="text"
                  value={form.endsIn}
                  onChange={(e) => setForm({ ...form, endsIn: e.target.value })}
                  placeholder="2 days"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                />
              </Field>
              <Field label="Category">
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-orange-500/50"
                />
              </Field>
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="accent-orange-500"
              />
              ✅ Active
            </label>

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
                {editing ? "✅ Save Changes" : "➕ Create Deal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => (
          <div
            key={d.id}
            className={`group overflow-hidden rounded-3xl border transition ${
              selectedId === d.id
                ? "border-orange-500/60 shadow-lg shadow-orange-500/20"
                : "border-white/10 hover:border-orange-500/40"
            } bg-gradient-to-b from-white/5 to-transparent`}
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={d.img}
                alt={d.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold">
                {d.badge}
              </span>
              <span
                className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                  d.active ? "bg-green-500/90" : "bg-red-500/90"
                }`}
              >
                {d.active ? "● Live" : "● Paused"}
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-black">{d.title}</h3>
              <p className="text-xs text-orange-300">{d.subtitle}</p>
              <p className="mt-2 line-clamp-2 text-xs text-gray-400">{d.desc}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {d.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-gray-400"
                  >
                    {it}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <div className="text-lg font-black text-orange-400">
                    {formatPKR(d.price)}
                  </div>
                  <div className="text-xs text-gray-500 line-through">
                    {formatPKR(d.oldPrice)}
                  </div>
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
                    onClick={() => handleSelect(d.id)}
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
            </div>
          </div>
        ))}
      </div>

      {/* ===== DELETE CONFIRM MODAL ===== */}
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
            <div className="border-b border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-4xl">
                ⚠️
              </div>
              <h2 className="mt-4 text-2xl font-black">Delete Deal?</h2>
              <p className="mt-2 text-sm text-gray-400">
                This action cannot be undone.
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