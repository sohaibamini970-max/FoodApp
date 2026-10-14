"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(username.trim(), password);

    if (!res.ok) {
      setError(res.error || "Login failed");
      setLoading(false);
      return;
    }

    if (res.role === "admin") router.push("/admin");
    else router.push("/");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
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

      <div className="relative flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <span className="text-4xl">🍔</span>
            <span className="text-3xl font-black">
              Foodie
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Hub
              </span>
            </span>
          </Link>

          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h1 className="text-3xl font-black">Welcome back 👋</h1>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to continue ordering delicious food.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Username / Email */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Email
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 transition focus-within:border-orange-500/50">
                  <span>👤</span>
                  <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 transition focus-within:border-orange-500/50">
                  <span>🔒</span>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-gray-400">
                  <input
                    type="checkbox"
                    className="accent-orange-500"
                    defaultChecked
                  />
                  Remember me
                </label>
                <a href="/forgot-password" className="text-orange-400 hover:text-orange-300">
                  Forgot password?
                </a>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  ❌ {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <>
                    Sign In
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4 text-xs text-gray-500">
              <div className="h-px flex-1 bg-white/10" />
              OR
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Social — now dynamic */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${API}/api/oauth/google`)
                }
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                <span>🔵</span> Google
              </button>
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${API}/api/oauth/facebook`)
                }
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                <span>📘</span> Facebook
              </button>
            </div>

            {/* Register link */}
            <p className="mt-8 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-orange-400 transition hover:text-orange-300"
              >
                Create one →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}