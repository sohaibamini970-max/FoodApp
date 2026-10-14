"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type Step = "email" | "code" | "password" | "done";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { requestPasswordReset, verifyResetCode, resetPassword } = useAuth();

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /* ── STEP 1: request code ── */
    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email.trim()) return setError("Please enter your email");

        setLoading(true);
        const res = await requestPasswordReset(email.trim());
        setLoading(false);

        if (!res.ok) {
            setError(res.error || "Could not send reset code");
            return;
        }
        setStep("code");
    };

    /* ── STEP 2: verify code ── */
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (code.length !== 6) return setError("Enter the 6-digit code");

        setLoading(true);
        const res = await verifyResetCode(email.trim(), code);
        setLoading(false);

        if (!res.ok || !res.reset_token) {
            setError(res.error || "Invalid code");
            return;
        }
        setResetToken(res.reset_token);
        setStep("password");
    };

    /* ── STEP 3: set new password ── */
    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password.length < 6) return setError("Password must be at least 6 characters");
        if (password !== confirm) return setError("Passwords do not match");

        setLoading(true);
        const res = await resetPassword(resetToken, password);
        setLoading(false);

        if (!res.ok) {
            setError(res.error || "Password reset failed");
            return;
        }
        setStep("done");
        setTimeout(() => router.push("/login"), 2000);
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
                        {/* Progress dots */}
                        <div className="mb-6 flex items-center justify-center gap-2">
                            {["email", "code", "password"].map((s, i) => {
                                const active =
                                    (step === "email" && i === 0) ||
                                    (step === "code" && i === 1) ||
                                    (step === "password" && i === 2) ||
                                    (step === "done" && i === 2);
                                return (
                                    <div
                                        key={s}
                                        className={`h-2 w-8 rounded-full transition ${active
                                                ? "bg-gradient-to-r from-orange-500 to-red-500"
                                                : "bg-white/10"
                                            }`}
                                    />
                                );
                            })}
                        </div>

                        {/* STEP 1 — Email */}
                        {step === "email" && (
                            <>
                                <h1 className="text-3xl font-black">Forgot password? 🔑</h1>
                                <p className="mt-2 text-sm text-gray-400">
                                    Enter your email and we'll send you a reset code.
                                </p>

                                <form onSubmit={handleRequestCode} className="mt-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            Email
                                        </label>
                                        <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 focus-within:border-orange-500/50">
                                            <span>📧</span>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                required
                                                autoComplete="email"
                                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                                            />
                                        </div>
                                    </div>

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
                                                Send Reset Code
                                                <span className="transition group-hover:translate-x-1">→</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* STEP 2 — Code */}
                        {step === "code" && (
                            <>
                                <div className="mb-6 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 text-3xl">
                                        📬
                                    </div>
                                </div>
                                <h1 className="text-center text-3xl font-black">Check your email</h1>
                                <p className="mt-2 text-center text-sm text-gray-400">
                                    We sent a 6-digit code to <strong className="text-white">{email}</strong>
                                </p>

                                <form onSubmit={handleVerifyCode} className="mt-8 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            Verification Code
                                        </label>
                                        <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-4 focus-within:border-orange-500/50">
                                            <span>🔢</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={6}
                                                value={code}
                                                onChange={(e) =>
                                                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                                                }
                                                placeholder="000000"
                                                autoFocus
                                                required
                                                className="flex-1 bg-transparent text-center text-2xl font-black tracking-[0.5em] outline-none placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                            ❌ {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || code.length !== 6}
                                        className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02] disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        ) : (
                                            <>Verify Code →</>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep("email");
                                            setCode("");
                                            setError("");
                                        }}
                                        className="w-full text-center text-xs text-gray-500 hover:text-white"
                                    >
                                        ← Use a different email
                                    </button>
                                </form>
                            </>
                        )}

                        {/* STEP 3 — Password */}
                        {step === "password" && (
                            <>
                                <h1 className="text-3xl font-black">Set new password 🔐</h1>
                                <p className="mt-2 text-sm text-gray-400">
                                    Choose a strong password you'll remember.
                                </p>

                                <form onSubmit={handleReset} className="mt-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            New Password
                                        </label>
                                        <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 focus-within:border-orange-500/50">
                                            <span>🔒</span>
                                            <input
                                                type={showPw ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
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
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            Confirm Password
                                        </label>
                                        <div className="mt-2 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 focus-within:border-orange-500/50">
                                            <span>🔐</span>
                                            <input
                                                type={showPw ? "text" : "password"}
                                                value={confirm}
                                                onChange={(e) => setConfirm(e.target.value)}
                                                placeholder="Re-enter password"
                                                required
                                                autoComplete="new-password"
                                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                                            />
                                        </div>
                                    </div>

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
                                            <>Reset Password →</>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* STEP 4 — Done */}
                        {step === "done" && (
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-4xl">
                                        ✅
                                    </div>
                                </div>
                                <h1 className="text-3xl font-black">Password reset!</h1>
                                <p className="mt-2 text-sm text-gray-400">
                                    Redirecting you to login…
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
                                </div>
                            </div>
                        )}

                        {/* Bottom link */}
                        <p className="mt-8 text-center text-sm text-gray-400">
                            Remembered it?{" "}
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