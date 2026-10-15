"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import { useAuth } from "../../components/AuthContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = () => setUserMenu(false);
    if (userMenu) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [userMenu]);

  const links = [
    { id: "home", label: "Home", href: "/" },
    { id: "menu", label: "Menu", href: "/menu" },
    { id: "deals", label: "Deals", href: "/deals" },
    { id: "orders", label: "Orders", href: "/orders" },
    { id: "how", label: "How It Works", href: "/how" },
    { id: "reviews", label: "Reviews", href: "/reviews" },
  ];

  const activeId = links.find((l) => l.href === pathname)?.id ?? "";

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl py-3 shadow-2xl border-b border-white/10"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-orange-500 blur-lg opacity-60 group-hover:opacity-100 transition" />
            <span className="relative text-3xl">🍔</span>
          </div>
          <span className="text-2xl font-black tracking-tight">
            Foodie
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Hub
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = activeId === l.id;
            return (
              <Link
                key={l.id}
                href={l.href}
                className={`group relative text-sm font-medium transition ${
                  active ? "text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300 ${
                    active
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">

          <Link
            href="/cart"
            className="group relative rounded-full p-2 transition hover:bg-white/10"
            aria-label="Cart"
          >
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold animate-[pop_0.3s_ease-out] shadow-lg shadow-orange-500/50">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Auth area */}
          {user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenu(!userMenu);
                }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 backdrop-blur transition hover:bg-white/10"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    user.role === "admin"
                      ? "bg-gradient-to-br from-orange-500 to-red-500"
                      : "bg-gradient-to-br from-blue-500 to-cyan-500"
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-semibold">
                  {user.name.split(" ")[0]}
                </span>
                <span className="text-xs text-gray-400">▾</span>
              </button>

              {/* Dropdown */}
              {userMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl animate-[slideDown_0.2s_ease-out]"
                >
                  <div className="border-b border-white/10 p-4">
                    <div className="text-sm font-bold">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        user.role === "admin"
                          ? "bg-orange-500/20 text-orange-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {user.role === "admin" ? "🛡️ Admin" : "👤 Customer"}
                    </span>
                  </div>
                  <div className="p-2">
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/5"
                      >
                        <span>📊</span> Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/cart"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/5"
                    >
                      <span>🛒</span> My Cart
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/5"
                    >
                      <span>📦</span> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/10"
              >
                Sign Up
              </Link>
              <Link
                href="/menu"
                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-orange-500/30 transition hover:scale-105 hover:shadow-orange-500/50"
              >
                Order Now
              </Link>
            </>
          )}

          {user && (
            <Link
              href="/menu"
              className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-orange-500/30 transition hover:scale-105 hover:shadow-orange-500/50"
            >
              Order Now
            </Link>
          )}
        </div>

        {/* Mobile Toggle + Cart badge */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className="relative rounded-full p-2 transition hover:bg-white/10"
            aria-label="Cart"
          >
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <button
            className="text-2xl p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[68px] bottom-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 animate-[slideDown_0.25s_ease-out] overflow-y-auto">
          <nav className="flex flex-col gap-2 p-6">
            {links.map((l) => {
              const active = activeId === l.id;
              return (
                <Link
                  key={l.id}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`group flex items-center justify-between rounded-2xl border px-5 py-4 text-base font-semibold transition ${
                    active
                      ? "border-orange-500/50 bg-orange-500/10 text-white"
                      : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{l.label}</span>
                  <span
                    className={`transition group-hover:translate-x-1 ${
                      active
                        ? "text-orange-400"
                        : "text-gray-500 group-hover:text-orange-400"
                    }`}
                  >
                    →
                  </span>
                </Link>
              );
            })}

            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className={`group flex items-center justify-between rounded-2xl border px-5 py-4 text-base font-semibold transition ${
                pathname === "/cart"
                  ? "border-orange-500/50 bg-orange-500/10 text-white"
                  : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                🛒 Cart
                {totalItems > 0 && (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </span>
              <span className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-orange-400">
                →
              </span>
            </Link>

            {/* User section */}
            {user ? (
              <>
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                        user.role === "admin"
                          ? "bg-gradient-to-br from-orange-500 to-red-500"
                          : "bg-gradient-to-br from-blue-500 to-cyan-500"
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div className="text-sm font-bold">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </div>

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-orange-500/50 bg-orange-500/10 px-5 py-4 text-base font-semibold text-white transition hover:bg-orange-500/20"
                  >
                    <span>📊 Admin Panel</span>
                    <span>→</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-between rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-base font-semibold text-red-300 transition hover:bg-red-500/20"
                >
                  <span>🚪 Logout</span>
                  <span>→</span>
                </button>

                <Link
                  href="/menu"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-base font-bold shadow-lg shadow-orange-500/30"
                >
                  Order Now →
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-4 text-base font-bold transition hover:bg-white/10"
                >
                  Sign Up
                </Link>
                <Link
                  href="/menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-base font-bold shadow-lg shadow-orange-500/30"
                >
                  Order Now →
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}