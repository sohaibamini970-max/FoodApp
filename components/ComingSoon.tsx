"use client";

import Link from "next/link";

type Props = {
  emoji?: string;
  title: string;
  subtitle: string;
  description: string;
  notifyEmail?: string;
  backHref?: string;
  backLabel?: string;
};

export default function ComingSoon({
  emoji = "🚧",
  title,
  subtitle,
  description,
  notifyEmail = "hello@foodiehub.com",
  backHref = "/",
  backLabel = "Back to Home",
}: Props) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur">
            <span className="animate-pulse">🛠️</span>
            {subtitle}
          </div>

          {/* Emoji */}
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/5 text-7xl backdrop-blur">
            {emoji}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-lg text-lg text-gray-400">
            {description}
          </p>

          {/* Notify input */}
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
              🔔 Get notified
            </div>
            <p className="mt-2 text-sm text-gray-500">
              We'll email you the moment this page goes live.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = (
                  e.currentTarget.elements.namedItem(
                    "email"
                  ) as HTMLInputElement
                ).value;
                window.location.href = `mailto:${notifyEmail}?subject=Notify me when ${
                  window.location.pathname
                } is live&body=My email: ${email}`;
              }}
              className="mt-3 flex flex-col gap-2 sm:flex-row"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
              />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-bold transition hover:scale-105"
              >
                Notify Me
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={backHref}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              ← {backLabel}
            </Link>
            <Link
              href="/menu"
              className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-bold transition hover:scale-105"
            >
              Browse Menu 🍔
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>

          {/* Footer note */}
          <p className="mt-12 text-xs text-gray-600">
            In the meantime, feel free to{" "}
            <Link href="/contact" className="text-orange-400 hover:underline">
              reach out to us
            </Link>{" "}
            — we'd love to hear from you.
          </p>
        </div>
      </section>
    </main>
  );
}