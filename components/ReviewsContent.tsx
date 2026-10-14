"use client";

import Link from "next/link";
import { useState } from "react";

type Review = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  dish: string;
  likes: number;
  verified: boolean;
};

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Blogger",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    text: "The fastest delivery I've ever experienced. Food arrived hot, well-packaged, and tasted exactly like it just came out of the kitchen. Absolutely love this app — it's my go-to every weekend!",
    date: "2 days ago",
    dish: "Double Cheeseburger",
    likes: 128,
    verified: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Regular Customer",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "Incredible selection of restaurants. I've discovered so many new favorite spots through FoodieHub. The live tracking feature is super smooth and accurate.",
    date: "1 week ago",
    dish: "Pepperoni Pizza",
    likes: 94,
    verified: true,
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Busy Mom",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    text: "Saves me so much time on busy weeknights. The kids love the family deals and the prices are very reasonable. Customer support is also incredibly responsive!",
    date: "3 days ago",
    dish: "Family Feast",
    likes: 76,
    verified: true,
  },
  {
    id: 4,
    name: "Ahmed Khan",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    text: "Ordered at 11 PM and got my food in 22 minutes. The sushi was fresh and the presentation was restaurant-quality. Easily the best food delivery app in the city.",
    date: "5 days ago",
    dish: "Salmon Sushi Set",
    likes: 143,
    verified: true,
  },
  {
    id: 5,
    name: "Fatima Ali",
    role: "Marketing Manager",
    avatar: "https://i.pravatar.cc/150?img=45",
    rating: 5,
    text: "The promo codes and daily deals are unbeatable. I've saved over Rs 5,000 this month alone. Highly recommended for anyone who orders food regularly.",
    date: "1 day ago",
    dish: "Truffle Mushroom Pasta",
    likes: 89,
    verified: true,
  },
  {
    id: 6,
    name: "David Wilson",
    role: "Fitness Trainer",
    avatar: "https://i.pravatar.cc/150?img=33",
    rating: 4,
    text: "Great healthy options and the veg-only filter is a lifesaver. Only wish there were more low-calorie desserts — but overall an excellent experience.",
    date: "4 days ago",
    dish: "Caesar Salad Bowl",
    likes: 52,
    verified: true,
  },
  {
    id: 7,
    name: "Ayesha Malik",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 5,
    text: "As a student, the budget-friendly deals are amazing. Got a full meal for under Rs 1,000 including delivery. The app is smooth and ordering takes seconds!",
    date: "6 days ago",
    dish: "Solo Combo",
    likes: 67,
    verified: true,
  },
  {
    id: 8,
    name: "James Rodriguez",
    role: "Business Owner",
    avatar: "https://i.pravatar.cc/150?img=68",
    rating: 5,
    text: "I order lunch for my team every Friday through FoodieHub. Bulk orders arrive on time, every time. The team loves the variety and I love the reliability.",
    date: "2 weeks ago",
    dish: "Pizza Party",
    likes: 112,
    verified: true,
  },
  {
    id: 9,
    name: "Zara Ahmed",
    role: "Doctor",
    avatar: "https://i.pravatar.cc/150?img=49",
    rating: 5,
    text: "After long hospital shifts, FoodieHub is a blessing. Food always arrives hot and the app remembers my usual orders. Five stars without hesitation!",
    date: "3 days ago",
    dish: "Breakfast Bundle",
    likes: 84,
    verified: true,
  },
];

const FILTERS = [
  { id: "all", label: "All Reviews", icon: "💬" },
  { id: "5", label: "5 Star", icon: "⭐" },
  { id: "4", label: "4 Star", icon: "✨" },
  { id: "recent", label: "Most Recent", icon: "🕒" },
  { id: "popular", label: "Most Liked", icon: "❤️" },
];

