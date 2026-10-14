"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useCart, formatPKR } from "../../components/CartContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ═════════════════ TYPES ═════════════════ */
type Variant = {
  id?: number;
  label: string;
  price: number;
  is_default?: boolean;
  sort_order?: number;
};

type Dish = {
  id: number;
  name: string;
  desc: string;
  longDesc: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  time: string;
  category: string; // slug
  categoryLabel: string;
  img: string;
  tags: string[];
  popular?: boolean;
  spicy?: boolean;
  veg?: boolean;
  calories: number;
  serves: string;
  ingredients: string[];
  variants: Variant[];
};

type CategoryPill = {
  id: string;
  label: string;
  icon: string;
  icon_url?: string | null;
};

type ApiVariant = {
  id: number;
  label: string;
  price: number | string;
  is_default: boolean;
  sort_order: number;
};

type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_desc: string;
  price: number | string;
  old_price: number | string | null;
  category_id: number;
  img: string;
  rating: number | string;
  reviews: number;
  time: string;
  calories: number;
  serves: string;
  ingredients: string[] | null;
  veg: boolean;
  spicy: boolean;
  popular: boolean;
  available: boolean;
  variants?: ApiVariant[];
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
  category_icon_url?: string | null;
};

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  icon_url: string | null;
  product_count?: number;
};

/* ═════════════════ MAPPING ═════════════════ */
const mapProduct = (p: ApiProduct): Dish => {
  const tags: string[] = [];
  if (p.popular) tags.push("Popular");
  if (p.veg) tags.push("Veg");
  if (p.spicy) tags.push("Spicy");
  if (p.old_price) {
    const oldP = Number(p.old_price);
    const curP = Number(p.price);
    if (oldP > curP) {
      const off = Math.round(((oldP - curP) / oldP) * 100);
      if (off > 0) tags.push(`${off}% Off`);
    }
  }

  const variants: Variant[] = (p.variants || []).map((v) => ({
    id: v.id,
    label: v.label,
    price: Number(v.price),
    is_default: v.is_default,
    sort_order: v.sort_order,
  }));

  return {
    id: p.id,
    name: p.name,
    desc: p.description || p.long_desc || "",
    longDesc: p.long_desc || p.description || "",
    price: Number(p.price),
    oldPrice: p.old_price ? Number(p.old_price) : undefined,
    rating: Number(p.rating) || 5,
    reviews: Number(p.reviews) || 0,
    time: p.time || "25 min",
    category: p.category_slug || p.category_name || "",
    categoryLabel: p.category_name || p.category_slug || "",
    img: p.img,
    tags: tags.length ? tags : ["New"],
    popular: p.popular,
    spicy: p.spicy,
    veg: p.veg,
    calories: Number(p.calories) || 0,
    serves: p.serves || "1 person",
    ingredients: p.ingredients || [],
    variants,
  };
};

