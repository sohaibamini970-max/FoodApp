"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export default function RegisterContent() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const strength = getStrength(form.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your name");
    if (!/\S+@\S+\.\S+/.test(form.email))
      return setError("Please enter a valid email");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm)
      return setError("Passwords do not match");
    if (!agree) return setError("You must accept the terms");

    setLoading(true);
    setTimeout(() => {
      const res = register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (!res.ok) {
        setError(res.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push("/");
    }, 400);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
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
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2"
          >
            <span className="text-4xl">🍔</span>
            <span className="text-3xl font-black">
              Foodie
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Hub
              </span>
            </span>
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h1 className="text-3xl font-black">Create your account 🎉</h1>
            <p className="mt-2 text-sm text-gray-400">
              Join FoodieHub and get 50% off your first order.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Full Name
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 transition focus-within:border-orange-500/50">
                  <span>😊</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Email
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 transition focus-within:border-orange-500/50">
                  <span>📧</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    required
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
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Min 6 characters"
                    required
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

                {/* Strength */}
                {form.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Confirm Password
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 transition focus-within:border-orange-500/50">
                  <span>🔐</span>
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) =>
                      setForm({ ...form, confirm: e.target.value })
                    }
                    placeholder="Re-enter password"
                    required
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 accent-orange-500"
                />
                I agree to the{" "}
                <a href="#" className="text-orange-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-orange-400 hover:underline">
                  Privacy Policy
                </a>
              </label>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <>
                    Create Account
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-orange-400 transition hover:text-orange-300"
              >
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", percent: 25, color: "bg-red-500" };
  if (score <= 3) return { label: "Medium", percent: 60, color: "bg-yellow-500" };
  return { label: "Strong", percent: 100, color: "bg-green-500" };
}