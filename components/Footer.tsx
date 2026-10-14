"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  // ✅ Read year in useEffect — only runs in browser
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const cols = [
    {
      title: "Company",
      links: [
          { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/contact" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "Menu", href: "/menu" },
        { label: "Deals", href: "/deals" },
        { label: "Cart", href: "/cart" },
        { label: "Track Order", href: "/order" },
      ],
    },
  ];

  const socials = [
    {
      label: "Twitter / X",
      icon: "𝕏",
      href: "https://twitter.com/foodiehub",
    },
    {
      label: "Facebook",
      icon: "f",
      href: "https://facebook.com/foodiehub",
    },
    {
      label: "LinkedIn",
      icon: "in",
      href: "https://linkedin.com/company/foodiehub",
    },
    {
      label: "Instagram",
      icon: "ig",
      href: "https://instagram.com/foodiehub",
    },
  ];

  return (
    <footer className="border-t border-white/10 pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🍔</span>
              <span className="text-2xl font-black">
                Foodie
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Hub
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-400">
              Delivering happiness, one meal at a time. Your favorite food, fast
              and fresh.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-orange-500"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div className="mt-6 space-y-2 text-xs text-gray-500">
              <div>📧 support@foodiehub.com</div>
              <div>📞 +92 300 1234567</div>
              <div>📍 Karachi, Pakistan</div>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold">{col.title}</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-400">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="transition hover:text-orange-400"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-sm text-gray-500 sm:flex-row">
          <div>© {year} FoodieHub. All rights reserved.</div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/privacy#cookies" className="transition hover:text-white">
              Cookies
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}