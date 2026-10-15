"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, formatPKR } from "../../components/CartContext";

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
  tagColor: string;
  endsIn: string;
  category: string;
};

const DEALS: Deal[] = [
  {
    id: 101,
    title: "Family Feast",
    subtitle: "Perfect for 4 people",
    desc: "2 large pizzas, 4 burgers, garlic bread, and a 1.5L drink. Enough to feed the whole crew.",
    price: 3499,
    oldPrice: 5200,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    items: ["2 Large Pizzas", "4 Burgers", "Garlic Bread", "1.5L Drink"],
    badge: "Save 32%",
    tagColor: "from-orange-500 to-red-500",
    endsIn: "2 days",
    category: "Family",
  },
  {
    id: 102,
    title: "Solo Combo",
    subtitle: "One-person meal",
    desc: "Any burger + fries + soft drink. Quick, tasty, and easy on the wallet.",
    price: 1199,
    oldPrice: 1650,
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    items: ["Any Burger", "Fries", "Soft Drink"],
    badge: "Save 27%",
    tagColor: "from-yellow-500 to-orange-500",
    endsIn: "5 hours",
    category: "Solo",
  },
  {
    id: 103,
    title: "Pizza Party",
    subtitle: "Great for sharing",
    desc: "3 medium pizzas of your choice + 2 sides + 1L drink. Perfect for movie night.",
    price: 2699,
    oldPrice: 3999,
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    items: ["3 Medium Pizzas", "2 Sides", "1L Drink"],
    badge: "Save 32%",
    tagColor: "from-red-500 to-pink-500",
    endsIn: "1 day",
    category: "Sharing",
  },
  {
    id: 104,
    title: "Sushi Lover",
    subtitle: "For 2 people",
    desc: "2 signature sushi rolls + miso soup + edamame + green tea. Fresh and authentic.",
    price: 3199,
    oldPrice: 4400,
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    items: ["2 Sushi Rolls", "Miso Soup", "Edamame", "Green Tea"],
    badge: "Save 27%",
    tagColor: "from-teal-500 to-cyan-500",
    endsIn: "3 days",
    category: "Duo",
  },
  {
    id: 105,
    title: "Breakfast Bundle",
    subtitle: "Start strong",
    desc: "2 breakfast wraps + 2 fresh juices + 2 coffees. The perfect morning kickstart.",
    price: 999,
    oldPrice: 1450,
    img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
    items: ["2 Breakfast Wraps", "2 Fresh Juices", "2 Coffees"],
    badge: "Save 31%",
    tagColor: "from-amber-500 to-yellow-500",
    endsIn: "6 hours",
    category: "Breakfast",
  },
  {
    id: 106,
    title: "Sweet Tooth Box",
    subtitle: "Dessert sampler",
    desc: "4 assorted desserts: lava cake, tiramisu, cheesecake, and brownie. A sugar lover's dream.",
    price: 1499,
    oldPrice: 2200,
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
    items: ["Lava Cake", "Tiramisu", "Cheesecake", "Brownie"],
    badge: "Save 32%",
    tagColor: "from-pink-500 to-purple-500",
    endsIn: "4 days",
    category: "Dessert",
  },
];

export default function DealsContent() {
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  // ⏱ Flash sale countdown (resets every day at midnight)
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

  const handleGrab = (deal: Deal) => {
    addItem(
      {
        id: deal.id,
        name: deal.title,
        price: deal.price,
        oldPrice: deal.oldPrice,
        img: deal.img,
        time: "30 min",
        category: "deals",
      },
      1
    );
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ============ HERO ============ */}
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

          {/* Flash sale countdown */}
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

      {/* ============ DEALS GRID ============ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DEALS.map((deal, i) => (
              <div
                key={deal.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent transition hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20"
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

                  {/* Save badge */}
                  <span
                    className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${deal.tagColor} px-3 py-1.5 text-xs font-black shadow-lg`}
                  >
                    {deal.badge}
                  </span>

                  {/* Countdown pill */}
                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                    ⏳ {deal.endsIn}
                  </span>

                  {/* Category */}
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {deal.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-black leading-tight">
                    {deal.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-orange-300">
                    {deal.subtitle}
                  </p>
                  <p className="mt-3 text-sm text-gray-400 line-clamp-2">
                    {deal.desc}
                  </p>

                  {/* What's inside */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      What's Inside
                    </div>
                    <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-300">
                      {deal.items.map((item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <span className="text-green-400">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Starting from</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-orange-400">
                          {formatPKR(deal.price)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPKR(deal.oldPrice)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGrab(deal)}
                      className="group/btn flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-bold shadow-lg shadow-orange-500/30 transition hover:scale-105"
                    >
                      Grab Deal
                      <span className="transition group-hover/btn:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
    </main>
  );
}

/* Countdown box */
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