export default function ReviewsContent() {
  const [filter, setFilter] = useState("all");
  const [liked, setLiked] = useState<number[]>([]);

  const filtered = REVIEWS.filter((r) => {
    if (filter === "5") return r.rating === 5;
    if (filter === "4") return r.rating === 4;
    return true;
  }).sort((a, b) => {
    if (filter === "popular") return b.likes - a.likes;
    return 0;
  });

  const avgRating = (
    REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
  ).toFixed(1);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: REVIEWS.filter((r) => r.rating === star).length,
    percent:
      (REVIEWS.filter((r) => r.rating === star).length / REVIEWS.length) * 100,
  }));

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
            <span className="text-yellow-400">★★★★★</span> {avgRating} from 10,000+ reviews
          </div>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Real stories from real customers. See why FoodieHub is the most
            trusted food delivery app in the country.
          </p>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="relative py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "10K+", label: "Happy Customers", icon: "😊" },
              { value: avgRating, label: "Average Rating", icon: "⭐" },
              { value: "98%", label: "Would Reorder", icon: "🔁" },
              { value: "24/7", label: "Support Available", icon: "💬" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 text-center backdrop-blur transition hover:-translate-y-1 hover:border-orange-500/40"
              >
                <div className="text-3xl">{s.icon}</div>
                <div className="mt-3 text-3xl font-black text-orange-400">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RATING BREAKDOWN ============ */}
      <section className="relative py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 backdrop-blur sm:grid-cols-2">
            {/* Big score */}
            <div className="flex flex-col items-center justify-center border-b border-white/10 pb-6 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
              <div className="text-6xl font-black text-orange-400">
                {avgRating}
              </div>
              <div className="mt-3 text-yellow-400 text-2xl">★★★★★</div>
              <div className="mt-2 text-sm text-gray-500">
                Based on {REVIEWS.length} reviews
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-3">
              {ratingBreakdown.map((r) => (
                <div key={r.star} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-semibold text-gray-400">
                    {r.star}★
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700"
                      style={{ width: `${r.percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-gray-500">
                    {r.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FILTERS ============ */}
      <section className="relative py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="scrollbar-hide -mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "border-orange-500 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                      : "border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10"
                  }`}
                >
                  <span>{f.icon}</span>
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ REVIEWS GRID ============ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 backdrop-blur transition hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10"
              >
                {/* Quote mark */}
                <div className="absolute -right-2 -top-4 text-8xl font-black text-orange-500/10">
                  "
                </div>

                {/* Rating + verified */}
                <div className="relative flex items-center justify-between">
                  <div className="flex text-yellow-400">
                    {"★".repeat(r.rating)}
                    <span className="text-gray-600">
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </div>
                  {r.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Text */}
                <p className="relative mt-4 text-sm leading-relaxed text-gray-300">
                  "{r.text}"
                </p>

                {/* Dish */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                  🍽️ {r.dish}
                </div>

                {/* Author */}
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="h-11 w-11 rounded-full ring-2 ring-orange-500/40"
                    />
                    <div>
                      <div className="text-sm font-bold">{r.name}</div>
                      <div className="text-xs text-gray-500">
                        {r.role} · {r.date}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setLiked((prev) =>
                        prev.includes(r.id)
                          ? prev.filter((id) => id !== r.id)
                          : [...prev, r.id]
                      )
                    }
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition ${
                      liked.includes(r.id)
                        ? "border-red-500/50 bg-red-500/20 text-red-300"
                        : "border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span>{liked.includes(r.id) ? "❤️" : "🤍"}</span>
                    <span>{r.likes + (liked.includes(r.id) ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Write review CTA */}
          <div className="mt-16 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 p-10 text-center">
            <div className="text-5xl">✍️</div>
            <h3 className="mt-4 text-2xl font-black sm:text-3xl">
              Tried FoodieHub recently?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              Share your experience with thousands of hungry customers and help
              us make the app even better.
            </p>
            <button className="mt-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-105">
              Write a Review
            </button>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-red-500 p-12 text-center shadow-2xl shadow-orange-500/30 sm:p-16">
            <h2 className="relative text-4xl font-black sm:text-5xl">
              Join the FoodieHub family
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/90">
              Order your first meal today and see why thousands of customers
              rate us 5 stars.
            </p>
            <Link
              href="/menu"
              className="relative mt-8 inline-flex items-center gap-3 rounded-full bg-black px-10 py-4 text-lg font-bold text-white shadow-2xl transition hover:scale-105"
            >
              Order Now →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}