/* ═════════════════ COMPONENT ═════════════════ */
export default function MenuContent() {
  /* ============ DATA STATE ============ */
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<CategoryPill[]>([
    { id: "all", label: "All", icon: "🍽️" },
  ]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  /* ============ FILTER STATE ============ */
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "popular" | "price-low" | "price-high" | "rating"
  >("popular");
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [maxPrice, setMaxPrice] = useState(3000);

  /* ============ MODAL STATE ============ */
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { items, addItem, totalItems, subtotal } = useCart();
  const cartIds = items.map((i) => i.id);

  /* ============ LOAD DATA ============ */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${API}/api/products`),
          fetch(`${API}/api/categories`),
        ]);

        if (!pRes.ok || !cRes.ok) throw new Error("Failed to load menu");

        const pData = await pRes.json();
        const cData = await cRes.json();

        if (cancelled) return;

        const mapped = (pData.products || [])
          .filter((p: ApiProduct) => p.available !== false)
          .map(mapProduct);

        setDishes(mapped);

        const pills: CategoryPill[] = [
          { id: "all", label: "All", icon: "🍽️" },
          ...(cData.categories || []).map((c: ApiCategory) => ({
            id: c.slug,
            label: c.name,
            icon: c.icon,
            icon_url: c.icon_url,
          })),
        ];
        setCategories(pills);

        const highest = Math.max(0, ...mapped.map((d) => d.price));
        if (highest > 3000) setMaxPrice(Math.ceil(highest / 100) * 100);
      } catch {
        if (!cancelled) setApiError("Could not load menu. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ============ RESET QTY + VARIANT WHEN OPENING DISH ============ */
  useEffect(() => {
    setQuantity(1);
    if (selectedDish?.variants && selectedDish.variants.length > 0) {
      const def =
        selectedDish.variants.find((v) => v.is_default) ||
        selectedDish.variants[0];
      setSelectedVariant(def);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedDish]);

  /* ============ LOCK BODY SCROLL ============ */
  useEffect(() => {
    document.body.style.overflow = selectedDish ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedDish]);

  /* ============ ESC TO CLOSE ============ */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDish(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ============ FILTER + SORT ============ */
  const filtered = useMemo(() => {
    let list = dishes.filter((d) => {
      if (activeCategory !== "all" && d.category !== activeCategory) return false;
      if (onlyVeg && !d.veg) return false;
      if (d.price > maxPrice) return false;
      if (
        search &&
        !d.name.toLowerCase().includes(search.toLowerCase()) &&
        !d.desc.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });

    switch (sortBy) {
      case "price-low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort(
          (a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
        );
    }
    return list;
  }, [dishes, activeCategory, search, sortBy, onlyVeg, maxPrice]);

  /* ============ CART HELPERS ============ */
  // Unique cart ID per variant so Small/Large don't collide
  const variantCartId = (dish: Dish, variant: Variant | null) => {
    if (!variant) return dish.id;
    const variantKey = variant.id ?? dish.variants.indexOf(variant) + 1;
    return dish.id * 1000 + variantKey;
  };

  // Effective price: variant price if chosen, else base
  const effectivePrice = selectedVariant?.price ?? selectedDish?.price ?? 0;

  /* ============ ADD TO CART (from card) ============ */
  const addToCart = async (dish: Dish, e?: React.MouseEvent) => {
    e?.stopPropagation();

    const variant =
      dish.variants.length > 0
        ? dish.variants.find((v) => v.is_default) || dish.variants[0]
        : null;

    const res = await addItem({
      product_id: dish.id,
      variant_id: variant?.id ?? null,
      quantity: 1,
    });

    if (!res.ok) {
      alert(res.error || "Could not add to cart");
    }
  };

  /* ============ ADD TO CART (from modal) ============ */
  const handleAddFromModal = async () => {
    if (!selectedDish) return;
    if (selectedDish.variants.length > 0 && !selectedVariant) return;

    const res = await addItem({
      product_id: selectedDish.id,
      variant_id: selectedVariant?.id ?? null,
      quantity,
    });

    if (!res.ok) {
      alert(res.error || "Could not add to cart");
      return;
    }

    setSelectedDish(null);
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setSearch("");
    setOnlyVeg(false);
    setMaxPrice(3000);
    setSortBy("popular");
  };

  /* ============ CHECK IF CART HAS ANY VARIANT OF A DISH ============ */
  const hasAnyVariantInCart = (dish: Dish) =>
    cartIds.some(
      (id) => id === dish.id || (id > dish.id * 1000 && id < dish.id * 1000 + 1000)
    );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ============ MENU HERO ============ */}
      <section className="relative overflow-hidden pt-40 pb-16">
        <div className="absolute inset-0">
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
            <span className="animate-pulse">🔥</span>{" "}
            {dishes.length > 0
              ? `${dishes.length}+ Dishes Available`
              : "Loading menu…"}
          </div>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Delicious
            </span>{" "}
            Menu
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Handcrafted dishes from world-class chefs, made with the freshest
            ingredients and delivered to your door.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-30 blur transition group-focus-within:opacity-60" />
              <div className="relative flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-6 py-4 backdrop-blur-xl">
                <span className="text-xl">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for burgers, pizza, sushi..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FILTERS + GRID ============ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Category pills */}
          <div className="scrollbar-hide -mx-6 mb-8 flex gap-3 overflow-x-auto px-6 pb-2">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${active
                      ? "border-orange-500 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                      : "border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10"
                    }`}
                >
                  {cat.icon_url ? (
                    <img
                      src={cat.icon_url}
                      alt={cat.label}
                      className="h-5 w-5 rounded-full object-cover transition group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-lg transition group-hover:scale-110">
                      {cat.icon}
                    </span>
                  )}
                  <span className="capitalize">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="font-semibold text-white">
                {filtered.length}
              </span>{" "}
              dishes found
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setOnlyVeg(!onlyVeg)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${onlyVeg
                    ? "border-green-500 bg-green-500/20 text-green-300"
                    : "border-white/10 hover:bg-white/10"
                  }`}
              >
                <span className="text-base">🌱</span> Veg Only
              </button>

              <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-sm">
                <span className="text-gray-400">Max</span>
                <input
                  type="range"
                  min="500"
                  max={Math.max(3000, maxPrice)}
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/20 accent-orange-500"
                />
                <span className="w-20 font-bold text-orange-400">
                  {formatPKR(maxPrice)}
                </span>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="cursor-pointer appearance-none rounded-full border border-white/10 bg-black/60 px-5 py-2 pr-10 text-sm font-medium text-white outline-none transition hover:bg-white/10"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {apiError && (
            <div className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
              ❌ {apiError}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
              <div className="text-6xl">🍽️</div>
              <h3 className="mt-4 text-2xl font-bold">No dishes found</h3>
              <p className="mt-2 text-gray-400">
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold transition hover:scale-105"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((dish, i) => {
                const inCart = hasAnyVariantInCart(dish);
                const hasVariants = dish.variants.length > 0;

                return (
                  <div
                    key={dish.id}
                    onClick={() => setSelectedDish(dish)}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={dish.img}
                        alt={dish.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold shadow-lg">
                        {dish.tags[0]}
                      </span>

                      {hasVariants && (
                        <span className="absolute right-14 top-3 rounded-full bg-purple-500/90 px-2 py-1 text-[10px] font-bold backdrop-blur">
                          {dish.variants.length} sizes
                        </span>
                      )}

                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur transition hover:bg-red-500 hover:scale-110"
                      >
                        ♡
                      </button>

                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur">
                          ⏱ {dish.time}
                        </span>
                        {dish.spicy && (
                          <span className="rounded-full bg-red-500/80 px-2 py-1 text-xs backdrop-blur">
                            🌶️
                          </span>
                        )}
                        {dish.veg && (
                          <span className="rounded-full bg-green-500/80 px-2 py-1 text-xs backdrop-blur">
                            🌱
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold leading-tight">
                          {dish.name}
                        </h3>
                        <div className="flex shrink-0 items-center gap-1 text-sm">
                          <span className="text-yellow-400">★</span>
                          <span className="font-semibold">{dish.rating}</span>
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                        {dish.desc}
                      </p>

                      <div className="mt-3 text-xs text-gray-500">
                        {dish.reviews} reviews
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-orange-400">
                              {hasVariants ? "from " : ""}
                              {formatPKR(dish.price)}
                            </span>
                          </div>
                          {dish.oldPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatPKR(dish.oldPrice)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => addToCart(dish, e)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition hover:scale-110 ${inCart
                              ? "bg-green-500 shadow-lg shadow-green-500/30"
                              : "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                            }`}
                          aria-label="Add to cart"
                        >
                          {inCart ? "✓" : "+"}
                        </button>
                      </div>
                    </div>

                    <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition group-hover:opacity-100">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============ PRODUCT DETAIL MODAL ============ */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedDish(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-2xl animate-[scaleIn_0.25s_ease-out]"
          >
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg backdrop-blur transition hover:bg-red-500 hover:scale-110"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="grid max-h-[92vh] grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">
              {/* Left — Image */}
              <div className="relative h-72 lg:h-auto">
                <img
                  src={selectedDish.img}
                  alt={selectedDish.name}
                  className="h-full w-full object-cover lg:absolute lg:inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#111]/80" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {selectedDish.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold shadow-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                    ⏱ {selectedDish.time}
                  </span>
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                    🔥 {selectedDish.calories} cal
                  </span>
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
                    👥 {selectedDish.serves}
                  </span>
                </div>
              </div>

              {/* Right — Details */}
              <div className="overflow-y-auto p-6 sm:p-8 lg:max-h-[92vh]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                    {selectedDish.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="font-bold">{selectedDish.rating}</span>
                    <span className="text-gray-400">
                      ({selectedDish.reviews})
                    </span>
                  </div>
                </div>

                <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  {selectedDish.name}
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedDish.popular && (
                    <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300">
                      🔥 Popular
                    </span>
                  )}
                  {selectedDish.spicy && (
                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300">
                      🌶️ Spicy
                    </span>
                  )}
                  {selectedDish.veg && (
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                      🌱 Vegetarian
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl font-black text-orange-400">
                    {formatPKR(effectivePrice)}
                  </span>
                  {selectedDish.oldPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPKR(selectedDish.oldPrice)}
                      </span>
                      <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                        Save{" "}
                        {formatPKR(
                          selectedDish.oldPrice - effectivePrice
                        )}
                      </span>
                    </>
                  )}
                </div>

                {/* ═══════════ VARIANTS PICKER ═══════════ */}
                {selectedDish.variants.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      Choose Size
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedDish.variants.map((v) => {
                        const active = selectedVariant?.label === v.label;
                        return (
                          <button
                            key={v.id ?? v.label}
                            onClick={() => setSelectedVariant(v)}
                            className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${active
                                ? "border-orange-500 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                                : "border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10"
                              }`}
                          >
                            <div>{v.label}</div>
                            <div
                              className={`mt-0.5 text-xs ${active ? "text-white/90" : "text-orange-400"
                                }`}
                            >
                              {formatPKR(v.price)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                    Description
                  </h3>
                  <p className="mt-2 text-gray-300 leading-relaxed">
                    {selectedDish.longDesc || selectedDish.desc}
                  </p>
                </div>

                {selectedDish.ingredients.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      Ingredients
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedDish.ingredients.map((ing) => (
                        <span
                          key={ing}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition hover:bg-white/10"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-lg font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddFromModal}
                    disabled={
                      selectedDish.variants.length > 0 && !selectedVariant
                    }
                    className="group flex flex-1 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>🛒 Add to Cart</span>
                    <span className="h-4 w-px bg-white/30" />
                    <span>{formatPKR(effectivePrice * quantity)}</span>
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl">🚚</div>
                    <div className="mt-1 text-gray-400">Free delivery</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl">🔄</div>
                    <div className="mt-1 text-gray-400">Easy returns</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl">✅</div>
                    <div className="mt-1 text-gray-400">Fresh guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ CART FLOATING BUTTON ============ */}
      {totalItems > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-[slideUp_0.3s_ease-out]"
        >
          <span className="group flex cursor-pointer items-center gap-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/50 transition hover:scale-105">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black/30">
              🛒
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-black">
                {totalItems}
              </span>
            </span>
            <span>{totalItems} items</span>
            <span className="h-4 w-px bg-white/30" />
            <span>{formatPKR(subtotal)}</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      )}
    </main>
  );
}