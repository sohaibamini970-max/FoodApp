"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { useCart, formatPKR } from "@/components/CartContext";
import type { Category, Product } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Header />
      <Hero />
      <MarqueeStrip />
      <Categories />
      <FeaturedDishes />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}

/* ============================================================
   HERO SECTION
============================================================ */
function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#1a0f0a] to-[#0a0a0a] pt-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px] animate-pulse" />
        <div
          className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-8">
        <div className="z-10 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            Free delivery on orders over Rs 3,000
          </div>

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block">Delicious</span>
            <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Food
            </span>
            <span className="block">Delivered Fast</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg text-gray-400 lg:mx-0">
            Craving something amazing? Get your favorite dishes from top
            restaurants delivered hot and fresh to your doorstep in 30 minutes
            or less.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href="/menu"
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-center font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-105 sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Order Now
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
            <Link
             href = "/deals"
             className="flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/10 sm:w-auto"
             > 
             <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black text-xs">
                ▶
              </span>
              Grab Deals
            </Link>
          </div>

          <div className="mt-12 flex justify-center gap-8 lg:justify-start">
            {[
              { num: "500+", label: "Restaurants" },
              { num: "10K+", label: "Happy Customers" },
              { num: "30min", label: "Avg Delivery" },
            ].map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <div className="text-2xl font-black sm:text-3xl">{s.num}</div>
                <div className="text-xs text-gray-500 sm:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[500px] lg:h-[650px]">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-500/20 animate-[spin_25s_linear_infinite] lg:h-[550px] lg:w-[550px]" />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/20 lg:h-[400px] lg:w-[400px]" />

          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(calc(-50% + ${mousePos.x * 15}px), calc(-50% + ${mousePos.y * 15}px))`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <div className="relative animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute inset-0 rounded-full bg-orange-500 blur-[80px] opacity-40" />
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
                alt="Delicious Burger"
                className="relative h-[320px] w-[320px] rounded-full object-cover shadow-2xl ring-4 ring-orange-500/30 lg:h-[420px] lg:w-[420px]"
              />
            </div>
          </div>

          <FloatCard
            img="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80"
            alt="Pizza"
            className="left-0 top-20 lg:top-24"
            transform={`translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`}
            size="lg"
          />
          <FloatCard
            img="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80"
            alt="Sushi"
            className="right-0 top-32 lg:top-40"
            transform={`translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`}
          />
          <FloatCard
            img="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80"
            alt="Dessert"
            className="bottom-24 left-8 lg:bottom-32"
            transform={`translate(${mousePos.x * 20}px, ${mousePos.y * -20}px)`}
            size="sm"
          />
          <FloatCard
            img="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80"
            alt="Drink"
            className="bottom-10 right-4 lg:bottom-20"
            transform={`translate(${mousePos.x * -20}px, ${mousePos.y * 20}px)`}
            size="sm"
          />

          <div className="absolute right-4 top-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-3 shadow-2xl lg:right-8 lg:top-8">
            <div className="text-yellow-400">★★★★★</div>
            <div className="mt-1 text-xs text-gray-400">
              <span className="font-bold text-white">4.9</span> · 2.5K reviews
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛵</span>
              <div>
                <div className="text-xs text-gray-400">Delivery in</div>
                <div className="text-sm font-bold">25-30 min</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          Scroll
        </span>
        <div className="h-10 w-6 rounded-full border border-white/20 p-1">
          <div className="h-2 w-1 mx-auto animate-bounce rounded-full bg-orange-500" />
        </div>
      </div>
    </section>
  );
}

function FloatCard({
  img,
  alt,
  className,
  transform,
  size = "md",
}: {
  img: string;
  alt: string;
  className: string;
  transform: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "h-20 w-20 lg:h-28 lg:w-28"
      : size === "sm"
        ? "h-16 w-16 lg:h-24 lg:w-24"
        : "h-20 w-20 lg:h-24 lg:w-24";

  return (
    <div
      className={`absolute ${className}`}
      style={{ transform, transition: "transform 0.3s ease-out" }}
    >
      <div className="animate-[float_6s_ease-in-out_infinite] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 shadow-2xl">
        <img
          src={img}
          alt={alt}
          className={`${sizeClass} rounded-xl object-cover`}
        />
      </div>
    </div>
  );
}

/* ============================================================
   MARQUEE STRIP
============================================================ */
function MarqueeStrip() {
  const items = [
    "🔥 Free Delivery Over Rs 3,000",
    "🍕 500+ Restaurants",
    "⚡ 30-Min Delivery",
    "⭐ 4.9 Star Rating",
    "🎁 First Order 50% Off",
    "🚀 Live Order Tracking",
  ];
  return (
    <div className="relative border-y border-white/10 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 py-5 overflow-hidden">
      <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-sm font-semibold text-orange-300">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   CATEGORIES — now dynamic, links to /menu?category=slug
============================================================ */
function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/categories`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        // silent — categories are decorative on failure
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const colorFor = (idx: number) => {
    const colors = [
      "from-orange-500 to-red-500",
      "from-red-500 to-pink-500",
      "from-teal-500 to-cyan-500",
      "from-pink-500 to-purple-500",
      "from-blue-500 to-indigo-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-purple-500 to-pink-500",
    ];
    return colors[idx % colors.length];
  };

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Categories
          </span>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl lg:text-6xl">
            What are you{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              craving
            </span>
            ?
          </h2>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && categories.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            No categories yet.
          </p>
        )}

        {/* Categories grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/menu?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition hover:-translate-y-2 hover:border-orange-500/50"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colorFor(
                    idx
                  )} opacity-0 transition group-hover:opacity-10`}
                />

                {/* Icon: prefer uploaded image, fallback to emoji */}
                <div className="relative flex justify-center transition group-hover:scale-125">
                  {cat.icon_url ? (
                    <img
                      src={cat.icon_url}
                      alt={cat.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{cat.icon || "🍽️"}</span>
                  )}
                </div>

                <div className="relative mt-3 font-bold capitalize">
                  {cat.name}
                </div>
                <div className="relative text-xs text-gray-500">
                  {cat.product_count ?? 0} items
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   FEATURED DISHES — now dynamic, top-rated products
============================================================ */
function FeaturedDishes() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/products?sort=rating`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Take top 6
        setProducts((data.products || []).slice(0, 6));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleQuickAdd = async (product: Product) => {
    // Variant products need a picker → go to detail
    if (product.variants && product.variants.length > 0) {
      window.location.href = `/menu/${product.id}`;
      return;
    }

    if (addingId) return;
    setAddingId(product.id);

    const res = await addItem({
      product_id: product.id,
      variant_id: null,
      quantity: 1,
    });

    setAddingId(null);

    if (!res.ok) alert(res.error || "Could not add to cart");
  };

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-orange-400">
              Featured Menu
            </span>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl lg:text-6xl">
              Trending{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Right Now
              </span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            View All Menu →
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
            <div className="text-5xl">🍽️</div>
            <h3 className="mt-4 text-xl font-bold">No dishes yet</h3>
            <p className="mt-2 text-sm text-gray-400">
              Check back soon or browse the full menu.
            </p>
          </div>
        )}

        {/* Products grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((dish) => {
              const hasVariants = (dish.variants?.length || 0) > 0;
              const isAdding = addingId === dish.id;
              const tag = dish.popular
                ? "Popular"
                : dish.veg
                  ? "Veg"
                  : dish.spicy
                    ? "Spicy"
                    : "New";

              return (
                <div
                  key={dish.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 transition hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20"
                >
                  <Link
                    href={`/menu/${dish.id}`}
                    className="relative block h-56 overflow-hidden rounded-2xl"
                  >
                    <img
                      src={dish.img}
                      alt={dish.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">
                      {tag}
                    </span>
                    {hasVariants && (
                      <span className="absolute right-14 top-3 rounded-full bg-purple-500/90 px-3 py-1 text-xs font-bold">
                        {dish.variants!.length} sizes
                      </span>
                    )}
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur transition hover:bg-red-500"
                    >
                      ♡
                    </button>
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur">
                      ⏱ {dish.time}
                    </span>
                  </Link>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/menu/${dish.id}`}
                        className="text-lg font-bold hover:text-orange-400"
                      >
                        {dish.name}
                      </Link>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-400">★</span>
                        <span className="font-semibold">
                          {Number(dish.rating).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                      {dish.description || dish.long_desc}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-orange-400">
                          {hasVariants ? "from " : ""}
                          {formatPKR(Number(dish.price))}
                        </span>
                        {dish.old_price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPKR(Number(dish.old_price))}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleQuickAdd(dish)}
                        disabled={isAdding}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-xl font-bold shadow-lg shadow-orange-500/30 transition hover:scale-110 disabled:opacity-60"
                        aria-label={hasVariants ? "Choose size" : "Add to cart"}
                      >
                        {isAdding ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                          "+"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
============================================================ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: "📍",
      title: "Choose Your Location",
      desc: "Set your delivery address and discover restaurants near you.",
    },
    {
      num: "02",
      icon: "🍽️",
      title: "Pick Your Food",
      desc: "Browse menus from hundreds of top-rated local restaurants.",
    },
    {
      num: "03",
      icon: "💳",
      title: "Easy Payment",
      desc: "Pay securely with card, wallet, or cash on delivery.",
    },
    {
      num: "04",
      icon: "🛵",
      title: "Fast Delivery",
      desc: "Track your order live and get it hot at your door.",
    },
  ];

  return (
    <section className="relative py-24">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[150px] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            How It Works
          </span>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl lg:text-6xl">
            Order in{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              4 Easy Steps
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.num} className="group relative">
              {i < steps.length - 1 && (
                <div className="absolute left-full top-16 hidden h-0.5 w-full bg-gradient-to-r from-orange-500/50 to-transparent lg:block" />
              )}
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:-translate-y-2 hover:border-orange-500/50">
                <div className="absolute -top-4 left-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-black">
                  {step.num}
                </div>
                <div className="text-5xl transition group-hover:scale-110">
                  {step.icon}
                </div>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS
============================================================ */
function Testimonials() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Food Blogger",
      avatar: "https://i.pravatar.cc/150?img=47",
      text: "The fastest delivery I've ever experienced. Food arrived hot and the packaging was perfect. Absolutely love this app!",
    },
    {
      name: "Michael Chen",
      role: "Regular Customer",
      avatar: "https://i.pravatar.cc/150?img=12",
      text: "Incredible selection of restaurants. I've discovered so many new favorites. The tracking feature is super smooth.",
    },
    {
      name: "Emily Davis",
      role: "Busy Mom",
      avatar: "https://i.pravatar.cc/150?img=32",
      text: "Saves me so much time on busy weeknights. The kids love it and the prices are very reasonable. Highly recommended!",
    },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Testimonials
          </span>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl lg:text-6xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 transition hover:-translate-y-2 hover:border-orange-500/50"
            >
              <div className="absolute -right-4 -top-4 text-8xl text-orange-500/10">
                "
              </div>
              <div className="text-yellow-400">★★★★★</div>
              <p className="mt-4 text-gray-300">{r.text}</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="h-12 w-12 rounded-full ring-2 ring-orange-500/50"
                />
                <div>
                  <div className="font-bold">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA
============================================================ */
function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-red-500 p-12 text-center shadow-2xl shadow-orange-500/30 sm:p-20">
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <h2 className="relative text-4xl font-black sm:text-5xl lg:text-6xl">
            Hungry? We've got you.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/90">
            Order now and get your favorite meal delivered in under 30 minutes.
          </p>
          <Link
            href="/menu"
            className="relative mt-8 inline-block rounded-full bg-black px-10 py-4 text-lg font-bold text-white shadow-2xl transition hover:scale-105"
          >
            Order Now →
          </Link>
        </div>
      </div>
    </section>
  );
}