"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

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
            Free delivery on orders over $30
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
            <button className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-105 sm:w-auto">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Order Now
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
            <button className="flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/10 sm:w-auto">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black text-xs">
                ▶
              </span>
              Watch Video
            </button>
          </div>

          <div className="mt-12 flex justify-center gap-8 lg:justify-start">
            {[
              { num: "500+", label: "Restaurants" },
              { num: "10K+", label: "Happy Customers" },
              { num: "30min", label: "Avg Delivery" },
            ].map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <div className="text-2xl font-black sm:text-3xl">{s.num}</div>
                <div className="text-xs text-gray-500 sm:text-sm">{s.label}</div>
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
        <span className="text-xs uppercase tracking-widest text-gray-500">Scroll</span>
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
    size === "lg" ? "h-20 w-20 lg:h-28 lg:w-28" :
    size === "sm" ? "h-16 w-16 lg:h-24 lg:w-24" :
    "h-20 w-20 lg:h-24 lg:w-24";

  return (
    <div
      className={`absolute ${className}`}
      style={{ transform, transition: "transform 0.3s ease-out" }}
    >
      <div className="animate-[float_6s_ease-in-out_infinite] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 shadow-2xl">
        <img src={img} alt={alt} className={`${sizeClass} rounded-xl object-cover`} />
      </div>
    </div>
  );
}

/* ============================================================
   MARQUEE STRIP
============================================================ */
function MarqueeStrip() {
  const items = [
    "🔥 Free Delivery Over $30",
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
   CATEGORIES
============================================================ */
function Categories() {
  const categories = [
    { name: "Burgers", icon: "🍔", color: "from-orange-500 to-red-500", count: 120 },
    { name: "Pizza", icon: "🍕", color: "from-red-500 to-pink-500", count: 85 },
    { name: "Sushi", icon: "🍣", color: "from-teal-500 to-cyan-500", count: 64 },
    { name: "Desserts", icon: "🍰", color: "from-pink-500 to-purple-500", count: 42 },
    { name: "Drinks", icon: "🥤", color: "from-blue-500 to-indigo-500", count: 90 },
    { name: "Salads", icon: "🥗", color: "from-green-500 to-emerald-500", count: 55 },
  ];

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

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition hover:-translate-y-2 hover:border-orange-500/50"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 transition group-hover:opacity-10`}
              />
              <div className="relative text-4xl transition group-hover:scale-125">
                {cat.icon}
              </div>
              <div className="relative mt-3 font-bold">{cat.name}</div>
              <div className="relative text-xs text-gray-500">{cat.count} items</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FEATURED DISHES
============================================================ */
function FeaturedDishes() {
  const dishes = [
    {
      name: "Double Cheeseburger",
      desc: "Juicy beef patties, melted cheddar, fresh veggies",
      price: 12.99,
      oldPrice: 16.99,
      rating: 4.9,
      time: "25 min",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
      tag: "Popular",
    },
    {
      name: "Pepperoni Pizza",
      desc: "Wood-fired crust, premium pepperoni, mozzarella",
      price: 15.99,
      oldPrice: 19.99,
      rating: 4.8,
      time: "30 min",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
      tag: "Hot 🔥",
    },
    {
      name: "Salmon Sushi Set",
      desc: "Fresh salmon nigiri, maki rolls, wasabi",
      price: 22.99,
      oldPrice: 28.99,
      rating: 4.9,
      time: "35 min",
      img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
      tag: "Chef's Pick",
    },
    {
      name: "Chocolate Lava Cake",
      desc: "Warm molten center, vanilla ice cream",
      price: 8.99,
      oldPrice: 11.99,
      rating: 5.0,
      time: "20 min",
      img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80",
      tag: "New",
    },
    {
      name: "Fresh Berry Smoothie",
      desc: "Mixed berries, banana, Greek yogurt",
      price: 6.99,
      oldPrice: 8.99,
      rating: 4.7,
      time: "15 min",
      img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80",
      tag: "Healthy",
    },
    {
      name: "Caesar Salad Bowl",
      desc: "Crisp romaine, parmesan, grilled chicken",
      price: 10.99,
      oldPrice: 13.99,
      rating: 4.6,
      time: "20 min",
      img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80",
      tag: "Light",
    },
  ];

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
          <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/10">
            View All Menu →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <div
              key={dish.name}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 transition hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20"
            >
              <div className="relative h-56 overflow-hidden rounded-2xl">
                <img
                  src={dish.img}
                  alt={dish.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">
                  {dish.tag}
                </span>
                <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur transition hover:bg-red-500">
                  ♡
                </button>
                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur">
                  ⏱ {dish.time}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold">{dish.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold">{dish.rating}</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">{dish.desc}</p>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-orange-400">
                      ${dish.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${dish.oldPrice}
                    </span>
                  </div>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-xl font-bold shadow-lg shadow-orange-500/30 transition hover:scale-110">
                    +
                  </button>
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
   HOW IT WORKS
============================================================ */
function HowItWorks() {
  const steps = [
    { num: "01", icon: "📍", title: "Choose Your Location", desc: "Set your delivery address and discover restaurants near you." },
    { num: "02", icon: "🍽️", title: "Pick Your Food", desc: "Browse menus from hundreds of top-rated local restaurants." },
    { num: "03", icon: "💳", title: "Easy Payment", desc: "Pay securely with card, wallet, or cash on delivery." },
    { num: "04", icon: "🛵", title: "Fast Delivery", desc: "Track your order live and get it hot at your door." },
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
                <div className="text-5xl transition group-hover:scale-110">{step.icon}</div>
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
              <div className="absolute -right-4 -top-4 text-8xl text-orange-500/10">"</div>
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
          <button className="relative mt-8 rounded-full bg-black px-10 py-4 text-lg font-bold text-white shadow-2xl transition hover:scale-105">
            Order Now →
          </button>
        </div>
      </div>
    </section>
  );
}