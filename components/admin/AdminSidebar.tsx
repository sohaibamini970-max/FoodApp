"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🍔" },
  { href: "/admin/deals", label: "Deals", icon: "🎁" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/contact", label: "Messages", icon: "📬" },
];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile topbar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="font-black">Admin</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full p-2 hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute left-0 top-[56px] h-[calc(100vh-56px)] w-64 space-y-1 border-r border-white/10 bg-[#0a0a0a] p-4">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{l.icon}</span>
                  {l.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              🚪 Logout
            </button>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0a0a0a] lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-6">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <span className="text-3xl">🍔</span>
            <span className="text-xl font-black">
              Foodie
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Hub
              </span>
            </span>
          </Link>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-gray-500">Signed in as</div>
            <div className="mt-1 font-bold">{user?.name}</div>
            <div className="text-xs text-orange-400">Administrator</div>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{l.icon}</span>
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            <span className="text-lg">🌐</span> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}