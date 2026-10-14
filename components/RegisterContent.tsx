"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ALLOWED_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "outlook.com", "hotmail.com", "live.com", "msn.com",
  "yahoo.com", "yahoo.co.uk", "yahoo.co.in", "ymail.com",
  "icloud.com", "me.com", "mac.com",
  "proton.me", "protonmail.com", "pm.me",
  "aol.com", "zoho.com", "gmx.com", "gmx.net", "mail.com",
  "yandex.com", "fastmail.com", "hey.com",
]);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email: string): { ok: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { ok: false, error: "Please enter your email" };
  if (!EMAIL_REGEX.test(trimmed))
    return { ok: false, error: "Please enter a valid email address" };

  const [local, domain] = trimmed.split("@");
  if (!ALLOWED_EMAIL_DOMAINS.has(domain))
    return {
      ok: false,
      error: "Please use a supported provider (Gmail, Outlook, Yahoo, iCloud, etc.)",
    };

  if (/^(test|asdf|qwer|aaa+|123+|fake|abc|xyz)$/i.test(local))
    return { ok: false, error: "Please use a real email address" };

  return { ok: true };
}

export default function RegisterContent() {
  const { register, verifyCode, resendCode } = useAuth();
  const router = useRouter();

  /* ---------- form state ---------- */
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

  /* ---------- OTP state ---------- */
  const [stage, setStage] = useState<"form" | "verify">("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const strength = getStrength(form.password);

  /* ---------- resend cooldown timer ---------- */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  /* ---------- register submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your name");

    const emailCheck = validateEmail(form.email);
    if (!emailCheck.ok) return setError(emailCheck.error!);

    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm)
      return setError("Passwords do not match");
    if (!agree) return setError("You must accept the terms");

    setLoading(true);

    const res = await register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    if (!res.ok) {
      setError(res.error || "Registration failed");
      setLoading(false);
      return;
    }

    // Backend sends code → switch to verify stage
    if (res.pendingVerification) {
      setPendingEmail(res.email || form.email.trim().toLowerCase());
      setStage("verify");
      setLoading(false);
      setResendCooldown(30);
      return;
    }

    // Fallback (in case backend skips OTP)
    router.push("/");
  };

  /* ---------- OTP verify ---------- */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);

    const res = await verifyCode(pendingEmail, otp);

    if (!res.ok) {
      setOtpError(res.error || "Verification failed");
      setOtpLoading(false);
      return;
    }

    if (res.role === "admin") router.push("/admin");
    else router.push("/");
  };

  /* ---------- resend code ---------- */
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtpError("");
    const res = await resendCode(pendingEmail);
    if (!res.ok) setOtpError(res.error || "Could not resend code");
    else setResendCooldown(30);
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
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <span className="text-4xl">🍔</span>
            <span className="text-3xl font-black">
              Foodie
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Hub
              </span>
            </span>
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            {stage === "form" ? (
              /* ============================================================ */
              /*  STAGE 1 — REGISTRATION FORM                                  */
              /* ============================================================ */
              <>
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
                        autoComplete="name"
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
                        placeholder="your@gmail.com"
                        required
                        autoComplete="email"
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                      />
                    </div>
                    {form.email && !validateEmail(form.email).ok && (
                      <p className="mt-1 text-xs text-red-400">
                        {validateEmail(form.email).error}
                      </p>
                    )}
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
                        autoComplete="new-password"
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
                        autoComplete="new-password"
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
                    <a href="/terms" className="text-orange-400 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-orange-400 hover:underline">
                      Privacy Policy
                    </a>
                  </label>

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

                <div className="my-6 flex items-center gap-4 text-xs text-gray-500">
                  <div className="h-px flex-1 bg-white/10" />
                  OR SIGN UP WITH
                  <div className="h-px flex-1 bg-white/10" />
                </div>

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

                <p className="mt-8 text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-orange-400 transition hover:text-orange-300"
                  >
                    Sign in →
                  </Link>
                </p>
              </>
            ) : (
              /* ============================================================ */
              /*  STAGE 2 — OTP VERIFICATION                                   */
              /* ============================================================ */
              <>
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 text-3xl">
                    📬
                  </div>
                </div>

                <h1 className="text-center text-3xl font-black">
                  Check your email
                </h1>
                <p className="mt-2 text-center text-sm text-gray-400">
                  We sent a 6-digit code to{" "}
                  <strong className="text-white">{pendingEmail}</strong>
                </p>

                <form onSubmit={handleVerify} className="mt-8 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Verification Code
                    </label>
                    <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-4 transition focus-within:border-orange-500/50">
                      <span>🔢</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="000000"
                        autoFocus
                        required
                        className="flex-1 bg-transparent text-center text-2xl font-black tracking-[0.5em] outline-none placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {otpError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      ❌ {otpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={otpLoading || otp.length !== 6}
                    className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02] disabled:opacity-60"
                  >
                    {otpLoading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <>
                        Verify & Continue
                        <span className="transition group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                  Didn&apos;t get the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="font-bold text-orange-400 transition hover:text-orange-300 disabled:cursor-not-allowed disabled:text-gray-600"
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStage("form");
                    setOtp("");
                    setOtpError("");
                  }}
                  className="mt-4 w-full text-center text-xs text-gray-500 transition hover:text-white"
                >
                  ← Change email
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- password strength ---------- */
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", percent: 25, color: "bg-red-500" };
  if (score <= 3)
    return { label: "Medium", percent: 60, color: "bg-yellow-500" };
  return { label: "Strong", percent: 100, color: "bg-green-500" };
}