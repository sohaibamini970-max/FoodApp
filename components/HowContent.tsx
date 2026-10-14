"use client";

import Link from "next/link";

export default function HowContent() {
  const steps = [
    {
      num: "01",
      icon: "📍",
      title: "Set Your Location",
      desc: "Enter your delivery address and we'll instantly show you restaurants and dishes available near you.",
      color: "from-orange-500 to-red-500",
      details: ["GPS auto-detect", "Save multiple addresses", "Coverage check"],
    },
    {
      num: "02",
      icon: "🍽️",
      title: "Browse & Choose",
      desc: "Explore hundreds of dishes from top-rated restaurants. Filter by cuisine, price, and dietary needs.",
      color: "from-yellow-500 to-orange-500",
      details: ["200+ dishes", "Veg & vegan filters", "Real reviews"],
    },
    {
      num: "03",
      icon: "💳",
      title: "Secure Checkout",
      desc: "Pay with card, wallet, or cash on delivery. Apply promo codes and get instant discounts.",
      color: "from-red-500 to-pink-500",
      details: ["100% secure", "Multiple payment options", "Promo codes"],
    },
    {
      num: "04",
      icon: "🛵",
      title: "Track & Enjoy",
      desc: "Watch your order live on the map and receive it hot at your door in 30 minutes or less.",
      color: "from-teal-500 to-cyan-500",
      details: ["Live GPS tracking", "30-min delivery", "Freshness guarantee"],
    },
  ];

  const faqs = [
    {
      q: "How fast is delivery?",
      a: "Most orders arrive within 25–35 minutes. You'll see the estimated time on each restaurant page before ordering.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit/debit cards, JazzCash, EasyPaisa, and cash on delivery.",
    },
    {
      q: "Can I schedule an order for later?",
      a: "Yes! During checkout you can pick a delivery time slot that fits your schedule — up to 7 days in advance.",
    },
    {
      q: "What if my order is late or wrong?",
      a: "Our support team is available 24/7. If anything goes wrong, we'll fix it with a refund or re-delivery — no questions asked.",
    },
    {
      q: "Is there a minimum order?",
      a: "No minimum order amount, but orders over Rs 3,000 get free delivery automatically.",
    },
    {
      q: "Do you deliver to my area?",
      a: "We currently operate in all major cities. Enter your address at checkout to confirm availability.",
    },
  ];

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
            <span>⚡</span> Simple & Fast
          </div>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            How It{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Works
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            From craving to doorstep in four simple steps. We've made ordering
            food as easy as it should be.
          </p>
        </div>
      </section>

      {/* ============ STEPS ============ */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.num} className="group relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-full top-16 z-0 hidden h-0.5 w-full bg-gradient-to-r from-orange-500/50 to-transparent lg:block" />
                )}

                <div className="relative z-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 backdrop-blur transition hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20">
                  {/* Number badge */}
                  <div
                    className={`absolute -top-4 left-6 rounded-full bg-gradient-to-r ${step.color} px-4 py-1.5 text-xs font-black shadow-lg`}
                  >
                    Step {step.num}
                  </div>

                  {/* Icon */}
                  <div
                    className={`mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-3xl shadow-lg transition group-hover:scale-110 group-hover:rotate-6`}
                  >
                    {step.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-black">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{step.desc}</p>

                  {/* Details */}
                  <ul className="mt-5 space-y-2 border-t border-white/5 pt-4">
                    {step.details.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-2 text-xs text-gray-300"
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20 text-[10px] text-green-400">
                          ✓
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APP PREVIEW ============ */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent p-8 sm:p-14">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/20 blur-[100px]" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-red-500/20 blur-[100px]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-orange-400">
                  Experience the app
                </span>
                <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                  Ordering has{" "}
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    never been easier
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-gray-400">
                  Track every step in real time, reorder with a tap, and unlock
                  exclusive app-only deals. Download now and get 50% off your
                  first order.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <Stat value="30min" label="Avg Delivery" />
                  <Stat value="500+" label="Restaurants" />
                  <Stat value="4.9★" label="App Rating" />
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button className="flex items-center gap-3 rounded-2xl border border-white/20 bg-black/60 px-5 py-3 backdrop-blur transition hover:bg-black/80">
                    <span className="text-2xl">🍎</span>
                    <div className="text-left">
                      <div className="text-[10px] uppercase text-gray-400">
                        Download on
                      </div>
                      <div className="text-sm font-bold">App Store</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 rounded-2xl border border-white/20 bg-black/60 px-5 py-3 backdrop-blur transition hover:bg-black/80">
                    <span className="text-2xl">🤖</span>
                    <div className="text-left">
                      <div className="text-[10px] uppercase text-gray-400">
                        Get it on
                      </div>
                      <div className="text-sm font-bold">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="relative flex justify-center">
                <div className="relative h-[440px] w-[230px] rounded-[2.75rem] border-[10px] border-black bg-gradient-to-b from-orange-500/20 to-red-500/10 shadow-2xl">
                  <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
                  <div className="flex h-full flex-col p-5 pt-10">
                    <div className="text-xs text-gray-500">Delivering to</div>
                    <div className="mt-1 text-sm font-bold">🏠 Home</div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🍔</span>
                        <div className="flex-1">
                          <div className="text-xs font-bold">
                            Double Cheeseburger
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Arriving in 12 min
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="h-2 w-full rounded-full bg-white/10" />
                      <div className="h-2 w-3/4 rounded-full bg-white/10" />
                      <div className="h-2 w-1/2 rounded-full bg-white/10" />
                    </div>

                    <div className="mt-auto rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-3 text-center text-xs font-bold">
                      Track Order
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="relative py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-orange-400">
              FAQ
            </span>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-red-500 p-12 text-center shadow-2xl shadow-orange-500/30 sm:p-16">
            <h2 className="relative text-4xl font-black sm:text-5xl">
              Ready to order?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/90">
              Browse our menu and get your favorite meal delivered in under 30
              minutes.
            </p>
            <Link
              href="/menu"
              className="relative mt-8 inline-flex items-center gap-3 rounded-full bg-black px-10 py-4 text-lg font-bold text-white shadow-2xl transition hover:scale-105"
            >
              Explore Menu →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <div className="text-xl font-black text-orange-400">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-gray-500">
        {label}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-3xl border border-white/10 bg-white/5 transition hover:border-orange-500/40">
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-base font-bold marker:content-['']">
        <span>{q}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition group-open:rotate-45 group-open:bg-orange-500 group-open:border-orange-500">
          +
        </span>
      </summary>
      <div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed">{a}</div>
    </details>
  );
}