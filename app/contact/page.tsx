"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactPage() {
    const { user, authFetch } = useAuth();

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
        honeypot: "", // bots fill this, real users don't
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.name.trim()) return setError("Please enter your name");
        if (!/\S+@\S+\.\S+/.test(form.email))
            return setError("Please enter a valid email");
        if (!form.subject.trim()) return setError("Please enter a subject");
        if (form.message.trim().length < 10)
            return setError("Message must be at least 10 characters");

        setSending(true);

        const res = await authFetch("/api/contact", {
            method: "POST",
            body: JSON.stringify(form),
        });

        const data = await res.json().catch(() => ({}));
        setSending(false);

        if (!res.ok) {
            setError(data.message || "Could not send message");
            return;
        }

        setSent(true);
    };

    /* ── Success state ── */
    if (sent) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] text-white">
                <section className="relative flex min-h-screen items-center justify-center px-6 py-20">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
                        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
                    </div>

                    <div className="relative w-full max-w-md text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-4xl">
                            ✅
                        </div>
                        <h1 className="text-3xl font-black">Message sent!</h1>
                        <p className="mt-3 text-gray-400">
                            Thanks for reaching out. We'll reply to{" "}
                            <strong className="text-white">{form.email}</strong> as soon as
                            possible.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href="/"
                                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
                            >
                                ← Back Home
                            </Link>
                            <button
                                onClick={() => {
                                    setSent(false);
                                    setForm({
                                        name: user?.name || "",
                                        email: user?.email || "",
                                        subject: "",
                                        message: "",
                                        honeypot: "",
                                    });
                                }}
                                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold"
                            >
                                Send Another →
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    /* ── Form ── */
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
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
                        <span className="animate-pulse">💬</span> We'd love to hear from
                        you
                    </div>
                    <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                        Get in{" "}
                        <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                            Touch
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                        Questions, feedback, partnership ideas, or just want to say hi? Drop
                        us a message and we'll reply within 24 hours.
                    </p>
                </div>
            </section>

            <section className="relative pb-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                        {/* Left — Contact info */}
                        <div className="space-y-4 lg:col-span-2">
                            <ContactCard
                                icon="📧"
                                title="Email us"
                                value="support@foodiehub.com"
                                href="mailto:support@foodiehub.com"
                                description="We reply within 24 hours"
                            />
                            <ContactCard
                                icon="📞"
                                title="Call us"
                                value="+92 300 1234567"
                                href="tel:+923001234567"
                                description="Mon–Fri · 9am–8pm"
                            />
                            <ContactCard
                                icon="💬"
                                title="Live chat"
                                value="Available in app"
                                description="Real-time support during business hours"
                            />
                            <ContactCard
                                icon="📍"
                                title="Head office"
                                value="Karachi, Pakistan"
                                description="FoodieHub HQ · Block 5, Clifton"
                            />

                            {/* Social */}
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Follow us
                                </div>
                                <div className="mt-4 flex gap-3">
                                    {[
                                        { icon: "📘", label: "Facebook" },
                                        { icon: "📷", label: "Instagram" },
                                        { icon: "🐦", label: "Twitter" },
                                        { icon: "💼", label: "LinkedIn" },
                                    ].map((s) => (
                                        <button
                                            key={s.label}
                                            title={s.label}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg transition hover:bg-orange-500/20 hover:border-orange-500/50"
                                        >
                                            {s.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right — Form */}
                        <div className="lg:col-span-3">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
                                <h2 className="text-2xl font-black">Send us a message</h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    All fields are required unless marked optional.
                                </p>

                                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Field label="Your Name *">
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) =>
                                                    setForm({ ...form, name: e.target.value })
                                                }
                                                required
                                                placeholder="John Doe"
                                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                                            />
                                        </Field>
                                        <Field label="Email *">
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) =>
                                                    setForm({ ...form, email: e.target.value })
                                                }
                                                required
                                                placeholder="you@example.com"
                                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Subject *">
                                        <input
                                            type="text"
                                            value={form.subject}
                                            onChange={(e) =>
                                                setForm({ ...form, subject: e.target.value })
                                            }
                                            required
                                            placeholder="Order issue, partnership, feedback…"
                                            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                                        />
                                    </Field>

                                    <Field label="Message *">
                                        <textarea
                                            value={form.message}
                                            onChange={(e) =>
                                                setForm({ ...form, message: e.target.value })
                                            }
                                            required
                                            rows={6}
                                            placeholder="Tell us how we can help…"
                                            className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-orange-500/50"
                                        />
                                        <div className="mt-1 text-right text-xs text-gray-500">
                                            {form.message.length} / 5000
                                        </div>
                                    </Field>

                                    {/* Honeypot — hidden from real users */}
                                    <input
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={form.honeypot}
                                        onChange={(e) =>
                                            setForm({ ...form, honeypot: e.target.value })
                                        }
                                        style={{
                                            position: "absolute",
                                            left: "-9999px",
                                            width: "1px",
                                            height: "1px",
                                            overflow: "hidden",
                                        }}
                                        aria-hidden="true"
                                    />

                                    {error && (
                                        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                            ❌ {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 font-bold shadow-2xl shadow-orange-500/30 transition hover:scale-[1.02] disabled:opacity-60"
                                    >
                                        {sending ? (
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        ) : (
                                            <>
                                                Send Message
                                                <span className="transition group-hover:translate-x-1">
                                                    →
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-16">
                        <h2 className="text-center text-3xl font-black">
                            Frequently Asked{" "}
                            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                Questions
                            </span>
                        </h2>
                        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
                            {[
                                {
                                    q: "How long do refunds take?",
                                    a: "Refunds are processed within 5–7 business days back to your original payment method.",
                                },
                                {
                                    q: "Can I change my order after placing it?",
                                    a: "Contact us within 5 minutes of ordering — we can usually catch it before the kitchen starts.",
                                },
                                {
                                    q: "Do you deliver everywhere?",
                                    a: "We deliver in all major cities. Check the delivery fee on each product before checkout.",
                                },
                                {
                                    q: "How do I become a partner?",
                                    a: "Send us a message with subject 'Partnership' and our team will reach out within 24 hours.",
                                },
                            ].map((faq) => (
                                <div
                                    key={faq.q}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                                >
                                    <div className="font-bold">{faq.q}</div>
                                    <div className="mt-2 text-sm text-gray-400">{faq.a}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function ContactCard({
    icon,
    title,
    value,
    href,
    description,
}: {
    icon: string;
    title: string;
    value: string;
    href?: string;
    description: string;
}) {
    const Wrapper = href ? "a" : "div";
    return (
        <Wrapper
            {...(href ? { href } : {})}
            className="block rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-orange-500/50"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 text-2xl">
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {title}
                    </div>
                    <div className="mt-1 truncate font-bold text-white">{value}</div>
                    <div className="mt-1 text-xs text-gray-500">{description}</div>
                </div>
            </div>
        </Wrapper>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {label}
            </label>
            <div className="mt-2">{children}</div>
        </div>
    );
}