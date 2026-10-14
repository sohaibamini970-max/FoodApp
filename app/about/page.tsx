"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
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

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur">
            🍔 Our Story
          </div>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            About{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              FoodieHub
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            We're on a mission to make great food accessible to everyone —
            fast, fresh, and without the hassle.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-12">
            <h2 className="text-3xl font-black">Our Mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-300">
              FoodieHub was founded in 2024 with a simple belief:{" "}
              <span className="font-semibold text-white">
                great food should be one tap away
              </span>
              . We connect hungry customers with the best local restaurants,
              delivering their favorite meals hot and fresh — in under 30
              minutes.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              We're not just a delivery app. We're a bridge between local food
              culture and the people who love it. Every order supports small
              restaurants, empowers delivery riders, and brings a little joy to
              someone's day.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-black sm:text-4xl">
            What We{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Stand For
            </span>
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: "⚡",
                title: "Speed",
                desc: "Hot food, fast delivery. Every order, every time.",
              },
              {
                icon: "🤝",
                title: "Trust",
                desc: "Transparent pricing, honest reviews, and real support.",
              },
              {
                icon: "🌱",
                title: "Local First",
                desc: "We champion small restaurants and independent chefs.",
              },
              {
                icon: "💎",
                title: "Quality",
                desc: "Only partner with restaurants we'd eat at ourselves.",
              },
              {
                icon: "❤️",
                title: "Care",
                desc: "Every rider, customer, and partner is treated like family.",
              },
              {
                icon: "🚀",
                title: "Innovation",
                desc: "Constantly improving how food finds its way to you.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-orange-500/50"
              >
                <div className="text-4xl">{v.icon}</div>
                <h3 className="mt-4 text-xl font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 p-10">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { num: "500+", label: "Restaurant Partners" },
                { num: "10K+", label: "Happy Customers" },
                { num: "30min", label: "Avg Delivery Time" },
                { num: "4.9★", label: "Customer Rating" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black text-orange-400 sm:text-4xl">
                    {s.num}
                  </div>
                  <div className="mt-1 text-sm text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story timeline */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-black sm:text-4xl">
            Our{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <div className="mt-12 space-y-6">
            {[
              {
                year: "2024",
                title: "The Spark",
                desc: "FoodieHub was founded by three friends tired of cold, late deliveries. We started with a single restaurant partner in Karachi.",
              },
              {
                year: "2025",
                title: "First 100 Restaurants",
                desc: "Expanded to Lahore and Islamabad, partnered with over 100 local restaurants, and crossed 10,000 orders.",
              },
              {
                year: "2026",
                title: "Going Nationwide",
                desc: "Launched in 5 more cities, introduced real-time order tracking, and built our own rider fleet.",
              },
              {
                year: "Future",
                title: "What's Next",
                desc: "AI-powered recommendations, loyalty rewards, and even faster delivery. Stay tuned!",
              },
            ].map((t, i) => (
              <div
                key={t.year}
                className="flex gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-xs font-black">
                  {t.year}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
            <h2 className="text-3xl font-black">
              Ready to taste the difference?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-400">
              Join thousands of customers who've made FoodieHub their go-to
              food delivery app.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/menu"
                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-105"
              >
                Order Now 🍔
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/10"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}